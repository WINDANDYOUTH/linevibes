import { AlignCenter, AlignLeft, AlignRight } from "lucide-react"

import type {
  ProductType,
  TextAlignOption,
  TextFontOption,
} from "../../../types/generator"
import TextInputField from "../controls/TextInputField"

const FONT_OPTIONS: Array<{
  value: TextFontOption
  label: string
  previewClassName: string
}> = [
  { value: "sans", label: "Sans-serif", previewClassName: "font-sans" },
  {
    value: "serif",
    label: "Serif",
    previewClassName: "font-[family-name:Georgia,_Times_New_Roman,_serif]",
  },
  {
    value: "script",
    label: "Script",
    previewClassName:
      "font-[family-name:Brush_Script_MT,_Segoe_Script,_cursive]",
  },
  {
    value: "modern",
    label: "Modern",
    previewClassName: "font-[family-name:Helvetica_Neue,_Arial,_sans-serif]",
  },
]

const COLOR_SWATCHES = ["#111111", "#dc2626", "#2563eb"]

const ALIGN_OPTIONS: Array<{
  value: TextAlignOption
  label: string
  icon: typeof AlignLeft
}> = [
  { value: "left", label: "Left", icon: AlignLeft },
  { value: "center", label: "Center", icon: AlignCenter },
  { value: "right", label: "Right", icon: AlignRight },
]

export default function TextSection({
  value,
  font,
  color,
  align,
  productType,
  maxLength = 32,
  onChange,
  onFontChange,
  onColorChange,
  onAlignChange,
}: {
  value: string
  font: TextFontOption
  color: string
  align: TextAlignOption
  productType: ProductType
  maxLength?: number
  onChange: (value: string) => void
  onFontChange: (value: TextFontOption) => void
  onColorChange: (value: string) => void
  onAlignChange: (value: TextAlignOption) => void
}) {
  return (
    <div className="rounded-[18px] bg-white">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
          Text
        </p>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-stone-950">Text</p>
          <span className="text-xs text-stone-400">
            {value.length}/{maxLength}
          </span>
        </div>
        <div className="mt-2">
          <TextInputField
            value={value}
            maxLength={maxLength}
            onChange={onChange}
          />
        </div>
      </div>

      {productType === "digital" ? (
        <div className="mt-5 rounded-[16px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Digital files are delivered without the preview text overlay.
        </div>
      ) : null}

      <div className="mt-5 space-y-5">
        <div>
          <p className="text-sm font-semibold text-stone-950">Font</p>
          <div className="mt-3 grid grid-cols-2 gap-1.5 md:grid-cols-4 md:gap-2">
            {FONT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onFontChange(option.value)}
                className={`rounded-[12px] border px-2.5 py-2.5 text-left transition md:px-3 md:py-3 ${
                  font === option.value
                    ? "border-[#2f80ed] bg-[#f4f8ff] shadow-[0_10px_24px_rgba(47,128,237,0.12)]"
                    : "border-stone-200 bg-[#fbfbfa]"
                }`}
              >
                <p
                  className={`text-base text-stone-950 ${option.previewClassName}`}
                >
                  {option.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_160px]">
          <div>
            <p className="text-sm font-semibold text-stone-950">Color</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {COLOR_SWATCHES.map((swatch) => {
                const active = swatch.toLowerCase() === color.toLowerCase()

                return (
                  <button
                    key={swatch}
                    type="button"
                    onClick={() => onColorChange(swatch)}
                    className={`h-9 w-9 rounded-full border transition ${
                      active
                        ? "scale-105 border-[#2f80ed] shadow-[0_0_0_3px_rgba(47,128,237,0.12)]"
                        : "border-stone-300"
                    }`}
                    style={{ backgroundColor: swatch }}
                    aria-label={`Choose color ${swatch}`}
                  />
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-stone-950">Alignment</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {ALIGN_OPTIONS.map((option) => {
                const Icon = option.icon
                const active = align === option.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onAlignChange(option.value)}
                    className={`inline-flex h-10 items-center justify-center rounded-[10px] border transition ${
                      active
                        ? "border-[#2f80ed] bg-[#f4f8ff] text-[#2f80ed]"
                        : "border-stone-200 bg-[#fbfbfa] text-stone-500"
                    }`}
                    aria-label={option.label}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
