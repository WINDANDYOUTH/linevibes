import { Metadata } from "next"
import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Returns & Exchanges | LineVibes",
  description:
    "Review the LineVibes returns, exchanges, and quality guarantee process for physical and personalized orders.",
}

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-stone-100 to-stone-50 py-16">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <Heading level="h1" className="text-4xl font-light text-stone-900 mb-4">
              Returns &amp; Exchanges
            </Heading>
            <p className="text-stone-600">Last updated: March 7, 2026</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="content-container">
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-stone-50 p-6 rounded-xl text-center">
                <h3 className="font-semibold text-stone-900 mb-1">30-Day Window</h3>
                <p className="text-sm text-stone-600">Request a return within 30 days of delivery</p>
              </div>
              <div className="bg-stone-50 p-6 rounded-xl text-center">
                <h3 className="font-semibold text-stone-900 mb-1">Approval First</h3>
                <p className="text-sm text-stone-600">Contact support before sending any item back</p>
              </div>
              <div className="bg-stone-50 p-6 rounded-xl text-center">
                <h3 className="font-semibold text-stone-900 mb-1">Quality Guarantee</h3>
                <p className="text-sm text-stone-600">We resolve verified quality issues promptly</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Return Eligibility</h2>
            <p className="text-stone-600 mb-4">
              If you are not satisfied with an eligible physical product, contact us within 30 days of
              delivery. Items must be unused, in original condition, and packed securely with all included
              components unless the return is due to damage or a verified quality problem.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Personalized and Made-to-Order Items</h2>
            <p className="text-stone-600 mb-4">
              Because many LineVibes products are customized or produced on demand, returns for buyer&apos;s
              remorse may be limited on personalized items. However, our quality guarantee still applies if
              the order arrives damaged, defective, or materially inconsistent with the approved design.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">How to Start a Return</h2>
            <ol className="list-decimal pl-6 text-stone-600 mb-4 space-y-2">
              <li>Email info@linevibes.com with your order number and reason for the request.</li>
              <li>Attach photos if the item is damaged, defective, or incorrect.</li>
              <li>Wait for approval and the correct return warehouse address before shipping anything back.</li>
              <li>Pack the item securely and use the instructions provided by our support team.</li>
            </ol>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Exchanges</h2>
            <p className="text-stone-600 mb-4">
              If you would like an exchange for an approved issue, contact support and we will confirm
              whether a remake, replacement, or alternate product is the best path. Availability depends on
              the product type and production status.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Refund Timing</h2>
            <p className="text-stone-600 mb-4">
              Approved refunds are issued after the return is received and inspected, or after we confirm
              a non-return resolution where applicable. Payment provider processing times may add several
              business days before funds appear in your account.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Quality Guarantee</h2>
            <p className="text-stone-600 mb-4">
              If your LineVibes order arrives damaged, defective, or significantly different from the
              confirmed order details, contact info@linevibes.com within 7 days of delivery. We may offer a
              replacement, remake, refund, or other reasonable remedy after review.
            </p>

            <div className="bg-stone-50 p-6 rounded-xl mt-8">
              <h3 className="font-semibold text-stone-900 mb-2">Return Support</h3>
              <p className="text-stone-600 mb-2">Email: info@linevibes.com</p>
              <p className="text-stone-600">
                Return warehouse addresses are provided case by case to ensure you send the item to the
                correct facility.
              </p>
            </div>

            <div className="text-center pt-8 mt-8 border-t border-stone-200">
              <LocalizedClientLink
                href="/contact"
                className="inline-flex items-center text-amber-700 hover:text-amber-800 font-medium"
              >
                Need help with a return? Contact us
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
