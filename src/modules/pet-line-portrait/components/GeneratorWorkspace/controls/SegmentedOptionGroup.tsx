export default function SegmentedOptionGroup<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: Array<{ value: T; label: string; description?: string }>
  onChange: (value: T) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
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
          {option.description ? (
            <p className="mt-2 text-sm leading-6 text-stone-600">{option.description}</p>
          ) : null}
        </button>
      ))}
    </div>
  )
}
