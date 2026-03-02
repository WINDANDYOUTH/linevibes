import { Metadata } from "next"
import { Heading } from "@medusajs/ui"

export const metadata: Metadata = {
  title: "Terms & Conditions | BetterKnitwear",
  description:
    "Read BetterKnitwear's terms and conditions for using our website and purchasing our products.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-stone-100 to-stone-50 py-16">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <Heading level="h1" className="text-4xl font-light text-stone-900 mb-4">
              Terms & Conditions
            </Heading>
            <p className="text-stone-600">Last updated: January 20, 2026</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="content-container">
          <div className="max-w-3xl mx-auto prose prose-stone">
            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">1. Agreement to Terms</h2>
            <p className="text-stone-600 mb-4">
              By accessing or using the BetterKnitwear website (&quot;Site&quot;), you agree to be bound by these Terms and Conditions (&quot;Terms&quot;). If you disagree with any part of these terms, you may not access the Site.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">2. Intellectual Property</h2>
            <p className="text-stone-600 mb-4">
              The Site and its original content, features, and functionality are owned by BetterKnitwear and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="text-stone-600 mb-4">
              You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Site without prior written consent.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">3. User Accounts</h2>
            <p className="text-stone-600 mb-4">
              When you create an account with us, you must provide accurate, complete, and current information. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
              <li>Maintaining the confidentiality of your account and password</li>
              <li>Restricting access to your computer or account</li>
              <li>Agreeing to accept responsibility for all activities under your account</li>
            </ul>
            <p className="text-stone-600 mb-4">
              We reserve the right to terminate accounts, refuse service, or cancel orders at our sole discretion.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">4. Products and Pricing</h2>
            <p className="text-stone-600 mb-4">
              All product descriptions, pricing, and availability are subject to change without notice. We reserve the right to:
            </p>
            <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
              <li>Limit quantities of any products</li>
              <li>Discontinue any product at any time</li>
              <li>Refuse any order for any reason</li>
              <li>Correct any errors in pricing or product information</li>
            </ul>
            <p className="text-stone-600 mb-4">
              Prices are displayed in the currency selected by you and include applicable taxes unless otherwise stated.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">5. Orders and Payment</h2>
            <p className="text-stone-600 mb-4">
              By placing an order, you represent that:
            </p>
            <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
              <li>You are legally capable of entering into binding contracts</li>
              <li>All information you provide is true and accurate</li>
              <li>You are authorized to use the payment method provided</li>
            </ul>
            <p className="text-stone-600 mb-4">
              We accept major credit cards, PayPal, and other payment methods as displayed at checkout. Payment must be received before orders are processed.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">6. Shipping and Delivery</h2>
            <p className="text-stone-600 mb-4">
              Shipping times are estimates and are not guaranteed. We are not responsible for delays caused by customs, weather, or other circumstances beyond our control.
            </p>
            <p className="text-stone-600 mb-4">
              Risk of loss and title for items pass to you upon delivery to the carrier. It is your responsibility to provide an accurate shipping address.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">7. Returns and Refunds</h2>
            <p className="text-stone-600 mb-4">
              Our return policy allows for returns within 30 days of delivery for unworn items in original condition with tags attached. Please refer to our Returns Policy for complete details.
            </p>
            <p className="text-stone-600 mb-4">
              Sale items and items marked as final sale are not eligible for returns or exchanges.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-stone-600 mb-4">
              THE SITE AND ALL PRODUCTS ARE PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
              <li>Merchantability</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement</li>
              <li>Accuracy or completeness of content</li>
            </ul>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">9. Limitation of Liability</h2>
            <p className="text-stone-600 mb-4">
              TO THE FULLEST EXTENT PERMITTED BY LAW, BETTERKNITWEAR SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SITE OR PRODUCTS.
            </p>
            <p className="text-stone-600 mb-4">
              Our total liability shall not exceed the amount paid by you for the product giving rise to the claim.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">10. Indemnification</h2>
            <p className="text-stone-600 mb-4">
              You agree to indemnify and hold harmless BetterKnitwear and its affiliates, officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Site or violation of these Terms.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">11. Governing Law</h2>
            <p className="text-stone-600 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the State of New York, United States, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">12. Changes to Terms</h2>
            <p className="text-stone-600 mb-4">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Site after any changes constitutes acceptance of the new Terms.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">13. Contact Information</h2>
            <p className="text-stone-600 mb-4">
              For questions about these Terms, please contact us at:
            </p>
            <div className="bg-stone-50 p-6 rounded-xl">
              <p className="text-stone-900 font-medium">BetterKnitwear</p>
              <p className="text-stone-600">123 Fashion Street</p>
              <p className="text-stone-600">New York, NY 10001</p>
              <p className="text-stone-600">Email: legal@betterknitwear.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
