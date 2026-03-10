import { PawPrint } from "lucide-react"

export default function EmptyPreviewState({
  title,
  body,
}: {
  title: string
  body: string
}) {
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center rounded-[24px] border border-dashed border-stone-300 bg-white px-4 text-center sm:px-8 xl:rounded-[30px]">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6f1e8] text-stone-700 sm:h-16 sm:w-16">
        <PawPrint className="h-6 w-6 sm:h-7 sm:w-7" />
      </div>
      <h4 className="mt-4 text-lg font-semibold text-stone-950 sm:mt-6 sm:text-2xl">
        {title}
      </h4>
      <p className="mt-2 max-w-md text-xs leading-5 text-stone-500 sm:mt-4 sm:text-sm sm:leading-7">
        {body}
      </p>
    </div>
  )
}
