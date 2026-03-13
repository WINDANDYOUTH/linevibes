import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"

import {
  DEFAULT_PORTRAIT_OUTPUT_HANDLES,
  type PortraitOutputVariantHandles,
} from "./style-template"

export type PortraitTemplateProductOption = {
  handle: string
  variantId: string
  price: string
  title: string
} | null

export type PortraitTemplateProductMap = {
  digital: PortraitTemplateProductOption
  print: PortraitTemplateProductOption
  canvas: PortraitTemplateProductOption
}

async function getTemplateProduct(handle: string, countryCode: string) {
  const { response } = await listProducts({
    countryCode,
    queryParams: { handle, limit: 1 },
  })

  const product = response.products[0]
  if (!product) {
    return null
  }

  const variant = product.variants?.[0]
  if (!variant) {
    return null
  }

  const { cheapestPrice } = getProductPrice({ product })

  return {
    handle,
    title: product.title ?? handle,
    variantId: variant.id,
    price: cheapestPrice?.calculated_price || "",
  }
}

export async function getPortraitTemplateProducts(
  countryCode: string,
  handles: Partial<PortraitOutputVariantHandles> = DEFAULT_PORTRAIT_OUTPUT_HANDLES
): Promise<PortraitTemplateProductMap> {
  const resolvedHandles: PortraitOutputVariantHandles = {
    digital: handles.digital ?? DEFAULT_PORTRAIT_OUTPUT_HANDLES.digital,
    print: handles.print ?? DEFAULT_PORTRAIT_OUTPUT_HANDLES.print,
    canvas: handles.canvas ?? DEFAULT_PORTRAIT_OUTPUT_HANDLES.canvas,
  }

  const [digital, print, canvas] = await Promise.all([
    getTemplateProduct(resolvedHandles.digital, countryCode),
    getTemplateProduct(resolvedHandles.print, countryCode),
    getTemplateProduct(resolvedHandles.canvas, countryCode),
  ])

  return {
    digital,
    print,
    canvas,
  }
}
