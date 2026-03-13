import Link from "next/link"

import type { HttpTypes } from "@medusajs/types"

import { groupPortraitStyleTemplateProducts } from "@lib/portrait/style-template"

type StylePortraitDirectoryTemplateProps = {
  countryCode: string
  products: HttpTypes.StoreProduct[]
}

export default function StylePortraitDirectoryTemplate({
  countryCode,
  products,
}: StylePortraitDirectoryTemplateProps) {
  const groups = groupPortraitStyleTemplateProducts(products)

  return (
    <div className="bg-[#f6f1ea] text-stone-950">
      <section className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.9),_transparent_40%),linear-gradient(180deg,_#f9f4eb_0%,_#f0e7da_100%)]">
        <div className="content-container py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">
              Portrait Styles
            </p>
            <h1 className="mt-5 font-[family-name:Georgia,_Times_New_Roman,_serif] text-4xl leading-tight md:text-6xl">
              Choose a ready-made world, then upload one photo to turn it into a portrait.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
              Each product acts like a guided template. The sample artwork defines
              the scene, wardrobe, and mood. Your uploaded portrait becomes the
              subject inside that visual style.
            </p>
          </div>
        </div>
      </section>

      <div className="content-container py-12 md:py-16">
        {groups.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-stone-300 bg-white/70 px-8 py-16 text-center">
            <h2 className="text-2xl font-semibold text-stone-900">
              No style templates are published yet.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-stone-600">
              Add `portrait_mode=style-template` and the related `template_*`
              metadata to Medusa products to make them appear in this directory.
            </p>
          </div>
        ) : (
          <div className="space-y-14">
            {groups.map((group) => (
              <section key={group.key}>
                <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-stone-500">
                      Curated Group
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-stone-950 md:text-5xl">
                      {group.label}
                    </h2>
                  </div>
                  <p className="max-w-2xl text-sm leading-7 text-stone-600">
                    {group.description}
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {group.items.map(({ product, template }) => (
                    <Link
                      key={product.id}
                      href={`/${countryCode}/products/${product.handle}`}
                      className="group overflow-hidden rounded-[30px] border border-stone-200 bg-white shadow-[0_20px_60px_rgba(28,25,23,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(28,25,23,0.12)]"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                        {template.previewImageUrl ? (
                          <img
                            src={template.previewImageUrl}
                            alt={template.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : null}
                        {template.badge ? (
                          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-900">
                            {template.badge}
                          </span>
                        ) : null}
                      </div>

                      <div className="space-y-3 px-5 py-5">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                            {template.familyLabel ?? group.label}
                          </div>
                          <span className="text-lg text-stone-400 transition group-hover:translate-x-1 group-hover:text-stone-700">
                            →
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold leading-tight text-stone-950">
                          {template.title}
                        </h3>
                        <p className="text-sm leading-7 text-stone-600">
                          {template.subtitle ??
                            template.description ??
                            "Open this style, upload a portrait photo, and generate a matching scene."}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
