"use client"

import React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { useStudio } from "./StudioProvider"

const STEPS = [
  { step: 1, title: "Upload", shortTitle: "Upload" },
  { step: 2, title: "Customize", shortTitle: "Edit" },
  { step: 3, title: "Generate", shortTitle: "AI" },
  { step: 4, title: "Preview & Order", shortTitle: "Order" },
] as const

export function StepperNav() {
  const { state, goToStep } = useStudio()
  const { currentStep, completedSteps } = state

  return (
    <nav aria-label="Progress" className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Desktop Stepper */}
      <ol className="hidden md:flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.step as 1 | 2 | 3 | 4)
          const isCurrent = currentStep === step.step
          const isAccessible = isCompleted || isCurrent

          return (
            <li key={step.step} className="flex-1 relative">
              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div className="absolute top-5 left-1/2 w-full h-0.5 -z-10">
                  <motion.div
                    className={`h-full ${
                      isCompleted ? "bg-blue-600" : "bg-gray-300"
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}

              {/* Step Circle */}
              <button
                onClick={() => isAccessible && goToStep(step.step as 1 | 2 | 3 | 4)}
                disabled={!isAccessible}
                className={`flex flex-col items-center gap-2 w-full group ${
                  isAccessible ? "cursor-pointer" : "cursor-not-allowed"
                }`}
              >
                <motion.div
                  className={`
                    relative w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-200
                    ${
                      isCompleted
                        ? "bg-blue-600 text-white"
                        : isCurrent
                          ? "bg-white border-2 border-blue-600 text-blue-600 shadow-lg"
                          : "bg-gray-200 text-gray-400 border-2 border-gray-300"
                    }
                    ${isAccessible && "group-hover:scale-110"}
                  `}
                  whileHover={isAccessible ? { scale: 1.1 } : {}}
                  whileTap={isAccessible ? { scale: 0.95 } : {}}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" strokeWidth={3} />
                  ) : (
                    <span className="text-sm font-bold">{step.step}</span>
                  )}
                </motion.div>

                <span
                  className={`text-xs sm:text-sm font-medium transition-colors ${
                    isCurrent
                      ? "text-blue-600 font-semibold"
                      : isCompleted
                        ? "text-gray-700 dark:text-gray-300"
                        : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      {/* Mobile Stepper */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Step {currentStep} of {STEPS.length}
          </span>
          <span className="text-sm font-semibold text-blue-600">
            {STEPS[currentStep - 1].title}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Step Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {STEPS.map((step) => {
            const isCompleted = completedSteps.includes(step.step as 1 | 2 | 3 | 4)
            const isCurrent = currentStep === step.step

            return (
              <button
                key={step.step}
                onClick={() => {
                  if (isCompleted || isCurrent) {
                    goToStep(step.step as 1 | 2 | 3 | 4)
                  }
                }}
                className={`
                  h-2 rounded-full transition-all duration-200
                  ${isCurrent ? "w-8 bg-blue-600" : "w-2"}
                  ${isCompleted && !isCurrent ? "bg-blue-400" : ""}
                  ${!isCompleted && !isCurrent ? "bg-gray-300 dark:bg-gray-600" : ""}
                `}
                aria-label={`Go to ${step.title}`}
              />
            )
          })}
        </div>
      </div>
    </nav>
  )
}
