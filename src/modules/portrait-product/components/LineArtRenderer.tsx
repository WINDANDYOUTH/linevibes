"use client"

import React from "react"

type LineArtRendererProps = {
  /** URL of the user-generated portrait image */
  imageUrl: string
  /** Alt text for the image */
  alt?: string
  /** Optional CSS className override */
  className?: string
}

/**
 * Renders the user-generated line art portrait.
 * Simply displays the image in a clean, centered container.
 * Can be extended later for CSS filters (color tinting) or Canvas rendering.
 */
export default function LineArtRenderer({
  imageUrl,
  alt = "Your line portrait",
  className = "",
}: LineArtRendererProps) {
  return (
    <div
      className={`relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-black/5 bg-[linear-gradient(45deg,_#f3f4f6_25%,_transparent_25%),linear-gradient(-45deg,_#f3f4f6_25%,_transparent_25%),linear-gradient(45deg,_transparent_75%,_#f3f4f6_75%),linear-gradient(-45deg,_transparent_75%,_#f3f4f6_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0] ${className}`}
      data-testid="line-art-renderer"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-contain"
          loading="eager"
        />
      ) : (
        /* Placeholder when no image is available */
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            className="text-gray-300 mb-4"
          >
            <path
              d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M21 15l-5-5L5 21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-gray-400 text-sm">Portrait preview</p>
        </div>
      )}
    </div>
  )
}
