export type ProductType = "digital" | "print"
export type FrameOption = "none" | "oak" | "black" | "acrylic"
export type SizeOption = "small" | "medium" | "large"
export type GenerationStatus = "idle" | "generating" | "success" | "error"
export type CartStatus = "idle" | "adding" | "success" | "error"

export type PortraitStyle = {
  id: string
  name: string
  description?: string
  thumbnailUrl?: string
  promptKey: string
  enabled?: boolean
}

export type AIGenerationInput = {
  sourceImageUrl: string | null
  croppedImageUrl: string | null
  selectedStyleId: string | null
}

export type LastGeneratedInput = {
  croppedImageUrl: string | null
  selectedStyleId: string | null
}

export type PresentationConfig = {
  customText: string
  productType: ProductType
  frameOption: FrameOption
  sizeOption: SizeOption
}

export type GeneratedArtwork = {
  imageUrl: string | null
  generatedAt?: string | null
  sessionId?: string | null
}

export type GeneratorPrice = {
  amount: number
  currency: string
  formatted: string
}

export type GeneratorState = {
  aiInput: AIGenerationInput
  presentation: PresentationConfig
  generatedArtwork: GeneratedArtwork
  generationStatus: GenerationStatus
  cartStatus: CartStatus
  generationError: string | null
  cartError: string | null
  lastGeneratedInput: LastGeneratedInput | null
}

export type GeneratorActions = {
  setSourceImage: (url: string | null) => void
  setCroppedImage: (url: string | null) => void
  setSelectedStyle: (styleId: string) => void
  setCustomText: (text: string) => void
  setProductType: (type: ProductType) => void
  setFrameOption: (frame: FrameOption) => void
  setSizeOption: (size: SizeOption) => void
  generateArtwork: () => Promise<void>
  addToCart: () => Promise<void>
  replacePhoto: () => void
  resetGenerator: () => void
}

export type GeneratorComputed = {
  needsRegeneration: boolean
  canGenerate: boolean
  canAddToCart: boolean
  visibleFrameSection: boolean
  visibleSizeSection: boolean
  price: GeneratorPrice
}
