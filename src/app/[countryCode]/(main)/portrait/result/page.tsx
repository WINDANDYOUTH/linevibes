import { Metadata } from "next"
import { redirect } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import PortraitProductTemplate from "@modules/portrait-product/components/PortraitProductTemplate"
import {
  fetchPortraitSession,
  isSessionValid,
} from "@modules/portrait-product/data/portrait-session"

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ sid?: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  return {
    title: "Your Line Portrait | LineVibes",
    description:
      "Your custom AI-generated line portrait. Choose from instant download, premium print, or gallery canvas.",
    openGraph: {
      title: "Your Line Portrait | LineVibes",
      description:
        "Your custom AI-generated line portrait. Choose from instant download, premium print, or gallery canvas.",
    },
  }
}

/**
 * Helper: fetch a product by handle and extract variant ID + formatted price
 */
async function getTemplateProduct(handle: string, countryCode: string) {
  try {
    const { response } = await listProducts({
      countryCode,
      queryParams: { handle, limit: 1 },
    })

    const product = response.products[0]
    if (!product) return null

    const variant = product.variants?.[0]
    if (!variant) return null

    const { cheapestPrice } = getProductPrice({ product })

    return {
      variantId: variant.id,
      price: cheapestPrice?.calculated_price || "",
    }
  } catch (error) {
    console.error(`Failed to fetch template product "${handle}":`, error)
    return null
  }
}

/**
 * Portrait Result Page
 *
 * Route: /[countryCode]/portrait/result?sid=SESSION_ID
 *
 * This page loads the user's generated portrait via session ID
 * and displays the PortraitProductTemplate with 3 variant options.
 *
 * The 3 template products are fetched from Medusa by handle:
 * - portrait-digital
 * - portrait-print
 * - portrait-canvas
 */
export default async function PortraitResultPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sid } = searchParams
  const restartHref = `/${params.countryCode}/line-portrait`

  // If no session ID, redirect to the generate page
  if (!sid) {
    redirect(restartHref)
  }

  // ─── Session Data Lookup ──────────────────────────────
  const portraitSession = await fetchPortraitSession(sid)

  // Session not found or expired
  if (!portraitSession || !isSessionValid(portraitSession)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <span className="text-5xl mb-4 block">⏰</span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Session Expired
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            This portrait session has expired or could not be found. Please
            generate a new portrait to continue.
          </p>
          <a
            href={restartHref}
            className="inline-flex items-center gap-2 px-6 py-3 bg-linevibes-blue text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            Generate New Portrait
          </a>
        </div>
      </div>
    )
  }

  // ─── Fetch Template Products from Medusa ──────────────
  const [digital, print, canvas] = await Promise.all([
    getTemplateProduct("portrait-digital", params.countryCode),
    getTemplateProduct("portrait-print", params.countryCode),
    getTemplateProduct("portrait-canvas", params.countryCode),
  ])

  // Build variant IDs — use actual Medusa data or empty fallback
  const variantIds = {
    digital: digital?.variantId || "",
    print: print?.variantId || "",
    canvas: canvas?.variantId || "",
  }

  // Build price labels from Medusa
  const prices = {
    digital: digital?.price || "$9",
    print: print?.price || "$29",
    canvas: canvas?.price || "$69",
  }

  return (
    <PortraitProductTemplate
      portraitImageUrl={portraitSession.portraitUrl}
      portraitSvgUrl={portraitSession.portraitSvgUrl}
      sessionId={portraitSession.sessionId}
      portraitStyle={portraitSession.style}
      variantIds={variantIds}
      prices={prices}
    />
  )
}
