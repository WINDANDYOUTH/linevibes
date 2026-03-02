import { Metadata } from "next"
import { Heading } from "@medusajs/ui"

export const metadata: Metadata = {
  title: "Privacy Policy | BetterKnitwear",
  description:
    "Learn how BetterKnitwear collects, uses, and protects your personal information. Read our comprehensive privacy policy.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-stone-100 to-stone-50 py-16">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <Heading level="h1" className="text-4xl font-light text-stone-900 mb-4">
              Privacy Policy
            </Heading>
            <p className="text-stone-600">Last updated: January 20, 2026</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="content-container">
          <div className="max-w-3xl mx-auto prose prose-stone">
            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">1. Introduction</h2>
            <p className="text-stone-600 mb-4">
              BetterKnitwear (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
            </p>
            <p className="text-stone-600 mb-4">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access our website.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium text-stone-900 mt-6 mb-3">Personal Information</h3>
            <p className="text-stone-600 mb-4">
              We may collect personal information that you voluntarily provide when you:
            </p>
            <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
              <li>Create an account on our website</li>
              <li>Make a purchase</li>
              <li>Sign up for our newsletter</li>
              <li>Contact us with inquiries or feedback</li>
              <li>Participate in promotions or surveys</li>
            </ul>
            <p className="text-stone-600 mb-4">
              This information may include your name, email address, postal address, phone number, and payment information.
            </p>

            <h3 className="text-xl font-medium text-stone-900 mt-6 mb-3">Automatically Collected Information</h3>
            <p className="text-stone-600 mb-4">
              When you access our website, we may automatically collect certain information about your device, including:
            </p>
            <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent</li>
              <li>Referring website</li>
              <li>Device identifiers</li>
            </ul>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-stone-600 mb-4">
              We may use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Send you order confirmations and updates</li>
              <li>Provide customer support</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Analyze usage trends and preferences</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">4. Sharing Your Information</h2>
            <p className="text-stone-600 mb-4">
              We may share your information with third parties in the following situations:
            </p>
            <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
              <li><strong>Service Providers:</strong> We may share your information with third-party vendors who provide services such as payment processing, shipping, and email delivery.</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid legal requests.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">5. Cookies and Tracking Technologies</h2>
            <p className="text-stone-600 mb-4">
              We use cookies and similar tracking technologies to collect information about your browsing activities. Cookies are small data files stored on your device that help us improve your experience on our website.
            </p>
            <p className="text-stone-600 mb-4">
              You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our website.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">6. Data Security</h2>
            <p className="text-stone-600 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">7. Your Rights</h2>
            <p className="text-stone-600 mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
              <li>Access to your personal data</li>
              <li>Correction of inaccurate data</li>
              <li>Deletion of your data</li>
              <li>Objection to processing</li>
              <li>Data portability</li>
              <li>Withdrawal of consent</li>
            </ul>
            <p className="text-stone-600 mb-4">
              To exercise these rights, please contact us at privacy@betterknitwear.com.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">8. Children&apos;s Privacy</h2>
            <p className="text-stone-600 mb-4">
              Our website is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">9. International Data Transfers</h2>
            <p className="text-stone-600 mb-4">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">10. Changes to This Policy</h2>
            <p className="text-stone-600 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">11. Contact Us</h2>
            <p className="text-stone-600 mb-4">
              If you have questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-stone-50 p-6 rounded-xl">
              <p className="text-stone-900 font-medium">BetterKnitwear</p>
              <p className="text-stone-600">123 Fashion Street</p>
              <p className="text-stone-600">New York, NY 10001</p>
              <p className="text-stone-600">Email: privacy@betterknitwear.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
