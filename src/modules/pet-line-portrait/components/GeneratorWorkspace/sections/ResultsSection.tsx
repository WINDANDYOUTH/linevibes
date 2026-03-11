import { ArrowRight, RefreshCcw, Sparkles } from "lucide-react"

import type { GeneratedPortrait } from "../../../types/generator"

function formatDateLabel(value: string) {
  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return "Recent"
  }

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
}

export default function ResultsSection({
  portraits,
  activePortraitSessionId,
  canGenerate,
  isGenerating,
  onGenerateAnother,
  onSelectPortrait,
  onTryAnotherStyle,
}: {
  portraits: GeneratedPortrait[]
  activePortraitSessionId: string | null
  canGenerate: boolean
  isGenerating: boolean
  onGenerateAnother: () => void
  onSelectPortrait: (sessionId: string) => void
  onTryAnotherStyle: () => void
}) {
  return (
    <div className="rounded-[18px] bg-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
            Results
          </p>
          <h3 className="mt-2 text-lg font-semibold text-stone-950 md:text-xl">
            Choose your favorite portrait
          </h3>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            Keep the versions you like, compare them here, then continue with
            the one you want to personalize.
          </p>
        </div>
        <Sparkles className="mt-1 h-5 w-5 text-stone-400" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        {portraits.map((portrait) => {
          const isActive = portrait.sessionId === activePortraitSessionId

          return (
            <button
              key={portrait.sessionId}
              type="button"
              onClick={() => onSelectPortrait(portrait.sessionId)}
              className={`overflow-hidden rounded-[18px] border text-left transition ${
                isActive
                  ? "border-[#2f80ed] bg-[#f4f8ff] shadow-[0_16px_30px_rgba(47,128,237,0.14)]"
                  : "border-stone-200 bg-[#faf8f3] hover:-translate-y-0.5 hover:shadow-[0_16px_26px_rgba(15,23,42,0.06)]"
              }`}
            >
              <div className="bg-[linear-gradient(180deg,#f7f4ed_0%,#efebe2_100%)] p-3">
                <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[16px] border border-stone-200 bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={portrait.imageUrl}
                    alt="Generated pet portrait"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              <div className="flex items-start justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-stone-950">
                    {portrait.styleId
                      ? portrait.styleId
                          .split("-")
                          .map(
                            (token) =>
                              token.charAt(0).toUpperCase() + token.slice(1)
                          )
                          .join(" ")
                      : "Generated Portrait"}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    {formatDateLabel(portrait.generatedAt)}
                  </p>
                </div>
                <span
                  className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                    isActive
                      ? "bg-[#2f80ed] text-white"
                      : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {isActive ? "Selected" : "Select"}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={onGenerateAnother}
          disabled={!canGenerate || isGenerating}
          className={`inline-flex items-center justify-center gap-2 rounded-[12px] px-4 py-3 text-sm font-semibold transition ${
            !canGenerate || isGenerating
              ? "cursor-not-allowed bg-[#cfd8e6] text-white/90"
              : "bg-[#2f80ed] text-white hover:bg-[#226fd7]"
          }`}
        >
          <RefreshCcw className="h-4 w-4" />
          {isGenerating ? "Generating Another" : "Generate Another Variation"}
        </button>
        <button
          type="button"
          onClick={onTryAnotherStyle}
          className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
        >
          Try Another Style
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
