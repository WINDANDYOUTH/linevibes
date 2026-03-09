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
    <div className="sticky bottom-4 rounded-[30px] border border-stone-200 bg-stone-950 p-6 text-white shadow-[0_20px_60px_rgba(28,25,23,0.15)]">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-300">
            Price
          </p>
          <div className="mt-2 text-3xl font-semibold">{price.formatted}</div>
          <p className="mt-3 text-sm leading-7 text-stone-300">
            Price updates instantly as you switch product configuration.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onAddToCart}
        disabled={!canAddToCart || cartStatus === "adding"}
        className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold transition ${
          !canAddToCart || cartStatus === "adding"
            ? "cursor-not-allowed bg-white/20 text-stone-300"
            : "bg-white text-stone-950 hover:bg-stone-100"
        }`}
      >
        {buttonLabel}
        <ArrowRight className="h-4 w-4" />
      </button>

      {cartError ? (
        <p className="mt-4 text-sm text-red-200">{cartError}</p>
      ) : (
        <p className="mt-4 text-sm text-stone-400">
          Generated artwork, custom text, and product configuration are all preserved in the cart item.
        </p>
      )}
    </div>
  )
}
