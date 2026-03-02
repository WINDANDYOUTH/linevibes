"use client"

import React, { useState } from "react"

interface GalleryItem {
  id: number
  src: string
  alt: string
  style: string
  span: "tall" | "wide" | "normal"
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: "/images/line-portrait/style-faceless.png",
    alt: "Faceless minimal portrait",
    style: "Faceless Minimal",
    span: "tall",
  },
  {
    id: 2,
    src: "/images/line-portrait/style-continuous-line.png",
    alt: "Continuous line portrait",
    style: "Continuous Line",
    span: "normal",
  },
  {
    id: 3,
    src: "/images/line-portrait/gallery-couple.png",
    alt: "Couple line art",
    style: "Couple Portrait",
    span: "normal",
  },
  {
    id: 4,
    src: "/images/line-portrait/style-bold-outline.png",
    alt: "Bold outline portrait",
    style: "Bold Outline",
    span: "tall",
  },
  {
    id: 5,
    src: "/images/line-portrait/style-blueprint.png",
    alt: "Blueprint style portrait",
    style: "Blueprint",
    span: "normal",
  },
  {
    id: 6,
    src: "/images/line-portrait/gallery-pet.png",
    alt: "Pet line art",
    style: "Pet Portrait",
    span: "normal",
  },
  {
    id: 7,
    src: "/images/line-portrait/style-fisheye.png",
    alt: "Fisheye portrait",
    style: "Fisheye",
    span: "normal",
  },
  {
    id: 8,
    src: "/images/line-portrait/portrait-after.png",
    alt: "Classic line portrait",
    style: "Classic Line",
    span: "tall",
  },
]

export default function GalleryInspirationSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section id="gallery-inspiration" className="py-20 md:py-28 bg-gray-50">
      <div className="content-container">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-linevibes-blue font-semibold text-sm tracking-widest uppercase">
            Inspiration Gallery
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-3">
            See What&apos;s Possible
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-base md:text-lg">
            Every portrait tells a unique story. Browse our curated collection
            of AI-generated line art.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid group relative rounded-xl overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className={`${
                  item.span === "tall" ? "aspect-[3/4]" : "aspect-square"
                } overflow-hidden`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Hover overlay */}
              <div
                className={`
                  absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent 
                  flex items-end p-4 transition-opacity duration-300
                  ${hoveredId === item.id ? "opacity-100" : "opacity-0"}
                `}
              >
                <div>
                  <span className="text-white/60 text-xs font-medium uppercase tracking-wider">
                    Style
                  </span>
                  <p className="text-white font-semibold text-sm mt-0.5">
                    {item.style}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
