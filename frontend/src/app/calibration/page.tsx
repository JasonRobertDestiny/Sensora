'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import StressProfile from '@/components/wellness/StressProfile'
import HeartRateMonitor from '@/components/wellness/HeartRateMonitor'

// Skin type options with descriptions
const skinTypes = [
  {
    id: 'dry',
    label: 'Dry',
    description: 'Tight feeling, visible flakes, matte appearance',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    id: 'normal',
    label: 'Normal',
    description: 'Balanced, minimal concerns, even texture',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'oily',
    label: 'Oily',
    description: 'Shiny appearance, enlarged pores, prone to breakouts',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
]

// Progress steps component
function ProgressSteps({ currentStep }: { currentStep: number }) {
  const steps = ['Bio-Calibration', 'Scent Brief', 'Your Formula']

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <motion.div
            className={`progress-step ${index < currentStep ? 'completed' : ''} ${
              index === currentStep ? 'active' : ''
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {index < currentStep ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="text-sm font-medium">{index + 1}</span>
            )}
          </motion.div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 md:w-24 h-0.5 mx-2 transition-colors duration-500 ${
                index < currentStep ? 'bg-sensora-teal-500' : 'bg-sensora-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// pH indicator visualization - light theme
function PhIndicator({ value }: { value: number }) {
  const getPhColor = (ph: number) => {
    if (ph < 4.5) return 'from-red-400 to-orange-400'
    if (ph < 5.5) return 'from-orange-300 to-yellow-300'
    if (ph < 6.5) return 'from-yellow-200 to-green-300'
    if (ph < 7.5) return 'from-green-300 to-teal-300'
    return 'from-teal-300 to-blue-400'
  }

  const getPhLabel = (ph: number) => {
    if (ph < 4.5) return 'Very Acidic'
    if (ph < 5.5) return 'Acidic'
    if (ph < 6.5) return 'Slightly Acidic'
    if (ph < 7.5) return 'Neutral'
    return 'Alkaline'
  }

  return (
    <div className="relative">
      <div className="h-4 rounded-full bg-gradient-to-r from-red-300 via-yellow-200 via-green-300 to-blue-300 opacity-50" />
      <motion.div
        className="absolute top-0 h-4 rounded-full"
        style={{
          width: '24px',
          left: `calc(${((value - 3) / 6) * 100}% - 12px)`,
        }}
        animate={{ left: `calc(${((value - 3) / 6) * 100}% - 12px)` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className={`h-full w-full rounded-full bg-gradient-to-r ${getPhColor(value)} shadow-md border-2 border-white`} />
      </motion.div>
      <motion.div
        className="mt-3 text-center"
        key={getPhLabel(value)}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="badge-teal">{getPhLabel(value)}</span>
      </motion.div>
    </div>
  )
}

export default function CalibrationPage() {
  const router = useRouter()
  const [ph, setPh] = useState(5.5)
  const [skinType, setSkinType] = useState<string | null>(null)
  const [temperature, setTemperature] = useState(36.5)
  const [stressLevel, setStressLevel] = useState(50)
  const [heartRate, setHeartRate] = useState(72)
  const [lifestyleScenario, setLifestyleScenario] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeSection, setActiveSection] = useState<'skin' | 'wellness'>('skin')

  const canProceed = skinType !== null

  const handleSubmit = async () => {
    if (!canProceed) return

    setIsSubmitting(true)

    // Store calibration data in localStorage
    const calibrationData = {
      ph,
      skinType,
      temperature,
      stressLevel,
      heartRate,
      lifestyleScenario,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem('sensora_calibration', JSON.stringify(calibrationData))

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    router.push('/neuro-brief')
  }

  return (
    <div className="min-h-screen py-8 px-6">
      {/* Decorative background elements */}
      <div className="wellness-blob w-96 h-96 -top-48 -left-48 opacity-50" />
      <div className="wellness-blob w-64 h-64 top-1/2 -right-32 opacity-30" style={{ animationDelay: '2s' }} />

      {/* Header */}
      <motion.nav
        className="max-w-5xl mx-auto flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link href="/" className="font-display text-xl text-teal-gradient">
          SENSORA
        </Link>
        <Link href="/" className="text-sensora-text-soft hover:text-sensora-teal-600 transition-colors text-sm font-medium">
          Exit
        </Link>
      </motion.nav>

      <div className="max-w-5xl mx-auto">
        {/* Progress */}
        <ProgressSteps currentStep={0} />

        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="badge-teal mb-3 inline-block">Step 1 of 3</span>
          <h1 className="font-display text-3xl md:text-4xl text-sensora-text mb-2">
            Bio-Calibration
          </h1>
          <p className="text-sensora-text-soft max-w-md mx-auto">
            Help us understand your unique skin chemistry and wellness state
          </p>
        </motion.div>

        {/* Section Toggle */}
        <motion.div
          className="flex justify-center gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setActiveSection('skin')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              activeSection === 'skin'
                ? 'bg-sensora-teal-500 text-white shadow-wellness'
                : 'bg-white text-sensora-text-soft hover:bg-sensora-gray-50'
            }`}
          >
            Skin Profile
          </button>
          <button
            onClick={() => setActiveSection('wellness')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              activeSection === 'wellness'
                ? 'bg-sensora-teal-500 text-white shadow-wellness'
                : 'bg-white text-sensora-text-soft hover:bg-sensora-gray-50'
            }`}
          >
            Wellness Data
          </button>
        </motion.div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          {activeSection === 'skin' ? (
            <motion.div
              key="skin"
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Left Column - pH and Temperature */}
              <div className="space-y-6">
                {/* pH Slider */}
                <div className="wellness-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sensora-teal-100 to-sensora-teal-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-sensora-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sensora-text font-semibold">Skin pH Level</h3>
                      <p className="text-sensora-text-soft text-sm">Affects fragrance molecule reaction</p>
                    </div>
                    <span className="text-2xl font-bold text-sensora-teal-600">{ph.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="3.0"
                    max="9.0"
                    step="0.1"
                    value={ph}
                    onChange={(e) => setPh(parseFloat(e.target.value))}
                    className="slider-sensora mb-4"
                  />
                  <PhIndicator value={ph} />
                  <p className="text-sensora-text-muted text-xs mt-4 text-center">
                    Normal skin pH ranges from 4.5 to 5.5
                  </p>
                </div>

                {/* Temperature Slider */}
                <div className="wellness-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sensora-gold-100 to-sensora-gold-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-sensora-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sensora-text font-semibold">Body Temperature</h3>
                      <p className="text-sensora-text-soft text-sm">Influences evaporation rates</p>
                    </div>
                    <span className="text-2xl font-bold text-sensora-gold-600">{temperature.toFixed(1)}°C</span>
                  </div>
                  <input
                    type="range"
                    min="35.0"
                    max="38.0"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="slider-sensora"
                  />
                  <div className="flex justify-between text-sensora-text-muted text-xs mt-2">
                    <span>35.0°C</span>
                    <span className="text-sensora-teal-600">Normal: 36.1 - 37.2°C</span>
                    <span>38.0°C</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Skin Type */}
              <div className="wellness-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sensora-teal-100 to-sensora-teal-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-sensora-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sensora-text font-semibold">Skin Type</h3>
                    <p className="text-sensora-text-soft text-sm">Determines scent longevity</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {skinTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      onClick={() => setSkinType(type.id)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left flex items-center gap-4 ${
                        skinType === type.id
                          ? 'border-sensora-teal-500 bg-sensora-teal-50'
                          : 'border-sensora-gray-100 bg-white hover:border-sensora-gray-200 hover:bg-sensora-gray-50'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          skinType === type.id
                            ? 'bg-sensora-teal-100 text-sensora-teal-600'
                            : 'bg-sensora-gray-100 text-sensora-text-soft'
                        }`}
                      >
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-semibold ${
                            skinType === type.id ? 'text-sensora-teal-700' : 'text-sensora-text'
                          }`}
                        >
                          {type.label}
                        </p>
                        <p className="text-sensora-text-muted text-sm">{type.description}</p>
                      </div>
                      <AnimatePresence>
                        {skinType === type.id && (
                          <motion.div
                            className="w-6 h-6 bg-sensora-teal-500 rounded-full flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="wellness"
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Left Column - Stress Profile */}
              <StressProfile
                stressLevel={stressLevel}
                onChange={setStressLevel}
                lifestyleScenario={lifestyleScenario}
                onScenarioChange={setLifestyleScenario}
              />

              {/* Right Column - Heart Rate Monitor */}
              <HeartRateMonitor
                heartRate={heartRate}
                onChange={setHeartRate}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info box */}
        <motion.div
          className="mt-8 p-5 rounded-2xl bg-white border border-sensora-gray-100 shadow-soft"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex gap-4">
            <div className="text-sensora-teal-500 shrink-0 mt-0.5">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sensora-text">
                <span className="text-sensora-teal-600 font-semibold">Science-backed personalization:</span>{' '}
                Your skin's pH affects how fragrance molecules react with your natural oils.
                Temperature influences evaporation rates. Stress hormones alter scent projection.
                We use all these factors to craft your perfect formula.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Submit button */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={handleSubmit}
            disabled={!canProceed || isSubmitting}
            className={`w-full btn-primary py-5 text-lg ${
              !canProceed || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-3">
                <motion.span
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Processing...
              </span>
            ) : (
              'Continue to Scent Brief'
            )}
          </button>
          {!canProceed && (
            <p className="text-center text-sensora-text-muted text-sm mt-3">
              Please select your skin type to continue
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
