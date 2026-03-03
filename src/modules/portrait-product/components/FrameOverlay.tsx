"use client"

import React from "react"
import { FrameMaterial } from "../data/portrait-data"

type FrameOverlayProps = {
  /** The selected frame material (null or "none" = no frame) */
  material: FrameMaterial | null
  /** The child content (line art image) to wrap */
  children: React.ReactNode
}

/**
 * Wraps the line art renderer with a visual frame border
 * that changes based on the selected material.
 * Uses CSS border-image / gradients to simulate frame textures.
 */
export default function FrameOverlay({
  material,
  children,
}: FrameOverlayProps) {
  const hasFrame = material && material.id !== "none"

  if (!hasFrame) {
    return <>{children}</>
  }

  return (
    <div
      className="relative transition-all duration-500 ease-out"
      data-testid="frame-overlay"
    >
      {/* Outer frame shadow */}
      <div
        className="rounded-sm"
        style={{
          padding: "24px",
          background: material.borderStyle,
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Inner mat / mount area */}
        <div
          className="p-3"
          style={{ backgroundColor: material.matColor }}
        >
          {/* The actual line art */}
          <div className="shadow-inner">{children}</div>
        </div>
      </div>

      {/* Frame material label */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
        <span className="text-xs text-gray-400 font-medium tracking-wide">
          {material.name} Frame
        </span>
      </div>
    </div>
  )
}
