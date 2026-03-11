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
    <div className="rounded-[24px] bg-white p-1 xl:rounded-[30px] xl:border xl:border-stone-200 xl:bg-[#faf8f3] xl:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
        Frame Option
      </p>
      <h3 className="mt-2 text-xl font-semibold text-stone-950 xl:text-2xl">
        Select a Frame
      </h3>
      <p className="mt-3 text-sm leading-6 text-stone-600 xl:leading-7">
        Pick the final presentation finish for printed artwork.
      </p>

      <div className="-mx-1 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:mx-0 xl:mt-6 xl:grid xl:grid-cols-2 xl:overflow-visible xl:px-0 xl:pb-0">
        {FRAME_OPTIONS.map((option) => {
          const isSelected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`min-w-[132px] max-w-[132px] shrink-0 snap-start rounded-[22px] border p-2.5 text-left transition xl:min-w-0 xl:max-w-none xl:rounded-[24px] xl:p-3 ${
                isSelected
                  ? "border-[#2f80d1] bg-white shadow-[0_10px_24px_rgba(47,128,209,0.14)] xl:border-stone-950 xl:shadow-sm"
                  : "border-stone-200 bg-white/70"
              }`}
            >
              <div className="rounded-[18px] border border-stone-200 bg-[#efe9de] p-2">
                <div className={`rounded-[16px] ${framePreviewClasses(option.value)}`}>
                  <div className="overflow-hidden rounded-[12px] border border-stone-200 bg-white shadow-[0_8px_18px_rgba(28,25,23,0.08)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/line-portrait/style-continuous-line.png"
                      alt={`${option.label} frame preview`}
                      className="aspect-square h-full w-full object-cover grayscale"
                    />
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
