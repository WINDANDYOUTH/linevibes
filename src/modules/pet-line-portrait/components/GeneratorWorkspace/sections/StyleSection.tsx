import { Sparkles } from "lucide-react"

import type { PortraitStyle } from "../../../types/generator"
import StyleCarousel from "../controls/StyleCarousel"

export default function StyleSection({
  styles,
  selectedStyleId,
  onSelectStyle,
}: {
  styles: PortraitStyle[]
  selectedStyleId: string | null
  onSelectStyle: (styleId: string) => void
}) {
  return (
    <div className="rounded-[30px] border border-stone-200 bg-[#faf8f3] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
            Style Options
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-stone-950">
            Pick a Portrait Style
          </h3>
        </div>
        <Sparkles className="h-5 w-5 text-stone-400" />
      </div>

      <div className="mt-6">
        <StyleCarousel
          styles={styles}
          selectedStyleId={selectedStyleId}
          onSelect={onSelectStyle}
        />
      </div>
    </div>
  )
}
