import { Download, Frame } from "lucide-react"

import { PRODUCT_TYPE_OPTIONS } from "../../../config/product-options"
import type { ProductType } from "../../../types/generator"

function previewForType(type: ProductType) {
  if (type === "digital") {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-[18px] border border-stone-200 bg-[#f5f1e8]">
        <div className="flex flex-col items-center justify-center gap-2 text-stone-900">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-stone-300 bg-white">
            <Download className="h-7 w-7" />
          </div>
          <p className="text-xs font-medium text-stone-500">JPG, PDF, PNG</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[18px] border border-stone-200 bg-[#efe9de] p-3">
      <div className="rounded-[16px] bg-[linear-gradient(135deg,#d8bb8c_0%,#cba36e_45%,#b6864f_100%)] p-2.5">
        <div className="overflow-hidden rounded-[12px] border border-stone-200 bg-white shadow-[0_8px_18px_rgba(28,25,23,0.08)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/line-portrait/style-continuous-line.png"
            alt="Printed artwork preview"
            className="aspect-[4/5] h-full w-full object-cover grayscale"
          />
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
    <div className="rounded-[24px] bg-white p-1 xl:rounded-[30px] xl:border xl:border-stone-200 xl:bg-[#faf8f3] xl:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
            Product Type
          </p>
          <h3 className="mt-2 text-xl font-semibold text-stone-950 xl:text-2xl">
            Choose Delivery Format
          </h3>
          <p className="mt-3 text-sm leading-6 text-stone-600 xl:leading-7">
            Select instant digital delivery or a framed physical print.
          </p>
        </div>
        <Frame className="h-5 w-5 text-stone-400" />
      </div>

      <div className="mt-5 grid gap-3 xl:mt-6 xl:grid-cols-2">
        {PRODUCT_TYPE_OPTIONS.map((option) => {
          const isSelected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-[22px] border p-3 text-left transition xl:rounded-[24px] ${
                isSelected
                  ? "border-[#2f80d1] bg-white shadow-[0_10px_24px_rgba(47,128,209,0.14)] xl:border-stone-950 xl:shadow-sm"
                  : "border-stone-200 bg-white/70"
              }`}
            >
              {previewForType(option.value)}

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
