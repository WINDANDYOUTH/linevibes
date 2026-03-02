import { Metadata } from "next"
import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Shipping Policy | BetterKnitwear",
  description:
    "Learn about BetterKnitwear's shipping options, delivery times, and international shipping information.",
}

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-stone-100 to-stone-50 py-16">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <Heading level="h1" className="text-4xl font-light text-stone-900 mb-4">
              Shipping Policy
            </Heading>
            <p className="text-stone-600">Last updated: January 20, 2026</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="content-container">
          <div className="max-w-3xl mx-auto">
            {/* Shipping Rates Table */}
            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Domestic Shipping (United States)</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-stone-100">
                    <th className="text-left p-4 font-medium text-stone-900">Shipping Method</th>
                    <th className="text-left p-4 font-medium text-stone-900">Delivery Time</th>
                    <th className="text-left p-4 font-medium text-stone-900">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-stone-200">
                    <td className="p-4 text-stone-600">Standard Shipping</td>
                    <td className="p-4 text-stone-600">5-7 Business Days</td>
                    <td className="p-4 text-stone-600">$8.95 (Free over $150)</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="p-4 text-stone-600">Express Shipping</td>
                    <td className="p-4 text-stone-600">2-3 Business Days</td>
                    <td className="p-4 text-stone-600">$14.95</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="p-4 text-stone-600">Overnight Shipping</td>
                    <td className="p-4 text-stone-600">1 Business Day</td>
                    <td className="p-4 text-stone-600">$24.95</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">International Shipping</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-stone-100">
                    <th className="text-left p-4 font-medium text-stone-900">Region</th>
                    <th className="text-left p-4 font-medium text-stone-900">Delivery Time</th>
                    <th className="text-left p-4 font-medium text-stone-900">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-stone-200">
                    <td className="p-4 text-stone-600">Canada</td>
                    <td className="p-4 text-stone-600">7-10 Business Days</td>
                    <td className="p-4 text-stone-600">$15.95 (Free over $200)</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="p-4 text-stone-600">Europe (EU & UK)</td>
                    <td className="p-4 text-stone-600">10-14 Business Days</td>
                    <td className="p-4 text-stone-600">$24.95 (Free over $250)</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="p-4 text-stone-600">Australia & New Zealand</td>
                    <td className="p-4 text-stone-600">12-18 Business Days</td>
                    <td className="p-4 text-stone-600">$29.95</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="p-4 text-stone-600">Rest of World</td>
                    <td className="p-4 text-stone-600">14-21 Business Days</td>
                    <td className="p-4 text-stone-600">$34.95</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Order Processing</h2>
            <p className="text-stone-600 mb-4">
              Orders are typically processed within 1-2 business days. Orders placed on weekends or holidays will be processed on the next business day.
            </p>
            <p className="text-stone-600 mb-4">
              You will receive a shipping confirmation email with tracking information once your order has shipped.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Customs & Import Duties</h2>
            <p className="text-stone-600 mb-4">
              International orders may be subject to import duties, taxes, and customs fees. These charges are determined by your local customs authority and are the responsibility of the recipient.
            </p>
            <p className="text-stone-600 mb-4">
              BetterKnitwear is not responsible for any customs fees, duties, or taxes imposed by your country.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Delivery Issues</h2>
            <p className="text-stone-600 mb-4">
              If your package is lost, damaged, or delayed, please contact our customer service team within 7 days of the expected delivery date. We will work with the carrier to resolve the issue.
            </p>
            <p className="text-stone-600 mb-4">
              Please ensure your shipping address is complete and accurate. We are not responsible for packages delivered to incorrect addresses due to customer error.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-stone-600 mb-4">
              For questions about shipping, please contact our customer service team:
            </p>
            <div className="bg-stone-50 p-6 rounded-xl mb-8">
              <p className="text-stone-600">Email: shipping@betterknitwear.com</p>
              <p className="text-stone-600">Phone: +1 (800) 123-4567</p>
            </div>

            <div className="text-center pt-8 border-t border-stone-200">
              <LocalizedClientLink
                href="/contact"
                className="inline-flex items-center text-amber-700 hover:text-amber-800 font-medium"
              >
                Have more questions? Contact us
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
