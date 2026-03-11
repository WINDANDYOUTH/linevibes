import { Ruler } from "lucide-react"

import { SIZE_OPTIONS } from "../../../config/product-options"
import type { SizeOption } from "../../../types/generator"

function sizeFigureClass(value: SizeOption) {
  switch (value) {
    case "small":
      return "h-10 w-8 md:h-12 md:w-10"
    case "large":
      return "h-16 w-[52px] md:h-20 md:w-16"
    default:
      return "h-14 w-10 md:h-16 md:w-12"
  }
}

export default function SizeSection({
  value,
  onChange,
}: {
  value: SizeOption
  onChange: (value: SizeOption) => void
}) {
  return (
    <div className="rounded-[18px] bg-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
            Size
          </p>
          <h3 className="mt-2 text-lg font-semibold text-stone-950 md:text-xl">
            Choose a print size
          </h3>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            Pick the final print dimensions for your wall space.
          </p>
        </div>
        <Ruler className="h-5 w-5 text-stone-400" />
      </div>

      <div className="-mx-3 mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-5 md:grid md:grid-cols-3 md:gap-3 md:overflow-visible md:px-0 md:pb-0">
        {SIZE_OPTIONS.map((option) => {
          const isSelected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`min-w-[148px] max-w-[148px] shrink-0 snap-start overflow-hidden rounded-[14px] border text-left transition md:min-w-0 md:max-w-none md:rounded-[18px] md:p-3 ${
                isSelected
                  ? "border-[#2f80ed] bg-[#f4f8ff] shadow-[0_10px_24px_rgba(47,128,237,0.12)]"
                  : "border-stone-200 bg-[#faf8f3] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.05)]"
              }`}
            >
              <div className="flex aspect-[3/4] items-end justify-center bg-[#f5f1e8] px-3 pb-3 pt-2.5 md:aspect-[4/5] md:rounded-[14px] md:border md:border-stone-200 md:px-4 md:pb-4 md:pt-3">
                <div className="flex items-end gap-1.5 md:gap-2">
                  <div className="h-8 w-4 rounded-t-full bg-stone-900/90 md:h-10 md:w-5" />
                  <div className="relative flex items-end justify-center">
                    <div
                      className={`${sizeFigureClass(
                        option.value
                      )} rounded-[10px] border-2 border-stone-700 bg-white`}
                    />
                    <div className="absolute bottom-[-4px] h-2 w-[120%] rounded-full bg-stone-300/70 blur-[1px]" />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 px-2.5 py-2 md:mt-3 md:px-0 md:py-0 md:gap-3">
                <span
                  className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border md:mt-1 md:h-[18px] md:w-[18px] ${
                    isSelected
                      ? "border-[#2f80ed] shadow-[inset_0_0_0_4px_#2f80ed]"
                      : "border-stone-300"
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-950 md:text-sm">
                    {option.label}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-4 text-stone-500 md:mt-1 md:text-[12px] md:leading-5">
                    {option.dimensions}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
