import type { ReactNode } from "react"

export default function GeneratorWorkspaceLayout({
  preview,
  configurator,
  purchaseBar,
}: {
  preview: ReactNode
  configurator: ReactNode
  purchaseBar: ReactNode
}) {
  return (
    <div className="mt-8 grid gap-6 xl:mt-12 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
      <div
        className="min-w-0 self-start sticky z-30"
        style={{
          top: "calc(var(--pet-portrait-header-height, 76px) + var(--pet-portrait-preview-gap, 12px))",
        }}
      >
        {preview}
      </div>
      <div className="min-w-0 space-y-6">
        {configurator}
        {purchaseBar}
      </div>
    </div>
  )
}
