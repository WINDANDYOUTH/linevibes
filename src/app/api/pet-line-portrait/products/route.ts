import { NextRequest, NextResponse } from "next/server"

import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"

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
    variantId: variant.id,
    price: cheapestPrice?.calculated_price || "",
  }
}

export async function GET(request: NextRequest) {
  try {
    const countryCode = request.nextUrl.searchParams.get("countryCode") || "us"

    const [digital, print] = await Promise.all([
      getTemplateProduct("portrait-digital", countryCode),
      getTemplateProduct("portrait-print", countryCode),
    ])

    return NextResponse.json({
      digital,
      print,
    })
  } catch (error) {
    console.error("[PetPortrait] Failed to load template products", error)

    return NextResponse.json(
      { error: "Failed to load product templates" },
      { status: 500 }
    )
  }
}
