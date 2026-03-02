import React from "react"

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
    title: "Multiple Artistic Styles",
    description:
      "Choose from 5+ curated styles — each designed for distinct emotional expression and visual impact.",
    gradient: "from-rose-500 to-pink-400",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="14 2 14 8 20 8" />
        <path d="M20 8v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8l6 6z" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
    title: "Vector-Ready Output",
    description:
      "Get clean, scalable SVG files perfect for printing at any size without quality loss.",
    gradient: "from-violet-500 to-indigo-400",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Instant Preview",
    description:
      "See a watermarked preview in seconds. No waiting, no guessing — know exactly what you&apos;ll get.",
    gradient: "from-amber-500 to-yellow-400",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Secure & Private",
    description:
      "Your photos are processed in a secure environment. Original images are deleted after 24 hours.",
    gradient: "from-emerald-500 to-green-400",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Commercial License",
    description:
      "Use your line portraits commercially — on merchandise, marketing materials, or resale prints.",
    gradient: "from-linevibes-blue to-cyan-400",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="3" width="12" height="18" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    title: "Print-Ready Quality",
    description:
      "4K resolution PNG files optimized for professional canvas and giclée printing up to 36 inches.",
    gradient: "from-sky-500 to-blue-400",
  },
]

export default function KeyFeaturesSection() {
  return (
    <section id="key-features" className="py-20 md:py-28 bg-gray-50">
      <div className="content-container">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-linevibes-blue font-semibold text-sm tracking-widest uppercase">
            Why LineVibes
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-3">
            Everything You Need
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-base md:text-lg">
            Professional-grade line art creation tools built for everyone.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-2xl p-7 md:p-8 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div
                  className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
