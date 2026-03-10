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
    <div className="rounded-[24px] bg-white p-1 xl:rounded-[30px] xl:border xl:border-stone-200 xl:bg-[#faf8f3] xl:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
            Style Options
          </p>
          <h3 className="mt-2 text-xl font-semibold text-stone-950 xl:text-2xl">
            Pick a Portrait Style
          </h3>
        </div>
        <Sparkles className="h-5 w-5 text-stone-400" />
      </div>

      <div className="mt-5 xl:mt-6">
        <StyleCarousel
          styles={styles}
          selectedStyleId={selectedStyleId}
          onSelect={onSelectStyle}
        />
      </div>
    </div>
  )
}
