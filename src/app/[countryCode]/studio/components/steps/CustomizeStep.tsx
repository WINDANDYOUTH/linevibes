"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Image as ImageIcon,  Check as CheckIcon } from "lucide-react"
import { nanoid } from "nanoid"
import { useStudio } from "../StudioProvider"
import { Button } from "../shared/Button"
import { FieldError } from "../shared/ErrorMessage"
import { VALIDATION_RULES, LegendItem } from "@/types/studio"

export default function CustomizeStep() {
  const { state, dispatch } = useStudio()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= VALIDATION_RULES.title.maxLength) {
      dispatch({ type: "SET_TITLE", payload: { title: value } })
      setErrors((prev) => ({ ...prev, title: "" }))
    }
  }

  const handleSubtitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= VALIDATION_RULES.subtitle.maxLength) {
      dispatch({ type: "SET_SUBTITLE", payload: { subtitle: value } })
      setErrors((prev) => ({ ...prev, subtitle: "" }))
    }
  }

  const handleAddLegendItem = () => {
    if (state.legendItems.length >= VALIDATION_RULES.legendItems.maxCount) {
      setErrors((prev) => ({
        ...prev,
        legend: `Maximum ${VALIDATION_RULES.legendItems.maxCount} legend items allowed`,
      }))
      return
    }

    const newItem: LegendItem = {
      id: nanoid(),
      label: "",
      symbolType: "line",
    }

    dispatch({ type: "ADD_LEGEND_ITEM", payload: { item: newItem } })
    setErrors((prev) => ({ ...prev, legend: "" }))
  }

  const handleRemoveLegendItem = (id: string) => {
    dispatch({ type: "REMOVE_LEGEND_ITEM", payload: { id } })
  }

  const handleLegendItemChange = (id: string, value: string) => {
    if (value.length <= VALIDATION_RULES.legendItems.labelMaxLength) {
      dispatch({ type: "UPDATE_LEGEND_ITEM", payload: { id, label: value } })
    }
  }

  const handleGenerate = async () => {
    // Validation
    const newErrors: Record<string, string> = {}

    if (!state.title || state.title.length < VALIDATION_RULES.title.minLength) {
      newErrors.title = "Title is required"
    }

    if (state.legendItems.some((item: LegendItem) => !item.label.trim())) {
      newErrors.legend = "All legend items must have labels"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Start generation
    dispatch({ type: "START_GENERATION" })

    // Call the AI generation API
    try {
      const response = await fetch("/api/studio/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: state.uploadedImageUrl,
          title: state.title,
          subtitle: state.subtitle,
          legendItems: state.legendItems,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Generation failed")
      }

      // Success! Cache the result AND update state
      dispatch({
        type: "CACHE_GENERATION_RESULT",
        payload: {
          lineartUrl: data.lineartUrl,
          fileId: data.fileId || "unknown",
        },
      })

      dispatch({
        type: "GENERATION_SUCCESS",
        payload: { url: data.lineartUrl },
      })
    } catch (error) {
      console.error("Generation error:", error)
      dispatch({
        type: "GENERATION_ERROR",
        payload: {
          error: error instanceof Error ? error.message : "Failed to generate blueprint. Please try again.",
        },
      })
    }
  }

  const handleRegenerate = () => {
    dispatch({ type: "REQUEST_REGENERATION" })
    // Will trigger generation immediately
    handleGenerate()
  }

  const handleViewPreview = () => {
    if (state.cachedGeneration) {
      // Use cached result - go directly to preview
      dispatch({
        type: "GENERATION_SUCCESS",
        payload: { url: state.cachedGeneration.lineartUrl },
      })
    }
  }

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: { step: 1 } })
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid lg:grid-cols-2 gap-8"
      >
        {/* Left: Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Customize Your Blueprint
          </h2>

          {/* Title Input */}
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={state.title}
              onChange={handleTitleChange}
              placeholder="e.g., Vintage Porsche 911"
              maxLength={VALIDATION_RULES.title.maxLength}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <div className="flex items-center justify-between mt-1">
              {errors.title && <FieldError message={errors.title} />}
              <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
                {state.title.length}/{VALIDATION_RULES.title.maxLength}
              </span>
            </div>
          </div>

          {/* Subtitle Input */}
          <div className="mb-6">
            <label
              htmlFor="subtitle"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Subtitle <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              id="subtitle"
              type="text"
              value={state.subtitle}
              onChange={handleSubtitleChange}
              placeholder="e.g., 1967 Classic Model"
              maxLength={VALIDATION_RULES.subtitle.maxLength}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {state.subtitle.length}/{VALIDATION_RULES.subtitle.maxLength}
              </span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Legend Items{" "}
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddLegendItem}
                disabled={
                  state.legendItems.length >= VALIDATION_RULES.legendItems.maxCount
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            {errors.legend && (
              <div className="mb-3">
                <FieldError message={errors.legend} />
              </div>
            )}

            <div className="space-y-3">
              {state.legendItems.map((item: LegendItem, index: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400 w-6">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) =>
                      handleLegendItemChange(item.id, e.target.value)
                    }
                    placeholder="e.g., Engine Bay"
                    maxLength={VALIDATION_RULES.legendItems.labelMaxLength}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    onClick={() => handleRemoveLegendItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}

              {state.legendItems.length === 0 && (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                  No legend items added yet
                </p>
              )}
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Add labels for different parts of your image (max{" "}
              {VALIDATION_RULES.legendItems.maxCount})
            </p>
          </div>

          {/* Cached Result Info */}
          {state.cachedGeneration && !state.shouldRegenerate && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckIcon className="h-5 w-5 text-green-600" />
                <p className="font-medium text-green-800 dark:text-green-200">
                  Blueprint already generated!
                </p>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                You can view your blueprint or generate a new version.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              ← Back
            </Button>
            
            {state.cachedGeneration && !state.shouldRegenerate ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleRegenerate}
                  className="flex-1"
                >
                  🔄 Regenerate
                </Button>
                <Button
                  variant="primary"
                  onClick={handleViewPreview}
                  className="flex-1"
                >
                  View Blueprint →
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={handleGenerate}
                className="flex-1"
                disabled={!state.title}
              >
                Generate Blueprint →
              </Button>
            )}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Live Preview
          </h3>

          {state.uploadedImageUrl ? (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="relative rounded-lg overflow-hidden bg-white dark:bg-gray-900 p-4">
                <img
                  src={state.uploadedImageUrl}
                  alt="Preview"
                  className="w-full h-auto rounded opacity-80"
                />

                {/* Overlay Text Preview */}
                <div className="absolute top-6 left-6 bg-white/90 dark:bg-gray-900/90 p-4 rounded backdrop-blur-sm max-w-[70%]">
                  {state.title && (
                    <p className="font-bold text-lg text-gray-900 dark:text-gray-100 font-mono">
                      {state.title}
                    </p>
                  )}
                  {state.subtitle && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-mono mt-1">
                      {state.subtitle}
                    </p>
                  )}
                  {state.legendItems.length > 0 && (
                    <div className="mt-3 space-y-1 text-xs font-mono text-gray-700 dark:text-gray-300">
                      {state.legendItems.map((item: LegendItem, idx: number) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <div className="w-4 h-px bg-gray-900 dark:bg-gray-100" />
                          <span>
                            {idx + 1}. {item.label || "Label"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <ImageIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  This is a preview. The final blueprint will be generated with AI
                  line art in the next step.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
              <p>No image uploaded</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
