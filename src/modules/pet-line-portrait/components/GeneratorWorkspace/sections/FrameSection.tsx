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
    <div className="rounded-[30px] border border-stone-200 bg-[#faf8f3] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
        Frame Option
      </p>
      <h3 className="mt-2 text-2xl font-semibold text-stone-950">
        Select a Frame
      </h3>

      <div className="mt-6">
        <SegmentedOptionGroup value={value} options={FRAME_OPTIONS} onChange={onChange} />
      </div>
    </div>
  )
}
