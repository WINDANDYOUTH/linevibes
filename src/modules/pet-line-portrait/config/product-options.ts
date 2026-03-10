import type { FrameOption, ProductType, SizeOption } from "../types/generator"

export const PRODUCT_TYPE_OPTIONS: Array<{
  value: ProductType
  label: string
  description: string
}> = [
  {
    value: "digital",
    label: "Digital Download",
    description: "High-resolution file for saving or printing later.",
  },
  {
    value: "print",
    label: "Printed Artwork",
    description: "Physical art print with optional frame selection.",
  },
]

export const FRAME_OPTIONS: Array<{
  value: FrameOption
  label: string
  description: string
}> = [
  { value: "none", label: "None", description: "Artwork only" },
  { value: "oak", label: "Oak Wood", description: "Warm natural wood finish" },
  { value: "black", label: "Black Frame", description: "Minimal matte black frame" },
  { value: "acrylic", label: "Acrylic", description: "Clean glossy acrylic finish" },
]

export const SIZE_OPTIONS: Array<{
  value: SizeOption
  label: string
  dimensions: string
}> = [
  { value: "small", label: "Small", dimensions: '8x10"' },
  { value: "medium", label: "Medium", dimensions: '12x16"' },
  { value: "large", label: "Large", dimensions: '18x24"' },
]
