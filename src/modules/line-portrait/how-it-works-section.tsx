import React from "react"

const steps = [
  {
    number: "01",
    title: "Upload Your Photo",
    description:
      "Drag & drop or browse to upload any portrait photo. We support JPG, PNG, and WEBP up to 15MB.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    number: "02",
    title: "Choose a Style",
    description:
      "Pick from 5 unique artistic styles — from faceless minimal to bold outline and blueprint.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
    gradient: "from-violet-500 to-purple-400",
  },
  {
    number: "03",
    title: "AI Generates Artwork",
    description:
      "Our AI engine transforms your photo into stunning line art in seconds. Preview instantly.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    gradient: "from-amber-500 to-orange-400",
  },
  {
    number: "04",
    title: "Download or Print",
    description:
      "Get your high-res 4K PNG or SVG file, or order a beautiful canvas print delivered to your door.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    gradient: "from-emerald-500 to-teal-400",
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-linevibes-blue/3 to-purple-200/5 rounded-full blur-3xl" />
      </div>

      <div className="content-container">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-linevibes-blue font-semibold text-sm tracking-widest uppercase">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-3">
            Four Simple Steps
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-base md:text-lg">
            From photo to artwork in minutes. No design skills needed.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative group">
              {/* Connector line (desktop) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] right-[-40%] h-[2px] bg-gradient-to-r from-gray-200 to-gray-100 z-0" />
              )}

              <div className="relative z-10 text-center lg:text-left">
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} text-white shadow-lg mb-6 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300`}
                >
                  {step.icon}
                </div>

                {/* Step number */}
                <div className="text-xs font-bold text-gray-300 tracking-[0.2em] uppercase mb-2">
                  Step {step.number}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
