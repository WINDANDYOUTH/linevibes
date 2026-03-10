export default function TextInputField({
  value,
  maxLength = 32,
  onChange,
}: {
  value: string
  maxLength?: number
  onChange: (value: string) => void
}) {
  return (
    <div>
      <input
        type="text"
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder="e.g. Charlie"
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-950"
      />
      <div className="mt-3 flex items-center justify-between text-xs text-stone-400">
        <span>Text updates the preview immediately and is not sent to the AI.</span>
        <span>{value.length}/{maxLength}</span>
      </div>
    </div>
  )
}
