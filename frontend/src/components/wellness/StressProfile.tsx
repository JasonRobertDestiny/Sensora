'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface StressProfileProps {
  stressLevel: number
  onChange: (level: number) => void
  lifestyleScenario?: string
  onScenarioChange?: (scenario: string) => void
}

const stressLevels = [
  { id: 'low', label: 'Low', value: 25, color: '#10B981', description: 'Relaxed and calm' },
  { id: 'medium', label: 'Medium', value: 50, color: '#FBBF24', description: 'Moderate daily stress' },
  { id: 'high', label: 'High', value: 75, color: '#F43F5E', description: 'Elevated stress levels' },
]

const lifestyleScenarios = [
  {
    id: 'morning',
    label: 'Morning Ritual',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    description: 'Fresh start, energizing notes',
    recommendedStress: 25,
  },
  {
    id: 'work',
    label: 'Work Focus',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Concentration and clarity',
    recommendedStress: 50,
  },
  {
    id: 'evening',
    label: 'Evening Unwind',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    description: 'Relaxation and calm',
    recommendedStress: 25,
  },
  {
    id: 'special',
    label: 'Special Occasion',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    description: 'Memorable and sophisticated',
    recommendedStress: 50,
  },
]

export default function StressProfile({
  stressLevel,
  onChange,
  lifestyleScenario,
  onScenarioChange,
}: StressProfileProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>(
    stressLevels.find(l => l.value === stressLevel)?.id || 'medium'
  )

  const getStressColor = (value: number) => {
    if (value <= 33) return '#10B981'
    if (value <= 66) return '#FBBF24'
    return '#F43F5E'
  }

  const getStressLabel = (value: number) => {
    if (value <= 33) return 'Low Stress'
    if (value <= 66) return 'Moderate Stress'
    return 'High Stress'
  }

  const handleLevelSelect = (level: typeof stressLevels[0]) => {
    setSelectedLevel(level.id)
    onChange(level.value)
  }

  return (
    <div className="space-y-6">
      {/* Stress Level Selector */}
      <div className="wellness-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sensora-rose-100 to-sensora-rose-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-sensora-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sensora-text font-semibold">Stress Profile</h3>
            <p className="text-sensora-text-soft text-sm">How are you feeling today?</p>
          </div>
        </div>

        {/* Visual Stress Meter */}
        <div className="relative mb-6">
          <div className="stress-indicator">
            <motion.div
              className="stress-marker"
              style={{ left: `${stressLevel}%` }}
              animate={{ left: `${stressLevel}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span className="text-sensora-teal-600">Relaxed</span>
            <span className="text-sensora-gold-600">Moderate</span>
            <span className="text-sensora-rose-500">Elevated</span>
          </div>
        </div>

        {/* Stress Level Buttons */}
        <div className="grid grid-cols-3 gap-3">
          {stressLevels.map((level) => (
            <motion.button
              key={level.id}
              onClick={() => handleLevelSelect(level)}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                selectedLevel === level.id
                  ? 'border-current bg-opacity-10'
                  : 'border-transparent bg-sensora-gray-50 hover:bg-sensora-gray-100'
              }`}
              style={{
                borderColor: selectedLevel === level.id ? level.color : 'transparent',
                backgroundColor: selectedLevel === level.id ? `${level.color}15` : undefined,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="w-4 h-4 rounded-full mx-auto mb-2"
                style={{ backgroundColor: level.color }}
              />
              <p className="font-medium text-sensora-text text-sm">{level.label}</p>
              <p className="text-xs text-sensora-text-muted mt-1">{level.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lifestyle Scenarios */}
      {onScenarioChange && (
        <div className="wellness-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sensora-teal-100 to-sensora-teal-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-sensora-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sensora-text font-semibold">Lifestyle Moment</h3>
              <p className="text-sensora-text-soft text-sm">When will you wear this scent?</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {lifestyleScenarios.map((scenario) => (
              <motion.button
                key={scenario.id}
                onClick={() => onScenarioChange(scenario.id)}
                className={`scenario-card text-left ${
                  lifestyleScenario === scenario.id ? 'selected' : ''
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`mb-2 ${
                  lifestyleScenario === scenario.id
                    ? 'text-sensora-teal-600'
                    : 'text-sensora-text-soft'
                }`}>
                  {scenario.icon}
                </div>
                <p className={`font-medium text-sm ${
                  lifestyleScenario === scenario.id
                    ? 'text-sensora-teal-700'
                    : 'text-sensora-text'
                }`}>
                  {scenario.label}
                </p>
                <p className="text-xs text-sensora-text-muted mt-1">
                  {scenario.description}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Stress Impact Info */}
      <motion.div
        className="p-4 rounded-2xl bg-gradient-to-r from-sensora-teal-50 to-sensora-bg border border-sensora-teal-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex gap-3">
          <div className="text-sensora-teal-500 shrink-0 mt-0.5">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sensora-text text-sm">
              <span className="text-sensora-teal-600 font-medium">Why stress matters:</span>{' '}
              Cortisol levels affect how fragrance molecules interact with your skin.
              We&apos;ll adjust top notes and fixatives to work with your body chemistry.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
