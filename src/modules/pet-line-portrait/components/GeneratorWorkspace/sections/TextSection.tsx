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
    <div className="rounded-[24px] bg-white p-1 xl:rounded-[30px] xl:border xl:border-stone-200 xl:bg-[#faf8f3] xl:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
        Text Option
      </p>
      <h3 className="mt-2 text-xl font-semibold text-stone-950 xl:text-2xl">
        Add Optional Text
      </h3>
      <p className="mt-3 text-sm leading-6 text-stone-600 xl:leading-7">
        This text appears at the bottom of the preview and final product presentation only.
      </p>

      <div className="mt-5 xl:mt-6">
        <TextInputField value={value} maxLength={maxLength} onChange={onChange} />
      </div>
    </div>
  )
}
