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
    <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:mx-0 xl:grid xl:grid-cols-1 xl:overflow-visible xl:px-0 xl:pb-0">
      {styles.map((style) => (
        <button
          key={style.id}
          type="button"
          onClick={() => onSelect(style.id)}
          className={`min-w-[116px] max-w-[116px] shrink-0 snap-start rounded-[20px] border p-2.5 text-left transition xl:min-w-0 xl:max-w-none xl:w-full xl:rounded-[24px] xl:p-3 ${
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
                className="aspect-square h-full w-full object-cover grayscale xl:aspect-[4/3]"
              />
            ) : (
              <div className="aspect-square xl:aspect-[4/3]" />
            )}
          </div>
          <p className="mt-3 text-sm font-semibold text-stone-950 xl:mt-4 xl:text-base">
            {style.name}
          </p>
          <p className="mt-1.5 text-[11px] leading-4 text-stone-600 xl:mt-2 xl:text-sm xl:leading-6">
            {style.description}
          </p>
        </button>
      ))}
    </div>
  )
}
