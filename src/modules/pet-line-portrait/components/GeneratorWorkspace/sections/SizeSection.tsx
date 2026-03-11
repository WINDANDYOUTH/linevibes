import { Ruler } from "lucide-react"

import { SIZE_OPTIONS } from "../../../config/product-options"
import type { SizeOption } from "../../../types/generator"

function sizeFigureClass(value: SizeOption) {
  switch (value) {
    case "small":
      return "h-12 w-10"
    case "large":
      return "h-20 w-16"
    default:
      return "h-16 w-12"
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
    <div className="rounded-[24px] bg-white p-1 xl:rounded-[30px] xl:border xl:border-stone-200 xl:bg-[#faf8f3] xl:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
            Size Option
          </p>
          <h3 className="mt-2 text-xl font-semibold text-stone-950 xl:text-2xl">
            Choose a Size
          </h3>
          <p className="mt-3 text-sm leading-6 text-stone-600 xl:leading-7">
            Pick the final print dimensions for your wall space.
          </p>
        </div>
        <Ruler className="h-5 w-5 text-stone-400" />
      </div>

      <div className="-mx-1 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:mx-0 xl:mt-6 xl:grid xl:grid-cols-3 xl:overflow-visible xl:px-0 xl:pb-0">
        {SIZE_OPTIONS.map((option) => {
          const isSelected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`min-w-[132px] max-w-[132px] shrink-0 snap-start rounded-[22px] border p-3 text-left transition xl:min-w-0 xl:max-w-none xl:rounded-[24px] ${
                isSelected
                  ? "border-[#2f80d1] bg-white shadow-[0_10px_24px_rgba(47,128,209,0.14)] xl:border-stone-950 xl:shadow-sm"
                  : "border-stone-200 bg-white/70"
              }`}
            >
              <div className="flex aspect-[4/5] items-end justify-center rounded-[18px] border border-stone-200 bg-[#f5f1e8] px-4 pb-4 pt-3">
                <div className="flex items-end gap-2">
                  <div className="h-10 w-5 rounded-t-full bg-stone-900/90" />
                  <div className="relative flex items-end justify-center">
                    <div className={`${sizeFigureClass(option.value)} rounded-[10px] border-2 border-stone-700 bg-white`} />
                    <div className="absolute bottom-[-4px] h-2 w-[120%] rounded-full bg-stone-300/70 blur-[1px]" />
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-start gap-2">
                <span
                  className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border ${
                    isSelected
                      ? "border-[#2f80d1] shadow-[inset_0_0_0_4px_#2f80d1] xl:border-stone-950 xl:shadow-[inset_0_0_0_4px_#111827]"
                      : "border-stone-300"
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-950">{option.label}</p>
                  <p className="mt-1 text-[11px] leading-4 text-stone-600 xl:text-sm xl:leading-6">
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
