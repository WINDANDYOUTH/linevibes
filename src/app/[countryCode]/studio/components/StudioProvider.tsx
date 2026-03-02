"use client"

import React, { createContext, useContext, useReducer, useEffect } from "react"
import { nanoid } from "nanoid"
import {
  StudioState,
  StudioAction,
  COLOR_VARIANTS,
  STUDIO_CONSTANTS,
  LegendItem,
} from "@/types/studio"

// ==================== Initial State ====================

const createInitialState = (): StudioState => ({
  currentStep: 1,
  completedSteps: [],
  uploadedImageUrl: null,
  uploadedImageFile: null,
  title: "",
  subtitle: "",
  legendItems: [],
  generatedLineartUrl: null,
  isGenerating: false,
  generationError: null,
  cachedGeneration: null,
  shouldRegenerate: false,
  selectedColorVariant: COLOR_VARIANTS[0], // Classic Blueprint
  selectedFrameOption: "none",
  selectedLegendPosition: "topLeft",
  sessionId: nanoid(),
})

// ==================== Reducer ====================

const studioReducer = (
  state: StudioState,
  action: StudioAction
): StudioState => {
  switch (action.type) {
    case "SET_STEP":
      return {
        ...state,
        currentStep: action.payload.step,
      }

    case "MARK_STEP_COMPLETED":
      if (!state.completedSteps.includes(action.payload.step)) {
        return {
          ...state,
          completedSteps: [...state.completedSteps, action.payload.step],
        }
      }
      return state

    case "SET_UPLOADED_IMAGE":
      return {
        ...state,
        uploadedImageUrl: action.payload.url,
        uploadedImageFile: action.payload.file,
        currentStep: 2,
        completedSteps: state.completedSteps.includes(1)
          ? state.completedSteps
          : [...state.completedSteps, 1],
      }

    case "SET_TITLE":
      return {
        ...state,
        title: action.payload.title,
      }

    case "SET_SUBTITLE":
      return {
        ...state,
        subtitle: action.payload.subtitle,
      }

    case "SET_LEGEND_ITEMS":
      return {
        ...state,
        legendItems: action.payload.items,
      }

    case "ADD_LEGEND_ITEM":
      return {
        ...state,
        legendItems: [...state.legendItems, action.payload.item],
      }

    case "REMOVE_LEGEND_ITEM":
      return {
        ...state,
        legendItems: state.legendItems.filter(
          (item) => item.id !== action.payload.id
        ),
      }

    case "UPDATE_LEGEND_ITEM":
      return {
        ...state,
        legendItems: state.legendItems.map((item) =>
          item.id === action.payload.id
            ? { ...item, label: action.payload.label }
            : item
        ),
      }

    case "START_GENERATION":
      return {
        ...state,
        isGenerating: true,
        generationError: null,
        currentStep: 3,
        completedSteps: state.completedSteps.includes(2)
          ? state.completedSteps
          : [...state.completedSteps, 2],
      }

    case "GENERATION_SUCCESS":
      return {
        ...state,
        generatedLineartUrl: action.payload.url,
        isGenerating: false,
        generationError: null,
        currentStep: 4,
        completedSteps: state.completedSteps.includes(3)
          ? state.completedSteps
          : [...state.completedSteps, 3],
      }

    case "GENERATION_ERROR":
      return {
        ...state,
        isGenerating: false,
        generationError: action.payload.error,
        currentStep: 2, // Go back to customize step
      }

    case "CACHE_GENERATION_RESULT":
      return {
        ...state,
        cachedGeneration: {
          lineartUrl: action.payload.lineartUrl,
          timestamp: Date.now(),
          fileId: action.payload.fileId,
        },
        shouldRegenerate: false,
      }

    case "REQUEST_REGENERATION":
      return {
        ...state,
        shouldRegenerate: true,
        cachedGeneration: null,  // Clear cache when regenerating
      }

    case "SET_COLOR_VARIANT":
      return {
        ...state,
        selectedColorVariant: action.payload.variant,
      }

    case "SET_FRAME_OPTION":
      return {
        ...state,
        selectedFrameOption: action.payload.option,
      }

    case "SET_LEGEND_POSITION":
      return {
        ...state,
        selectedLegendPosition: action.payload.position,
      }

    case "RESET_STATE":
      return createInitialState()

    case "RESTORE_FROM_STORAGE":
      return {
        ...state,
        ...action.payload.state,
      }

    default:
      return state
  }
}

// ==================== Context ====================

interface StudioContextType {
  state: StudioState
  dispatch: React.Dispatch<StudioAction>
  // Helper functions
  goToStep: (step: 1 | 2 | 3 | 4) => void
  resetStudio: () => void
}

const StudioContext = createContext<StudioContextType | undefined>(undefined)

// ==================== Provider Component ====================

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(studioReducer, null, createInitialState)

  // Persist state to localStorage
  useEffect(() => {
    const saveState = () => {
      try {
        const stateToSave = {
          ...state,
          uploadedImageFile: null, // Don't save File objects
        }
        localStorage.setItem(
          STUDIO_CONSTANTS.SESSION_STORAGE_KEY,
          JSON.stringify(stateToSave)
        )
      } catch (error) {
        console.error("Failed to save studio state:", error)
      }
    }

    // Save state whenever it changes
    const timeoutId = setTimeout(saveState, 500) // Debounce

    return () => clearTimeout(timeoutId)
  }, [state])

  // Restore state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(
        STUDIO_CONSTANTS.SESSION_STORAGE_KEY
      )
      if (savedState) {
        const parsed = JSON.parse(savedState)
        dispatch({
          type: "RESTORE_FROM_STORAGE",
          payload: { state: parsed },
        })
      }
    } catch (error) {
      console.error("Failed to restore studio state:", error)
    }
  }, [])

  const goToStep = (step: 1 | 2 | 3 | 4) => {
    dispatch({ type: "SET_STEP", payload: { step } })
  }

  const resetStudio = () => {
    localStorage.removeItem(STUDIO_CONSTANTS.SESSION_STORAGE_KEY)
    dispatch({ type: "RESET_STATE" })
  }

  const value: StudioContextType = {
    state,
    dispatch,
    goToStep,
    resetStudio,
  }

  return (
    <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
  )
}

// ==================== Hook ====================

export function useStudio() {
  const context = useContext(StudioContext)
  if (context === undefined) {
    throw new Error("useStudio must be used within a StudioProvider")
  }
  return context
}
