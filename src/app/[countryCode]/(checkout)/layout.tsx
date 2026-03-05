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
    <div className="w-full bg-gradient-to-b from-[#FDFBF7] to-[#F5F0E8] relative min-h-screen">
      <UserAnalyticsSync userId={customer?.id || null} />
      {/* Header */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#E8E0D4] sticky top-0 z-50">
        <nav className="flex h-full items-center max-w-[1280px] mx-auto px-6 justify-between">
          {/* Back to Cart */}
          <LocalizedClientLink
            href="/cart"
            className="flex items-center gap-x-2 text-sm font-medium text-[#6B5B4F] hover:text-[#8B4513] transition-colors"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="hidden sm:block">Back to cart</span>
            <span className="block sm:hidden">Back</span>
          </LocalizedClientLink>

          {/* Logo */}
          <LocalizedClientLink
            href="/"
            className="text-xl font-semibold text-[#3D3229] hover:text-[#8B4513] transition-colors tracking-wide"
            data-testid="store-link"
          >
            Better Knitwear
          </LocalizedClientLink>

          {/* Secure Checkout Badge */}
          <div className="flex items-center gap-x-2 text-sm text-[#6B5B4F]">
            <svg 
              className="w-4 h-4 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
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

      {/* Checkout Progress Indicator */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-[#E8E0D4]">
        <div className="max-w-[1280px] mx-auto px-6 py-3">
          <div className="flex items-center justify-center gap-x-2 sm:gap-x-4 text-xs sm:text-sm">
            <div className="flex items-center gap-x-1 sm:gap-x-2 text-[#8B4513] font-medium">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#8B4513] text-white flex items-center justify-center text-xs">1</span>
              <span className="hidden xs:inline">Information</span>
            </div>
            <div className="w-6 sm:w-8 h-px bg-[#D4C4B0]"></div>
            <div className="flex items-center gap-x-1 sm:gap-x-2 text-[#6B5B4F]">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#D4C4B0] text-[#6B5B4F] flex items-center justify-center text-xs">2</span>
              <span className="hidden xs:inline">Shipping</span>
            </div>
            <div className="w-6 sm:w-8 h-px bg-[#D4C4B0]"></div>
            <div className="flex items-center gap-x-1 sm:gap-x-2 text-[#6B5B4F]">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#D4C4B0] text-[#6B5B4F] flex items-center justify-center text-xs">3</span>
              <span className="hidden xs:inline">Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative" data-testid="checkout-container">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[#E8E0D4] bg-white/50">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Links */}
            <div className="flex items-center gap-4 text-xs text-[#6B5B4F]">
              <LocalizedClientLink href="/privacy-policy" className="hover:text-[#8B4513] transition-colors">
                Privacy Policy
              </LocalizedClientLink>
              <LocalizedClientLink href="/terms" className="hover:text-[#8B4513] transition-colors">
                Terms of Service
              </LocalizedClientLink>
              <LocalizedClientLink href="/refund-policy" className="hover:text-[#8B4513] transition-colors">
                Refund Policy
              </LocalizedClientLink>
            </div>

            {/* Payment Icons */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#6B5B4F] mr-2">We accept:</span>
              {/* Visa */}
              <svg className="h-6 w-auto" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="32" rx="4" fill="#F7F7F7"/>
                <path d="M18.5 21L20.5 11H23L21 21H18.5Z" fill="#1A1F71"/>
                <path d="M32 11L29.5 18L29 15.5L28 12C28 12 27.8 11 26.5 11H22L21.9 11.3C21.9 11.3 23.4 11.7 25 12.7L27.5 21H30.5L35 11H32Z" fill="#1A1F71"/>
                <path d="M15.5 11L13 18.5L12.7 17L11.5 12C11.5 12 11.3 11 10 11H6L5.9 11.3C5.9 11.3 8 11.8 10 13.2L12.5 21H15.5L20 11H17L15.5 11Z" fill="#1A1F71"/>
              </svg>
              {/* Mastercard */}
              <svg className="h-6 w-auto" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="32" rx="4" fill="#F7F7F7"/>
                <circle cx="19" cy="16" r="8" fill="#EB001B"/>
                <circle cx="29" cy="16" r="8" fill="#F79E1B"/>
                <path d="M24 9.5C26 11 27.3 13.3 27.3 16C27.3 18.7 26 21 24 22.5C22 21 20.7 18.7 20.7 16C20.7 13.3 22 11 24 9.5Z" fill="#FF5F00"/>
              </svg>
              {/* PayPal */}
              <svg className="h-6 w-auto" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="32" rx="4" fill="#F7F7F7"/>
                <path d="M18.5 22H16L17.5 12H22C24.5 12 26 13.5 25.5 16C25 19 22.5 20 20.5 20H19L18.5 22Z" fill="#003087"/>
                <path d="M28 22H25.5L27 12H31.5C34 12 35.5 13.5 35 16C34.5 19 32 20 30 20H28.5L28 22Z" fill="#009CDE"/>
              </svg>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-4 text-xs text-[#6B5B4F]">
            © {new Date().getFullYear()} Better Knitwear. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
