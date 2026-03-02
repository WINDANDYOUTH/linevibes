import { Metadata } from "next"
import { Heading, Text, Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowRight, CheckCircleSolid } from "@medusajs/icons"

export const metadata: Metadata = {
  title: "Custom Order | Turn Your Photo Into Art | LineVibes",
  description:
    "Upload your photo and we'll transform it into stunning line art. Perfect for cars, pets, portraits, and cherished memories. Precision-plotted with real archival ink.",
  keywords: [
    "custom line art",
    "photo to art",
    "custom portrait",
    "car drawing commission",
    "pet portrait line art",
    "personalized art gift",
  ],
}

const customStyles = [
  {
    name: "Minimalist",
    description: "Clean, continuous lines capturing the essence",
    icon: "✨",
    bestFor: "Portraits, pets, simple subjects",
    example: "Single flowing line that never lifts",
  },
  {
    name: "Blueprint",
    description: "Technical schematic-style with annotations",
    icon: "📐",
    bestFor: "Cars, aircraft, machinery, architecture",
    example: "White lines on classic blue paper",
  },
  {
    name: "Detailed",
    description: "Intricate multi-layered line work",
    icon: "🎨",
    bestFor: "Complex scenes, landscapes, group portraits",
    example: "Multiple passes for depth and shadow",
  },
]

const processSteps = [
  {
    step: 1,
    title: "Upload Your Photo",
    description:
      "Send us your favorite photo via our form. High resolution works best, but we can work with most images.",
    icon: "📤",
  },
  {
    step: 2,
    title: "Choose Your Style",
    description:
      "Select from Minimalist, Blueprint, or Detailed styles. Not sure? We'll recommend the best fit for your image.",
    icon: "🎯",
  },
  {
    step: 3,
    title: "Review Digital Proof",
    description:
      "Within 3-5 days, you'll receive a digital preview of your artwork. Request unlimited revisions until it's perfect.",
    icon: "👁️",
  },
  {
    step: 4,
    title: "We Plot Your Art",
    description:
      "Once approved, our robots plot your artwork with real archival ink on museum-grade paper.",
    icon: "🖋️",
  },
  {
    step: 5,
    title: "Delivered to You",
    description:
      "Your finished artwork ships worldwide in protective packaging, ready to frame and display.",
    icon: "📦",
  },
]

const pricing = [
  {
    size: '8" × 10"',
    name: "Small",
    price: "$55",
    description: "Perfect for desks & shelves",
    popular: false,
  },
  {
    size: '11" × 14"',
    name: "Medium",
    price: "$75",
    description: "Great for wall display",
    popular: true,
  },
  {
    size: '16" × 20"',
    name: "Large",
    price: "$99",
    description: "Statement piece",
    popular: false,
  },
  {
    size: '24" × 36"',
    name: "Extra Large",
    price: "$149",
    description: "Gallery-worthy",
    popular: false,
  },
]

const faqs = [
  {
    question: "What kind of photos work best?",
    answer:
      "High-resolution photos with clear subjects work best. For portraits, good lighting on the face helps. For cars/vehicles, a side or 3/4 angle is ideal. We can work with most photos and will let you know if we need a better source.",
  },
  {
    question: "How long does it take?",
    answer:
      "Digital preview: 3-5 business days. After approval, plotting takes 2-3 days. Shipping is 5-10 business days (domestic) or 2-3 weeks (international).",
  },
  {
    question: "Can I make revisions?",
    answer:
      "Yes! You get unlimited revisions on the digital proof before we plot. Once plotting begins, changes aren't possible, so take your time reviewing the proof.",
  },
  {
    question: "What if I'm not happy with the result?",
    answer:
      "We offer a 100% satisfaction guarantee. If your final printed piece doesn't meet expectations, we'll work with you to make it right or provide a full refund.",
  },
  {
    question: "Do you offer framing?",
    answer:
      "Yes! Add professional framing for an additional $40-$60 depending on size. Options include Black Wood, Natural Oak, and White Wood frames.",
  },
]

export default function CustomOrderPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white py-24 overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="content-container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Now Accepting Orders
            </div>

            <Heading
              level="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              Turn Your Photo Into
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                Timeless Line Art
              </span>
            </Heading>

            <Text className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
              Upload any photo — a car you love, a beloved pet, a cherished
              memory — and our robots will transform it into stunning line art
              drawn with real archival ink.
            </Text>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#order-form"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                ✨ Start Your Order
                <ArrowRight className="ml-2" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                See How It Works
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2 text-indigo-200">
                <CheckCircleSolid className="text-green-400" />
                <span className="text-sm">Unlimited Revisions</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-200">
                <CheckCircleSolid className="text-green-400" />
                <span className="text-sm">100% Satisfaction Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-200">
                <CheckCircleSolid className="text-green-400" />
                <span className="text-sm">Ships Worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Style Options */}
      <section className="py-20 bg-stone-50">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Choose Your Style
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Each style creates a unique aesthetic. Not sure which to choose?
              We&apos;ll recommend the best fit for your photo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {customStyles.map((style) => (
              <div
                key={style.name}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-100"
              >
                <div className="text-5xl mb-4">{style.icon}</div>
                <h3 className="text-2xl font-bold text-stone-900 mb-3">
                  {style.name}
                </h3>
                <p className="text-stone-600 mb-4">{style.description}</p>
                <div className="space-y-2 text-sm">
                  <p className="text-stone-500">
                    <span className="font-medium text-indigo-600">
                      Best for:
                    </span>{" "}
                    {style.bestFor}
                  </p>
                  <p className="text-stone-500">
                    <span className="font-medium text-indigo-600">
                      Technique:
                    </span>{" "}
                    {style.example}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="content-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              From photo to finished art in 5 simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {processSteps.map((step, index) => (
              <div key={step.step} className="flex gap-6 mb-8 last:mb-0">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg">
                    {step.icon}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="w-0.5 h-12 bg-indigo-200 mx-auto mt-2"></div>
                  )}
                </div>

                {/* Step Content */}
                <div className="pt-3">
                  <div className="text-sm text-indigo-600 font-semibold mb-1">
                    Step {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-stone-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-stone-50">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              All prices include digital proof with unlimited revisions
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {pricing.map((tier) => (
              <div
                key={tier.size}
                className={`relative bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  tier.popular
                    ? "border-indigo-500 scale-105"
                    : "border-stone-100"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center">
                  <div className="text-sm text-stone-500 mb-1">{tier.name}</div>
                  <div className="text-2xl font-bold text-stone-900 mb-1">
                    {tier.size}
                  </div>
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    {tier.price}
                  </div>
                  <p className="text-sm text-stone-500">{tier.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 text-stone-600">
            <p className="text-sm">
              Add-ons: Premium Paper (+$10) • Professional Framing (+$40-60) •
              Rush Processing (+$25)
            </p>
          </div>
        </div>
      </section>

      {/* Order Form Section */}
      <section
        id="order-form"
        className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900 text-white"
      >
        <div className="content-container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Start Your Custom Order
              </h2>
              <p className="text-indigo-200">
                Fill out the form below and we&apos;ll get back to you within
                24 hours
              </p>
            </div>

            <form className="space-y-6 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20 transition-all"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20 transition-all"
                  placeholder="john@example.com"
                />
              </div>

              {/* Style Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Preferred Style *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Minimalist", "Blueprint", "Detailed"].map((style) => (
                    <label
                      key={style}
                      className="flex items-center justify-center px-4 py-3 rounded-lg bg-white/10 border border-white/20 cursor-pointer hover:bg-white/20 transition-all"
                    >
                      <input
                        type="radio"
                        name="style"
                        value={style.toLowerCase()}
                        className="sr-only"
                      />
                      <span>{style}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Size Preference *
                </label>
                <select
                  name="size"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white transition-all"
                >
                  <option value="" className="text-stone-900">
                    Select a size
                  </option>
                  <option value="8x10" className="text-stone-900">
                    8&quot; × 10&quot; - $55
                  </option>
                  <option value="11x14" className="text-stone-900">
                    11&quot; × 14&quot; - $75 (Popular)
                  </option>
                  <option value="16x20" className="text-stone-900">
                    16&quot; × 20&quot; - $99
                  </option>
                  <option value="24x36" className="text-stone-900">
                    24&quot; × 36&quot; - $149
                  </option>
                </select>
              </div>

              {/* Subject Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-2"
                >
                  Describe Your Photo *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20 transition-all resize-none"
                  placeholder="Tell us about the photo - is it a car, pet, portrait, landscape? Any special requests or notes?"
                ></textarea>
              </div>

              {/* Photo Upload Note */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-indigo-200">
                  📸 <strong>Photo Upload:</strong> After submitting this form,
                  you&apos;ll receive an email with instructions to upload your
                  photo securely.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-8 py-4 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Submit Order Request
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-stone-50 rounded-xl p-6 border border-stone-100"
              >
                <h3 className="text-lg font-bold text-stone-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-stone-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-stone-900 text-white">
        <div className="content-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Create Your Custom Art?
          </h2>
          <p className="text-stone-400 mb-8 max-w-xl mx-auto">
            Join hundreds of happy customers who have transformed their memories
            into stunning line art.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#order-form"
              className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition-all duration-300"
            >
              Start Your Order
              <ArrowRight className="ml-2" />
            </a>
            <LocalizedClientLink
              href="/store"
              className="inline-flex items-center justify-center px-8 py-4 border border-stone-700 text-white font-medium rounded-lg hover:bg-stone-800 transition-all duration-300"
            >
              Browse Ready-Made Art
            </LocalizedClientLink>
          </div>
        </div>
      </section>
    </div>
  )
}
