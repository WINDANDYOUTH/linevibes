import { SIZE_OPTIONS } from "../../../config/product-options"
import type { SizeOption } from "../../../types/generator"
import SizeOptionCards from "../controls/SizeOptionCards"

export default function SizeSection({
  value,
  onChange,
}: {
  value: SizeOption
  onChange: (value: SizeOption) => void
}) {
  return (
    <div className="rounded-[30px] border border-stone-200 bg-[#faf8f3] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
        Size Option
      </p>
      <h3 className="mt-2 text-2xl font-semibold text-stone-950">
        Choose a Size
      </h3>

      <div className="mt-6">
        <SizeOptionCards value={value} options={SIZE_OPTIONS} onChange={onChange} />
      </div>
    </div>
  )
}
