/**
 * Sensora API Client
 * Handles all communication with the FastAPI backend
 */

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/+$/, '')

// Types
export interface CalibrationData {
  ph: number
  skinType: 'dry' | 'normal' | 'oily'
  temperature: number
}

export interface UserProfile {
  id: string
  ph: number
  skinType: string
  temperature: number
  allergies: string[]
  createdAt: string
}

export interface NeuroBriefData {
  prompt: string
  valence: number
  arousal: number
}

export interface Ingredient {
  name: string
  concentration: number
  logp: number
  sustainable: boolean
  noteType: 'top' | 'middle' | 'base'
}

export interface Formula {
  id: string
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
  createdAt: string
}

export interface FormulaGenerationRequest {
  userProfileId: string
  prompt: string
  valence: number
  arousal: number
}

// API Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Generic fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new ApiError(
      response.status,
      response.statusText,
      errorBody || 'An error occurred'
    )
  }

  return response.json()
}

// API Functions

/**
 * Health check endpoint
 */
export async function checkHealth(): Promise<{ status: string }> {
  return apiFetch('/health')
}

/**
 * Create user profile from calibration data
 */
export async function createUserProfile(
  calibration: CalibrationData
): Promise<UserProfile> {
  return apiFetch('/api/calibration/profile', {
    method: 'POST',
    body: JSON.stringify({
      ph: calibration.ph,
      skin_type: calibration.skinType,
      temperature: calibration.temperature,
      allergies: [],
    }),
  })
}

/**
 * Analyze pH from test strip image
 */
export async function analyzePh(imageBase64: string): Promise<{ ph: number }> {
  return apiFetch('/api/calibration/analyze-ph', {
    method: 'POST',
    body: JSON.stringify({
      image_base64: imageBase64,
    }),
  })
}

/**
 * Generate personalized formula
 */
export async function generateFormula(
  request: FormulaGenerationRequest
): Promise<Formula> {
  return apiFetch('/api/formulation/generate', {
    method: 'POST',
    body: JSON.stringify({
      user_profile_id: request.userProfileId,
      prompt: request.prompt,
      valence: request.valence,
      arousal: request.arousal,
    }),
  })
}

/**
 * Validate formula against IFRA standards
 */
export async function validateFormula(formulaId: string): Promise<{
  valid: boolean
  violations: string[]
}> {
  return apiFetch('/api/formulation/validate', {
    method: 'POST',
    body: JSON.stringify({
      formula_id: formulaId,
    }),
  })
}

/**
 * Get list of available ingredients
 */
export async function getIngredients(): Promise<Ingredient[]> {
  return apiFetch('/api/ingredients')
}

/**
 * Get sustainable ingredients only
 */
export async function getSustainableIngredients(): Promise<Ingredient[]> {
  return apiFetch('/api/ingredients/sustainable')
}

// Utility functions

/**
 * Convert file to base64 for pH strip analysis
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      // Remove the data URL prefix
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = (error) => reject(error)
  })
}

/**
 * Format concentration percentage
 */
export function formatConcentration(value: number): string {
  return `${value.toFixed(1)}%`
}

/**
 * Calculate total concentration for validation
 */
export function calculateTotalConcentration(ingredients: Ingredient[]): number {
  return ingredients.reduce((sum, ing) => sum + ing.concentration, 0)
}

export default {
  checkHealth,
  createUserProfile,
  analyzePh,
  generateFormula,
  validateFormula,
  getIngredients,
  getSustainableIngredients,
  fileToBase64,
  formatConcentration,
  calculateTotalConcentration,
}
