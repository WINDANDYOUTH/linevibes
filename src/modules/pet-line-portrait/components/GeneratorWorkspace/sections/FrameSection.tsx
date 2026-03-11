import { FRAME_OPTIONS } from "../../../config/product-options"
import type { FrameOption } from "../../../types/generator"

function framePreviewClasses(value: FrameOption) {
  switch (value) {
    case "oak":
      return "bg-[linear-gradient(135deg,#d8bb8c_0%,#cba36e_45%,#b6864f_100%)] p-2.5"
    case "black":
      return "bg-[linear-gradient(135deg,#3b3b3b_0%,#111111_100%)] p-2.5"
    case "acrylic":
      return "border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(209,213,219,0.68))] p-2"
    default:
      return "bg-stone-100 p-1"
  }
}

export default function FrameSection({
  value,
  onChange,
}: {
  value: FrameOption
  onChange: (value: FrameOption) => void
}) {
  return (
    <div className="rounded-[18px] bg-white">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
        Frame Option
      </p>
      <h3 className="mt-2 text-lg font-semibold text-stone-950 md:text-xl">
        Select a frame finish
      </h3>
      <p className="mt-2 text-sm leading-6 text-stone-500">
        Pick the final presentation finish for printed artwork.
      </p>

      <div className="-mx-3 mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-5 md:grid md:grid-cols-2 md:gap-3 md:overflow-visible md:px-0 md:pb-0">
        {FRAME_OPTIONS.map((option) => {
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
              <div className="bg-[#efe9de] p-1.5 md:rounded-[14px] md:border md:border-stone-200 md:p-2">
                <div
                  className={`flex aspect-[3/4] items-center justify-center rounded-[12px] md:aspect-auto ${framePreviewClasses(
                    option.value
                  )}`}
                >
                  <div className="overflow-hidden rounded-[12px] border border-stone-200 bg-white shadow-[0_8px_18px_rgba(28,25,23,0.08)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/line-portrait/style-continuous-line.png"
                      alt={`${option.label} frame preview`}
                      className="aspect-[3/4] h-full w-full object-cover grayscale md:aspect-square"
                    />
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
                    {option.description}
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
