import type { PortraitStyleTemplate } from "@lib/portrait/style-template"

import {
  downloadImage,
  type GeneratePortraitResult,
} from "./generate-portrait"

const GEMINI_MODEL = "gemini-2.5-flash-image"
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`
const TOGETHER_MODEL = "black-forest-labs/FLUX.1-kontext-max"
const TOGETHER_API_URL = "https://api.together.xyz/v1/images/generations"

type GeminiPart = {
  text?: string
  inlineData?: {
    data?: string
    mimeType?: string
  }
  inline_data?: {
    data?: string
    mime_type?: string
  }
}

function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
}

function getTogetherApiKey() {
  return process.env.TOGETHER_API_KEY
}

function resolveAssetUrl(url: string) {
  if (/^https?:\/\//i.test(url) || url.startsWith("data:")) {
    return url
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"
  return new URL(url.startsWith("/") ? url : `/${url}`, baseUrl).toString()
}

function extractGeneratedImage(result: any): Buffer {
  const parts = (result?.candidates ?? []).flatMap(
    (candidate: any) => candidate?.content?.parts ?? []
  ) as GeminiPart[]

  const imagePart = parts.find((part) => {
    const mimeType = part.inlineData?.mimeType || part.inline_data?.mime_type
    return typeof mimeType === "string" && mimeType.startsWith("image/")
  })

  const base64Data = imagePart?.inlineData?.data || imagePart?.inline_data?.data
  if (!base64Data) {
    throw new Error("Gemini did not return an image for the style template")
  }

  return Buffer.from(base64Data, "base64")
}

function resolveCanvasSize(aspectRatio: string) {
  switch (aspectRatio) {
    case "1:1":
      return { width: 1024, height: 1024 }
    case "4:5":
      return { width: 1024, height: 1280 }
    case "16:9":
      return { width: 1280, height: 720 }
    case "3:4":
    default:
      return { width: 1024, height: 1365 }
  }
}

function buildStylePrompt(template: PortraitStyleTemplate) {
  const promptSections = [
    "Image 1 is the uploaded portrait photo. Preserve the person's identity, age range, face shape, skin tone, hairstyle, and expression.",
    "Image 2 is the style reference. Follow its wardrobe direction, color palette, scene design, composition, lighting mood, and overall art direction.",
    "Create one polished portrait of the uploaded person in the world of the reference artwork.",
    "Keep the result premium, clean, flattering, and highly recognizable as the uploaded person.",
    "Do not add extra people, duplicate faces, extra limbs, text, watermark, frame, collage layout, or UI elements.",
    "Keep the subject as the clear hero of the composition.",
    `Target aspect ratio: ${template.aspectRatio}.`,
  ]

  if (template.promptPreset) {
    promptSections.push(`Template brief: ${template.promptPreset}`)
  }

  if (template.promptNotes) {
    promptSections.push(`Additional direction: ${template.promptNotes}`)
  }

  promptSections.push(
    `Negative prompt: ${
      template.negativePrompt ??
      "extra fingers, deformed hands, duplicate face, bad anatomy, text, watermark, blurry face, cropped head"
    }.`
  )

  promptSections.push("Output only the finished image.")

  return promptSections.join(" ")
}

async function generateWithTogether(
  sourceImageUrl: string,
  template: PortraitStyleTemplate
): Promise<GeneratePortraitResult> {
  const apiKey = getTogetherApiKey()
  if (!apiKey) {
    throw new Error("TOGETHER_API_KEY is not configured")
  }

  if (!template.referenceImageUrl) {
    throw new Error("Style template is missing a reference image")
  }

  const { width, height } = resolveCanvasSize(template.aspectRatio)
  const prompt = buildStylePrompt(template)
  const referenceImageUrl = resolveAssetUrl(template.referenceImageUrl)

  const response = await fetch(TOGETHER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: TOGETHER_MODEL,
      width,
      height,
      n: 1,
      steps: 28,
      output_format: "png",
      image_url: sourceImageUrl,
      reference_images: [referenceImageUrl],
      prompt,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Together AI API error: ${response.status} - ${errorText}`)
  }

  const result = await response.json()
  const generatedUrl = result?.data?.[0]?.url

  if (!generatedUrl) {
    throw new Error("Together AI did not return an image URL")
  }

  const { buffer } = await downloadImage(generatedUrl)

  return {
    buffer,
    provider: "together",
    model: TOGETHER_MODEL,
  }
}

export async function generateStylePortrait(
  imageBuffer: Buffer,
  mimeType: string,
  template: PortraitStyleTemplate,
  sourceImageUrl?: string
): Promise<GeneratePortraitResult> {
  const apiKey = getGeminiApiKey()
  const prompt = buildStylePrompt(template)

  if (!apiKey) {
    if (sourceImageUrl && getTogetherApiKey()) {
      return generateWithTogether(sourceImageUrl, template)
    }

    throw new Error(
      "GEMINI_API_KEY/GOOGLE_API_KEY or TOGETHER_API_KEY is not configured"
    )
  }

  if (!template.referenceImageUrl) {
    throw new Error("Style template is missing a reference image")
  }

  const referenceImage = await downloadImage(
    resolveAssetUrl(template.referenceImageUrl)
  )

  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: imageBuffer.toString("base64"),
              },
            },
            {
              inline_data: {
                mime_type: referenceImage.mimeType,
                data: referenceImage.buffer.toString("base64"),
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["Image"],
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    const isLocationBlocked =
      response.status === 400 &&
      errorText.includes("User location is not supported")

    if (isLocationBlocked && sourceImageUrl && getTogetherApiKey()) {
      return generateWithTogether(sourceImageUrl, template)
    }

    throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
  }

  const result = await response.json()

  return {
    buffer: extractGeneratedImage(result),
    provider: "gemini",
    model: GEMINI_MODEL,
  }
}
