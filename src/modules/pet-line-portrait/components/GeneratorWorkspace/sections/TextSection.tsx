import { useEffect, useState } from "react"
import { AlignCenter, AlignLeft, AlignRight, Type } from "lucide-react"

import type { TextAlignOption, TextFontOption } from "../../../types/generator"
import TextInputField from "../controls/TextInputField"

const FONT_OPTIONS: Array<{ value: TextFontOption; label: string; previewClassName: string }> = [
  { value: "sans", label: "Sans-serif", previewClassName: "font-sans" },
  {
    value: "serif",
    label: "Serif",
    previewClassName: "font-[family-name:Georgia,_Times_New_Roman,_serif]",
  },
  {
    value: "script",
    label: "Script",
    previewClassName: "font-[family-name:Brush_Script_MT,_Segoe_Script,_cursive]",
  },
  {
    value: "modern",
    label: "Modern",
    previewClassName: "font-[family-name:Helvetica_Neue,_Arial,_sans-serif]",
  },
]

const COLOR_SWATCHES = ["#111111", "#4B5563", "#FACC15", "#1D4ED8"]

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
  size,
  maxLength = 32,
  onChange,
  onFontChange,
  onColorChange,
  onAlignChange,
  onSizeChange,
}: {
  value: string
  font: TextFontOption
  color: string
  align: TextAlignOption
  size: number
  maxLength?: number
  onChange: (value: string) => void
  onFontChange: (value: TextFontOption) => void
  onColorChange: (value: string) => void
  onAlignChange: (value: TextAlignOption) => void
  onSizeChange: (value: number) => void
}) {
  const selectedFont =
    FONT_OPTIONS.find((option) => option.value === font) ?? FONT_OPTIONS[0]
  const [colorInput, setColorInput] = useState(color)

  useEffect(() => {
    setColorInput(color)
  }, [color])

  return (
    <div className="rounded-[24px] bg-white p-1 xl:rounded-[30px] xl:border xl:border-stone-200 xl:bg-[#faf8f3] xl:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
            Text Option
          </p>
          <h3 className="mt-2 text-xl font-semibold text-stone-950 xl:text-2xl">
            Add Optional Text
          </h3>
          <p className="mt-3 text-sm leading-6 text-stone-600 xl:leading-7">
            This text appears at the bottom of the preview and final product presentation only.
          </p>
        </div>
        <Type className="h-5 w-5 text-stone-400" />
      </div>

      <div className="mt-4 rounded-[18px] border border-stone-200 bg-[#f8f7f4] px-4 py-3 xl:hidden">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
          Live placement
        </p>
        <p className={`mt-1 text-sm ${selectedFont.previewClassName}`} style={{ color }}>
          {value || "Your pet name will appear here"}
        </p>
      </div>

      <div className="mt-5 xl:mt-6">
        <TextInputField value={value} maxLength={maxLength} onChange={onChange} />
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-stone-950">Font</p>
            <span className="text-xs text-stone-400">{value.length}/{maxLength}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 xl:grid-cols-4">
            {FONT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onFontChange(option.value)}
                className={`rounded-[18px] border px-3 py-3 text-left transition ${
                  font === option.value
                    ? "border-[#2f80d1] bg-white shadow-[0_10px_24px_rgba(47,128,209,0.14)] xl:border-stone-950 xl:shadow-sm"
                    : "border-stone-200 bg-white/70"
                }`}
              >
                <p className={`text-base text-stone-950 ${option.previewClassName}`}>
                  {option.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_140px]">
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
                        ? "scale-105 border-stone-950 shadow-[0_0_0_2px_rgba(17,24,39,0.12)]"
                        : "border-stone-300"
                    }`}
                    style={{ backgroundColor: swatch }}
                    aria-label={`Choose color ${swatch}`}
                  />
                )
              })}

              <input
                type="text"
                value={colorInput}
                onChange={(event) => setColorInput(event.target.value)}
                onBlur={() => onColorChange(colorInput)}
                className="h-10 w-[120px] rounded-2xl border border-stone-300 bg-white px-3 text-sm text-stone-900 outline-none transition focus:border-stone-950"
              />
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
                    className={`inline-flex h-10 items-center justify-center rounded-2xl border transition ${
                      active
                        ? "border-[#2f80d1] bg-white text-[#2f80d1] xl:border-stone-950 xl:text-stone-950"
                        : "border-stone-200 bg-white/70 text-stone-500"
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

        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-stone-950">Font Size</p>
            <span className="text-sm text-stone-500">{size}px</span>
          </div>
          <input
            type="range"
            min={18}
            max={42}
            step={1}
            value={size}
            onChange={(event) => onSizeChange(Number(event.target.value))}
            className="mt-3 h-2 w-full accent-[#2f80d1]"
          />
        </div>
      </div>
    </div>
  )
}
