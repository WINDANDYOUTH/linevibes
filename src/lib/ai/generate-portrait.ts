/**
 * Together AI – Line Portrait Generator
 *
 * Uses FLUX.1-kontext (via Together AI) to transform a photo
 * into a minimalist line art portrait.
 *
 * The model supports `image_url` for reference images,
 * enabling photo-to-line-art conversion.
 */

// Together AI model for image generation with reference input
const MODEL = "black-forest-labs/FLUX.1-kontext-max"

// Line art generation prompts per style
const STYLE_PROMPTS: Record<string, string> = {
  classic:
    "Transform this photograph into a clean minimalist single-line continuous contour line drawing portrait on a pure white background. Use only thin black lines. Capture facial features, expression, and hair with elegant simplicity. No shading, no color, no cross-hatching. The style should resemble a sophisticated single-line portrait sketch.",
  bold:
    "Transform this photograph into a bold graphic line art portrait on a white background. Use thick confident black ink strokes. Emphasize strong contours of face and hair with varying line weight for dramatic effect. No color, no gray tones, only solid black ink lines on white.",
  detailed:
    "Transform this photograph into a highly detailed fine line art portrait on white background. Use precise thin black lines to capture every facial feature, wrinkle, hair strand, and subtle expression. The drawing should look like a masterful pen-and-ink illustration with fine crosshatching for subtle depth. Black lines only on pure white.",
  artistic:
    "Transform this photograph into an expressive artistic line portrait on white background. Use flowing, gestural black lines with varying thickness. The drawing should capture the essence and emotion of the subject in an abstract yet recognizable way, like a loose sketch by a master artist. No color, just dynamic black pen strokes on white.",
  minimal:
    "Transform this photograph into an ultra-minimalist line art portrait on white background. Use the absolute fewest lines possible to capture the essence of the face. Only the most essential contours — perhaps 10-15 simple curves. Remove all detail, keep only what makes the face recognizable. Thin black lines on pure white background.",
}

export type PortraitStyle = keyof typeof STYLE_PROMPTS

/**
 * Generate a line art portrait from a photo URL using Together AI.
 *
 * @param imageUrl - Public URL of the original photo
 * @param style - Art style to apply
 * @returns URL of the generated line art image (hosted by Together AI temporarily)
 */
export async function generateLinePortrait(
  imageUrl: string,
  style: PortraitStyle = "classic"
): Promise<string> {
  const apiKey = process.env.TOGETHER_API_KEY
  if (!apiKey) {
    throw new Error("TOGETHER_API_KEY is not configured")
  }

  const prompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.classic

  console.log(`[AI] Generating line portrait – style: ${style}`)
  console.log(`[AI] Source image: ${imageUrl}`)

  const response = await fetch("https://api.together.xyz/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      image_url: imageUrl,
      width: 1024,
      height: 1024,
      steps: 28,
      n: 1,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`[AI] Together API error ${response.status}:`, errorText)
    throw new Error(`Together AI API error: ${response.status} – ${errorText}`)
  }

  const result = await response.json()

  const generatedUrl = result?.data?.[0]?.url
  if (!generatedUrl) {
    console.error("[AI] No image URL in response:", JSON.stringify(result))
    throw new Error("Together AI did not return an image URL")
  }

  console.log(`[AI] Generated image URL: ${generatedUrl}`)
  return generatedUrl
}

/**
 * Download an image from a URL and return it as a Buffer.
 */
export async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download image: ${res.status}`)
  const arrayBuffer = await res.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

export { STYLE_PROMPTS }
