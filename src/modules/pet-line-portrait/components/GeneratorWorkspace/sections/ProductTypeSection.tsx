import { PRODUCT_TYPE_OPTIONS } from "../../../config/product-options"
import type { ProductType } from "../../../types/generator"
import SegmentedOptionGroup from "../controls/SegmentedOptionGroup"

export default function ProductTypeSection({
  value,
  onChange,
}: {
  value: ProductType
  onChange: (value: ProductType) => void
}) {
  return (
    <div className="rounded-[30px] border border-stone-200 bg-[#faf8f3] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
        Product Type
      </p>
      <h3 className="mt-2 text-2xl font-semibold text-stone-950">
        Choose Delivery Format
      </h3>

      <div className="mt-6">
        <SegmentedOptionGroup
          value={value}
          options={PRODUCT_TYPE_OPTIONS}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
