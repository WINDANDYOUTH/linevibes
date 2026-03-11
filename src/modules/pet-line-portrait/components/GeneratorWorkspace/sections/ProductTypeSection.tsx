import { Download, Frame, Image as ImageIcon } from "lucide-react"

import { PRODUCT_TYPE_OPTIONS } from "../../../config/product-options"
import type { ProductType } from "../../../types/generator"

function previewForType(type: ProductType) {
  if (type === "digital") {
    return (
      <div className="flex aspect-[3/4] items-center justify-center bg-[linear-gradient(135deg,#f6f0e5_0%,#efe6d7_100%)] md:aspect-[4/3] md:rounded-[18px] md:border md:border-stone-200">
        <div className="flex flex-col items-center justify-center gap-1.5 text-stone-900 md:gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-stone-300 bg-white/95 md:h-14 md:w-14 md:rounded-2xl">
            <Download className="h-5 w-5 md:h-7 md:w-7" />
          </div>
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
            <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-stone-200" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[linear-gradient(135deg,#eee2cf_0%,#dbc19a_100%)] p-2 md:rounded-[18px] md:border md:border-stone-200 md:p-3">
      <div className="flex aspect-[3/4] items-center justify-center rounded-[12px] border border-white/50 bg-[rgba(255,255,255,0.28)] md:aspect-[4/3] md:rounded-[16px]">
        <div className="relative flex h-11 w-11 items-center justify-center md:h-14 md:w-14">
          <div className="absolute inset-0 rounded-[16px] border border-stone-500/15 bg-white/75 shadow-[0_8px_18px_rgba(28,25,23,0.08)]" />
          <div className="absolute inset-[6px] rounded-[12px] border border-stone-400/25" />
          <ImageIcon className="relative h-5 w-5 text-stone-700 md:h-6 md:w-6" />
        </div>
      </div>
    </div>
  )
}

export default function ProductTypeSection({
  value,
  onChange,
}: {
  value: ProductType
  onChange: (value: ProductType) => void
}) {
  return (
    <div className="rounded-[18px] bg-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
            Delivery Format
          </p>
          <h3 className="mt-2 text-lg font-semibold text-stone-950 md:text-xl">
            Choose delivery format
          </h3>
          <p className="mt-1 text-sm leading-5 text-stone-500">
            Digital or printed.
          </p>
        </div>
        <Frame className="h-5 w-5 text-stone-400" />
      </div>

      <div className="-mx-3 mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-center md:mx-auto md:mt-5 md:grid md:max-w-[340px] md:grid-cols-2 md:gap-3 md:overflow-visible md:px-0 md:pb-0">
        {PRODUCT_TYPE_OPTIONS.map((option) => {
          const isSelected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`min-w-[148px] max-w-[148px] shrink-0 snap-start overflow-hidden rounded-[14px] border text-left transition md:min-w-0 md:max-w-none md:w-full md:rounded-[18px] md:p-3 ${
                isSelected
                  ? "border-[#2f80ed] bg-[#f4f8ff] shadow-[0_10px_24px_rgba(47,128,237,0.12)]"
                  : "border-stone-200 bg-[#faf8f3] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.05)]"
              }`}
            >
              <div className="overflow-hidden bg-stone-100 md:rounded-[14px] md:border md:border-stone-200">
                {previewForType(option.value)}
              </div>

              <div className="flex items-center gap-2 px-2.5 py-2 md:mt-3 md:px-0 md:py-0 md:gap-3">
                <span
                  className={`h-4 w-4 shrink-0 rounded-full border md:h-[18px] md:w-[18px] ${
                    isSelected
                      ? "border-[#2f80ed] shadow-[inset_0_0_0_4px_#2f80ed]"
                      : "border-stone-300"
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-4 text-stone-950 md:text-sm">
                    {option.label}
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
