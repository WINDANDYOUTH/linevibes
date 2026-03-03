import { Metadata } from "next"
import { redirect } from "next/navigation"
import PortraitProductTemplate from "@modules/portrait-product/components/PortraitProductTemplate"

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
 * Portrait Result Page
 *
 * Route: /[countryCode]/portrait/result?sid=SESSION_ID
 *
 * This page loads the user's generated portrait via session ID
 * and displays the PortraitProductTemplate with 3 variant options.
 *
 * For Phase 1 (MVP), we use placeholder data for session lookup
 * and hardcoded variant IDs (to be replaced once the Medusa
 * template products are created in the backend).
 */
export default async function PortraitResultPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sid } = searchParams

  // If no session ID, redirect to the generate page
  if (!sid) {
    redirect(`/${params.countryCode}/line-portraits`)
  }

  // ─── Session Data Lookup ──────────────────────────────
  // TODO: Replace with actual Cloudflare R2 / KV lookup
  // For now, use a demo image URL if session data isn't available
  const portraitData = {
    imageUrl: "", // Empty for placeholder; replace with actual R2 URL
    style: "classic",
    sessionId: sid,
  }

  // ─── Medusa Product Variant IDs ───────────────────────
  // TODO: Replace with actual variant IDs after creating
  // the 3 template products in Medusa Admin
  const variantIds = {
    digital: "PLACEHOLDER_DIGITAL_VARIANT_ID",
    print: "PLACEHOLDER_PRINT_VARIANT_ID",
    canvas: "PLACEHOLDER_CANVAS_VARIANT_ID",
  }

  // ─── Price Labels ─────────────────────────────────────
  // TODO: Fetch from Medusa product data
  const prices = {
    digital: "$9",
    print: "$29",
    canvas: "$69",
  }

  return (
    <PortraitProductTemplate
      portraitImageUrl={portraitData.imageUrl}
      sessionId={portraitData.sessionId}
      portraitStyle={portraitData.style}
      variantIds={variantIds}
      prices={prices}
    />
  )
}
