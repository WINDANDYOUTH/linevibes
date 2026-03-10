import { FRAME_OPTIONS } from "../../../config/product-options"
import type { FrameOption } from "../../../types/generator"
import SegmentedOptionGroup from "../controls/SegmentedOptionGroup"

export default function FrameSection({
  value,
  onChange,
}: {
  value: FrameOption
  onChange: (value: FrameOption) => void
}) {
  return (
    <div className="rounded-[24px] bg-white p-1 xl:rounded-[30px] xl:border xl:border-stone-200 xl:bg-[#faf8f3] xl:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
        Frame Option
      </p>
      <h3 className="mt-2 text-xl font-semibold text-stone-950 xl:text-2xl">
        Select a Frame
      </h3>

      <div className="mt-5 xl:mt-6">
        <SegmentedOptionGroup value={value} options={FRAME_OPTIONS} onChange={onChange} />
      </div>
    </div>
  )
}
