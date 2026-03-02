import { Metadata } from "next"
import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Returns & Exchanges | BetterKnitwear",
  description:
    "Learn about BetterKnitwear's hassle-free return and exchange policy. 30-day returns on unworn items.",
}

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-stone-100 to-stone-50 py-16">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <Heading level="h1" className="text-4xl font-light text-stone-900 mb-4">
              Returns & Exchanges
            </Heading>
            <p className="text-stone-600">Last updated: January 20, 2026</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="content-container">
          <div className="max-w-3xl mx-auto">
            {/* Highlights */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-stone-50 p-6 rounded-xl text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-stone-900 mb-1">30-Day Returns</h3>
                <p className="text-sm text-stone-600">Return within 30 days of delivery</p>
              </div>
              <div className="bg-stone-50 p-6 rounded-xl text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-stone-900 mb-1">Free Returns</h3>
                <p className="text-sm text-stone-600">Free return shipping in the US</p>
              </div>
              <div className="bg-stone-50 p-6 rounded-xl text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="font-semibold text-stone-900 mb-1">Easy Exchanges</h3>
                <p className="text-sm text-stone-600">Swap for a different size or color</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Return Policy</h2>
            <p className="text-stone-600 mb-4">
              We want you to love your BetterKnitwear purchase. If you&apos;re not completely satisfied, we accept returns within 30 days of delivery for a full refund.
            </p>

            <h3 className="text-xl font-medium text-stone-900 mt-6 mb-3">Eligible Items</h3>
            <p className="text-stone-600 mb-4">
              To be eligible for a return, items must be:
            </p>
            <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
              <li>Unworn and unwashed</li>
              <li>In original condition with all tags attached</li>
              <li>Free from pet hair, odors, or damage</li>
              <li>In original packaging (when possible)</li>
            </ul>

            <h3 className="text-xl font-medium text-stone-900 mt-6 mb-3">Non-Returnable Items</h3>
            <p className="text-stone-600 mb-4">
              The following items cannot be returned:
            </p>
            <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
              <li>Items marked as &quot;Final Sale&quot;</li>
              <li>Items that have been worn, washed, or altered</li>
              <li>Gift cards</li>
              <li>Items purchased with a promotional discount greater than 50%</li>
            </ul>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">How to Return</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center flex-shrink-0 font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-stone-900 mb-1">Start Your Return</h4>
                  <p className="text-stone-600">Log into your account and go to &quot;Order History.&quot; Select the item(s) you wish to return and follow the prompts.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center flex-shrink-0 font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-stone-900 mb-1">Print Your Label</h4>
                  <p className="text-stone-600">You&apos;ll receive a prepaid return shipping label via email. Print it and attach it to your package.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center flex-shrink-0 font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-stone-900 mb-1">Ship It Back</h4>
                  <p className="text-stone-600">Drop off your package at any authorized shipping location. Keep your tracking number for reference.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center flex-shrink-0 font-medium">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-stone-900 mb-1">Get Your Refund</h4>
                  <p className="text-stone-600">Once we receive and inspect your return, we&apos;ll process your refund within 3-5 business days.</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Exchanges</h2>
            <p className="text-stone-600 mb-4">
              Want a different size or color? We&apos;re happy to help! The fastest way to exchange is to:
            </p>
            <ol className="list-decimal pl-6 text-stone-600 mb-4 space-y-2">
              <li>Return your original item for a refund</li>
              <li>Place a new order for the item you want</li>
            </ol>
            <p className="text-stone-600 mb-4">
              This ensures you get your new item as quickly as possible without waiting for the return to be processed.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Refund Timeline</h2>
            <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
              <li><strong>Processing:</strong> 3-5 business days after we receive your return</li>
              <li><strong>Credit Card:</strong> 5-10 business days to appear on your statement</li>
              <li><strong>PayPal:</strong> 3-5 business days</li>
              <li><strong>Store Credit:</strong> Immediate upon processing</li>
            </ul>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">International Returns</h2>
            <p className="text-stone-600 mb-4">
              International customers are responsible for return shipping costs. We recommend using a trackable shipping method. Refunds will not include the original shipping charges or any customs fees paid.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Damaged or Defective Items</h2>
            <p className="text-stone-600 mb-4">
              If you receive a damaged or defective item, please contact us within 48 hours of delivery with photos of the damage. We&apos;ll arrange for a replacement or full refund at no additional cost.
            </p>

            <div className="bg-stone-50 p-6 rounded-xl mt-8">
              <h3 className="font-semibold text-stone-900 mb-2">Need Help?</h3>
              <p className="text-stone-600 mb-4">
                Our customer service team is here to assist you with returns and exchanges.
              </p>
              <p className="text-stone-600">Email: returns@betterknitwear.com</p>
              <p className="text-stone-600">Phone: +1 (800) 123-4567</p>
            </div>

            <div className="text-center pt-8 mt-8 border-t border-stone-200">
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
