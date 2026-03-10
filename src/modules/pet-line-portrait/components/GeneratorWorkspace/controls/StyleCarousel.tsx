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
    <div className="grid gap-3 sm:-mx-1 sm:flex sm:overflow-x-auto sm:px-1 sm:pb-1">
      {styles.map((style) => (
        <button
          key={style.id}
          type="button"
          onClick={() => onSelect(style.id)}
          className={`min-w-0 w-full rounded-[24px] border p-3 text-left transition sm:min-w-[220px] sm:w-auto ${
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
