"use client"

// Google Tag Manager Configuration
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

// Initialize GTM dataLayer
export const initDataLayer = () => {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || []
  }
}

// Push events to GTM dataLayer
export const pushToDataLayer = (data: Record<string, unknown>) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push(data)
  }
}

// Page View Event
export const trackPageView = (url: string, title?: string) => {
  pushToDataLayer({
    event: "page_view",
    page_location: url,
    page_title: title || document.title,
    timestamp: new Date().toISOString(),
  })
}

// User ID tracking
export const setUserId = (userId: string | null) => {
  pushToDataLayer({
    user_id: userId,
  })
}

// Custom Event tracking
export const trackCustomEvent = (eventName: string, params?: Record<string, unknown>) => {
  pushToDataLayer({
    event: eventName,
    ...params,
  })
}

// E-commerce Events (GA4 Enhanced E-commerce)

// View Item Event
export const trackViewItem = (item: {
  id: string
  name: string
  category?: string
  price: number
  currency: string
  quantity?: number
}) => {
  pushToDataLayer({
    event: "view_item",
    ecommerce: {
      currency: item.currency,
      value: item.price,
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          price: item.price,
          quantity: item.quantity || 1,
        },
      ],
    },
  })
}

// Add to Cart Event
export const trackAddToCart = (item: {
  id: string
  name: string
  category?: string
  price: number
  currency: string
  quantity: number
}) => {
  pushToDataLayer({
    event: "add_to_cart",
    ecommerce: {
      currency: item.currency,
      value: item.price * item.quantity,
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          price: item.price,
          quantity: item.quantity,
        },
      ],
    },
  })
}

// Remove from Cart Event
export const trackRemoveFromCart = (item: {
  id: string
  name: string
  price: number
  currency: string
  quantity: number
}) => {
  pushToDataLayer({
    event: "remove_from_cart",
    ecommerce: {
      currency: item.currency,
      value: item.price * item.quantity,
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        },
      ],
    },
  })
}

// View Cart Event
export const trackViewCart = (items: {
  id: string
  name: string
  price: number
  quantity: number
}[], currency: string, total: number) => {
  pushToDataLayer({
    event: "view_cart",
    ecommerce: {
      currency: currency,
      value: total,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    },
  })
}

// Begin Checkout Event
export const trackBeginCheckout = (items: {
  id: string
  name: string
  price: number
  quantity: number
}[], currency: string, total: number) => {
  pushToDataLayer({
    event: "begin_checkout",
    ecommerce: {
      currency: currency,
      value: total,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    },
  })
}

// Add Shipping Info Event
export const trackAddShippingInfo = (
  shippingTier: string,
  items: { id: string; name: string; price: number; quantity: number }[],
  currency: string,
  total: number
) => {
  pushToDataLayer({
    event: "add_shipping_info",
    ecommerce: {
      currency: currency,
      value: total,
      shipping_tier: shippingTier,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    },
  })
}

// Add Payment Info Event
export const trackAddPaymentInfo = (
  paymentType: string,
  items: { id: string; name: string; price: number; quantity: number }[],
  currency: string,
  total: number
) => {
  pushToDataLayer({
    event: "add_payment_info",
    ecommerce: {
      currency: currency,
      value: total,
      payment_type: paymentType,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    },
  })
}

// Purchase Event
export const trackPurchase = (order: {
  transactionId: string
  value: number
  tax: number
  shipping: number
  currency: string
  items: { id: string; name: string; price: number; quantity: number }[]
  coupon?: string
}) => {
  pushToDataLayer({
    event: "purchase",
    ecommerce: {
      transaction_id: order.transactionId,
      value: order.value,
      tax: order.tax,
      shipping: order.shipping,
      currency: order.currency,
      coupon: order.coupon,
      items: order.items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    },
  })
}

// Declare dataLayer on window
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}
