import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

// Category-specific SEO content
const categorySEO: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  automotive: {
    title: "Automotive Line Art | Car Blueprints & Drawings",
    description:
      "Custom automotive line art and car blueprints. Transform your classic car, sports car, or motorcycle into stunning precision-plotted artwork. Perfect gifts for car enthusiasts.",
    keywords: [
      "car art",
      "automotive drawing",
      "car blueprint",
      "vehicle poster",
      "classic car art",
    ],
  },
  aviation: {
    title: "Aviation Line Art | Aircraft Blueprints & Drawings",
    description:
      "Aviation line art and aircraft blueprints. Precision-plotted drawings of planes, helicopters, and aerospace engineering. Perfect for pilots and aviation enthusiasts.",
    keywords: [
      "aircraft art",
      "aviation blueprint",
      "plane drawing",
      "pilot gift",
      "aerospace art",
    ],
  },
  "ocean-nature": {
    title: "Ocean & Nature Line Art | Waves, Mountains & Landscapes",
    description:
      "Ocean and nature line art. Minimalist wave drawings, mountain landscapes, and natural scenery precision-plotted with archival ink. Bring nature indoors.",
    keywords: [
      "wave art",
      "ocean drawing",
      "nature art",
      "mountain landscape",
      "minimalist nature",
    ],
  },
  "family-love": {
    title: "Family & Love Art | Custom Portraits & Pet Drawings",
    description:
      "Custom family and pet line art portraits. Transform photos of loved ones, couples, and pets into unique precision-plotted artwork. Meaningful personalized gifts.",
    keywords: [
      "custom portrait",
      "pet portrait",
      "family art",
      "couple drawing",
      "memorial art",
    ],
  },
  architecture: {
    title: "Architecture Line Art | Buildings, Skylines & Home Portraits",
    description:
      "Architectural line art and building drawings. Custom home portraits, city skylines, and landmark artwork. Precision-plotted with archival ink.",
    keywords: [
      "architecture art",
      "building drawing",
      "city skyline",
      "home portrait",
      "landmark art",
    ],
  },
}

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
  )

  const categoryHandles = product_categories.map(
    (category: any) => category.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string | undefined) =>
      categoryHandles.map((handle: any) => ({
        countryCode,
        category: [handle],
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    const productCategory = await getCategoryByHandle(params.category)

    // Get category-specific SEO or use defaults
    const seo = categorySEO[productCategory.handle]

    const title = seo?.title || `${productCategory.name} Line Art`
    const description =
      seo?.description ||
      productCategory.description ||
      `Browse our ${productCategory.name} collection of precision-plotted line art.`
    const keywords = seo?.keywords || [
      productCategory.name.toLowerCase(),
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
        canonical: `/categories/${params.category.join("/")}`,
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  return (
    <CategoryTemplate
      category={productCategory}
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}

