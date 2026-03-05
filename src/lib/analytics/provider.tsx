"use client"

import { createContext, useContext, useEffect, useCallback, ReactNode } from "react"
import { usePathname } from "next/navigation"
import {
  trackPageView as gtmTrackPageView,
  trackViewItem,
  trackAddToCart,
  trackRemoveFromCart,
  trackViewCart,
  trackBeginCheckout,
  trackAddShippingInfo,
  trackAddPaymentInfo,
  trackPurchase,
  pushToDataLayer,
  setUserId,
  trackCustomEvent,
} from "@lib/analytics/gtm"
import {
  getSession,
  trackSessionPageView,
  trackSessionProductView,
  trackSessionAddToCart,
  trackSessionCheckoutStart,
  trackSessionPurchase,
  getSessionSummaryForOrder,
  updateSessionActivity,
} from "@lib/analytics/session"

interface AnalyticsContextValue {
  // Page tracking
  trackPageView: (url: string, title?: string) => void
  
  // E-commerce events
  trackProductView: (product: {
    id: string
    name: string
    category?: string
    price: number
    currency: string
  }) => void
  
  trackAddToCart: (item: {
    id: string
    name: string
    category?: string
    price: number
    currency: string
    quantity: number
  }) => void
  
  trackRemoveFromCart: (item: {
    id: string
    name: string
    price: number
    currency: string
    quantity: number
  }) => void
  
  trackViewCart: (
    items: { id: string; name: string; price: number; quantity: number }[],
    currency: string,
    total: number
  ) => void
  
  trackCheckoutStart: (
    items: { id: string; name: string; price: number; quantity: number }[],
    currency: string,
    total: number
  ) => void
  
  trackShippingInfo: (
    shippingTier: string,
    items: { id: string; name: string; price: number; quantity: number }[],
    currency: string,
    total: number
  ) => void
  
  trackPaymentInfo: (
    paymentType: string,
    items: { id: string; name: string; price: number; quantity: number }[],
    currency: string,
    total: number
  ) => void
  
  trackPurchase: (order: {
    transactionId: string
    value: number
    tax: number
    shipping: number
    currency: string
    items: { id: string; name: string; price: number; quantity: number }[]
    coupon?: string
  }) => void
  
  // Custom events
  trackCustomEvent: (eventName: string, params?: Record<string, unknown>) => void
  setUserId: (userId: string | null) => void

  // Session data for order metadata
  getOrderMetadata: () => Record<string, unknown>
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null)

export function useAnalytics(): AnalyticsContextValue {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider")
  }
  return context
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  // Auto track page views on route change
  useEffect(() => {
    const url = window.location.href
    gtmTrackPageView(url)
    trackSessionPageView(url)
    updateSessionActivity()
  }, [pathname])
  
  // Activity tracking
  useEffect(() => {
    const handleActivity = () => {
      updateSessionActivity()
    }
    
    // Track user activity
    window.addEventListener("scroll", handleActivity, { passive: true })
    window.addEventListener("click", handleActivity, { passive: true })
    
    return () => {
      window.removeEventListener("scroll", handleActivity)
      window.removeEventListener("click", handleActivity)
    }
  }, [])
  
  const trackPageViewHandler = useCallback((url: string, title?: string) => {
    gtmTrackPageView(url, title)
    trackSessionPageView(url)
  }, [])
  
  const trackProductViewHandler = useCallback((product: {
    id: string
    name: string
    category?: string
    price: number
    currency: string
  }) => {
    trackViewItem(product)
    trackSessionProductView(product.id, product.name)
  }, [])
  
  const trackAddToCartHandler = useCallback((item: {
    id: string
    name: string
    category?: string
    price: number
    currency: string
    quantity: number
  }) => {
    trackAddToCart(item)
    trackSessionAddToCart(item.id, item.quantity)
  }, [])
  
  const trackRemoveFromCartHandler = useCallback((item: {
    id: string
    name: string
    price: number
    currency: string
    quantity: number
  }) => {
    trackRemoveFromCart(item)
  }, [])
  
  const trackViewCartHandler = useCallback((
    items: { id: string; name: string; price: number; quantity: number }[],
    currency: string,
    total: number
  ) => {
    trackViewCart(items, currency, total)
  }, [])
  
  const trackCheckoutStartHandler = useCallback((
    items: { id: string; name: string; price: number; quantity: number }[],
    currency: string,
    total: number
  ) => {
    trackBeginCheckout(items, currency, total)
    trackSessionCheckoutStart()
  }, [])
  
  const trackShippingInfoHandler = useCallback((
    shippingTier: string,
    items: { id: string; name: string; price: number; quantity: number }[],
    currency: string,
    total: number
  ) => {
    trackAddShippingInfo(shippingTier, items, currency, total)
  }, [])
  
  const trackPaymentInfoHandler = useCallback((
    paymentType: string,
    items: { id: string; name: string; price: number; quantity: number }[],
    currency: string,
    total: number
  ) => {
    trackAddPaymentInfo(paymentType, items, currency, total)
  }, [])
  
  const trackPurchaseHandler = useCallback((order: {
    transactionId: string
    value: number
    tax: number
    shipping: number
    currency: string
    items: { id: string; name: string; price: number; quantity: number }[]
    coupon?: string
  }) => {
    trackPurchase(order)
    trackSessionPurchase(order.transactionId, order.value)
    
    // Also push session data to GTM for attribution
    const sessionData = getSessionSummaryForOrder()
    pushToDataLayer({
      event: "purchase_with_attribution",
      ...sessionData,
      transaction_id: order.transactionId,
      value: order.value,
    })
  }, [])
  
  const getOrderMetadataHandler = useCallback(() => {
    return getSessionSummaryForOrder()
  }, [])
  
  const trackCustomEventHandler = useCallback((eventName: string, params?: Record<string, unknown>) => {
    trackCustomEvent(eventName, params)
  }, [])

  const setUserIdHandler = useCallback((userId: string | null) => {
    setUserId(userId)
  }, [])
  
  const value: AnalyticsContextValue = {
    trackPageView: trackPageViewHandler,
    trackProductView: trackProductViewHandler,
    trackAddToCart: trackAddToCartHandler,
    trackRemoveFromCart: trackRemoveFromCartHandler,
    trackViewCart: trackViewCartHandler,
    trackCheckoutStart: trackCheckoutStartHandler,
    trackShippingInfo: trackShippingInfoHandler,
    trackPaymentInfo: trackPaymentInfoHandler,
    trackPurchase: trackPurchaseHandler,
    getOrderMetadata: getOrderMetadataHandler,
    trackCustomEvent: trackCustomEventHandler,
    setUserId: setUserIdHandler,
  }
  
  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}
