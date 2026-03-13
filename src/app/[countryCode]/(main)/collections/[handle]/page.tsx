import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCollectionByHandle, listCollections } from "@lib/data/collections"
import { listRegions } from "@lib/data/regions"
import { StoreCollection, StoreRegion } from "@medusajs/types"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<{
    page?: string
    sortBy?: SortOptions
  }>
}

export const PRODUCT_LIMIT = 12

// Collection-specific SEO content
const collectionSEO: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  // Style Collections
  minimalist: {
    title: "Minimalist Line Art Collection",
    description:
      "Clean, continuous line drawings that capture the essence of your subject. Single-stroke art plotted with precision.",
    keywords: ["minimalist art", "single line drawing", "continuous line art"],
  },
  blueprint: {
    title: "Blueprint Style Art Collection",
    description:
      "Technical schematic-style artwork inspired by engineering blueprints. White lines on classic blue paper.",
    keywords: ["blueprint art", "technical drawing", "schematic poster"],
  },
  detailed: {
    title: "Detailed Line Art Collection",
    description:
      "Intricate multi-layered line work with multiple passes for depth and shadow. Complex precision art.",
    keywords: ["detailed art", "intricate drawing", "complex line art"],
  },
  "bold-stroke": {
    title: "Bold Stroke Art Collection",
    description:
      "Thick, expressive lines with dramatic contrast. Statement artwork that commands attention.",
    keywords: ["bold art", "expressive drawing", "statement art"],
  },

  // Occasion Collections
  anniversary: {
    title: "Anniversary Gift Art",
    description:
      "Meaningful line art gifts for anniversaries. Transform wedding photos and special moments into lasting artwork.",
    keywords: ["anniversary gift", "couple art", "wedding anniversary"],
  },
  memorial: {
    title: "Memorial & Tribute Art",
    description:
      "Tender tributes to those we've lost. Transform cherished photos into timeless memorial artwork.",
    keywords: ["memorial art", "tribute drawing", "in memoriam"],
  },
  wedding: {
    title: "Wedding Gift Art Collection",
    description:
      "Unique wedding gifts for couples. Venue portraits, couple drawings, and custom wedding art.",
    keywords: ["wedding gift", "couple art", "venue portrait"],
  },
  birthday: {
    title: "Birthday Gift Art",
    description:
      "One-of-a-kind art for milestone birthdays. Custom portraits, hobby art, and personalized gift ideas.",
    keywords: ["birthday gift", "personalized art", "unique gift"],
  },
  "fathers-day": {
    title: "Father's Day Gift Art",
    description:
      "Perfect gifts for dad. Classic car art, aircraft blueprints, and custom pieces for fathers.",
    keywords: ["father's day gift", "gift for dad", "dad art"],
  },
  "mothers-day": {
    title: "Mother's Day Gift Art",
    description:
      "Thoughtful art gifts for mom. Family portraits, nature scenes, and meaningful personalized pieces.",
    keywords: ["mother's day gift", "gift for mom", "mom art"],
  },

  // Recipient Collections
  "gift-for-him": {
    title: "Gift for Him - Art Collection",
    description:
      "Curated art collection for men. Automotive blueprints, aviation art, and bold designs he'll love.",
    keywords: ["gift for him", "men's art", "masculine artwork"],
  },
  "gift-for-her": {
    title: "Gift for Her - Art Collection",
    description:
      "Elegant art collection for women. Minimalist portraits, nature scenes, and romantic designs.",
    keywords: ["gift for her", "women's art", "feminine artwork"],
  },
  "gift-for-dad": {
    title: "Gift for Dad - Art Collection",
    description:
      "Dad-approved art. Classic cars, military aircraft, and custom pieces celebrating fatherhood.",
    keywords: ["gift for dad", "father art", "dad gift"],
  },
  "gift-for-mom": {
    title: "Gift for Mom - Art Collection",
    description:
      "Art from the heart for mom. Family portraits, pet drawings, and meaningful custom pieces.",
    keywords: ["gift for mom", "mother art", "mom gift"],
  },
  "gift-for-couples": {
    title: "Gift for Couples - Art Collection",
    description:
      "Art for two. Couple portraits, wedding venue art, and romantic line drawings.",
    keywords: ["couple gift", "couple art", "romantic artwork"],
  },

  // Marketing Collections
  "new-in": {
    title: "New Arrivals - Latest Line Art",
    description:
      "Fresh from the plotter. Our newest designs and latest releases. Be first to own these pieces.",
    keywords: ["new arrivals", "latest art", "new releases"],
  },
  "best-sellers": {
    title: "Best Sellers - Popular Line Art",
    description:
      "Customer favorites and top-rated artwork. Proven designs that never disappoint.",
    keywords: ["best sellers", "popular art", "top rated"],
  },
  "staff-picks": {
    title: "Staff Picks - Team Favorites",
    description:
      "Hand-picked by the LineVibes team. The pieces we're most proud of creating.",
    keywords: ["staff picks", "team favorites", "curated art"],
  },
  "limited-edition": {
    title: "Limited Edition Art",
    description:
      "Exclusive limited runs that won't last. Rare designs available while supplies last.",
    keywords: ["limited edition", "exclusive art", "rare artwork"],
  },

  // Format Collections
  digital: {
    title: "Digital Download Art",
    description:
      "Instant digital downloads. High-resolution files ready to print at home or your favorite print shop.",
    keywords: ["digital download", "printable art", "instant download"],
  },
  printed: {
    title: "Printed Art Collection",
    description:
      "Museum-quality printed artwork on acid-free paper with archival ink. Ready for framing.",
    keywords: ["printed art", "museum quality", "archival print"],
  },
  framed: {
    title: "Framed Art Collection",
    description:
      "Professionally framed and ready to hang. Premium wood frame options included.",
    keywords: ["framed art", "ready to hang", "framed print"],
  },
  canvas: {
    title: "Canvas Art Collection",
    description:
      "Gallery-wrapped canvas prints with 1.5-inch depth. No frame needed.",
    keywords: ["canvas art", "gallery wrapped", "canvas print"],
  },
}

export async function generateStaticParams() {
  try {
    const { collections } = await listCollections({
      fields: "*products",
    })

    if (!collections) {
      return []
    }

    const countryCodes = await listRegions().then(
      (regions: StoreRegion[]) =>
        regions
          ?.map((r) => r.countries?.map((c) => c.iso_2))
          .flat()
          .filter(Boolean) as string[]
    )

    const collectionHandles = collections
      .map((collection: StoreCollection) => collection.handle)
      .filter(Boolean) as string[]

    return countryCodes
      ?.map((countryCode: string) =>
        collectionHandles.map((handle: string) => ({
          countryCode,
          handle,
        }))
      )
      .flat()
  } catch (error) {
    console.error(
      `Failed to generate static paths for collection pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  // Get collection-specific SEO or use defaults
  const seo = collectionSEO[collection.handle]

  const title = seo?.title || `${collection.title} Collection`
  const description =
    seo?.description ||
    `Browse our ${collection.title} collection of precision-plotted line art.`
  const keywords = seo?.keywords || [
    collection.title.toLowerCase(),
    "line art",
    "precision art",
  ]

  return {
    title: `${title} | LineVibes`,
    description,
    keywords: keywords.join(", "),
    openGraph: {
      title: `${title} | LineVibes`,
      description,
      type: "website",
    },
    alternates: {
      canonical: `/collections/${params.handle}`,
    },
  }
}

export default async function CollectionPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const collection = await getCollectionByHandle(params.handle).then(
    (collection: StoreCollection) => collection
  )

  if (!collection) {
    notFound()
  }

  return (
    <CollectionTemplate
      collection={collection}
      page={page}
      sortBy={sortBy}
      countryCode={params.countryCode}
    />
  )
}

