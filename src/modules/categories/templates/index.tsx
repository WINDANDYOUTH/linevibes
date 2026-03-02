import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

// Category SEO Content & Theming
const categoryContent: Record<
  string,
  {
    icon: string
    gradient: string
    tagline: string
    heroDescription: string
    features: { icon: string; title: string; description: string }[]
    seoDescription: string
    relatedOccasions: { name: string; href: string }[]
  }
> = {
  automotive: {
    icon: "🚗",
    gradient: "from-red-900 to-orange-800",
    tagline: "Classic Cars, Timeless Art",
    heroDescription:
      "From vintage Porsches to modern supercars, every vehicle has a story. Our precision line art captures the soul of automotive engineering—the curves, the power, the legacy.",
    features: [
      {
        icon: "🏎️",
        title: "Side Profile Perfection",
        description: "Iconic silhouettes drawn with technical precision",
      },
      {
        icon: "📐",
        title: "Blueprint Style",
        description: "Technical schematics with authentic annotations",
      },
      {
        icon: "🖋️",
        title: "Archival Quality",
        description: "Fade-resistant ink on museum-grade paper",
      },
    ],
    seoDescription:
      "Custom automotive line art and car blueprints. Transform your classic car, sports car, or motorcycle into stunning precision-plotted artwork. Perfect gifts for car enthusiasts.",
    relatedOccasions: [
      { name: "Father's Day", href: "/collections/fathers-day" },
      { name: "Gift for Him", href: "/collections/gift-for-him" },
      { name: "Birthday", href: "/collections/birthday" },
    ],
  },
  aviation: {
    icon: "✈️",
    gradient: "from-sky-900 to-blue-800",
    tagline: "Engineering Takes Flight",
    heroDescription:
      "From the Wright Brothers to modern jets, aviation represents humanity's highest achievements. Our line art honors these marvels with the precision they deserve.",
    features: [
      {
        icon: "🛫",
        title: "Aircraft Schematics",
        description: "Detailed technical drawings of legendary aircraft",
      },
      {
        icon: "🗺️",
        title: "Flight Path Art",
        description: "Custom flight routes as minimalist line art",
      },
      {
        icon: "🎖️",
        title: "Military Aviation",
        description: "Honor service with fighter jet artwork",
      },
    ],
    seoDescription:
      "Aviation line art and aircraft blueprints. Precision-plotted drawings of planes, helicopters, and aerospace engineering. Perfect for pilots and aviation enthusiasts.",
    relatedOccasions: [
      { name: "Gift for Dad", href: "/collections/gift-for-dad" },
      { name: "Retirement Gift", href: "/collections/anniversary" },
      { name: "Memorial", href: "/collections/memorial" },
    ],
  },
  "ocean-nature": {
    icon: "🌊",
    gradient: "from-teal-900 to-emerald-800",
    tagline: "Where Waves Meet Lines",
    heroDescription:
      "The ocean's endless movement, frozen in time. Mountain peaks reaching skyward. Our nature line art brings the peaceful power of the natural world into your space.",
    features: [
      {
        icon: "🌊",
        title: "Wave Art",
        description: "Dynamic ocean waves in fluid continuous lines",
      },
      {
        icon: "🏔️",
        title: "Landscape Lines",
        description: "Mountains, forests, and horizons simplified",
      },
      {
        icon: "☮️",
        title: "Minimalist Calm",
        description: "Peaceful designs for tranquil spaces",
      },
    ],
    seoDescription:
      "Ocean and nature line art. Minimalist wave drawings, mountain landscapes, and natural scenery precision-plotted with archival ink. Bring nature indoors.",
    relatedOccasions: [
      { name: "Wedding Gift", href: "/collections/wedding" },
      { name: "Gift for Her", href: "/collections/gift-for-her" },
      { name: "Mother's Day", href: "/collections/mothers-day" },
    ],
  },
  "family-love": {
    icon: "❤️",
    gradient: "from-rose-900 to-pink-800",
    tagline: "Memories Made Permanent",
    heroDescription:
      "The people and pets who mean the most. Transform your favorite photos into lasting line art—a unique way to honor the love that shapes your life.",
    features: [
      {
        icon: "👨‍👩‍👧",
        title: "Family Portraits",
        description: "Custom portraits from your photos",
      },
      {
        icon: "🐕",
        title: "Pet Art",
        description: "Honor your furry family members",
      },
      {
        icon: "💑",
        title: "Couple Art",
        description: "Celebrate love with intertwined lines",
      },
    ],
    seoDescription:
      "Custom family and pet line art portraits. Transform photos of loved ones, couples, and pets into unique precision-plotted artwork. Meaningful personalized gifts.",
    relatedOccasions: [
      { name: "Anniversary", href: "/collections/anniversary" },
      { name: "Memorial", href: "/collections/memorial" },
      { name: "Wedding", href: "/collections/wedding" },
    ],
  },
  architecture: {
    icon: "🏛️",
    gradient: "from-stone-800 to-zinc-700",
    tagline: "Structures in Lines",
    heroDescription:
      "From hometown landmarks to world-famous buildings, architecture tells the story of human ambition. Capture the places that matter most in geometric precision.",
    features: [
      {
        icon: "🏠",
        title: "Home Portraits",
        description: "Your house immortalized in line art",
      },
      {
        icon: "🌆",
        title: "City Skylines",
        description: "Urban landscapes with geometric precision",
      },
      {
        icon: "⛪",
        title: "Landmark Art",
        description: "Famous buildings and monuments",
      },
    ],
    seoDescription:
      "Architectural line art and building drawings. Custom home portraits, city skylines, and landmark artwork. Precision-plotted with archival ink.",
    relatedOccasions: [
      { name: "Housewarming", href: "/collections/birthday" },
      { name: "Wedding", href: "/collections/wedding" },
      { name: "Anniversary", href: "/collections/anniversary" },
    ],
  },
}

// Default content for unknown categories
const defaultContent = {
  icon: "🖼️",
  gradient: "from-indigo-900 to-purple-800",
  tagline: "Precision Art",
  heroDescription:
    "Discover our collection of precision-plotted line art—each piece drawn with real archival ink on museum-grade paper.",
  features: [
    {
      icon: "🖋️",
      title: "Real Ink",
      description: "Drawn with archival pens, not printed",
    },
    {
      icon: "📜",
      title: "Museum Paper",
      description: "Acid-free paper that lasts generations",
    },
    {
      icon: "🤖",
      title: "Robotic Precision",
      description: "0.01mm accuracy in every line",
    },
  ],
  seoDescription: "Precision line art drawn with archival ink on museum-grade paper.",
  relatedOccasions: [
    { name: "Gifts", href: "/collections/gift-for-him" },
    { name: "Birthday", href: "/collections/birthday" },
  ],
}

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  // Get category-specific content or use default
  const content = categoryContent[category.handle] || defaultContent

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className={`relative bg-gradient-to-br ${content.gradient} text-white py-16 md:py-24 overflow-hidden`}
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>

        <div className="content-container relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <LocalizedClientLink href="/" className="hover:text-white">
              Home
            </LocalizedClientLink>
            <span>/</span>
            <LocalizedClientLink href="/store" className="hover:text-white">
              Shop
            </LocalizedClientLink>
            {parents.map((parent) => (
              <span key={parent.id} className="flex items-center gap-2">
                <span>/</span>
                <LocalizedClientLink
                  href={`/categories/${parent.handle}`}
                  className="hover:text-white"
                >
                  {parent.name}
                </LocalizedClientLink>
              </span>
            ))}
            <span>/</span>
            <span className="text-white">{category.name}</span>
          </nav>

          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{content.icon}</span>
              <h1
                className="text-4xl md:text-5xl font-bold"
                data-testid="category-page-title"
              >
                {category.name}
              </h1>
            </div>

            <p className="text-xl text-white/90 mb-2 font-medium">
              {content.tagline}
            </p>

            <p className="text-lg text-white/70 max-w-2xl mb-8">
              {category.description || content.heroDescription}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-white/80">
                <span className="text-lg">🖋️</span>
                <span className="text-sm">Real Archival Ink</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <span className="text-lg">📦</span>
                <span className="text-sm">Ships Worldwide</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <span className="text-lg">✨</span>
                <span className="text-sm">Custom Orders Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-stone-50 border-b border-stone-200">
        <div className="content-container">
          <div className="grid md:grid-cols-3 gap-6">
            {content.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-stone-100 shadow-sm"
              >
                <div className="text-2xl">{feature.icon}</div>
                <div>
                  <h3 className="font-semibold text-stone-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-stone-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <div
        className="flex flex-col small:flex-row small:items-start py-8 content-container"
        data-testid="category-container"
      >
        <RefinementList sortBy={sort} data-testid="sort-by-container" />
        <div className="w-full">
          {/* Subcategories */}
          {category.category_children &&
            category.category_children.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  Browse Subcategories
                </h2>
                <div className="flex flex-wrap gap-3">
                  {category.category_children?.map((c) => (
                    <LocalizedClientLink
                      key={c.id}
                      href={`/categories/${c.handle}`}
                      className="px-4 py-2 bg-stone-100 hover:bg-indigo-100 text-stone-700 hover:text-indigo-700 rounded-full text-sm font-medium transition-colors duration-200"
                    >
                      {c.name}
                    </LocalizedClientLink>
                  ))}
                </div>
              </div>
            )}

          {/* Product Grid */}
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={category.products?.length ?? 8}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={category.id}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>

      {/* Related Occasions */}
      <section className="py-12 bg-stone-50 border-t border-stone-200">
        <div className="content-container">
          <h2 className="text-lg font-semibold text-stone-900 mb-4">
            Perfect for These Occasions
          </h2>
          <div className="flex flex-wrap gap-3">
            {content.relatedOccasions.map((occasion) => (
              <LocalizedClientLink
                key={occasion.name}
                href={occasion.href}
                className="px-4 py-2 bg-white hover:bg-indigo-50 border border-stone-200 hover:border-indigo-300 text-stone-700 hover:text-indigo-700 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                {occasion.name}
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Order CTA */}
      <section className="py-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="content-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Don&apos;t See What You&apos;re Looking For?
              </h2>
              <p className="text-indigo-100">
                Upload your own photo and we&apos;ll create a custom piece just
                for you.
              </p>
            </div>
            <LocalizedClientLink
              href="/custom"
              className="px-8 py-4 bg-white text-indigo-700 font-bold rounded-lg hover:bg-indigo-50 transition-colors duration-200 whitespace-nowrap"
            >
              ✨ Create Custom Art
            </LocalizedClientLink>
          </div>
        </div>
      </section>

      {/* SEO Content Footer */}
      <section className="py-12 bg-white border-t border-stone-100">
        <div className="content-container">
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              About {category.name} Line Art
            </h2>
            <p className="text-stone-600 leading-relaxed">
              {content.seoDescription} Our{" "}
              {category.name.toLowerCase()} collection features
              precision-plotted artwork created with high-quality archival ink
              on museum-grade paper. Each piece is drawn by our robotic pen
              plotters with 0.01mm accuracy, creating a unique blend of digital
              precision and analog warmth that printed art simply cannot match.
              Whether you&apos;re looking for ready-made designs or want to
              commission a custom piece, LineVibes offers{" "}
              {category.name.toLowerCase()} artwork that will last for
              generations.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
