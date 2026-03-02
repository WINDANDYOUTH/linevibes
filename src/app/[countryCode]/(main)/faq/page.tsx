import { Metadata } from "next"
import { Heading, Text } from "@medusajs/ui"
import FAQAccordion from "@modules/common/components/faq-accordion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "FAQ | BetterKnitwear",
  description:
    "Find answers to frequently asked questions about BetterKnitwear products, shipping, returns, care instructions, and more.",
}

const faqData = [
  {
    category: "Shipping & Delivery",
    questions: [
      {
        question: "How long does shipping take?",
        answer: "Standard shipping typically takes 5-7 business days within the US. International shipping times vary by destination, usually between 10-21 business days. Express shipping options are available at checkout for faster delivery."
      },
      {
        question: "Do you offer free shipping?",
        answer: "Yes! We offer free standard shipping on all orders over $150 within the United States. International orders over $250 qualify for free shipping to select countries."
      },
      {
        question: "Can I track my order?",
        answer: "Absolutely. Once your order ships, you'll receive a confirmation email with a tracking number. You can also track your order by logging into your account on our website."
      },
      {
        question: "Do you ship internationally?",
        answer: "Yes, we ship to most countries worldwide. Shipping rates and delivery times vary by destination. Please note that international orders may be subject to customs duties and taxes, which are the responsibility of the recipient."
      }
    ]
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for unworn, unwashed items with original tags attached. Items must be in their original condition. Sale items are final sale and cannot be returned."
      },
      {
        question: "How do I initiate a return?",
        answer: "To start a return, log into your account and navigate to your order history. Select the item you wish to return and follow the prompts. You'll receive a prepaid shipping label via email. Please ensure items are securely packaged."
      },
      {
        question: "Can I exchange an item for a different size?",
        answer: "Yes! We're happy to process exchanges for different sizes. Simply initiate a return for your original item and place a new order for the correct size. We'll refund the original purchase once we receive the return."
      },
      {
        question: "How long do refunds take?",
        answer: "Once we receive and inspect your return, refunds are processed within 3-5 business days. The refund will be credited to your original payment method. Please allow an additional 5-10 business days for the refund to appear on your statement."
      }
    ]
  },
  {
    category: "Product Care",
    questions: [
      {
        question: "How should I wash my knitwear?",
        answer: "We recommend hand washing your knitwear in cold water with a gentle detergent. Avoid wringing or twisting. Lay flat to dry away from direct sunlight or heat. Some of our items are machine washable on a delicate cycle - please check the care label for specific instructions."
      },
      {
        question: "How do I remove pilling from my sweater?",
        answer: "Some pilling is natural for high-quality knitwear and doesn't indicate poor quality. Use a fabric shaver or sweater stone to gently remove pills. Regular care will help maintain your garment's appearance."
      },
      {
        question: "How should I store my knitwear?",
        answer: "Fold your knitwear rather than hanging to prevent stretching. Store in a cool, dry place away from direct sunlight. We recommend using cedar blocks or lavender sachets to deter moths naturally."
      },
      {
        question: "Can I dry clean my sweaters?",
        answer: "Yes, dry cleaning is safe for most of our products and is often the gentlest option for delicate cashmere pieces. Always check the care label for specific recommendations."
      }
    ]
  },
  {
    category: "Sizing & Fit",
    questions: [
      {
        question: "How do I find my correct size?",
        answer: "Each product page includes a detailed size guide with measurements. We recommend measuring a garment that fits you well and comparing it to our size chart. If you're between sizes, we generally recommend sizing up for a relaxed fit or sizing down for a more fitted look."
      },
      {
        question: "Do your sweaters shrink?",
        answer: "Our knitwear is pre-washed to minimize shrinkage. However, improper washing (hot water, machine drying) can cause natural fibers to shrink. Following our care instructions will help maintain the original size and shape of your garments."
      },
      {
        question: "What if the fit isn't right?",
        answer: "If you're not completely satisfied with the fit, we offer free exchanges within 30 days of purchase. Simply initiate a return and order your preferred size."
      }
    ]
  },
  {
    category: "Materials & Quality",
    questions: [
      {
        question: "Where do you source your materials?",
        answer: "We partner with ethical suppliers in Mongolia, Italy, and Scotland to source the finest merino wool and cashmere. Our suppliers adhere to strict animal welfare standards and sustainable farming practices."
      },
      {
        question: "Is your cashmere authentic?",
        answer: "Absolutely. All our cashmere is 100% pure, Grade A cashmere sourced from Inner Mongolia. We provide certificates of authenticity upon request and maintain full traceability throughout our supply chain."
      },
      {
        question: "Are your products sustainable?",
        answer: "Sustainability is at the core of our business. We use eco-friendly packaging, work with certified ethical suppliers, and design our products to last for years, reducing the need for frequent replacements."
      }
    ]
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-stone-100 to-amber-50 py-20">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-amber-700 text-sm uppercase tracking-wider mb-4">Help Center</p>
            <Heading level="h1" className="text-4xl md:text-5xl font-light text-stone-900 mb-6">
              Frequently Asked Questions
            </Heading>
            <Text className="text-lg text-stone-600">
              Find answers to common questions about our products, shipping, returns, and more. 
              Can&apos;t find what you&apos;re looking for? Contact our support team.
            </Text>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-white">
        <div className="content-container">
          <div className="max-w-4xl mx-auto">
            {faqData.map((category, index) => (
              <div key={index} className="mb-12">
                <h2 className="text-2xl font-semibold text-stone-900 mb-6 pb-2 border-b border-stone-200">
                  {category.category}
                </h2>
                <FAQAccordion questions={category.questions} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-stone-50">
        <div className="content-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">
              Still Have Questions?
            </h2>
            <Text className="text-stone-600 mb-6">
              Our customer support team is here to help. Get in touch and we&apos;ll respond as soon as possible.
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
