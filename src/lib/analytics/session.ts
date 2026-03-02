"use client"

// Session data structure
export interface SessionData {
  sessionId: string
  visitorId: string
  startTime: string
  lastActivity: string
  pageViews: number
  
  // Traffic source
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  referrer?: string
  landingPage?: string
  
  // Device info
  userAgent?: string
  screenWidth?: number
  screenHeight?: number
  deviceType?: "desktop" | "mobile" | "tablet"
  browser?: string
  os?: string
  language?: string
  timezone?: string
  
  // Behavior
  events: SessionEvent[]
  hasAddedToCart: boolean
  hasStartedCheckout: boolean
  hasCompletedPurchase: boolean
  viewedProductIds: string[]
  cartItemIds: string[]
}

export interface SessionEvent {
  type: string
  timestamp: string
  data?: Record<string, unknown>
}

const SESSION_STORAGE_KEY = "bk_session_data"
const VISITOR_STORAGE_KEY = "bk_visitor_id"
const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes

// Get or create visitor ID (persists across sessions)
export const getVisitorId = (): string => {
  if (typeof window === "undefined") return ""
  
  let visitorId = localStorage.getItem(VISITOR_STORAGE_KEY)
  if (!visitorId) {
    visitorId = generateId()
    localStorage.setItem(VISITOR_STORAGE_KEY, visitorId)
  }
  return visitorId
}

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

// Get device type from user agent
const getDeviceType = (): "desktop" | "mobile" | "tablet" => {
  if (typeof window === "undefined") return "desktop"
  
  const ua = navigator.userAgent.toLowerCase()
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return "tablet"
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
    return "mobile"
  }
  return "desktop"
}

// Get browser name
const getBrowser = (): string => {
  if (typeof window === "undefined") return "unknown"
  
  const ua = navigator.userAgent
  if (ua.indexOf("Chrome") > -1 && ua.indexOf("Edg") === -1) return "Chrome"
  if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) return "Safari"
  if (ua.indexOf("Firefox") > -1) return "Firefox"
  if (ua.indexOf("Edg") > -1) return "Edge"
  if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) return "Opera"
  return "Other"
}

// Get OS name
const getOS = (): string => {
  if (typeof window === "undefined") return "unknown"
  
  const ua = navigator.userAgent
  if (ua.indexOf("Win") > -1) return "Windows"
  if (ua.indexOf("Mac") > -1) return "MacOS"
  if (ua.indexOf("Linux") > -1) return "Linux"
  if (ua.indexOf("Android") > -1) return "Android"
  if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) return "iOS"
  return "Other"
}

// Parse UTM parameters from URL
const parseUtmParams = (): Partial<SessionData> => {
  if (typeof window === "undefined") return {}
  
  const params = new URLSearchParams(window.location.search)
  return {
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    utmTerm: params.get("utm_term") || undefined,
    utmContent: params.get("utm_content") || undefined,
  }
}

// Initialize or retrieve session
export const getSession = (): SessionData => {
  if (typeof window === "undefined") {
    return createNewSession()
  }
  
  const stored = sessionStorage.getItem(SESSION_STORAGE_KEY)
  if (stored) {
    const session: SessionData = JSON.parse(stored)
    const lastActivity = new Date(session.lastActivity).getTime()
    const now = Date.now()
    
    // Check if session has expired
    if (now - lastActivity > SESSION_TIMEOUT_MS) {
      return createNewSession()
    }
    
    return session
  }
  
  return createNewSession()
}

// Create a new session
const createNewSession = (): SessionData => {
  if (typeof window === "undefined") {
    return {
      sessionId: "",
      visitorId: "",
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      pageViews: 0,
      events: [],
      hasAddedToCart: false,
      hasStartedCheckout: false,
      hasCompletedPurchase: false,
      viewedProductIds: [],
      cartItemIds: [],
    }
  }
  
  const utmParams = parseUtmParams()
  
  const session: SessionData = {
    sessionId: generateId(),
    visitorId: getVisitorId(),
    startTime: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    pageViews: 0,
    
    // Traffic source
    ...utmParams,
    referrer: document.referrer || undefined,
    landingPage: window.location.href,
    
    // Device info
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    deviceType: getDeviceType(),
    browser: getBrowser(),
    os: getOS(),
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    
    // Behavior
    events: [],
    hasAddedToCart: false,
    hasStartedCheckout: false,
    hasCompletedPurchase: false,
    viewedProductIds: [],
    cartItemIds: [],
  }
  
  saveSession(session)
  return session
}

// Save session to storage
const saveSession = (session: SessionData) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  }
}

// Update session activity
export const updateSessionActivity = () => {
  const session = getSession()
  session.lastActivity = new Date().toISOString()
  saveSession(session)
}

// Track page view
export const trackSessionPageView = (url: string) => {
  const session = getSession()
  session.pageViews++
  session.lastActivity = new Date().toISOString()
  session.events.push({
    type: "page_view",
    timestamp: new Date().toISOString(),
    data: { url },
  })
  saveSession(session)
}

// Track product view
export const trackSessionProductView = (productId: string, productName: string) => {
  const session = getSession()
  if (!session.viewedProductIds.includes(productId)) {
    session.viewedProductIds.push(productId)
  }
  session.events.push({
    type: "product_view",
    timestamp: new Date().toISOString(),
    data: { productId, productName },
  })
  session.lastActivity = new Date().toISOString()
  saveSession(session)
}

// Track add to cart
export const trackSessionAddToCart = (productId: string, quantity: number) => {
  const session = getSession()
  session.hasAddedToCart = true
  if (!session.cartItemIds.includes(productId)) {
    session.cartItemIds.push(productId)
  }
  session.events.push({
    type: "add_to_cart",
    timestamp: new Date().toISOString(),
    data: { productId, quantity },
  })
  session.lastActivity = new Date().toISOString()
  saveSession(session)
}

// Track checkout start
export const trackSessionCheckoutStart = () => {
  const session = getSession()
  session.hasStartedCheckout = true
  session.events.push({
    type: "checkout_start",
    timestamp: new Date().toISOString(),
  })
  session.lastActivity = new Date().toISOString()
  saveSession(session)
}

// Track purchase complete
export const trackSessionPurchase = (orderId: string, total: number) => {
  const session = getSession()
  session.hasCompletedPurchase = true
  session.events.push({
    type: "purchase",
    timestamp: new Date().toISOString(),
    data: { orderId, total },
  })
  session.lastActivity = new Date().toISOString()
  saveSession(session)
}

// Get session duration in seconds
export const getSessionDuration = (): number => {
  const session = getSession()
  const start = new Date(session.startTime).getTime()
  const end = new Date(session.lastActivity).getTime()
  return Math.floor((end - start) / 1000)
}

// Get session summary for order metadata
export const getSessionSummaryForOrder = (): Record<string, unknown> => {
  const session = getSession()
  return {
    session_id: session.sessionId,
    visitor_id: session.visitorId,
    session_duration_seconds: getSessionDuration(),
    page_views: session.pageViews,
    
    // Traffic source
    utm_source: session.utmSource,
    utm_medium: session.utmMedium,
    utm_campaign: session.utmCampaign,
    utm_term: session.utmTerm,
    utm_content: session.utmContent,
    referrer: session.referrer,
    landing_page: session.landingPage,
    
    // Device
    device_type: session.deviceType,
    browser: session.browser,
    os: session.os,
    screen_resolution: session.screenWidth && session.screenHeight 
      ? `${session.screenWidth}x${session.screenHeight}` 
      : undefined,
    language: session.language,
    timezone: session.timezone,
    
    // Behavior summary
    viewed_products_count: session.viewedProductIds.length,
    viewed_product_ids: session.viewedProductIds.slice(0, 10), // Limit for storage
    cart_items_count: session.cartItemIds.length,
    events_count: session.events.length,
  }
}
