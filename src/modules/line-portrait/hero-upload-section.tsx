"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getHistory, saveToHistory, type PortraitHistoryEntry } from "@lib/portrait-history"

/* ───────── Generation Status Types ───────── */
type GenerationStatus = "idle" | "uploading" | "generating" | "completed" | "error"

/* ───────── Before / After Slider ───────── */
function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sliderPos, setSliderPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      let pos = ((clientX - rect.left) / rect.width) * 100
      pos = Math.max(2, Math.min(98, pos))
      setSliderPos(pos)
    },
    []
  )

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    handleMove(e.clientX)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }
  const onPointerUp = () => setIsDragging(false)

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/5] max-w-[480px] mx-auto rounded-2xl overflow-hidden cursor-col-resize select-none group shadow-2xl"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* After (line art) – full background */}
      <img
        src="/images/line-portrait/portrait-after.png"
        alt="Line portrait result"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Before (photo) – clipped */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src="/images/line-portrait/portrait-before.png"
          alt="Original portrait photo"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: `${100 / (sliderPos / 100)}%`, maxWidth: "none" }}
          draggable={false}
        />
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-[3px] bg-white/90 backdrop-blur-sm z-10 transition-shadow"
        style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
      >
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-white/50 backdrop-blur-md">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 4L2 10L6 16" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 4L18 10L14 16" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm z-20">
        PHOTO
      </div>
      <div className="absolute top-4 right-4 bg-white/80 text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm z-20">
        LINE ART
      </div>
    </div>
  )
}

/* ───────── Upload Drop Zone ───────── */
function UploadDropZone({
  onFileSelect,
  isDisabled,
}: {
  onFileSelect: (file: File) => void
  isDisabled?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return
    if (file.size > 15 * 1024 * 1024) {
      alert("File size must be under 15MB")
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    onFileSelect(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (isDisabled) return
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!isDisabled) setIsDragOver(true)
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={() => setIsDragOver(false)}
      onClick={() => !isDisabled && inputRef.current?.click()}
      className={`
        relative w-full max-w-[480px] mx-auto aspect-[4/5] rounded-2xl border-2 border-dashed
        flex flex-col items-center justify-center gap-4
        transition-all duration-300 group
        ${isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
        ${
          isDragOver
            ? "border-linevibes-blue bg-linevibes-blue/5 scale-[1.02]"
            : preview
            ? "border-transparent bg-gray-50"
            : "border-gray-300 bg-gray-50/50 hover:border-linevibes-blue/50 hover:bg-linevibes-blue/5"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={isDisabled}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      {preview ? (
        <>
          <img
            src={preview}
            alt="Uploaded preview"
            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
          />
          {!isDisabled && (
            <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white font-semibold text-sm bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full">
                Change Photo
              </span>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Upload icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-linevibes-blue/10 to-linevibes-blue/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-linevibes-blue"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div className="text-center px-6">
            <p className="text-gray-800 font-semibold text-base">
              Drop your photo here
            </p>
            <p className="text-gray-500 text-sm mt-1">
              or <span className="text-linevibes-blue underline">browse files</span>
            </p>
          </div>
          <div className="flex gap-2 text-[11px] text-gray-400">
            <span className="bg-gray-100 px-2 py-0.5 rounded">JPG</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded">PNG</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded">WEBP</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded">≤15MB</span>
          </div>
        </>
      )}
    </div>
  )
}

/* ───────── Feature Pills ───────── */
const pills = [
  { icon: "⚡", text: "Instant AI Generation" },
  { icon: "🖼️", text: "High-Resolution Download" },
  { icon: "🎨", text: "Print-Ready Artwork" },
  { icon: "🔒", text: "100% Private Processing" },
]

function FeaturePills() {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-8">
      {pills.map((pill) => (
        <div
          key={pill.text}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-full px-4 py-2 text-sm text-gray-700 shadow-sm hover:shadow-md hover:border-linevibes-blue/30 transition-all duration-200"
        >
          <span className="text-base">{pill.icon}</span>
          <span className="font-medium">{pill.text}</span>
        </div>
      ))}
    </div>
  )
}

/* ───────── Generation Progress Overlay ───────── */
function GenerationOverlay({ status, errorMessage }: { status: GenerationStatus; errorMessage?: string }) {
  if (status === "idle") return null

  const statusConfig: Record<string, { icon: string; title: string; subtitle: string; color: string }> = {
    uploading: {
      icon: "☁️",
      title: "Uploading your photo...",
      subtitle: "Securely transferring to our servers",
      color: "from-blue-500 to-indigo-600",
    },
    generating: {
      icon: "✨",
      title: "Creating your line portrait...",
      subtitle: "Our AI is transforming your photo into art. This may take 30–60 seconds.",
      color: "from-indigo-500 to-purple-600",
    },
    completed: {
      icon: "🎉",
      title: "Portrait complete!",
      subtitle: "Redirecting you to your artwork...",
      color: "from-green-500 to-emerald-600",
    },
    error: {
      icon: "😕",
      title: "Something went wrong",
      subtitle: errorMessage || "Please try uploading again.",
      color: "from-red-500 to-rose-600",
    },
  }

  const config = statusConfig[status]
  if (!config) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300">
        {/* Icon */}
        <div className="text-5xl mb-4 animate-bounce">{config.icon}</div>

        {/* Progress bar */}
        {(status === "uploading" || status === "generating") && (
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
            <div
              className={`h-full bg-gradient-to-r ${config.color} rounded-full transition-all duration-1000`}
              style={{
                width: status === "uploading" ? "30%" : "75%",
                animation: "progress-pulse 2s ease-in-out infinite",
              }}
            />
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{config.title}</h3>
        <p className="text-sm text-gray-500">{config.subtitle}</p>

        {/* Cancel hint for errors */}
        {status === "error" && (
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes progress-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}

/* ───────── Style Selector (inline compact) ───────── */
const STYLES = [
  { id: "classic", label: "Classic", emoji: "✏️" },
  { id: "bold", label: "Bold", emoji: "🖊️" },
  { id: "detailed", label: "Detailed", emoji: "🔍" },
  { id: "artistic", label: "Artistic", emoji: "🎨" },
  { id: "minimal", label: "Minimal", emoji: "〰️" },
]

/* ───────── Main Hero Section ───────── */
export default function HeroUploadSection() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedStyle, setSelectedStyle] = useState("classic")
  const [genStatus, setGenStatus] = useState<GenerationStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string>()
  const router = useRouter()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "us"

  // ─── Generate Handler ──────────────────────────────
  const handleGenerate = useCallback(async () => {
    if (!uploadedFile) return

    try {
      setGenStatus("uploading")
      setErrorMessage(undefined)

      // Build FormData
      const formData = new FormData()
      formData.append("photo", uploadedFile)
      formData.append("style", selectedStyle)

      setGenStatus("generating")

      // Call API
      const response = await fetch("/api/portrait/generate", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Generation failed")
      }

      setGenStatus("completed")

      // Save to history so user can find this portrait later
      saveToHistory({
        sessionId: data.sessionId,
        portraitUrl: data.portraitUrl,
        originalUrl: data.originalUrl,
        style: selectedStyle,
        createdAt: new Date().toISOString(),
      })

      // Redirect to result page after a brief pause
      setTimeout(() => {
        router.push(`/${countryCode}/portrait/result?sid=${data.sessionId}`)
      }, 1500)
    } catch (error: any) {
      console.error("[Generate] Error:", error)
      setGenStatus("error")
      setErrorMessage(error.message || "An unexpected error occurred")
    }
  }, [uploadedFile, selectedStyle, router, countryCode])

  return (
    <>
      {/* Generation overlay */}
      <GenerationOverlay status={genStatus} errorMessage={errorMessage} />

      <section
        id="hero-upload"
        className="relative min-h-[90vh] flex items-center overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30" />
          {/* Animated grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,87,217,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,87,217,0.3) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
          {/* Floating orbs */}
          <div className="absolute top-20 right-20 w-72 h-72 bg-linevibes-blue/5 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="content-container py-16 md:py-24">
          {/* Headline */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-linevibes-blue/10 text-linevibes-blue text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-linevibes-blue rounded-full animate-pulse" />
              AI-Powered Line Art Generator
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
              Turn Your Photo into a{" "}
              <span className="bg-gradient-to-r from-linevibes-blue via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Timeless Line Portrait
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 mt-4 max-w-2xl mx-auto font-light">
              Upload. Choose Style. Download. Print.
            </p>
          </div>

          {/* Two-column: Slider + Upload */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
            {/* Left: Before / After */}
            <div>
              <BeforeAfterSlider />
              <p className="text-center text-sm text-gray-400 mt-4 italic">
                Drag the slider to compare
              </p>
            </div>

            {/* Right: Upload */}
            <div>
              <UploadDropZone
                onFileSelect={setUploadedFile}
                isDisabled={genStatus !== "idle" && genStatus !== "error"}
              />

              {/* Style selector + Generate button */}
              {uploadedFile && genStatus === "idle" && (
                <div className="mt-6 space-y-4">
                  {/* Style chips */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {STYLES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedStyle(s.id)}
                        className={`
                          flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
                          transition-all duration-200 border
                          ${
                            selectedStyle === s.id
                              ? "bg-linevibes-blue text-white border-linevibes-blue shadow-md shadow-linevibes-blue/20"
                              : "bg-white text-gray-600 border-gray-200 hover:border-linevibes-blue/40 hover:text-gray-900"
                          }
                        `}
                      >
                        <span>{s.emoji}</span>
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Generate button */}
                  <div className="flex justify-center">
                    <button
                      onClick={handleGenerate}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-linevibes-blue to-indigo-600 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-linevibes-blue/25 hover:shadow-xl hover:shadow-linevibes-blue/30 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      ✨ Generate Line Portrait
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Feature Pills */}
          <FeaturePills />

          {/* Recent Portraits */}
          <RecentPortraits countryCode={countryCode} />
        </div>
      </section>
    </>
  )
}

/* ───────── Recent Portraits ───────── */
function RecentPortraits({ countryCode }: { countryCode: string }) {
  const [history, setHistory] = useState<PortraitHistoryEntry[]>([])

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  if (history.length === 0) return null

  return (
    <div className="mt-16 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gray-200" />
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Your Recent Portraits
        </h3>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {history.map((entry) => (
          <a
            key={entry.sessionId}
            href={`/${countryCode}/portrait/result?sid=${entry.sessionId}`}
            className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 hover:border-linevibes-blue/40 hover:shadow-lg transition-all duration-300"
          >
            <img
              src={entry.portraitUrl}
              alt={`Portrait – ${entry.style}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <span className="text-white text-xs font-semibold capitalize">
                {entry.style}
              </span>
              <span className="text-white/70 text-[10px]">
                {new Date(entry.createdAt).toLocaleDateString()}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
