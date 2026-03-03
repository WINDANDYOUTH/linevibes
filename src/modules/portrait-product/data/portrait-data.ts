/**
 * Portrait Product Template – Static Data & Configuration
 *
 * This file contains all the data for the 3 product variants,
 * highlights, frame materials, and default options.
 * 
 * These values drive the UI but actual pricing comes from
 * the 3 pre-created Medusa "template products".
 */

// ─── Frame Material Definitions ───────────────────────────────
export type FrameMaterial = {
  id: string
  name: string
  description: string
  /** CSS border-image or border-color value */
  borderStyle: string
  /** Gradient or solid background for the mat/mount area */
  matColor: string
  /** Price label shown in the selector (actual price from Medusa) */
  priceLabel: string
  /** URL to a tileable texture image (optional, for CSS border-image) */
  textureUrl?: string
}

export const FRAME_MATERIALS: FrameMaterial[] = [
  {
    id: "none",
    name: "No Frame",
    description: "Print only, no frame",
    borderStyle: "none",
    matColor: "transparent",
    priceLabel: "",
  },
  {
    id: "oak-wood",
    name: "Oak Wood",
    description: "Natural oak with warm grain",
    borderStyle: "linear-gradient(135deg, #c8a876 0%, #d4b896 25%, #b8945e 50%, #d4b896 75%, #c8a876 100%)",
    matColor: "#f5f0e8",
    priceLabel: "+$50",
  },
  {
    id: "black-wood",
    name: "Black Wood",
    description: "Sleek matte black finish",
    borderStyle: "linear-gradient(135deg, #2a2a2a 0%, #3d3d3d 25%, #1a1a1a 50%, #3d3d3d 75%, #2a2a2a 100%)",
    matColor: "#f5f5f5",
    priceLabel: "+$50",
  },
  {
    id: "walnut",
    name: "Walnut",
    description: "Rich dark walnut wood",
    borderStyle: "linear-gradient(135deg, #5c3d2e 0%, #7a5340 25%, #4a2f22 50%, #7a5340 75%, #5c3d2e 100%)",
    matColor: "#faf6f0",
    priceLabel: "+$60",
  },
]

// ─── Print Highlights ─────────────────────────────────────────
export type Highlight = {
  icon: string
  title: string
  description: string
}

export const PRINT_HIGHLIGHTS: Highlight[] = [
  {
    icon: "📄",
    title: "Premium Art Paper",
    description: "310gsm museum-quality cotton rag paper with a subtle matte finish",
  },
  {
    icon: "🖊️",
    title: "Archival Ink",
    description: "Pigment-based inks rated for 100+ years of fade resistance",
  },
  {
    icon: "✨",
    title: "Crisp Line Detail",
    description: "Ultra-high resolution printing preserves every stroke and detail",
  },
  {
    icon: "🛡️",
    title: "Protective Coating",
    description: "UV-resistant coating protects against fading and moisture",
  },
]

export const CANVAS_HIGHLIGHTS: Highlight[] = [
  {
    icon: "🎨",
    title: "Premium Cotton Canvas",
    description: "Museum-grade 400gsm poly-cotton blend with fine texture",
  },
  {
    icon: "🪵",
    title: "Solid Wood Stretcher",
    description: "Kiln-dried pine stretcher bars for lasting rigidity",
  },
  {
    icon: "🖼️",
    title: "Gallery-Wrapped Edges",
    description: "Image wraps around the edges for a frameless, modern look",
  },
  {
    icon: "📦",
    title: "Ready to Hang",
    description: "Arrives with pre-installed hardware, hang it in seconds",
  },
]

// ─── Size Options ─────────────────────────────────────────────
export type SizeOption = {
  id: string
  label: string
  dimensions: string
  /** Extra price label if any */
  priceLabel: string
  isDefault: boolean
}

export const PRINT_SIZES: SizeOption[] = [
  {
    id: "12x16",
    label: '12×16"',
    dimensions: "30 × 40 cm",
    priceLabel: "",
    isDefault: true,
  },
]

export const CANVAS_SIZES: SizeOption[] = [
  {
    id: "12x16",
    label: '12×16"',
    dimensions: "30 × 40 cm",
    priceLabel: "",
    isDefault: true,
  },
]

// ─── Color Options ────────────────────────────────────────────
export type ColorOption = {
  id: string
  name: string
  hex: string
  isDefault: boolean
}

export const PRINT_COLORS: ColorOption[] = [
  {
    id: "black",
    name: "Black",
    hex: "#1a1a1a",
    isDefault: true,
  },
]

// ─── Variant Tab Types ────────────────────────────────────────
export type VariantType = "digital" | "print" | "canvas"

export type VariantTabConfig = {
  id: VariantType
  label: string
  icon: string
  shortDescription: string
  /** The Medusa product handle for this variant type */
  productHandle: string
}

export const VARIANT_TABS: VariantTabConfig[] = [
  {
    id: "digital",
    label: "Instant Download",
    icon: "📥",
    shortDescription: "High-res digital file delivered to your inbox",
    productHandle: "portrait-digital",
  },
  {
    id: "print",
    label: "Order Print",
    icon: "🖨️",
    shortDescription: "Museum-quality print on premium art paper",
    productHandle: "portrait-print",
  },
  {
    id: "canvas",
    label: "Order Canvas",
    icon: "🖼️",
    shortDescription: "Gallery-wrapped canvas with optional frame",
    productHandle: "portrait-canvas",
  },
]
