"use client"

import React, { useState } from "react"

interface StyleOption {
  id: string
  name: string
  description: string
  image: string
  accent: string
}

const styles: StyleOption[] = [
  {
    id: "s01",
    name: "Faceless Minimal",
    description:
      "Ultra-clean silhouette with no facial features. Pure form, pure emotion.",
    image: "/images/line-portrait/style-faceless.png",
    accent: "from-rose-500 to-orange-400",
  },
  {
    id: "s02",
    name: "Continuous Line",
    description:
      "One unbroken flowing line creates the entire portrait. Elegant and artistic.",
    image: "/images/line-portrait/style-continuous-line.png",
    accent: "from-violet-500 to-purple-400",
  },
  {
    id: "s03",
    name: "Bold Outline",
    description:
      "Thick uniform strokes for a powerful, graphic poster-like result.",
    image: "/images/line-portrait/style-bold-outline.png",
    accent: "from-linevibes-blue to-cyan-400",
  },
  {
    id: "s04",
    name: "Blueprint",
    description:
      "Technical drawing style with a deep blue background and white contour lines.",
    image: "/images/line-portrait/style-blueprint.png",
    accent: "from-blue-700 to-sky-500",
  },
  {
    id: "s05",
    name: "Fisheye Portrait",
    description:
      "Subtle barrel distortion adds a unique, contemporary perspective to your portrait.",
    image: "/images/line-portrait/style-fisheye.png",
    accent: "from-emerald-500 to-teal-400",
  },
]

function StyleCard({
  style,
  isSelected,
  onSelect,
}: {
  style: StyleOption
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      id={`style-card-${style.id}`}
      onClick={onSelect}
      className={`
        relative group rounded-2xl overflow-hidden text-left transition-all duration-300 
        ${
          isSelected
            ? "ring-2 ring-linevibes-blue ring-offset-2 scale-[1.02] shadow-xl"
            : "hover:scale-[1.02] hover:shadow-lg shadow-sm"
        }
      `}
    >
      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={style.image}
          alt={style.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
        <div
          className={`inline-block w-8 h-1 rounded-full bg-gradient-to-r ${style.accent} mb-2`}
        />
        <h3 className="text-white font-bold text-base md:text-lg">
          {style.name}
        </h3>
        <p className="text-white/70 text-xs md:text-sm mt-1 line-clamp-2 leading-relaxed">
          {style.description}
        </p>
      </div>

      {/* Selected check */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-8 h-8 bg-linevibes-blue rounded-full flex items-center justify-center shadow-lg animate-[scaleIn_0.2s_ease-out]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
    </button>
  )
}

export default function StyleSelectorSection() {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)

  return (
    <section
      id="style-selector"
      className="py-20 md:py-28 bg-white relative overflow-hidden"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="content-container">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-linevibes-blue font-semibold text-sm tracking-widest uppercase">
            Choose Your Style
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-3">
            5 Unique Artistic Styles
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-base md:text-lg">
            Each style tells a different story. Pick the one that resonates with
            you.
          </p>
        </div>

        {/* Style grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {styles.map((style) => (
            <StyleCard
              key={style.id}
              style={style}
              isSelected={selectedStyle === style.id}
              onSelect={() => setSelectedStyle(style.id)}
            />
          ))}
        </div>

        {/* Generate CTA */}
        {selectedStyle && (
          <div className="flex justify-center mt-10 animate-fade-in-top">
            <button
              id="generate-preview-btn"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-linevibes-blue to-indigo-600 text-white font-semibold px-10 py-4 rounded-full shadow-lg shadow-linevibes-blue/25 hover:shadow-xl hover:shadow-linevibes-blue/35 hover:-translate-y-0.5 transition-all duration-200 text-lg"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Generate Preview
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
