import sharp from "sharp"

type ExportDimensions = {
  width: number
  height: number
}

export type PortraitDeliveryAssetBundle = {
  previewBuffer: Buffer
  deliveryBuffer: Buffer
}

const PREVIEW_MAX_EDGE = 1280
const DELIVERY_MAX_EDGE = 4096

function resolveBaseDimensions(aspectRatio: string): ExportDimensions {
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

function scaleDimensions(
  dimensions: ExportDimensions,
  maxEdge: number
): ExportDimensions {
  const scale = maxEdge / Math.max(dimensions.width, dimensions.height)

  return {
    width: Math.max(1, Math.round(dimensions.width * scale)),
    height: Math.max(1, Math.round(dimensions.height * scale)),
  }
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function buildWatermarkOverlay(
  width: number,
  height: number,
  label: string
): Buffer {
  const safeLabel = escapeXml(label)
  const diagonalFontSize = Math.max(
    42,
    Math.round(Math.min(width, height) * 0.065)
  )
  const badgeFontSize = Math.max(
    16,
    Math.round(Math.min(width, height) * 0.026)
  )
  const badgePaddingX = Math.round(badgeFontSize * 1.2)
  const badgePaddingY = Math.round(badgeFontSize * 0.9)
  const badgeWidth = Math.round(width * 0.44)
  const badgeHeight = badgeFontSize + badgePaddingY * 2

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(${Math.round(width / 2)} ${Math.round(height / 2)}) rotate(-28)">
        <text
          x="0"
          y="${-Math.round(diagonalFontSize * 2.1)}"
          text-anchor="middle"
          fill="rgba(255,255,255,0.42)"
          stroke="rgba(17,24,39,0.18)"
          stroke-width="2"
          font-family="Arial, Helvetica, sans-serif"
          font-size="${diagonalFontSize}"
          font-weight="700"
          letter-spacing="8"
        >${safeLabel}</text>
        <text
          x="0"
          y="0"
          text-anchor="middle"
          fill="rgba(255,255,255,0.46)"
          stroke="rgba(17,24,39,0.2)"
          stroke-width="2"
          font-family="Arial, Helvetica, sans-serif"
          font-size="${diagonalFontSize}"
          font-weight="700"
          letter-spacing="8"
        >${safeLabel}</text>
        <text
          x="0"
          y="${Math.round(diagonalFontSize * 2.1)}"
          text-anchor="middle"
          fill="rgba(255,255,255,0.42)"
          stroke="rgba(17,24,39,0.18)"
          stroke-width="2"
          font-family="Arial, Helvetica, sans-serif"
          font-size="${diagonalFontSize}"
          font-weight="700"
          letter-spacing="8"
        >${safeLabel}</text>
      </g>

      <rect
        x="24"
        y="24"
        width="${badgeWidth}"
        height="${badgeHeight}"
        rx="${Math.round(badgeHeight / 2)}"
        fill="rgba(17,24,39,0.72)"
      />
      <text
        x="${24 + badgePaddingX}"
        y="${24 + badgePaddingY + badgeFontSize - 2}"
        fill="rgba(255,255,255,0.92)"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${badgeFontSize}"
        font-weight="700"
        letter-spacing="1.5"
      >PREVIEW ONLY / WATERMARKED</text>
    </svg>
  `

  return Buffer.from(svg)
}

async function renderPng(
  baseBuffer: Buffer,
  dimensions: ExportDimensions
): Promise<Buffer> {
  return sharp(baseBuffer)
    .resize({
      width: dimensions.width,
      height: dimensions.height,
      fit: "fill",
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: false,
    })
    .png()
    .toBuffer()
}

export async function buildStylePortraitAssetBundle(
  baseBuffer: Buffer,
  aspectRatio: string,
  watermarkLabel = "LINEVIBES PREVIEW"
): Promise<PortraitDeliveryAssetBundle> {
  const baseDimensions = resolveBaseDimensions(aspectRatio)
  const previewDimensions = scaleDimensions(baseDimensions, PREVIEW_MAX_EDGE)
  const deliveryDimensions = scaleDimensions(baseDimensions, DELIVERY_MAX_EDGE)

  const [previewBaseBuffer, deliveryBuffer] = await Promise.all([
    renderPng(baseBuffer, previewDimensions),
    renderPng(baseBuffer, deliveryDimensions),
  ])

  const watermarkOverlay = buildWatermarkOverlay(
    previewDimensions.width,
    previewDimensions.height,
    watermarkLabel
  )

  const previewBuffer = await sharp(previewBaseBuffer)
    .composite([{ input: watermarkOverlay }])
    .png()
    .toBuffer()

  return {
    previewBuffer,
    deliveryBuffer,
  }
}
