import { HttpTypes } from "@medusajs/types"

export type PortraitOutputVariantHandles = {
  digital: string
  print: string
  canvas: string
}

export const DEFAULT_PORTRAIT_OUTPUT_HANDLES: PortraitOutputVariantHandles = {
  digital: "portrait-digital",
  print: "portrait-print",
  canvas: "portrait-canvas",
}

export type PortraitStyleTemplate = {
  mode: "style-template"
  templateId: string
  handle: string
  title: string
  subtitle: string | null
  description: string | null
  group: string
  groupLabel: string
  groupDescription: string
  family: string | null
  familyLabel: string | null
  badge: string | null
  promptPreset: string | null
  promptNotes: string | null
  negativePrompt: string | null
  referenceImageUrl: string | null
  previewImageUrl: string | null
  aspectRatio: string
  sortOrder: number
  outputVariantHandles: PortraitOutputVariantHandles
}

type GroupConfig = {
  label: string
  description: string
}

const GROUP_CONFIG: Record<string, GroupConfig> = {
  "for-girls": {
    label: "For Girls",
    description:
      "Dreamy portraits with princess, ballet, fairy-tale, and pastel scenes.",
  },
  "for-boys": {
    label: "For Boys",
    description:
      "Adventure, hero, explorer, and playful storybook portrait templates.",
  },
  fantasy: {
    label: "Fantasy",
    description:
      "Imaginative worlds with magical creatures, glowing scenes, and cinematic lighting.",
  },
  classic: {
    label: "Classic Portraits",
    description:
      "Polished studio-inspired portrait templates with timeless styling.",
  },
  seasonal: {
    label: "Seasonal",
    description:
      "Holiday and event-led portrait styles built around specific moments.",
  },
}

function readString(
  metadata: Record<string, unknown> | null | undefined,
  ...keys: string[]
) {
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

function readNumber(
  metadata: Record<string, unknown> | null | undefined,
  ...keys: string[]
) {
  const value = readString(metadata, ...keys)

  if (!value) {
    return null
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function readBoolean(
  metadata: Record<string, unknown> | null | undefined,
  ...keys: string[]
) {
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

function slugToLabel(value: string) {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function resolveGroup(group: string) {
  return (
    GROUP_CONFIG[group] ?? {
      label: slugToLabel(group),
      description: "Curated portrait templates designed for a specific vibe.",
    }
  )
}

function normalizeHandleMap(
  metadata: Record<string, unknown> | null | undefined
): PortraitOutputVariantHandles {
  return {
    digital:
      readString(
        metadata,
        "output_digital_handle",
        "outputDigitalHandle",
        "digital_handle",
        "digitalHandle"
      ) ?? DEFAULT_PORTRAIT_OUTPUT_HANDLES.digital,
    print:
      readString(
        metadata,
        "output_print_handle",
        "outputPrintHandle",
        "print_handle",
        "printHandle"
      ) ?? DEFAULT_PORTRAIT_OUTPUT_HANDLES.print,
    canvas:
      readString(
        metadata,
        "output_canvas_handle",
        "outputCanvasHandle",
        "canvas_handle",
        "canvasHandle"
      ) ?? DEFAULT_PORTRAIT_OUTPUT_HANDLES.canvas,
  }
}

export function getPortraitStyleTemplate(
  product: HttpTypes.StoreProduct
): PortraitStyleTemplate | null {
  const metadata = (product.metadata ?? null) as Record<string, unknown> | null
  const portraitMode = readString(metadata, "portrait_mode", "portraitMode")
  const templateGroup = readString(metadata, "template_group", "templateGroup")

  if (
    portraitMode !== "style-template" &&
    !templateGroup
  ) {
    return null
  }

  if (!product.handle) {
    return null
  }

  const normalizedGroup = (templateGroup ?? "classic").toLowerCase()
  const groupConfig = resolveGroup(normalizedGroup)
  const family = readString(metadata, "template_family", "templateFamily")
  const productImageUrl = product.images?.[0]?.url ?? product.thumbnail ?? null
  const metadataPreviewImageUrl = readString(
    metadata,
    "preview_image_url",
    "previewImageUrl"
  )
  const metadataReferenceImageUrl = readString(
    metadata,
    "reference_image_url",
    "referenceImageUrl"
  )
  const useCustomPreviewImage =
    readBoolean(
      metadata,
      "use_custom_preview_image",
      "useCustomPreviewImage"
    ) ?? false
  const useCustomReferenceImage =
    readBoolean(
      metadata,
      "use_custom_reference_image",
      "useCustomReferenceImage"
    ) ?? false
  const previewImageUrl =
    (useCustomPreviewImage ? metadataPreviewImageUrl : null) ??
    productImageUrl ??
    metadataPreviewImageUrl ??
    null
  const referenceImageUrl =
    (useCustomReferenceImage ? metadataReferenceImageUrl : null) ??
    productImageUrl ??
    metadataReferenceImageUrl ??
    previewImageUrl

  return {
    mode: "style-template",
    templateId:
      readString(metadata, "template_id", "templateId") ?? product.handle,
    handle: product.handle,
    title: product.title ?? slugToLabel(product.handle),
    subtitle:
      readString(metadata, "template_subtitle", "templateSubtitle") ??
      product.subtitle ??
      null,
    description: product.description ?? null,
    group: normalizedGroup,
    groupLabel: groupConfig.label,
    groupDescription: groupConfig.description,
    family,
    familyLabel: family ? slugToLabel(family) : null,
    badge: readString(metadata, "template_badge", "templateBadge"),
    promptPreset: readString(metadata, "prompt_preset", "promptPreset"),
    promptNotes: readString(metadata, "prompt_notes", "promptNotes"),
    negativePrompt: readString(metadata, "negative_prompt", "negativePrompt"),
    referenceImageUrl,
    previewImageUrl,
    aspectRatio:
      readString(metadata, "aspect_ratio", "aspectRatio") ?? "3:4",
    sortOrder:
      readNumber(metadata, "template_sort_order", "templateSortOrder") ?? 999,
    outputVariantHandles: normalizeHandleMap(metadata),
  }
}

export function isPortraitStyleTemplateProduct(
  product: HttpTypes.StoreProduct
) {
  return getPortraitStyleTemplate(product) !== null
}

export function groupPortraitStyleTemplateProducts(
  products: HttpTypes.StoreProduct[]
) {
  const grouped = new Map<
    string,
    {
      key: string
      label: string
      description: string
      items: Array<{
        product: HttpTypes.StoreProduct
        template: PortraitStyleTemplate
      }>
    }
  >()

  for (const product of products) {
    const template = getPortraitStyleTemplate(product)

    if (!template) {
      continue
    }

    const group = grouped.get(template.group) ?? {
      key: template.group,
      label: template.groupLabel,
      description: template.groupDescription,
      items: [],
    }

    group.items.push({ product, template })
    grouped.set(template.group, group)
  }

  return Array.from(grouped.values())
    .map((group) => ({
      ...group,
      items: group.items.sort((left, right) => {
        if (left.template.sortOrder !== right.template.sortOrder) {
          return left.template.sortOrder - right.template.sortOrder
        }

        return left.template.title.localeCompare(right.template.title)
      }),
    }))
    .sort((left, right) => left.label.localeCompare(right.label))
}
