import type { SizeOption } from "../../../types/generator"

export default function SizeOptionCards({
  value,
  options,
  onChange,
}: {
  value: SizeOption
  options: Array<{ value: SizeOption; label: string; dimensions: string }>
  onChange: (value: SizeOption) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-[24px] border px-4 py-4 text-left transition ${
            value === option.value
              ? "border-stone-950 bg-white shadow-sm"
              : "border-stone-200 bg-white/70"
          }`}
        >
          <p className="text-sm font-semibold text-stone-950">{option.label}</p>
          <p className="mt-2 text-sm text-stone-500">{option.dimensions}</p>
        </button>
      ))}
    </div>
  )
}
