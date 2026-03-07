import { Metadata } from "next"
import { Heading, Text } from "@medusajs/ui"
import ContactForm from "@modules/common/components/contact-form"

export const metadata: Metadata = {
  title: "Contact Us | LineVibes",
  description:
    "Contact LineVibes for order support, shipping questions, quality concerns, and general inquiries.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-stone-100 to-amber-50 py-20">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-amber-700 text-sm uppercase tracking-wider mb-4">Get In Touch</p>
            <Heading level="h1" className="text-4xl md:text-5xl font-light text-stone-900 mb-6">
              Contact LineVibes
            </Heading>
            <Text className="text-lg text-stone-600">
              Reach out for support with your order, shipping updates, return requests, or product questions.
            </Text>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="content-container">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-semibold text-stone-900 mb-8">Contact Information</h2>

              <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Email</p>
                    <a href="mailto:info@linevibes.com" className="text-stone-900 hover:text-amber-700 transition-colors">
                      info@linevibes.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-start gap-4 mb-2">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Operations</p>
                    <p className="text-stone-900">
                      Dongguan City, Guangdong Province
                      <br />
                      China
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Support Hours</p>
                    <p className="text-stone-900">
                      Monday - Friday
                      <br />
                      Response times vary by queue volume and time zone
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-stone-50 rounded-2xl p-8">
                <h2 className="text-2xl font-semibold text-stone-900 mb-6">Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
