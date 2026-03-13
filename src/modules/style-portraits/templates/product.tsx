import type { HttpTypes } from "@medusajs/types"

import { getPortraitTemplateProducts } from "@lib/portrait/template-products"
import { getPortraitStyleTemplate } from "@lib/portrait/style-template"

import StyleTemplateProduct from "../components/style-template-product"

type StyleTemplateProductTemplateProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

export default async function StyleTemplateProductTemplate({
  product,
  countryCode,
  images,
}: StyleTemplateProductTemplateProps) {
  const template = getPortraitStyleTemplate(product)

  if (!template) {
    return null
  }

  const templateProducts = await getPortraitTemplateProducts(
    countryCode,
    template.outputVariantHandles
  )

  return (
    <StyleTemplateProduct
      countryCode={countryCode}
      product={product}
      images={images}
      template={template}
      templateProducts={templateProducts}
    />
  )
}
