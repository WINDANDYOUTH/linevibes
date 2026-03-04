/**
 * API Auth Helper
 *
 * Extracts the current Medusa customer from the JWT cookie
 * for use in Next.js API Route Handlers.
 *
 * Uses the Medusa backend to validate the token and get customer info.
 */
import { cookies } from "next/headers"

const MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

/**
 * Get the current customer ID from the Medusa JWT cookie.
 * Returns null if not logged in or token is invalid.
 */
export async function getCustomerIdFromRequest(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("_medusa_jwt")?.value

    if (!token) return null

    // Call Medusa to validate token and get customer
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/customers/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.customer?.id || null
  } catch {
    return null
  }
}
