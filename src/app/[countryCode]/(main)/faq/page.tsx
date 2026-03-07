import { Metadata } from "next"
import { Heading, Text } from "@medusajs/ui"
import FAQAccordion from "@modules/common/components/faq-accordion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "FAQ | LineVibes",
  description:
    "Find answers about LineVibes shipping, tracking, product care, order timelines, and customer support.",
}

const faqData = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        question: "Where do orders ship from?",
        answer:
          "Physical LineVibes orders ship from Dongguan City, Guangdong Province, China. Processing usually takes 2 to 5 business days before dispatch.",
      },
      {
        question: "How long does shipping take?",
        answer:
          "Estimated transit times are 7 to 14 business days for North America, 10 to 15 business days for Europe, 5 to 10 business days for Asia-Pacific, and 10 to 18 business days for many other destinations.",
      },
      {
        question: "How do I track my package?",
        answer:
          "Once your order ships, we send a tracking email to the address used at checkout. Tracking can take 24 to 72 hours to activate after the carrier receives the parcel.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes. LineVibes serves customers in many regions worldwide. Import duties, taxes, or customs fees may apply depending on your destination.",
      },
    ],
  },
  {
    category: "Products & Care",
    questions: [
      {
        question: "How should I care for my LineVibes print or framed piece?",
        answer:
          "Keep artwork in a dry indoor environment, avoid prolonged direct sunlight, and handle prints with clean, dry hands. For framed or mounted pieces, dust gently with a soft microfiber cloth.",
      },
      {
        question: "Can I clean the surface of my product?",
        answer:
          "For framed surfaces and protective covers, use a soft dry cloth or a cleaner specifically intended for that material. Do not use abrasive pads, harsh solvents, or excessive moisture on printed artwork.",
      },
      {
        question: "Are your products suitable for gifting?",
        answer:
          "Yes. Many customers order LineVibes pieces as personalized gifts for anniversaries, memorials, pets, vehicles, homes, and milestone moments.",
      },
      {
        question: "Will my finished piece look exactly like the screen preview?",
        answer:
          "We work to match the approved design closely, but minor differences in color, material texture, and finishing can occur between digital previews and physical production.",
      },
    ],
  },
  {
    category: "Returns & Support",
    questions: [
      {
        question: "What is your quality guarantee?",
        answer:
          "If your order arrives damaged, defective, or materially different from the approved design or ordered specification, contact info@linevibes.com within 7 days of delivery so we can review and resolve it.",
      },
      {
        question: "How do I start a return or exchange?",
        answer:
          "Email info@linevibes.com with your order number and request details. We will confirm eligibility and provide the correct return warehouse address if a return is approved.",
      },
      {
        question: "Can I cancel or change an order?",
        answer:
          "If production has not started yet, we may be able to update or cancel your order. Contact support as soon as possible because custom and made-to-order work moves into production quickly.",
      },
      {
        question: "How can I contact LineVibes support?",
        answer:
          "Send us an email at info@linevibes.com. We use that inbox for order support, shipping questions, returns, and general inquiries.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-stone-100 to-amber-50 py-20">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-amber-700 text-sm uppercase tracking-wider mb-4">Help Center</p>
            <Heading level="h1" className="text-4xl md:text-5xl font-light text-stone-900 mb-6">
              Frequently Asked Questions
            </Heading>
            <Text className="text-lg text-stone-600">
              Find answers to common questions about LineVibes products, fulfillment, and support.
              Can&apos;t find what you need? Contact our team.
            </Text>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="content-container">
          <div className="max-w-4xl mx-auto">
            {faqData.map((category) => (
              <div key={category.category} className="mb-12">
                <h2 className="text-2xl font-semibold text-stone-900 mb-6 pb-2 border-b border-stone-200">
                  {category.category}
                </h2>
                <FAQAccordion questions={category.questions} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-stone-50">
        <div className="content-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">Still Have Questions?</h2>
            <Text className="text-stone-600 mb-6">
              Our support team can help with orders, delivery, quality questions, and return requests.
            </Text>
            <LocalizedClientLink
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-full font-medium transition-colors"
            >
              Contact Support
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </LocalizedClientLink>
          </div>
        </div>
      </section>
    </div>
  )
}
