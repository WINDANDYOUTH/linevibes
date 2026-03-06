import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import { retrieveCustomer } from "@lib/data/customer"
import { UserAnalyticsSync } from "@lib/analytics/user-sync"

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const customer = await retrieveCustomer()

  return (
    <div className="min-h-screen w-full bg-white text-black">
      <UserAnalyticsSync userId={customer?.id || null} />

      <header className="sticky top-0 z-50 h-16 border-b border-black bg-white">
        <nav className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6">
          <LocalizedClientLink
            href="/cart"
            className="flex items-center gap-x-2 text-sm font-medium text-black transition-opacity hover:opacity-70"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="hidden sm:block">Back to cart</span>
            <span className="block sm:hidden">Back</span>
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/"
            className="text-xl font-semibold tracking-[0.18em] text-black transition-opacity hover:opacity-70"
            data-testid="store-link"
          >
            LineVibes
          </LocalizedClientLink>

          <div className="flex items-center gap-x-2 text-sm text-black">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="hidden sm:block font-medium">Secure Checkout</span>
          </div>
        </nav>
      </header>

      <div className="border-b border-black bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-3">
          <div className="flex items-center justify-center gap-x-2 text-xs sm:gap-x-4 sm:text-sm">
            <div className="flex items-center gap-x-1 font-medium text-black sm:gap-x-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white sm:h-6 sm:w-6">
                1
              </span>
              <span className="hidden xs:inline">Information</span>
            </div>
            <div className="h-px w-6 bg-black sm:w-8"></div>
            <div className="flex items-center gap-x-1 text-black/60 sm:gap-x-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-black bg-white text-xs text-black sm:h-6 sm:w-6">
                2
              </span>
              <span className="hidden xs:inline">Shipping</span>
            </div>
            <div className="h-px w-6 bg-black sm:w-8"></div>
            <div className="flex items-center gap-x-1 text-black/60 sm:gap-x-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-black bg-white text-xs text-black sm:h-6 sm:w-6">
                3
              </span>
              <span className="hidden xs:inline">Payment</span>
            </div>
          </div>
        </div>
      </div>

      <main className="relative" data-testid="checkout-container">
        {children}
      </main>

      <footer className="border-t border-black bg-white py-6">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-4 text-xs text-black/70">
              <LocalizedClientLink href="/privacy" className="transition-opacity hover:opacity-70">
                Privacy
              </LocalizedClientLink>
              <LocalizedClientLink href="/terms" className="transition-opacity hover:opacity-70">
                Terms
              </LocalizedClientLink>
              <LocalizedClientLink href="/returns" className="transition-opacity hover:opacity-70">
                Returns
              </LocalizedClientLink>
            </div>

            <div className="flex items-center gap-3">
              <span className="mr-2 text-xs uppercase tracking-[0.2em] text-black/60">
                We accept
              </span>
              <img src="/payment-icons/visa.svg" alt="Visa" className="h-6 w-auto" />
              <img
                src="/payment-icons/mastercard.svg"
                alt="Mastercard"
                className="h-6 w-auto"
              />
              <img src="/payment-icons/paypal.svg" alt="PayPal" className="h-6 w-auto" />
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-black/50">
            © {new Date().getFullYear()} LineVibes. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
