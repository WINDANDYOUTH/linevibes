import type { PortraitStyle } from "../types/generator"

export const PET_PORTRAIT_STYLES: PortraitStyle[] = [
  {
    id: "minimal-line",
    name: "Minimal Line",
    description: "Clean and elegant outline with a modern gallery feel.",
    thumbnailUrl: "/images/line-portrait/style-continuous-line.png",
    promptKey: "classic",
    enabled: true,
  },
  {
    id: "faceless",
    name: "Faceless",
    description: "Balanced simplified portrait with clear recognizable contours.",
    thumbnailUrl: "/images/line-portrait/style-faceless.png",
    promptKey: "minimal",
    enabled: true,
  },
  {
    id: "playful-sketch",
    name: "Playful Sketch",
    description: "More expressive linework for a softer gift-friendly result.",
    thumbnailUrl: "/images/line-portrait/style-bold-outline.png",
    promptKey: "artistic",
    enabled: true,
  },
]
