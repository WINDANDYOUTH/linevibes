import { ArrowRight, Sparkles } from "lucide-react"

import type { PortraitStyle } from "../../../types/generator"
import StyleCarousel from "../controls/StyleCarousel"

export default function StyleSection({
  styles,
  selectedStyleId,
  onSelectStyle,
  canGenerate,
  isGenerating,
  hasGeneratedResult,
  needsRegeneration,
  generationError,
  onGenerate,
}: {
  styles: PortraitStyle[]
  selectedStyleId: string | null
  onSelectStyle: (styleId: string) => void
  canGenerate: boolean
  isGenerating: boolean
  hasGeneratedResult: boolean
  needsRegeneration: boolean
  generationError: string | null
  onGenerate: () => void
}) {
  const buttonLabel = isGenerating
    ? "Generating"
    : hasGeneratedResult && needsRegeneration
    ? "Generate Portrait"
    : "Generate Portrait"

  return (
    <div className="rounded-[18px] bg-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="hidden text-xs font-semibold uppercase tracking-[0.24em] text-stone-400 md:block">
            Style
          </p>
          <h3 className="text-lg font-semibold text-stone-950 md:mt-2 md:text-xl">
            Choose a portrait style
          </h3>
          <p className="mt-2 hidden text-sm leading-6 text-stone-500 md:block">
            Select the look first, then click Generate to apply it to the AI
            preview.
          </p>
        </div>
        <Sparkles className="mt-1 hidden h-5 w-5 text-stone-400 md:block" />
      </div>

      <div className="mt-4 md:mt-5">
        <StyleCarousel
          styles={styles}
          selectedStyleId={selectedStyleId}
          onSelect={onSelectStyle}
        />
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={!canGenerate || isGenerating}
        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[10px] px-4 py-3 text-sm font-semibold transition ${
          !canGenerate || isGenerating
            ? "cursor-not-allowed bg-[#cfd8e6] text-white/90"
            : "bg-[#2f80ed] text-white hover:bg-[#226fd7]"
        }`}
      >
        {buttonLabel}
        <ArrowRight className="h-4 w-4" />
      </button>

      {needsRegeneration ? (
        <p className="mt-3 text-sm text-amber-700">
          The preview is out of date. Generate again to apply the current crop
          or style.
        </p>
      ) : null}

      {generationError ? (
        <p className="mt-3 text-sm text-red-600">{generationError}</p>
      ) : null}
    </div>
  )
}
