"use client"

import React, { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "What type of photo works best?",
    answer:
      "Clear, well-lit portrait photos with a simple background work best. Face the camera or turn slightly for a ¾ profile. High-contrast images with good lighting produce the cleanest line art. Avoid group photos, heavy shadows, or overly busy backgrounds. Resolution of at least 1024×1024 pixels is recommended.",
  },
  {
    question: "Is my photo kept private?",
    answer:
      "Absolutely. Your photos are processed in a secure, encrypted environment. Original images are automatically deleted within 24 hours of upload. We never share, sell, or use your photos for training purposes. Generated artwork is stored in your private account only.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "Digital downloads are non-refundable once delivered, as they cannot be \"returned.\" For canvas prints, we offer a full refund or reprint if the product arrives damaged or defective. Contact us within 14 days of delivery with photos of any issues. We stand behind the quality of every print.",
  },
  {
    question: "How long does canvas print shipping take?",
    answer:
      "Canvas prints are produced and shipped within 3-5 business days. Standard shipping takes an additional 5-7 business days. Express shipping (included free on 16×24\" and larger) arrives in 2-3 business days. International shipping is available and typically takes 7-14 business days.",
  },
  {
    question: "What file formats do I receive?",
    answer:
      "With a digital download purchase, you receive: a 4K PNG file (4096×4096 pixels, transparent background), a scalable SVG vector file (perfect for any print size), and a web-optimized JPG version. All files are watermark-free and ready for commercial use under our included license.",
  },
  {
    question: "Can I use the artwork commercially?",
    answer:
      "Yes! Every purchase includes a commercial license. You can use your line portrait for personal projects, merchandise, marketing materials, social media, website graphics, and printed products for resale. The only restriction is you cannot resell the raw digital files themselves.",
  },
  {
    question: "How does the AI generation work?",
    answer:
      "Our AI uses advanced computer vision to detect facial contours, edges, and features in your photo. It then generates clean, uniform line art following the chosen style parameters. The process takes seconds and produces vector-quality output with pure black strokes on a transparent background.",
  },
]

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`border-b border-gray-200 transition-colors ${
        isOpen ? "bg-gray-50/50" : ""
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 px-6 text-left group"
        aria-expanded={isOpen}
      >
        <span
          className={`text-base md:text-lg font-semibold pr-8 transition-colors ${
            isOpen ? "text-linevibes-blue" : "text-gray-900 group-hover:text-linevibes-blue"
          }`}
        >
          {item.question}
        </span>
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-linevibes-blue text-white rotate-180"
              : "bg-gray-100 text-gray-500 group-hover:bg-linevibes-blue/10 group-hover:text-linevibes-blue"
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="px-6 text-gray-600 text-sm leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  )
}

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 md:py-28 bg-white">
      <div className="content-container">
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="text-linevibes-blue font-semibold text-sm tracking-widest uppercase">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-base md:text-lg">
              Got questions? We&apos;ve got answers.
            </p>
          </div>

          {/* Accordion */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {faqs.map((faq, idx) => (
              <FAQAccordionItem
                key={idx}
                item={faq}
                isOpen={openIdx === idx}
                onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
