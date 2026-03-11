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
    <div className="-mx-3 flex snap-x snap-mandatory gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-2 md:gap-3 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-3">
      {styles.map((style) => (
        <button
          key={style.id}
          type="button"
          onClick={() => onSelect(style.id)}
          className={`min-w-[148px] max-w-[148px] shrink-0 snap-start overflow-hidden rounded-[14px] border text-left transition md:min-w-0 md:max-w-none md:w-full md:rounded-[18px] md:p-3 ${
            selectedStyleId === style.id
              ? "border-[#2f80ed] bg-[#f4f8ff] shadow-[0_10px_24px_rgba(47,128,237,0.12)]"
              : "border-stone-200 bg-[#fbfbfa] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.06)]"
          }`}
        >
          <div className="overflow-hidden bg-stone-100 md:rounded-[14px] md:border md:border-stone-200">
            {style.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={style.thumbnailUrl}
                alt={style.name}
                className="aspect-[3/4] h-full w-full object-cover grayscale md:aspect-[4/3]"
              />
            ) : (
              <div className="aspect-[3/4] md:aspect-[4/3]" />
            )}
          </div>
          <p className="px-2.5 py-2 text-sm font-semibold text-stone-950 md:mt-3 md:px-0 md:py-0 md:text-[15px]">
            {style.name}
          </p>
          <p className="hidden md:mt-1 md:block md:text-[12px] md:leading-5 md:text-stone-500">
            {style.description}
          </p>
        </button>
      ))}
    </div>
  )
}
