import type { PortraitStyle } from "../../../types/generator"

export default function StyleCarousel({
  styles,
  selectedStyleId,
  onSelect,
}: {
  styles: PortraitStyle[]
  selectedStyleId: string | null
  onSelect: (styleId: string) => void
}) {
  return (
    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
      {styles.map((style) => (
        <button
          key={style.id}
          type="button"
          onClick={() => onSelect(style.id)}
          className={`min-w-[220px] rounded-[24px] border p-3 text-left transition ${
            selectedStyleId === style.id
              ? "border-stone-950 bg-white shadow-sm"
              : "border-stone-200 bg-white/70"
          }`}
        >
          <div className="overflow-hidden rounded-[18px] border border-stone-200 bg-stone-100">
            {style.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={style.thumbnailUrl}
                alt={style.name}
                className="aspect-[4/3] h-full w-full object-cover grayscale"
              />
            ) : (
              <div className="aspect-[4/3]" />
            )}
          </div>
          <p className="mt-4 text-base font-semibold text-stone-950">{style.name}</p>
          <p className="mt-2 text-sm leading-6 text-stone-600">{style.description}</p>
        </button>
      ))}
    </div>
  )
}
