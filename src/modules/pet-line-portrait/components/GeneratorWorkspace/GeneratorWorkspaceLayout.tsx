import type { ReactNode } from "react"

export default function GeneratorWorkspaceLayout({
  hasStartedEditing,
  preview,
  configurator,
  purchaseBar,
}: {
  hasStartedEditing: boolean
  preview: ReactNode
  configurator: ReactNode
  purchaseBar: ReactNode
}) {
  return (
    <div
      className={`mt-6 grid gap-4 xl:mt-12 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] xl:gap-6 ${
        hasStartedEditing ? "pt-[calc(var(--pet-portrait-mobile-preview-height,252px)+12px)] xl:pt-0" : ""
      }`}
    >
      <div
        className={`min-w-0 self-start z-30 ${
          hasStartedEditing
            ? "fixed inset-x-3 top-0 xl:sticky xl:inset-x-auto"
            : "sticky"
        }`}
        style={{
          top: hasStartedEditing
            ? "0px"
            : "calc(var(--pet-portrait-header-height, 76px) + var(--pet-portrait-preview-gap, 12px))",
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
