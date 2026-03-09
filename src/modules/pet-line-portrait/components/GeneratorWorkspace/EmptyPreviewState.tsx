import { PawPrint } from "lucide-react"

export default function EmptyPreviewState({
  title,
  body,
}: {
  title: string
  body: string
}) {
  return (
    <div className="flex min-h-[560px] flex-col items-center justify-center rounded-[30px] border border-dashed border-stone-300 bg-white px-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f6f1e8] text-stone-700">
        <PawPrint className="h-7 w-7" />
      </div>
      <h4 className="mt-6 text-2xl font-semibold text-stone-950">{title}</h4>
      <p className="mt-4 max-w-md text-sm leading-7 text-stone-500">{body}</p>
    </div>
  )
}
