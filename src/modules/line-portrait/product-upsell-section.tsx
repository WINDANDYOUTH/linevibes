import React from "react"

const products = [
  {
    id: "digital",
    badge: "Most Popular",
    title: "Digital Download",
    subtitle: "Instant delivery to your inbox",
    price: "$9",
    priceNote: "– $19",
    features: [
      "4K PNG (4096×4096)",
      "Scalable SVG file",
      "No watermark",
      "Commercial license",
      "Instant download link",
    ],
    cta: "Unlock High-Res",
    gradient: "from-linevibes-blue to-indigo-600",
    bgGradient: "from-linevibes-blue/5 to-indigo-50",
    highlight: true,
  },
  {
    id: "canvas-small",
    badge: null,
    title: 'Canvas Print 12×16"',
    subtitle: "Gallery-wrapped, ready to hang",
    price: "$49",
    priceNote: "",
    features: [
      "Premium cotton canvas",
      "Solid wood stretcher bars",
      "Museum-quality print",
      "Protective coating",
      "Free shipping",
    ],
    cta: "Order Print",
    gradient: "from-gray-800 to-gray-900",
    bgGradient: "from-gray-50 to-gray-100/50",
    highlight: false,
  },
  {
    id: "canvas-medium",
    badge: "Best Value",
    title: 'Canvas Print 16×24"',
    subtitle: "Our most popular print size",
    price: "$79",
    priceNote: "",
    features: [
      "Premium cotton canvas",
      "Solid wood stretcher bars",
      "Museum-quality print",
      "Protective UV coating",
      "Free express shipping",
    ],
    cta: "Order Print",
    gradient: "from-violet-600 to-purple-700",
    bgGradient: "from-violet-50 to-purple-50/50",
    highlight: true,
  },
  {
    id: "canvas-large",
    badge: null,
    title: 'Canvas Print 24×36"',
    subtitle: "Statement piece for large spaces",
    price: "$129",
    priceNote: "",
    features: [
      "Premium cotton canvas",
      "Heavy-duty stretcher bars",
      "Museum-quality print",
      "Protective UV coating",
      "Free express shipping",
    ],
    cta: "Order Print",
    gradient: "from-gray-800 to-gray-900",
    bgGradient: "from-gray-50 to-gray-100/50",
    highlight: false,
  },
]

export default function ProductUpsellSection() {
  return (
    <section id="product-upsell" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-linevibes-blue/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl" />
      </div>

      <div className="content-container">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-linevibes-blue font-semibold text-sm tracking-widest uppercase">
            Get Your Artwork
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-3">
            Choose Your Format
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-base md:text-lg">
            Download instantly or order a stunning canvas print delivered to your door.
          </p>
        </div>

        {/* Product cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className={`
                relative rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1
                ${
                  product.highlight
                    ? "border-linevibes-blue/20 shadow-xl shadow-linevibes-blue/5"
                    : "border-gray-200 shadow-sm hover:shadow-lg"
                }
              `}
            >
              {/* Badge */}
              {product.badge && (
                <div
                  className={`absolute top-0 left-0 right-0 text-center text-xs font-bold text-white py-1.5 bg-gradient-to-r ${product.gradient}`}
                >
                  {product.badge}
                </div>
              )}

              <div className={`p-6 md:p-7 ${product.badge ? "pt-10" : ""} bg-gradient-to-b ${product.bgGradient}`}>
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900">
                  {product.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{product.subtitle}</p>

                {/* Price */}
                <div className="mt-5 mb-6">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {product.price}
                  </span>
                  {product.priceNote && (
                    <span className="text-gray-400 text-lg ml-1">
                      {product.priceNote}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-7">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-emerald-500 flex-shrink-0"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`
                    w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200
                    ${
                      product.highlight
                        ? `bg-gradient-to-r ${product.gradient} text-white shadow-lg hover:shadow-xl hover:opacity-90`
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }
                  `}
                >
                  {product.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bundle banner */}
        <div className="mt-10 bg-gradient-to-r from-linevibes-blue/10 via-indigo-50 to-violet-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-linevibes-blue/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🎁</span>
              <h3 className="text-lg font-bold text-gray-900">
                Bundle & Save 25%
              </h3>
            </div>
            <p className="text-gray-500 text-sm">
              Get digital download + any canvas print together and save 25% on
              your total order.
            </p>
          </div>
          <button className="flex-shrink-0 bg-gradient-to-r from-linevibes-blue to-indigo-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
            Get Bundle Deal
          </button>
        </div>
      </div>
    </section>
  )
}
