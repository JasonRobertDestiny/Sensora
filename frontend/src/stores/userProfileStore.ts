import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
interface CalibrationData {
  ph: number
  skinType: 'dry' | 'normal' | 'oily' | null
  temperature: number
  timestamp: string | null
}

interface NeuroBriefData {
  prompt: string
  valence: number
  arousal: number
  timestamp: string | null
}

interface Ingredient {
  name: string
  concentration: number
  sustainable: boolean
}

interface FormulaData {
  id: string | null
  name: string
  description: string
  topNotes: Ingredient[]
  middleNotes: Ingredient[]
  baseNotes: Ingredient[]
  metrics: {
    longevity: number
    projection: number
    uniqueness: number
    sustainability: number
    ifraCompliance: number
  }
  physioCorrections: string[]
  createdAt: string | null
}

interface UserProfileState {
  // Calibration step
  calibration: CalibrationData
  setCalibration: (data: Partial<CalibrationData>) => void
  resetCalibration: () => void

  // Neuro-brief step
  neuroBrief: NeuroBriefData
  setNeuroBrief: (data: Partial<NeuroBriefData>) => void
  resetNeuroBrief: () => void

  // Generated formula
  formula: FormulaData | null
  setFormula: (formula: FormulaData) => void
  resetFormula: () => void

  // Current step in the flow
  currentStep: number
  setCurrentStep: (step: number) => void

  // Loading states
  isGenerating: boolean
  setIsGenerating: (value: boolean) => void

  // Error handling
  error: string | null
  setError: (error: string | null) => void

  // Reset entire state
  resetAll: () => void

  // Check if calibration is complete
  isCalibrationComplete: () => boolean

  // Check if neuro-brief is complete
  isNeuroBriefComplete: () => boolean
}

const initialCalibration: CalibrationData = {
  ph: 5.5,
  skinType: null,
  temperature: 36.5,
  timestamp: null,
}

const initialNeuroBrief: NeuroBriefData = {
  prompt: '',
  valence: 0,
  arousal: 0,
  timestamp: null,
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set, get) => ({
      // Calibration
      calibration: initialCalibration,
      setCalibration: (data) =>
        set((state) => ({
          calibration: {
            ...state.calibration,
            ...data,
            timestamp: new Date().toISOString(),
          },
        })),
      resetCalibration: () => set({ calibration: initialCalibration }),

      // Neuro-brief
      neuroBrief: initialNeuroBrief,
      setNeuroBrief: (data) =>
        set((state) => ({
          neuroBrief: {
            ...state.neuroBrief,
            ...data,
            timestamp: new Date().toISOString(),
          },
        })),
      resetNeuroBrief: () => set({ neuroBrief: initialNeuroBrief }),

      // Formula
      formula: null,
      setFormula: (formula) => set({ formula }),
      resetFormula: () => set({ formula: null }),

      // Current step
      currentStep: 0,
      setCurrentStep: (step) => set({ currentStep: step }),

      // Loading
      isGenerating: false,
      setIsGenerating: (value) => set({ isGenerating: value }),

      // Error
      error: null,
      setError: (error) => set({ error }),

      // Reset all
      resetAll: () =>
        set({
          calibration: initialCalibration,
          neuroBrief: initialNeuroBrief,
          formula: null,
          currentStep: 0,
          isGenerating: false,
          error: null,
        }),

      // Validation helpers
      isCalibrationComplete: () => {
        const { calibration } = get()
        return calibration.skinType !== null && calibration.timestamp !== null
      },

      isNeuroBriefComplete: () => {
        const { neuroBrief } = get()
        return neuroBrief.prompt.length >= 10 && neuroBrief.timestamp !== null
      },
    }),
    {
      name: 'sensora-user-profile',
      partialize: (state) => ({
        calibration: state.calibration,
        neuroBrief: state.neuroBrief,
        formula: state.formula,
        currentStep: state.currentStep,
      }),
    }
  )
)

// Selector hooks for performance optimization
export const useCalibration = () =>
  useUserProfileStore((state) => state.calibration)

export const useNeuroBrief = () =>
  useUserProfileStore((state) => state.neuroBrief)

export const useFormula = () => useUserProfileStore((state) => state.formula)

export const useCurrentStep = () =>
  useUserProfileStore((state) => state.currentStep)

export const useIsGenerating = () =>
  useUserProfileStore((state) => state.isGenerating)

export const useError = () => useUserProfileStore((state) => state.error)

// Action hooks
export const useCalibrationActions = () => ({
  setCalibration: useUserProfileStore((state) => state.setCalibration),
  resetCalibration: useUserProfileStore((state) => state.resetCalibration),
  isComplete: useUserProfileStore((state) => state.isCalibrationComplete),
})

export const useNeuroBriefActions = () => ({
  setNeuroBrief: useUserProfileStore((state) => state.setNeuroBrief),
  resetNeuroBrief: useUserProfileStore((state) => state.resetNeuroBrief),
  isComplete: useUserProfileStore((state) => state.isNeuroBriefComplete),
})

export const useFormulaActions = () => ({
  setFormula: useUserProfileStore((state) => state.setFormula),
  resetFormula: useUserProfileStore((state) => state.resetFormula),
  setIsGenerating: useUserProfileStore((state) => state.setIsGenerating),
})

export default useUserProfileStore
