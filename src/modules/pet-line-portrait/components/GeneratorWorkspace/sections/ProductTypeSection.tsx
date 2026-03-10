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
    <div className="rounded-[24px] bg-white p-1 xl:rounded-[30px] xl:border xl:border-stone-200 xl:bg-[#faf8f3] xl:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
        Product Type
      </p>
      <h3 className="mt-2 text-xl font-semibold text-stone-950 xl:text-2xl">
        Choose Delivery Format
      </h3>

      <div className="mt-5 xl:mt-6">
        <SegmentedOptionGroup
          value={value}
          options={PRODUCT_TYPE_OPTIONS}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
