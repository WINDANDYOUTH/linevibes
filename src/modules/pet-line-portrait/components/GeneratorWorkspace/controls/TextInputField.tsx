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
    <input
      type="text"
      value={value}
      maxLength={maxLength}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Enter text"
      className="w-full rounded-[10px] border border-[#dedede] bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-[#2f80ed]"
    />
  )
}
