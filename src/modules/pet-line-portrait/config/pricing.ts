import type {
  FrameOption,
  GeneratorPrice,
  ProductType,
  SizeOption,
} from "../types/generator"

const DIGITAL_BASE_PRICE = 29

const PRINT_BASE_PRICES: Record<SizeOption, number> = {
  small: 59,
  medium: 89,
  large: 129,
}

const FRAME_SURCHARGE: Record<FrameOption, number> = {
  none: 0,
  oak: 20,
  black: 20,
  acrylic: 35,
}

export function calculateGeneratorPrice(
  productType: ProductType,
  sizeOption: SizeOption,
  frameOption: FrameOption
): GeneratorPrice {
  if (productType === "digital") {
    return {
      amount: DIGITAL_BASE_PRICE,
      currency: "USD",
      formatted: `$${DIGITAL_BASE_PRICE.toFixed(2)}`,
    }
  }

  const amount = PRINT_BASE_PRICES[sizeOption] + FRAME_SURCHARGE[frameOption]

  return {
    amount,
    currency: "USD",
    formatted: `$${amount.toFixed(2)}`,
  }
}
