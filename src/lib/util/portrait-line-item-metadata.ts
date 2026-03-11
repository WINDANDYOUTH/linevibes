type RawPortraitLineItemMetadata = Record<string, unknown> | null | undefined

export type PortraitLineItemMetadata = {
  isPortraitItem: boolean
  portraitSessionId: string | null
  portraitImageUrl: string | null
  portraitSvgUrl: string | null
  portraitStyle: string | null
  variantType: string | null
  includesDigitalDownload: boolean
}

function readString(
  metadata: RawPortraitLineItemMetadata,
  ...keys: string[]
): string | null {
  if (!metadata) {
    return null
  }

  for (const key of keys) {
    const value = metadata[key]

    if (typeof value !== "string") {
      continue
    }

    const trimmed = value.trim()
    if (trimmed) {
      return trimmed
    }
  }

  return null
}

function readBoolean(
  metadata: RawPortraitLineItemMetadata,
  ...keys: string[]
): boolean | null {
  const value = readString(metadata, ...keys)

  if (value === null) {
    return null
  }

  const normalized = value.toLowerCase()
  if (normalized === "true") {
    return true
  }

  if (normalized === "false") {
    return false
  }

  return null
}

export function getPortraitLineItemMetadata(
  metadata: RawPortraitLineItemMetadata
): PortraitLineItemMetadata {
  const portraitSessionId = readString(
    metadata,
    "portrait_session_id",
    "portraitSessionId"
  )
  const portraitImageUrl = readString(
    metadata,
    "portrait_image_url",
    "generatedArtworkUrl"
  )
  const portraitSvgUrl = readString(
    metadata,
    "portrait_svg_url",
    "portraitSvgUrl"
  )
  const portraitStyle = readString(
    metadata,
    "portrait_style",
    "selected_style_label",
    "selected_style_id",
    "selectedStyleId"
  )
  const variantType = readString(
    metadata,
    "variant_type",
    "product_type",
    "productType"
  )
  const generatorType = readString(metadata, "generator_type", "generatorType")

  const isPortraitItem = Boolean(
    portraitSessionId ||
      portraitImageUrl ||
      (generatorType && generatorType.includes("portrait"))
  )

  const includesDigitalDownload =
    readBoolean(
      metadata,
      "includes_digital_download",
      "includesDigitalDownload"
    ) ?? isPortraitItem

  return {
    isPortraitItem,
    portraitSessionId,
    portraitImageUrl,
    portraitSvgUrl,
    portraitStyle,
    variantType,
    includesDigitalDownload,
  }
}
