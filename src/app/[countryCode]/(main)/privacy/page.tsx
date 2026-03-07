import { Metadata } from "next"
import { Heading } from "@medusajs/ui"

export const metadata: Metadata = {
  title: "Privacy Policy | LineVibes",
  description:
    "Review how LineVibes collects, uses, stores, and transfers personal data across our global operations.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-stone-100 to-stone-50 py-16">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <Heading level="h1" className="text-4xl font-light text-stone-900 mb-4">
              Privacy Policy
            </Heading>
            <p className="text-stone-600">Last updated: March 7, 2026</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="content-container">
          <div className="max-w-3xl mx-auto prose prose-stone">
            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">1. Who We Are</h2>
            <p className="text-stone-600 mb-4">
              LineVibes (&quot;LineVibes,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates this website and related
              services from Dongguan City, Guangdong Province, China. This Privacy Policy explains how
              we collect, use, share, and protect information when you browse our website, place an
              order, contact support, or otherwise interact with our services.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">2. Information We Collect</h2>
            <p className="text-stone-600 mb-4">We may collect the following categories of personal information:</p>
            <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
              <li>Contact details such as your name, email address, shipping address, and phone number</li>
              <li>Order details such as purchased items, custom instructions, uploaded assets, and order history</li>
              <li>Payment-related details processed through secure third-party payment providers</li>
              <li>Technical data such as IP address, browser type, device identifiers, and usage logs</li>
              <li>Customer support communications, feedback, and other information you send to us</li>
            </ul>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">3. How We Use Information</h2>
            <p className="text-stone-600 mb-4">We use personal information to operate and improve LineVibes, including to:</p>
            <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
              <li>Process payments, fulfill orders, and coordinate delivery</li>
              <li>Provide customer support, quality assurance, and after-sales service</li>
              <li>Personalize products and maintain production records for reprints or support requests</li>
              <li>Detect fraud, misuse, security incidents, and technical issues</li>
              <li>Send service communications such as order confirmations, tracking updates, and policy notices</li>
              <li>Send marketing messages where permitted by law or with your consent</li>
              <li>Comply with legal obligations and enforce our terms</li>
            </ul>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">4. Legal Bases and Disclosures</h2>
            <p className="text-stone-600 mb-4">
              Depending on your location, we rely on contractual necessity, legitimate interests, legal
              compliance, and consent where required. We may disclose information to logistics partners,
              hosting providers, analytics services, payment processors, customer support tools, and
              professional advisors when reasonably necessary to operate the business.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">5. International Data Transfers</h2>
            <p className="text-stone-600 mb-4">
              LineVibes serves customers internationally. Your personal information may be transferred to,
              stored in, or accessed from countries outside your home jurisdiction, including China and
              other locations where our service providers operate. Where applicable, we implement
              reasonable contractual, technical, and organizational safeguards for those transfers.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">6. Data Retention</h2>
            <p className="text-stone-600 mb-4">
              We retain personal information only for as long as needed for the purposes described in this
              policy, including order fulfillment, customer support, legal compliance, tax and accounting
              requirements, dispute resolution, and security monitoring.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">7. Your Rights</h2>
            <p className="text-stone-600 mb-4">
              Subject to applicable law, you may request access, correction, deletion, restriction,
              objection, or portability of your personal information, and you may withdraw consent where
              processing is based on consent. To submit a privacy request, email us at info@linevibes.com.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">8. Cookies and Analytics</h2>
            <p className="text-stone-600 mb-4">
              We use cookies and similar technologies to keep the website functional, understand traffic
              patterns, remember your preferences, and improve performance. You can manage cookie settings
              through your browser, although some features may not work properly if certain cookies are disabled.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">9. Security</h2>
            <p className="text-stone-600 mb-4">
              We use commercially reasonable safeguards designed to protect personal information against
              unauthorized access, disclosure, alteration, and destruction. No internet-based service can
              be guaranteed to be completely secure.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">10. Children&apos;s Privacy</h2>
            <p className="text-stone-600 mb-4">
              Our services are not directed to children under the age required by applicable law to provide
              valid consent. We do not knowingly collect personal information from children where prohibited.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">11. Changes to This Policy</h2>
            <p className="text-stone-600 mb-4">
              We may update this Privacy Policy from time to time. When we do, we will revise the
              effective date on this page and publish the updated policy on our website.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">12. Contact Us</h2>
            <p className="text-stone-600 mb-4">
              For privacy questions, data requests, or concerns about this policy, contact:
            </p>
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
