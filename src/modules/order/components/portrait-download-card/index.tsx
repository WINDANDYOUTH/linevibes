"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"
import { getPortraitLineItemMetadata } from "@lib/util/portrait-line-item-metadata"

type PortraitDownloadCardProps = {
  items: HttpTypes.StoreOrderLineItem[]
  email: string
  deliveryUrls?: Record<string, string>
}

function formatStyleLabel(style: string | null) {
  if (!style) {
    return ""
  }

  return style
    .split(/[-_]/)
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ")
}

export default function PortraitDownloadCard({
  items,
  email,
  deliveryUrls = {},
}: PortraitDownloadCardProps) {
  const portraitItems = items
    .map((item) => ({
      item,
      portraitMeta: getPortraitLineItemMetadata(
        item.metadata as Record<string, unknown> | undefined
      ),
    }))
    .filter(
      ({ portraitMeta }) =>
        portraitMeta.includesDigitalDownload && !!portraitMeta.portraitImageUrl
    )

  if (portraitItems.length === 0) {
    return null
  }

  return (
    <div
      className="w-full overflow-hidden rounded-2xl border border-linevibes-blue/15 shadow-sm"
      data-testid="portrait-download-card"
    >
      <div className="bg-gradient-to-r from-linevibes-blue to-indigo-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
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
            <h3 className="text-base font-bold text-white">
              Your Digital Files Are Ready
            </h3>
            <p className="mt-0.5 text-xs text-white/70">
              Download links have also been sent to {email}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 bg-white p-6">
        {portraitItems.map(({ item, portraitMeta }, idx) => {
          const sessionId = portraitMeta.portraitSessionId
          const imageUrl = portraitMeta.portraitImageUrl as string
          const downloadUrl =
            (sessionId ? deliveryUrls[sessionId] : null) ?? imageUrl
          const svgUrl = portraitMeta.portraitSvgUrl
          const variantType = portraitMeta.variantType || "digital"
          const styleLabel = formatStyleLabel(portraitMeta.portraitStyle)

          return (
            <div
              key={item.id || idx}
              className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
                <img
                  src={downloadUrl}
                  alt="Your line portrait"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  Line Portrait
                  {styleLabel && (
                    <span className="ml-1 font-normal text-gray-400">
                      - {styleLabel}
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {variantType === "digital"
                    ? "Digital Download"
                    : variantType === "print"
                    ? "Art Print + Digital Download"
                    : "Canvas Frame + Digital Download"}
                </p>
                <div className="mt-1 flex items-center gap-3">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-400">
                    PNG 4K
                  </span>
                  {svgUrl && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-400">
                      SVG
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-shrink-0 flex-col gap-2">
                <a
                  href={downloadUrl}
                  download={`line-portrait-${
                    sessionId || "download"
                  }.png`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-linevibes-blue px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                  data-testid="download-png-button"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  PNG
                </a>
                {svgUrl && (
                  <a
                    href={svgUrl}
                    download={`line-portrait-${
                      sessionId || "download"
                    }.svg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-800"
                    data-testid="download-svg-button"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
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

        <div className="flex items-start gap-2.5 pt-2 text-gray-400">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mt-0.5 flex-shrink-0"
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
