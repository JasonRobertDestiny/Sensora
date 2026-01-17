'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
    <div className="flex items-center justify-center gap-4 mb-12">
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
                index < currentStep ? 'bg-aether-gold' : 'bg-aether-purple/50'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// pH indicator visualization
function PhIndicator({ value }: { value: number }) {
  const getPhColor = (ph: number) => {
    if (ph < 4.5) return 'from-red-500 to-orange-500'
    if (ph < 5.5) return 'from-orange-400 to-yellow-400'
    if (ph < 6.5) return 'from-yellow-300 to-green-400'
    if (ph < 7.5) return 'from-green-400 to-teal-400'
    return 'from-teal-400 to-blue-500'
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
      <div className="h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 to-blue-500 opacity-30" />
      <motion.div
        className="absolute top-0 h-4 rounded-full"
        style={{
          width: '20%',
          left: `${((value - 3) / 6) * 100}%`,
          transform: 'translateX(-50%)',
        }}
        animate={{ left: `${((value - 3) / 6) * 100}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className={`h-full rounded-full bg-gradient-to-r ${getPhColor(value)} blur-sm`} />
        <div className={`absolute inset-0 h-full rounded-full bg-gradient-to-r ${getPhColor(value)}`} />
      </motion.div>
      <motion.div
        className="mt-2 text-center text-sm text-aether-gold"
        key={getPhLabel(value)}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {getPhLabel(value)}
      </motion.div>
    </div>
  )
}

export default function CalibrationPage() {
  const router = useRouter()
  const [ph, setPh] = useState(5.5)
  const [skinType, setSkinType] = useState<string | null>(null)
  const [temperature, setTemperature] = useState(36.5)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canProceed = skinType !== null

  const handleSubmit = async () => {
    if (!canProceed) return

    setIsSubmitting(true)

    // Store calibration data in localStorage for now
    // In production, this would go to the API
    const calibrationData = {
      ph,
      skinType,
      temperature,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem('sensora_calibration', JSON.stringify(calibrationData))

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    router.push('/neuro-brief')
  }

  return (
    <div className="min-h-screen py-8 px-6">
      {/* Header */}
      <motion.nav
        className="max-w-4xl mx-auto flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link href="/" className="font-display text-xl text-gold-gradient">
          SENSORA
        </Link>
        <Link href="/" className="text-aether-cream/50 hover:text-aether-gold transition-colors text-sm">
          Exit
        </Link>
      </motion.nav>

      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <ProgressSteps currentStep={0} />

        {/* Main content */}
        <motion.div
          className="glass-card p-8 md:p-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center mb-10">
            <motion.p
              className="text-aether-gold uppercase tracking-[0.2em] text-sm mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Step 1 of 3
            </motion.p>
            <motion.h1
              className="font-display text-3xl md:text-4xl text-aether-cream mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Bio-Calibration
            </motion.h1>
            <motion.p
              className="text-aether-cream/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Help us understand your unique skin chemistry
            </motion.p>
          </div>

          {/* pH Slider */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <label className="text-aether-cream font-medium">Skin pH Level</label>
              <span className="font-mono text-aether-gold text-lg">{ph.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="3.0"
              max="9.0"
              step="0.1"
              value={ph}
              onChange={(e) => setPh(parseFloat(e.target.value))}
              className="slider-aether mb-4"
            />
            <PhIndicator value={ph} />
            <p className="text-aether-cream/40 text-xs mt-3 text-center">
              Normal skin pH ranges from 4.5 to 5.5. Use a pH test strip to measure accurately.
            </p>
          </motion.div>

          {/* Skin Type Selector */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="text-aether-cream font-medium block mb-4">Skin Type</label>
            <div className="grid grid-cols-3 gap-4">
              {skinTypes.map((type) => (
                <motion.button
                  key={type.id}
                  onClick={() => setSkinType(type.id)}
                  className={`relative p-4 rounded-xl border transition-all duration-300 ${
                    skinType === type.id
                      ? 'border-aether-gold bg-aether-gold/10'
                      : 'border-aether-purple/50 bg-aether-void/30 hover:border-aether-purple'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`mb-2 mx-auto w-fit ${
                      skinType === type.id ? 'text-aether-gold' : 'text-aether-cream/50'
                    }`}
                  >
                    {type.icon}
                  </div>
                  <p
                    className={`font-medium text-sm ${
                      skinType === type.id ? 'text-aether-gold' : 'text-aether-cream/70'
                    }`}
                  >
                    {type.label}
                  </p>
                  <p className="text-aether-cream/40 text-xs mt-1 hidden md:block">
                    {type.description}
                  </p>

                  {/* Selection indicator */}
                  <AnimatePresence>
                    {skinType === type.id && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-5 h-5 bg-aether-gold rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <svg className="w-3 h-3 text-aether-void" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Temperature Slider */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center justify-between mb-4">
              <label className="text-aether-cream font-medium">Body Temperature</label>
              <span className="font-mono text-aether-gold text-lg">{temperature.toFixed(1)}C</span>
            </div>
            <input
              type="range"
              min="35.0"
              max="38.0"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="slider-aether"
            />
            <div className="flex justify-between text-aether-cream/40 text-xs mt-2">
              <span>35.0C</span>
              <span>Normal: 36.1 - 37.2C</span>
              <span>38.0C</span>
            </div>
          </motion.div>

          {/* Info box */}
          <motion.div
            className="p-4 rounded-xl bg-aether-purple/20 border border-aether-purple/30 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex gap-3">
              <div className="text-aether-gold shrink-0 mt-0.5">
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
                <p className="text-aether-cream/80 text-sm">
                  <span className="text-aether-gold font-medium">Why this matters:</span>{' '}
                  Your skin's pH affects how fragrance molecules react with your natural oils.
                  Temperature influences evaporation rates. Skin type determines how long scents linger.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Submit button */}
          <motion.button
            onClick={handleSubmit}
            disabled={!canProceed || isSubmitting}
            className={`w-full btn-glow ${
              !canProceed || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={canProceed && !isSubmitting ? { scale: 1.01 } : {}}
            whileTap={canProceed && !isSubmitting ? { scale: 0.99 } : {}}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  className="w-5 h-5 border-2 border-aether-void/30 border-t-aether-void rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Processing...
              </span>
            ) : (
              'Continue to Scent Brief'
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
