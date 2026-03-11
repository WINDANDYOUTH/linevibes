import type { ReactNode } from "react"

export default function GeneratorWorkspaceLayout({
  preview,
  configurator,
  purchaseBar,
}: {
  preview: ReactNode
  configurator: ReactNode
  purchaseBar?: ReactNode
}) {
  return (
    <div
      className={`mt-8 space-y-6 md:mt-12 md:space-y-8 xl:grid xl:grid-cols-[minmax(0,560px)_minmax(0,1fr)] xl:gap-8 xl:space-y-0 xl:pb-0 2xl:grid-cols-[minmax(0,640px)_minmax(0,1fr)] 2xl:gap-10 ${
        purchaseBar ? "pb-28 md:pb-32" : ""
      }`}
    >
      <div className="xl:sticky xl:top-[calc(var(--pet-portrait-header-height,0px)+var(--pet-portrait-preview-gap,24px))] xl:self-start">
        {preview}
      </div>
      <div className="min-w-0">
        <div className="rounded-[28px] border border-[#e8e8e8] bg-white p-3 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:p-5 xl:rounded-[32px] xl:p-6">
          {configurator}
        </div>
      </div>
      {purchaseBar ? (
        <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 sm:px-5 lg:px-6 xl:hidden">
          {purchaseBar}
        </div>
      ) : null}
    </div>
  )
}
