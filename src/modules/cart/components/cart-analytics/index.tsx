"use client"

import { useAnalytics } from "@lib/analytics/provider"
import { HttpTypes } from "@medusajs/types"
import { useEffect } from "react"

type CartAnalyticsProps = {
  cart: HttpTypes.StoreCart
}

const CartAnalytics = ({ cart }: CartAnalyticsProps) => {
  const { trackViewCart } = useAnalytics()

  useEffect(() => {
    if (!cart?.items?.length) {
      return
    }

    trackViewCart(
      cart.items.map((item) => ({
        id: item.variant_id || item.variant?.id || item.id,
        name: item.product_title || item.title || "Unknown Product",
        price: item.unit_price || 0,
        quantity: item.quantity || 1,
      })),
      (cart.currency_code || "USD").toUpperCase(),
      cart.total || 0
    )
  }, [cart, trackViewCart])

  return null
}

export default CartAnalytics