"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type PortraitEntry = {
  sessionId: string
  status: string
  style: string
  originalUrl: string | null
  portraitUrl: string | null
  createdAt: string
  expiresAt: string
}

export default function MyPortraitsTemplate() {
  const [portraits, setPortraits] = useState<PortraitEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { countryCode } = useParams() as { countryCode: string }

  useEffect(() => {
    async function fetchPortraits() {
      try {
        const res = await fetch("/api/portrait/my-portraits")
        if (!res.ok) {
          if (res.status === 401) {
            setError("Please log in to view your portraits.")
          } else {
            setError("Failed to load portraits.")
          }
          return
        }
        const data = await res.json()
        setPortraits(data.portraits || [])
      } catch {
        setError("Failed to load portraits.")
      } finally {
        setLoading(false)
      }
    }
    fetchPortraits()
  }, [])

  return (
    <div className="w-full" data-testid="my-portraits-page">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">My Portraits</h1>
        <p className="text-base-regular text-ui-fg-subtle">
          View all your AI-generated line portraits. Click any portrait to
          revisit, customize, or purchase.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            <span className="text-sm text-gray-500">Loading your portraits...</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <span className="text-4xl block mb-3">😕</span>
            <p className="text-gray-500">{error}</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && portraits.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="text-5xl mb-4">🎨</span>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            No portraits yet
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
            You haven&apos;t generated any line portraits yet. Upload a photo to create
            your first unique line art portrait!
          </p>
          <LocalizedClientLink
            href="/line-portrait"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors"
          >
            ✨ Create Your First Portrait
          </LocalizedClientLink>
        </div>
      )}

      {/* Portrait grid */}
      {!loading && !error && portraits.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {portraits.map((p) => (
            <LocalizedClientLink
              key={p.sessionId}
              href={`/portrait/result?sid=${p.sessionId}`}
              className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-300"
            >
              {p.portraitUrl ? (
                <img
                  src={p.portraitUrl}
                  alt={`Portrait – ${p.style}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-3xl">⏳</span>
                </div>
              )}

              {/* Info overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <span className="text-white text-xs font-semibold capitalize">
                  {p.style} style
                </span>
                <span className="text-white/70 text-[10px]">
                  {new Date(p.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Status badge for non-completed */}
              {p.status !== "completed" && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {p.status}
                </div>
              )}
            </LocalizedClientLink>
          ))}
        </div>
      )}

      {/* Generate more CTA */}
      {!loading && !error && portraits.length > 0 && (
        <div className="mt-8 text-center">
          <LocalizedClientLink
            href="/line-portrait"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 hover:border-gray-400 transition-all"
          >
            ✨ Generate Another Portrait
          </LocalizedClientLink>
        </div>
      )}
    </div>
  )
}
