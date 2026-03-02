import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

// Collection-specific content & theming
const collectionContent: Record<
  string,
  {
    icon: string
    gradient: string
    tagline: string
    description: string
    type: "style" | "occasion" | "format" | "marketing" | "recipient"
  }
> = {
  // Style Collections
  minimalist: {
    icon: "✨",
    gradient: "from-stone-800 to-stone-600",
    tagline: "Less is More",
    description:
      "Clean, continuous lines that capture the essence of your subject. Our minimalist style uses single-line drawings that never lift from the page.",
    type: "style",
  },
  blueprint: {
    icon: "📐",
    gradient: "from-blue-900 to-indigo-800",
    tagline: "Technical Perfection",
    description:
      "Inspired by engineering schematics, our blueprint style features white lines on classic blue paper with authentic annotations.",
    type: "style",
  },
  detailed: {
    icon: "🎨",
    gradient: "from-purple-900 to-violet-800",
    tagline: "Every Line Matters",
    description:
      "Intricate multi-layered line work with multiple passes for depth and shadow. Perfect for complex subjects.",
    type: "style",
  },
  "bold-stroke": {
    icon: "🖌️",
    gradient: "from-stone-900 to-zinc-700",
    tagline: "Make a Statement",
    description:
      "Thick, expressive lines with dramatic contrast. Bold and impactful artwork that commands attention.",
    type: "style",
  },

  // Format Collections
  digital: {
    icon: "💾",
    gradient: "from-cyan-800 to-teal-700",
    tagline: "Instant Download",
    description:
      "High-resolution digital files delivered instantly. Print at home or at your favorite print shop in any size.",
    type: "format",
  },
  printed: {
    icon: "📜",
    gradient: "from-amber-800 to-orange-700",
    tagline: "Museum Quality",
    description:
      "Precision-plotted on acid-free museum-grade paper with archival ink. Ready for framing.",
    type: "format",
  },
  framed: {
    icon: "🖼️",
    gradient: "from-stone-700 to-stone-500",
    tagline: "Ready to Hang",
    description:
      "Professionally framed and ready to display. Choose from premium wood frame options.",
    type: "format",
  },
  canvas: {
    icon: "🎭",
    gradient: "from-rose-800 to-pink-700",
    tagline: "Gallery Wrapped",
    description:
      "Stretched canvas prints with 1.5-inch depth. Gallery-quality presentation without glass.",
    type: "format",
  },

  // Occasion Collections
  anniversary: {
    icon: "💕",
    gradient: "from-rose-900 to-pink-800",
    tagline: "Celebrate Your Love Story",
    description:
      "Mark milestones with meaningful art. Transform wedding photos, first dates, or special moments into lasting line art.",
    type: "occasion",
  },
  memorial: {
    icon: "🕊️",
    gradient: "from-slate-700 to-slate-500",
    tagline: "Honor Forever",
    description:
      "Tender tributes to those we've lost. Transform cherished photos into timeless memorials.",
    type: "occasion",
  },
  wedding: {
    icon: "💒",
    gradient: "from-pink-800 to-rose-600",
    tagline: "Timeless Wedding Gifts",
    description:
      "Unique artwork for the couple. Venue portraits, couple drawings, and custom wedding art.",
    type: "occasion",
  },
  birthday: {
    icon: "🎂",
    gradient: "from-violet-800 to-purple-600",
    tagline: "Special Day, Special Gift",
    description:
      "One-of-a-kind art for milestone birthdays. Custom portraits, hobby art, and personalized designs.",
    type: "occasion",
  },
  "fathers-day": {
    icon: "👔",
    gradient: "from-blue-800 to-indigo-600",
    tagline: "Perfect for Dad",
    description:
      "Art he'll actually love. Classic cars, aircraft, and custom pieces for the man who has everything.",
    type: "occasion",
  },
  "mothers-day": {
    icon: "💐",
    gradient: "from-pink-700 to-rose-500",
    tagline: "Art from the Heart",
    description:
      "Thoughtful gifts for mom. Family portraits, nature art, and personalized pieces she'll treasure.",
    type: "occasion",
  },

  // Recipient Collections
  "gift-for-him": {
    icon: "🎁",
    gradient: "from-slate-800 to-slate-600",
    tagline: "Art He'll Love",
    description:
      "Curated collection for men. Automotive art, aviation blueprints, and bold designs.",
    type: "recipient",
  },
  "gift-for-her": {
    icon: "🎀",
    gradient: "from-pink-700 to-rose-500",
    tagline: "Beautiful Art for Her",
    description:
      "Elegant pieces for women. Minimalist portraits, nature scenes, and romantic designs.",
    type: "recipient",
  },
  "gift-for-dad": {
    icon: "👨",
    gradient: "from-emerald-800 to-teal-600",
    tagline: "Dad-Approved Art",
    description:
      "Things dads love. Classic cars, military aircraft, and custom pieces celebrating fatherhood.",
    type: "recipient",
  },
  "gift-for-mom": {
    icon: "👩",
    gradient: "from-fuchsia-700 to-pink-500",
    tagline: "Made for Mom",
    description:
      "Art from the heart. Family portraits, pet drawings, and meaningful custom pieces.",
    type: "recipient",
  },
  "gift-for-couples": {
    icon: "💑",
    gradient: "from-red-800 to-rose-600",
    tagline: "Celebrate Together",
    description:
      "Art for two. Couple portraits, wedding venue art, and romantic designs.",
    type: "recipient",
  },

  // Marketing Collections
  "new-in": {
    icon: "🆕",
    gradient: "from-indigo-800 to-violet-600",
    tagline: "Fresh from the Plotter",
    description:
      "Our latest designs, hot off the drawing board. Be the first to own these new pieces.",
    type: "marketing",
  },
  "best-sellers": {
    icon: "⭐",
    gradient: "from-amber-700 to-yellow-500",
    tagline: "Customer Favorites",
    description:
      "The artwork our customers love most. Proven designs that never disappoint.",
    type: "marketing",
  },
  "staff-picks": {
    icon: "❤️",
    gradient: "from-red-700 to-orange-500",
    tagline: "Our Team's Favorites",
    description:
      "Hand-picked by the LineVibes team. The pieces we're most proud of.",
    type: "marketing",
  },
  "limited-edition": {
    icon: "💎",
    gradient: "from-purple-900 to-indigo-700",
    tagline: "Exclusive & Limited",
    description:
      "Limited runs that won't last. Exclusive designs while supplies last.",
    type: "marketing",
  },
}

// Default content for unknown collections
const defaultContent = {
  icon: "🖼️",
  gradient: "from-indigo-800 to-purple-600",
  tagline: "Precision Line Art",
  description:
    "Browse our curated collection of precision-plotted artwork, drawn with archival ink on museum-grade paper.",
  type: "marketing" as const,
}

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  // Get collection-specific content or use default
  const content = collectionContent[collection.handle] || defaultContent

  // Type label mapping
  const typeLabels = {
    style: "Style Collection",
    occasion: "Gift Guide",
    format: "Format",
    marketing: "Featured",
    recipient: "Gift Ideas",
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className={`relative bg-gradient-to-br ${content.gradient} text-white py-16 md:py-20 overflow-hidden`}
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        ></div>

        <div className="content-container relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <LocalizedClientLink href="/" className="hover:text-white">
              Home
            </LocalizedClientLink>
            <span>/</span>
            <LocalizedClientLink
              href="/store"
              className="hover:text-white"
            >
              Shop
            </LocalizedClientLink>
            <span>/</span>
            <span className="text-white">{collection.title}</span>
          </nav>

          <div className="max-w-3xl">
            {/* Type Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium mb-4">
              {typeLabels[content.type]}
            </div>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{content.icon}</span>
              <h1 className="text-4xl md:text-5xl font-bold">
                {collection.title}
              </h1>
            </div>

            <p className="text-xl text-white/90 mb-2 font-medium">
              {content.tagline}
            </p>

            <p className="text-lg text-white/70 max-w-2xl">
              {content.description}
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <div className="flex flex-col small:flex-row small:items-start py-8 content-container">
        <RefinementList sortBy={sort} />
        <div className="w-full">
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={collection.products?.length}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              collectionId={collection.id}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>

      {/* Custom Order CTA */}
      <section className="py-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="content-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Want Something Custom?
              </h2>
              <p className="text-indigo-100">
                Upload your own photo and we&apos;ll create a one-of-a-kind piece.
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
    </div>
  )
}
