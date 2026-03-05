"use client"

import { useAnalytics } from "@lib/analytics/provider"
import { HttpTypes } from "@medusajs/types"
import { useEffect } from "react"

type OrderAnalyticsProps = {
  order: HttpTypes.StoreOrder
}

const OrderAnalytics = ({ order }: OrderAnalyticsProps) => {
  const { trackPurchase } = useAnalytics()

  useEffect(() => {
    if (!order?.id) {
      return
    }

    const storageKey = `purchase_tracked_${order.id}`
    const alreadyTracked = window.sessionStorage.getItem(storageKey)

    if (alreadyTracked) {
      return
    }

    trackPurchase({
      transactionId: order.id,
      value: order.total || 0,
      tax: order.tax_total || 0,
      shipping: order.shipping_total || 0,
      currency: (order.currency_code || "USD").toUpperCase(),
      items: (order.items || []).map((item) => ({
        id: item.variant_id || item.variant?.id || item.id,
        name: item.product_title || item.title || "Unknown Product",
        price: item.unit_price || 0,
        quantity: item.quantity || 1,
      })),
      coupon: (order as any).promotions?.[0]?.code,
    })

    window.sessionStorage.setItem(storageKey, "1")
  }, [order, trackPurchase])

  return null
}

export default OrderAnalytics
