import { ArrowRight } from "lucide-react"

import type {
  CartStatus,
  GenerationStatus,
  GeneratorPrice,
} from "../../types/generator"

export default function PurchaseBar({
  price,
  canAddToCart,
  cartStatus,
  generationStatus,
  cartError,
  onAddToCart,
}: {
  price: GeneratorPrice
  canAddToCart: boolean
  cartStatus: CartStatus
  generationStatus: GenerationStatus
  cartError: string | null
  onAddToCart: () => void
}) {
  const buttonLabel =
    cartStatus === "adding"
      ? "Adding..."
      : generationStatus === "generating"
      ? "Generating Required"
      : canAddToCart
      ? "Add to Cart"
      : "Generating Required"

  return (
    <div className="sticky bottom-3 z-20 overflow-hidden rounded-[20px] border border-stone-200 bg-stone-950 px-4 py-3 text-white shadow-[0_14px_32px_rgba(28,25,23,0.14)] md:px-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-300">
            Price
          </p>
          <div className="mt-1 truncate text-xl font-semibold leading-none md:text-2xl">
            {price.formatted}
          </div>
        </div>

        <button
          type="button"
          onClick={onAddToCart}
          disabled={!canAddToCart || cartStatus === "adding"}
          className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition md:min-w-[172px] ${
            !canAddToCart || cartStatus === "adding"
              ? "cursor-not-allowed bg-white/20 text-stone-300"
              : "bg-white text-stone-950 hover:bg-stone-100"
          }`}
        >
          {buttonLabel}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {cartError ? <p className="mt-2 text-sm text-red-200">{cartError}</p> : null}
    </div>
  )
}
