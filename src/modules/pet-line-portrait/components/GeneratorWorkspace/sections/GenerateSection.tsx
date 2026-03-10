import { ArrowRight, WandSparkles } from "lucide-react"

export default function GenerateSection({
  canGenerate,
  isGenerating,
  hasGeneratedResult,
  needsRegeneration,
  error,
  onGenerate,
}: {
  canGenerate: boolean
  isGenerating: boolean
  hasGeneratedResult: boolean
  needsRegeneration: boolean
  error?: string | null
  onGenerate: () => void
}) {
  const label = isGenerating
    ? "Generating..."
    : hasGeneratedResult && needsRegeneration
    ? "Regenerate Preview"
    : "Generate Preview"

  return (
    <div className="rounded-[30px] border border-stone-200 bg-stone-950 p-6 text-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-300">
            Generate Action
          </p>
          <h3 className="mt-2 text-2xl font-semibold">Create Preview</h3>
          <p className="mt-3 text-sm leading-7 text-stone-300">
            Generation only uses the cropped image and the selected style.
          </p>
        </div>
        <WandSparkles className="h-5 w-5 text-stone-300" />
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={!canGenerate || isGenerating}
        className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold transition ${
          !canGenerate || isGenerating
            ? "cursor-not-allowed bg-white/20 text-stone-300"
            : "bg-white text-stone-950 hover:bg-stone-100"
        }`}
      >
        {label}
        <ArrowRight className="h-4 w-4" />
      </button>

      {error ? <p className="mt-4 text-sm text-red-200">{error}</p> : null}
    </div>
  )
}
