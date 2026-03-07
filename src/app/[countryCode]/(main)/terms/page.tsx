import { Metadata } from "next"
import { Heading } from "@medusajs/ui"

export const metadata: Metadata = {
  title: "Terms & Conditions | LineVibes",
  description:
    "Read the LineVibes terms governing purchases, product customization, fulfillment, and use of this website.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-stone-100 to-stone-50 py-16">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <Heading level="h1" className="text-4xl font-light text-stone-900 mb-4">
              Terms &amp; Conditions
            </Heading>
            <p className="text-stone-600">Last updated: March 7, 2026</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="content-container">
          <div className="max-w-3xl mx-auto prose prose-stone">
            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-stone-600 mb-4">
              By accessing or using the LineVibes website, placing an order, or submitting content for
              production, you agree to these Terms &amp; Conditions. If you do not agree, do not use the site.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">2. About LineVibes</h2>
            <p className="text-stone-600 mb-4">
              LineVibes designs and sells custom and ready-made art products and related goods through its
              online storefront. Operations and fulfillment are coordinated from Dongguan City, Guangdong
              Province, China.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">3. Orders and Product Customization</h2>
            <p className="text-stone-600 mb-4">
              When you place an order, you confirm that the information you provide is accurate and that
              you are authorized to use the selected payment method. Customized orders may require uploaded
              files, text, preferences, or approval inputs from you. You are responsible for ensuring you
              have the right to use any content you submit.
            </p>
            <p className="text-stone-600 mb-4">
              Product images, previews, and mockups are illustrative. Minor variations in color, scale,
              framing, material texture, or output detail may occur due to screen settings, production
              processes, and handcrafted finishing.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">4. Pricing and Payment</h2>
            <p className="text-stone-600 mb-4">
              Prices, promotions, and availability may change without notice. We reserve the right to
              correct pricing errors, limit quantities, refuse suspicious transactions, or cancel orders
              where necessary. Payment must be successfully completed before production or shipment.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">5. Shipping and Delivery</h2>
            <p className="text-stone-600 mb-4">
              Delivery windows are estimates only and may be affected by customs clearance, carrier delays,
              weather, peak seasons, or other factors outside our control. Risk of loss transfers to you
              when the shipment is handed to the carrier, except where non-waivable law provides otherwise.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">6. Returns, Exchanges, and Quality Issues</h2>
            <p className="text-stone-600 mb-4">
              Returns and exchanges are governed by our published Returns &amp; Exchanges policy. If an item
              arrives damaged, defective, or materially different from the approved or ordered specification,
              contact info@linevibes.com promptly so we can review and resolve the issue.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">7. Intellectual Property</h2>
            <p className="text-stone-600 mb-4">
              Unless otherwise stated, the website, branding, product photography, designs, text, graphics,
              and software are owned by LineVibes or its licensors and are protected by intellectual
              property laws. You may not copy, reproduce, distribute, or exploit site content without
              prior written permission.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">8. User Content</h2>
            <p className="text-stone-600 mb-4">
              If you upload images, text, or other content, you represent that you have all necessary
              rights to do so and that the content does not violate any law or third-party rights. You
              grant us a limited license to use that content solely to produce, fulfill, support, and
              improve your order and our services.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">9. Disclaimer and Limitation of Liability</h2>
            <p className="text-stone-600 mb-4">
              To the fullest extent permitted by applicable law, the site and products are provided on an
              &quot;as available&quot; and &quot;as is&quot; basis. LineVibes disclaims implied warranties to the extent
              permitted by law. Our aggregate liability for any claim relating to your order or use of the
              site will not exceed the amount you paid for the affected order.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">10. Governing Law</h2>
            <p className="text-stone-600 mb-4">
              These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of
              the People&apos;s Republic of China, without regard to conflict of law principles. Any dispute
              arising out of or relating to these terms or your use of the site shall be submitted to the
              competent courts with jurisdiction over Dongguan City, Guangdong Province, China, unless
              applicable consumer law requires otherwise.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">11. Changes to These Terms</h2>
            <p className="text-stone-600 mb-4">
              We may revise these Terms &amp; Conditions from time to time. The updated version becomes
              effective when posted on this page.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">12. Contact Information</h2>
            <div className="bg-stone-50 p-6 rounded-xl">
              <p className="text-stone-900 font-medium">LineVibes</p>
              <p className="text-stone-600">Dongguan City, Guangdong Province, China</p>
              <p className="text-stone-600">Email: info@linevibes.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
