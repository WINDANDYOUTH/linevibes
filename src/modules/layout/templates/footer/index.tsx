import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  await listCategories()

  return (
    <footer className="border-t border-ui-border-base w-full bg-stone-50">
      <div className="content-container flex flex-col w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-16">
          <div className="lg:col-span-2">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus text-stone-900 hover:text-blue-700 uppercase font-bold tracking-widest font-mono"
            >
              LineVibes
            </LocalizedClientLink>
            <p className="mt-4 text-stone-600 text-sm max-w-sm">
              Turning moments into precision-plotted art. Real ink, real paper, drawn by robots.
            </p>
          </div>

          <div className="flex flex-col gap-y-3">
            <span className="txt-small-plus text-stone-900 font-semibold">Shop</span>
            <ul className="grid grid-cols-1 gap-y-2 text-stone-600 txt-small">
              <li>
                <LocalizedClientLink href="/store" className="hover:text-amber-700 transition-colors">
                  All Products
                </LocalizedClientLink>
              </li>
              {collections?.slice(0, 4).map((c) => (
                <li key={c.id}>
                  <LocalizedClientLink
                    className="hover:text-amber-700 transition-colors"
                    href={`/collections/${c.handle}`}
                  >
                    {c.title}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-y-3">
            <span className="txt-small-plus text-stone-900 font-semibold">Help</span>
            <ul className="grid grid-cols-1 gap-y-2 text-stone-600 txt-small">
              <li>
                <LocalizedClientLink href="/faq" className="hover:text-amber-700 transition-colors">
                  FAQ
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/contact" className="hover:text-amber-700 transition-colors">
                  Contact Us
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/shipping-policy" className="hover:text-amber-700 transition-colors">
                  Shipping
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/returns" className="hover:text-amber-700 transition-colors">
                  Returns & Exchanges
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-y-3">
            <span className="txt-small-plus text-stone-900 font-semibold">Company</span>
            <ul className="grid grid-cols-1 gap-y-2 text-stone-600 txt-small">
              <li>
                <LocalizedClientLink href="/about" className="hover:text-amber-700 transition-colors">
                  About Us
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/privacy" className="hover:text-amber-700 transition-colors">
                  Privacy Policy
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/terms" className="hover:text-amber-700 transition-colors">
                  Terms & Conditions
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full py-6 border-t border-stone-200 justify-between items-center gap-4 text-stone-500">
          <Text className="txt-compact-small">
            {`© ${new Date().getFullYear()} LineVibes. All rights reserved.`}
          </Text>
          <div className="flex items-center gap-4 text-sm">
            <LocalizedClientLink href="/privacy" className="hover:text-amber-700 transition-colors">
              Privacy
            </LocalizedClientLink>
            <span>/</span>
            <LocalizedClientLink href="/terms" className="hover:text-amber-700 transition-colors">
              Terms
            </LocalizedClientLink>
            <span>/</span>
            <LocalizedClientLink href="/contact" className="hover:text-amber-700 transition-colors">
              Contact
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
