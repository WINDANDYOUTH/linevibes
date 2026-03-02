import React from "react"

export default function FinalCTASection() {
  return (
    <section id="final-cta" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-linevibes-dark to-gray-900" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linevibes-blue/10 rounded-full blur-[120px]" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="content-container relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-sm font-medium px-4 py-1.5 rounded-full mb-8 border border-white/10">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Start Creating Now
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Your Photo Deserves{" "}
            <span className="bg-gradient-to-r from-linevibes-blue via-cyan-400 to-violet-400 bg-clip-text text-transparent">
              to Be Art
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-white/50 text-lg md:text-xl mt-6 max-w-xl mx-auto leading-relaxed">
            Transform any portrait into a timeless line drawing. Upload your
            photo and see the magic in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <a
              href="#hero-upload"
              className="inline-flex items-center gap-3 bg-white text-gray-900 font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 text-lg group"
            >
              Upload Your Photo
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:translate-x-1 transition-transform"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a
              href="#gallery-inspiration"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium px-6 py-4 rounded-full border border-white/20 hover:border-white/40 transition-all duration-200"
            >
              View Gallery
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Secure Processing
            </div>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Instant Generation
            </div>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Privacy Protected
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
