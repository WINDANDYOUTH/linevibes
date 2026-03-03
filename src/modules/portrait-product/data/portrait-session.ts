/**
 * Portrait Session Data Utilities
 *
 * Handles fetching and managing portrait generation session data.
 * Session data is stored in Cloudflare R2 (images) and KV (metadata).
 *
 * Current implementation: placeholder/demo mode
 * Production: Replace with actual Cloudflare R2/KV API calls
 */

export type PortraitSession = {
  /** Unique session identifier */
  sessionId: string
  /** Status of the portrait generation */
  status: "generating" | "completed" | "expired"
  /** URL to the generated portrait image (PNG) */
  portraitUrl: string
  /** URL to the SVG version (if available) */
  portraitSvgUrl: string
  /** URL to the original uploaded photo */
  originalPhotoUrl: string
  /** Thumbnail URL for previews */
  thumbnailUrl: string
  /** Selected art style */
  style: string
  /** When the session was created */
  createdAt: string
  /** When the session/download links expire */
  expiresAt: string
}

/**
 * Fetches portrait session data by session ID.
 *
 * In production, this will query:
 * 1. Cloudflare KV for session metadata
 * 2. Cloudflare R2 for image URLs (pre-signed if needed)
 *
 * @param sessionId - The session ID from the URL parameter
 * @returns Session data or null if not found/expired
 */
export async function fetchPortraitSession(
  sessionId: string
): Promise<PortraitSession | null> {
  // ─────────────────────────────────────────────────────
  // TODO: Replace with actual Cloudflare R2/KV integration
  //
  // Example production implementation:
  //
  // const KV_NAMESPACE = process.env.CLOUDFLARE_KV_NAMESPACE_ID
  // const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET
  // const R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL
  //
  // // 1. Fetch session metadata from Cloudflare KV
  // const response = await fetch(
  //   `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE}/values/session:${sessionId}`,
  //   { headers: { Authorization: `Bearer ${CF_API_TOKEN}` } }
  // )
  //
  // if (!response.ok) return null
  //
  // const metadata = await response.json()
  //
  // // 2. Check expiration
  // if (new Date(metadata.expiresAt) < new Date()) return null
  //
  // // 3. Build image URLs from R2
  // return {
  //   sessionId,
  //   status: metadata.status,
  //   portraitUrl: `${R2_PUBLIC_URL}/portraits/${sessionId}/portrait.png`,
  //   portraitSvgUrl: `${R2_PUBLIC_URL}/portraits/${sessionId}/portrait.svg`,
  //   originalPhotoUrl: `${R2_PUBLIC_URL}/portraits/${sessionId}/original.jpg`,
  //   thumbnailUrl: `${R2_PUBLIC_URL}/portraits/${sessionId}/thumb.png`,
  //   style: metadata.style,
  //   createdAt: metadata.createdAt,
  //   expiresAt: metadata.expiresAt,
  // }
  // ─────────────────────────────────────────────────────

  // Demo/placeholder mode - return mock data
  // This allows the page to render and be tested without Cloudflare
  const now = new Date()
  const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

  return {
    sessionId,
    status: "completed",
    portraitUrl: "",      // Empty = shows placeholder in LineArtRenderer
    portraitSvgUrl: "",
    originalPhotoUrl: "",
    thumbnailUrl: "",
    style: "classic",
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  }
}

/**
 * Checks if a portrait session is still valid (not expired).
 */
export function isSessionValid(session: PortraitSession): boolean {
  if (session.status === "expired") return false
  return new Date(session.expiresAt) > new Date()
}
