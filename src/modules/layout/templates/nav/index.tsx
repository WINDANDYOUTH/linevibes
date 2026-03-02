import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import DesktopNav from "@modules/layout/components/desktop-nav"
import DesktopCountrySelect from "@modules/layout/components/desktop-country-select"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="relative h-16 mx-auto border-b bg-white border-ui-border-base">
        <nav className="content-container flex items-center w-full h-full">
          {/* Left Section - Navigation */}
          <div className="flex items-center h-full flex-1">
            {/* Mobile Menu Button */}
            <div className="h-full lg:hidden">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
            
            {/* Desktop Navigation */}
            <DesktopNav />
          </div>

          {/* Center - Brand Logo (always centered using absolute) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center h-full pointer-events-auto">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase font-bold tracking-widest font-mono text-stone-900"
              data-testid="nav-store-link"
            >
              LineVibes
            </LocalizedClientLink>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-x-4 h-full flex-1 justify-end">
            {/* Desktop: Country Selector */}
            <div className="hidden lg:block">
              <DesktopCountrySelect regions={regions} />
            </div>
            
            {/* Desktop: Account Link */}
            <div className="hidden lg:flex items-center">
              <LocalizedClientLink
                className="text-stone-600 hover:text-stone-900 transition-colors text-sm font-medium"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            
            {/* Cart Button */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="text-stone-600 hover:text-stone-900 flex gap-2 text-sm font-medium"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
