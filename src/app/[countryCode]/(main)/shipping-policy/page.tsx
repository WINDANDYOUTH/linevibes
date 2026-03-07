import { Metadata } from "next"
import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Shipping Policy | LineVibes",
  description:
    "Learn how LineVibes ships orders from Dongguan, China, including current processing times and regional delivery estimates.",
}

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-stone-100 to-stone-50 py-16">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <Heading level="h1" className="text-4xl font-light text-stone-900 mb-4">
              Shipping Policy
            </Heading>
            <p className="text-stone-600">Last updated: March 7, 2026</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="content-container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Fulfillment Origin</h2>
            <p className="text-stone-600 mb-4">
              All physical LineVibes orders are prepared and dispatched from Dongguan City, Guangdong
              Province, China. Delivery time depends on destination, customs processing, and carrier capacity.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Processing Time</h2>
            <p className="text-stone-600 mb-4">
              Most orders are processed within 2 to 5 business days. Personalized or made-to-order items
              may require additional production time before shipment. You will receive a shipping
              confirmation email once your parcel is in transit.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Estimated Delivery Windows</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-stone-100">
                    <th className="text-left p-4 font-medium text-stone-900">Destination</th>
                    <th className="text-left p-4 font-medium text-stone-900">Transit Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-stone-200">
                    <td className="p-4 text-stone-600">North America</td>
                    <td className="p-4 text-stone-600">7-14 business days</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="p-4 text-stone-600">Europe</td>
                    <td className="p-4 text-stone-600">10-15 business days</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="p-4 text-stone-600">Asia-Pacific</td>
                    <td className="p-4 text-stone-600">5-10 business days</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="p-4 text-stone-600">Rest of World</td>
                    <td className="p-4 text-stone-600">10-18 business days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Tracking</h2>
            <p className="text-stone-600 mb-4">
              Tracking information is sent to the email address used at checkout as soon as the carrier
              scans your package. Tracking updates may take 24 to 72 hours to appear after dispatch.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Customs, Duties, and Taxes</h2>
            <p className="text-stone-600 mb-4">
              International orders may be subject to customs inspections, import duties, VAT, or local
              handling fees charged by the destination country. These charges are typically the customer&apos;s
              responsibility unless stated otherwise at checkout.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Delivery Issues</h2>
            <p className="text-stone-600 mb-4">
              If your tracking has stalled, your parcel arrives damaged, or the package appears lost,
              contact info@linevibes.com with your order number. We will coordinate with the carrier and
              review replacement or refund options when appropriate.
            </p>

            <div className="bg-stone-50 p-6 rounded-xl mb-8">
              <p className="text-stone-900 font-medium">Shipping Support</p>
              <p className="text-stone-600">Email: info@linevibes.com</p>
              <p className="text-stone-600">Origin: Dongguan City, Guangdong Province, China</p>
            </div>

            <div className="text-center pt-8 border-t border-stone-200">
              <LocalizedClientLink
                href="/contact"
                className="inline-flex items-center text-amber-700 hover:text-amber-800 font-medium"
              >
                Need shipping help? Contact us
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
