"use client"

import React from "react"
import { motion } from "framer-motion"

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6" />
      <div className="space-y-3">
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  )
}

export function SkeletonImage() {
  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse">
      <div className="aspect-video w-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-gray-400 dark:text-gray-500">
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  )
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
        />
      ))}
    </div>
  )
}

// Shimmer effect skeleton
export function ShimmerSkeleton() {
  return (
    <div className="relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-xl">
      <div className="h-64 w-full" />
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          translateX: ["100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  )
}
