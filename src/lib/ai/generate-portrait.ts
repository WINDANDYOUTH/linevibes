/**
 * Google Gemini image generation for pet line portraits.
 *
 * Uses Gemini image generation to transform a source photo
 * into a minimalist pet line art portrait.
 */

const MODEL = "gemini-2.5-flash-image"
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`
const TOGETHER_MODEL = "black-forest-labs/FLUX.2-pro"
const TOGETHER_FALLBACK_MODEL = "black-forest-labs/FLUX.1-kontext-max"
const TOGETHER_API_URL = "https://api.together.xyz/v1/images/generations"

const TRANSPARENT_BACKGROUND_REQUIREMENT =
  "Use a fully transparent background. Do not add any white fill, colored backdrop, paper texture, shadow, frame, or background elements."
const LINE_ART_HARD_CONSTRAINTS =
  "Create true line art only. Use black contour strokes only. No grayscale fill, no soft shading, no glow, no vignette, no gradients, no photographic rendering, no charcoal texture, no pencil shading, no halftone, no watercolor, no background."

// Line art generation prompts per style
const STYLE_PROMPTS: Record<string, string> = {
  classic: `Transform this pet photograph into a clean minimalist contour line pet portrait. ${TRANSPARENT_BACKGROUND_REQUIREMENT} ${LINE_ART_HARD_CONSTRAINTS} Use only thin elegant black lines. Preserve the pet's silhouette, ear shape, muzzle, eyes, whiskers, fur outline, collar details, and pose with restraint and clarity. The result should feel refined and modern, not like a shaded sketch.`,
  bold: `Transform this pet photograph into a bold graphic line art pet portrait. ${TRANSPARENT_BACKGROUND_REQUIREMENT} ${LINE_ART_HARD_CONSTRAINTS} Use thick confident black ink strokes with clear line-weight variation. Emphasize the silhouette, ear shape, muzzle, chest fur, paws, and collar outline. Only solid black linework.`,
  detailed: `Transform this pet photograph into a highly detailed fine line art pet portrait. ${TRANSPARENT_BACKGROUND_REQUIREMENT} ${LINE_ART_HARD_CONSTRAINTS} Use precise thin black lines to capture the pet's eyes, nose, muzzle, whiskers, fur flow, markings, and expression. Add detail through line placement only, not tonal shading. The result should feel like crisp pen linework on a transparent background.`,
  artistic: `Transform this pet photograph into an expressive artistic line pet portrait. ${TRANSPARENT_BACKGROUND_REQUIREMENT} ${LINE_ART_HARD_CONSTRAINTS} Use flowing gestural black lines with selective simplification. Keep the pet recognizable while highlighting personality, posture, and movement in a clean graphic way. The output should feel intentional and lively, never shaded or painterly.`,
  minimal: `Transform this pet photograph into an ultra-minimal line art pet portrait. ${TRANSPARENT_BACKGROUND_REQUIREMENT} ${LINE_ART_HARD_CONSTRAINTS} Remove most interior facial detail, fur texture, and all tonal modeling. Preserve identity through silhouette, head angle, ear shape, muzzle outline, chest, body posture, and tail shape. Use very few thin black curves and keep large areas fully transparent.`,
}

const TOGETHER_STYLE_PROMPTS: Record<string, string> = {
  classic:
    "Create a refined modern pet portrait as clean black line art on a fully transparent background. Preserve the pet's pose, head angle, ear shape, muzzle, whiskers, fur silhouette, collar details, and body outline. Use elegant contour lines with light interior detail where needed. Keep the result crisp, minimal, poster-ready, and centered.",
  bold: "Create a bold graphic pet portrait as strong black contour line art on a fully transparent background. Preserve the silhouette, ears, muzzle, chest fur, paws, collar, and body outline. Use confident line-weight variation and simplified graphic shapes. Keep the result clean, modern, and centered.",
  detailed:
    "Create a highly refined pet portrait as precise black pen-style line art on a fully transparent background. Preserve likeness, eyes, nose, muzzle, whiskers, fur flow, markings, and body outline through linework only. Keep the result crisp, premium, and centered.",
  artistic:
    "Create an expressive editorial pet portrait as flowing black line art on a fully transparent background. Preserve the pet's pose, likeness, fur silhouette, ears, and tail while simplifying into elegant gestural contour lines. Keep the output clean, graphic, and centered.",
  minimal:
    "Create an ultra-minimal pet portrait as black contour line art on a fully transparent background. Preserve only the silhouette, head angle, ear shape, muzzle outline, chest, body posture, and tail shape. Omit most interior facial detail, fur texture, and all tonal rendering. Use very few clean lines and keep large transparent areas around the subject.",
}

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

export type PortraitStyle = keyof typeof STYLE_PROMPTS
export type GeneratePortraitResult = {
  buffer: Buffer
  provider: "gemini" | "together"
  model: string
}

function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
}

function getTogetherApiKey() {
  return process.env.TOGETHER_API_KEY
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
    const textPart = parts.find(
      (part) => typeof part.text === "string" && part.text.trim()
    )
    if (textPart?.text) {
      console.error(
        "[AI] Gemini returned text instead of image:",
        textPart.text
      )
    } else {
      console.error(
        "[AI] No image found in Gemini response:",
        JSON.stringify(result)
      )
    }
    throw new Error("Gemini did not return an image")
  }

  return Buffer.from(base64Data, "base64")
}

async function makeNearWhitePixelsTransparent(
  imageBuffer: Buffer
): Promise<Buffer> {
  const { default: sharp } = await import("sharp")

  const { data, info } = await sharp(imageBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const alphaIndex = i + 3
    const currentAlpha = data[alphaIndex]
    const minChannel = Math.min(r, g, b)
    const avg = Math.round((r + g + b) / 3)

    if (minChannel >= 248) {
      data[alphaIndex] = 0
      continue
    }

    if (avg >= 225) {
      const opacityScale = Math.max(0, (245 - avg) / 20)
      data[alphaIndex] = Math.round(currentAlpha * opacityScale)
    }
  }

  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .png()
    .toBuffer()
}

async function generateWithTogether(
  sourceImageUrl: string,
  style: PortraitStyle
): Promise<GeneratePortraitResult> {
  const apiKey = getTogetherApiKey()
  if (!apiKey) {
    throw new Error("TOGETHER_API_KEY is not configured")
  }

  const prompt = TOGETHER_STYLE_PROMPTS[style] || TOGETHER_STYLE_PROMPTS.classic

  async function requestTogether(model: string, body: Record<string, unknown>) {
    const response = await fetch(TOGETHER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        width: 1024,
        height: 1024,
        n: 1,
        output_format: "png",
        prompt_upsampling: false,
        ...body,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Together AI API error: ${response.status} - ${errorText}`
      )
    }

    const result = await response.json()
    const generatedUrl = result?.data?.[0]?.url

    if (!generatedUrl) {
      throw new Error("Together AI did not return an image URL")
    }

    const { buffer } = await downloadImage(generatedUrl)
    return {
      buffer: await makeNearWhitePixelsTransparent(buffer),
      provider: "together" as const,
      model,
    }
  }

  try {
    return await requestTogether(TOGETHER_MODEL, {
      prompt: `${prompt} The source photo is reference image 1. Follow its composition and likeness faithfully. Produce transparent PNG artwork only.`,
      reference_images: [sourceImageUrl],
    })
  } catch (error) {
    console.warn(
      `[AI] Together primary model failed, retrying fallback model ${TOGETHER_FALLBACK_MODEL}:`,
      error
    )

    return requestTogether(TOGETHER_FALLBACK_MODEL, {
      prompt: `${prompt} Keep the composition centered. Render a clean poster-ready pet portrait with transparent empty space around the subject. Output only the finished artwork image as a transparent PNG.`,
      image_url: sourceImageUrl,
      steps: 28,
    })
  }
}

/**
 * Generate a line art portrait from an uploaded image buffer using Gemini.
 *
 * @param imageBuffer - Original photo bytes
 * @param mimeType - MIME type of the original photo
 * @param style - Art style to apply
 * @returns Generated image as a PNG/JPEG buffer from Gemini
 */
export async function generateLinePortrait(
  imageBuffer: Buffer,
  mimeType: string,
  style: PortraitStyle = "classic",
  sourceImageUrl?: string
): Promise<GeneratePortraitResult> {
  const apiKey = getGeminiApiKey()
  if (!apiKey) {
    if (sourceImageUrl && getTogetherApiKey()) {
      console.warn("[AI] Gemini API key missing, falling back to Together AI")
      return generateWithTogether(sourceImageUrl, style)
    }

    throw new Error(
      "GEMINI_API_KEY/GOOGLE_API_KEY or TOGETHER_API_KEY is not configured"
    )
  }

  const prompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.classic

  console.log(
    `[AI] Generating line portrait with Gemini - model: ${MODEL}, style: ${style}`
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
              text: `${prompt} Keep the composition centered. Output only the finished artwork image.`,
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: imageBuffer.toString("base64"),
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
    console.error(`[AI] Gemini API error ${response.status}:`, errorText)

    const isLocationBlocked =
      response.status === 400 &&
      errorText.includes("User location is not supported")

    if (isLocationBlocked && sourceImageUrl && getTogetherApiKey()) {
      console.warn(
        "[AI] Gemini unavailable in this location, falling back to Together AI"
      )
      return generateWithTogether(sourceImageUrl, style)
    }

    throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
  }

  const result = await response.json()
  const generatedImage = extractGeneratedImage(result)
  return {
    buffer: await makeNearWhitePixelsTransparent(generatedImage),
    provider: "gemini",
    model: MODEL,
  }
}

/**
 * Download an image from a URL and return it as a Buffer with its MIME type.
 */
export async function downloadImage(
  url: string
): Promise<{ buffer: Buffer; mimeType: string }> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to download image: ${res.status}`)
  }

  const arrayBuffer = await res.arrayBuffer()
  const mimeType = res.headers.get("content-type") || "image/jpeg"

  return {
    buffer: Buffer.from(arrayBuffer),
    mimeType,
  }
}

export { MODEL, STYLE_PROMPTS }
