"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"

type PortraitDownloadCardProps = {
  /** The order line item(s) that contain portrait metadata */
  items: HttpTypes.StoreOrderLineItem[]
  /** The order email (for display) */
  email: string
}

/**
 * Displays a download card on the order confirmed page for portrait orders.
 * 
 * This component checks line item metadata for `portrait_image_url` and
 * `includes_digital_download` to display download buttons.
 * 
 * All portrait variants (Digital, Print, Canvas) include digital download,
 * so this card appears for ANY portrait order.
 */
export default function PortraitDownloadCard({
  items,
  email,
}: PortraitDownloadCardProps) {
  // Filter items that are portrait products with download access
  const portraitItems = items.filter(
    (item) =>
      item.metadata?.includes_digital_download === "true" &&
      item.metadata?.portrait_image_url
  )

  if (portraitItems.length === 0) return null

  return (
    <div
      className="w-full rounded-2xl overflow-hidden border border-linevibes-blue/15 shadow-sm"
      data-testid="portrait-download-card"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-linevibes-blue to-indigo-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-bold text-base">
              Your Digital Files Are Ready
            </h3>
            <p className="text-white/70 text-xs mt-0.5">
              Download links have also been sent to {email}
            </p>
          </div>
        </div>
      </div>

      {/* Download items */}
      <div className="bg-white p-6 space-y-4">
        {portraitItems.map((item, idx) => {
          const imageUrl = item.metadata?.portrait_image_url as string
          const variantType = (item.metadata?.variant_type as string) || "digital"
          const style = (item.metadata?.portrait_style as string) || ""

          return (
            <div
              key={item.id || idx}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100"
            >
              {/* Thumbnail */}
              <div className="w-16 h-20 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Your line portrait"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  Line Portrait
                  {style && (
                    <span className="text-gray-400 font-normal ml-1">
                      · {style}
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {variantType === "digital"
                    ? "Digital Download"
                    : variantType === "print"
                    ? "Art Print + Digital Download"
                    : "Canvas Frame + Digital Download"}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    PNG 4K
                  </span>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    SVG
                  </span>
                </div>
              </div>

              {/* Download buttons */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                {imageUrl && (
                  <a
                    href={imageUrl}
                    download={`line-portrait-${item.metadata?.portrait_session_id || "download"}.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-linevibes-blue text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                    data-testid="download-png-button"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    PNG
                  </a>
                )}
                {imageUrl && (
                  <a
                    href={imageUrl.replace(/\.png$/i, ".svg")}
                    download={`line-portrait-${item.metadata?.portrait_session_id || "download"}.svg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors"
                    data-testid="download-svg-button"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    SVG
                  </a>
                )}
              </div>
            </div>
          )
        })}

        {/* Additional info */}
        <div className="flex items-start gap-2.5 pt-2 text-gray-400">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="flex-shrink-0 mt-0.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p className="text-xs leading-relaxed">
            Download links are also available in your order confirmation email.
            Links expire in 30 days. Contact us if you need them re-sent.
          </p>
        </div>
      </div>
    </div>
  )
}
