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
    <div className="rounded-[24px] bg-white p-1 xl:rounded-[30px] xl:border xl:border-stone-200 xl:bg-[#faf8f3] xl:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
        Size Option
      </p>
      <h3 className="mt-2 text-xl font-semibold text-stone-950 xl:text-2xl">
        Choose a Size
      </h3>

      <div className="mt-5 xl:mt-6">
        <SizeOptionCards value={value} options={SIZE_OPTIONS} onChange={onChange} />
      </div>
    </div>
  )
}
