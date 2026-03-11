import type { FrameOption, ProductType, SizeOption } from "../types/generator"

export const PRODUCT_TYPE_OPTIONS: Array<{
  value: ProductType
  label: string
  description: string
}> = [
  {
    value: "digital",
    label: "Digital File",
    description: "High-quality downloadable files for printing or digital use.",
  },
  {
    value: "print",
    label: "Physical Print",
    description: "Professionally printed and framed, delivered to your door.",
  },
]

export const FRAME_OPTIONS: Array<{
  value: FrameOption
  label: string
  description: string
}> = [
  { value: "none", label: "None", description: "Artwork only" },
  { value: "oak", label: "Oak Wood", description: "Warm natural wood finish" },
  {
    value: "black",
    label: "Black Metal",
    description: "Minimal matte black frame",
  },
  {
    value: "acrylic",
    label: "Brushed Gold",
    description: "Luxe metallic gallery finish",
  },
]

export const SIZE_OPTIONS: Array<{
  value: SizeOption
  label: string
  dimensions: string
}> = [
  { value: "small", label: "8x10 inches", dimensions: "20x25 cm" },
  { value: "medium", label: "11x14 inches", dimensions: "28x36 cm" },
  { value: "large", label: "16x20 inches", dimensions: "40x50 cm" },
]
