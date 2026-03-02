"use client"

import React, { useState, useEffect, useRef } from "react"

interface Testimonial {
  id: number
  name: string
  avatar: string
  role: string
  rating: number
  text: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "SC",
    role: "Anniversary Gift",
    rating: 5,
    text: "I uploaded our engagement photo and the continuous line style was breathtaking. My husband cried when he saw the canvas. It's now the centerpiece of our living room.",
  },
  {
    id: 2,
    name: "Marcus Rivera",
    avatar: "MR",
    role: "Memorial Portrait",
    rating: 5,
    text: "Created a line portrait of my grandmother from an old photo. The faceless minimal style captured her essence so beautifully. A truly timeless piece of art.",
  },
  {
    id: 3,
    name: "Emily Thompson",
    avatar: "ET",
    role: "Pet Portrait",
    rating: 5,
    text: "The bold outline of my golden retriever is incredible! The lines are so clean and precise. I ordered the 24×36 canvas and the quality is gallery-level.",
  },
  {
    id: 4,
    name: "James Park",
    avatar: "JP",
    role: "Business Branding",
    rating: 5,
    text: "Used the blueprint style for my startup's founder portraits. The commercial license and SVG output made it perfect for our website and marketing materials.",
  },
  {
    id: 5,
    name: "Aria Patel",
    avatar: "AP",
    role: "Wedding Gift",
    rating: 5,
    text: "Ordered line portraits for every table at our wedding reception. The guests were amazed! Fast turnaround and exceptional quality on every single print.",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < rating ? "#FBBF24" : "none"}
          stroke={i < rating ? "#FBBF24" : "#D1D5DB"}
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isAutoPlaying) return
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isAutoPlaying])

  const goTo = (idx: number) => {
    setCurrent(idx)
    setIsAutoPlaying(false)
    // Resume auto-play after 10s
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-gray-50">
      <div className="content-container">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-linevibes-blue font-semibold text-sm tracking-widest uppercase">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-3">
            Loved by Thousands
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-base md:text-lg">
            See what our customers are saying about their line portrait
            experience.
          </p>
        </div>

        {/* Testimonial slider */}
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-100 p-8 md:p-12">
            {/* Quote icon */}
            <div className="absolute top-6 right-8 text-6xl text-gray-100 font-serif leading-none select-none">
              &ldquo;
            </div>

            <div className="relative z-10">
              {/* Avatar & info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-linevibes-blue to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {testimonials[current].avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    {testimonials[current].name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {testimonials[current].role}
                  </p>
                </div>
                <div className="ml-auto">
                  <StarRating rating={testimonials[current].rating} />
                </div>
              </div>

              {/* Text */}
              <p className="text-gray-700 text-lg leading-relaxed italic">
                &ldquo;{testimonials[current].text}&rdquo;
              </p>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2.5 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`
                  h-2.5 rounded-full transition-all duration-300
                  ${
                    idx === current
                      ? "w-8 bg-linevibes-blue"
                      : "w-2.5 bg-gray-300 hover:bg-gray-400"
                  }
                `}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
