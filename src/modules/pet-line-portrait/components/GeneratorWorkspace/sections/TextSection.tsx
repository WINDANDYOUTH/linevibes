import TextInputField from "../controls/TextInputField"

export default function TextSection({
  value,
  maxLength = 32,
  onChange,
}: {
  value: string
  maxLength?: number
  onChange: (value: string) => void
}) {
  return (
    <div className="rounded-[30px] border border-stone-200 bg-[#faf8f3] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
        Text Option
      </p>
      <h3 className="mt-2 text-2xl font-semibold text-stone-950">
        Add Optional Text
      </h3>
      <p className="mt-3 text-sm leading-7 text-stone-600">
        This text appears at the bottom of the preview and final product presentation only.
      </p>

      <div className="mt-6">
        <TextInputField value={value} maxLength={maxLength} onChange={onChange} />
      </div>
    </div>
  )
}
