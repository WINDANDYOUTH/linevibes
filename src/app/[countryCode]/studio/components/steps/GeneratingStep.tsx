"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BlueprintLoader } from "../shared/LoadingSpinner"

const GENERATION_STEPS = [
  { progress: 10, message: "Analyzing image composition..." },
  { progress: 25, message: "Detecting edges and contours..." },
  { progress: 45, message: "Optimizing line extraction..." },
  { progress: 65, message: "Generating AI blueprint..." },
  { progress: 80, message: "Refining line art details..." },
  { progress: 95, message: "Finalizing your blueprint..." },
]

export default function GeneratingStep() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate progress
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < GENERATION_STEPS.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 2000) // Change step every 2 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Smooth progress animation
    const targetProgress = GENERATION_STEPS[currentStepIndex].progress
    const duration = 1500 // 1.5 seconds
    const steps = 60
    const increment = (targetProgress - progress) / steps
    let currentStep = 0

    const progressInterval = setInterval(() => {
      currentStep++
      setProgress((prev) => {
        const newProgress = prev + increment
        if (currentStep >= steps) {
          clearInterval(progressInterval)
          return targetProgress
        }
        return newProgress
      })
    }, duration / steps)

    return () => clearInterval(progressInterval)
  }, [currentStepIndex])

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Creating Your Blueprint
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Our AI is transforming your photo into stunning line art
          </p>
        </div>

        {/* Blueprint Loader */}
        <div className="mb-8">
          <BlueprintLoader
            message={GENERATION_STEPS[currentStepIndex].message}
          />
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm font-bold text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            {/* Blueprint grid pattern background */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    id="grid-pattern"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 10 0 L 0 0 0 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              </svg>
            </div>

            {/* Animated progress bar */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </motion.div>
          </div>
        </div>

        {/* Status Steps */}
        <div className="space-y-3">
          {GENERATION_STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex
            const isCurrent = index === currentStepIndex
            const isPending = index > currentStepIndex

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isCurrent
                    ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                    : isCompleted
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      : "bg-gray-50 dark:bg-gray-700/50 border border-transparent"
                }`}
              >
                {/* Status Icon */}
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isCurrent
                        ? "bg-blue-500 text-white animate-pulse"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Message */}
                <p
                  className={`text-sm font-medium ${
                    isCurrent
                      ? "text-blue-700 dark:text-blue-300"
                      : isCompleted
                        ? "text-green-700 dark:text-green-300"
                        : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {step.message}
                </p>

                {/* Loading spinner for current step */}
                {isCurrent && (
                  <div className="ml-auto">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Fun Fact / Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
        >
          <p className="text-sm text-purple-900 dark:text-purple-200">
            <span className="font-semibold">💡 Did you know?</span> Our AI
            analyzes thousands of line patterns to create the perfect blueprint
            style for your image. This typically takes 10-20 seconds.
          </p>
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
