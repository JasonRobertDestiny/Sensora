'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Mood quadrant visualization
function MoodQuadrant({
  valence,
  arousal,
  onPositionChange,
}: {
  valence: number
  arousal: number
  onPositionChange: (v: number, a: number) => void
}) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = 1 - (e.clientY - rect.top) / rect.height

    // Convert to -1 to 1 range
    const newValence = x * 2 - 1
    const newArousal = y * 2 - 1

    onPositionChange(newValence, newArousal)
  }

  // Calculate position percentages
  const xPos = ((valence + 1) / 2) * 100
  const yPos = (1 - (arousal + 1) / 2) * 100

  // Get mood label based on position
  const getMoodLabel = () => {
    if (valence > 0.15 && arousal > 0.15) return 'Excited / Joyful'
    if (valence > 0.15 && arousal < -0.15) return 'Calm / Content'
    if (valence < -0.15 && arousal > 0.15) return 'Tense / Anxious'
    if (valence < -0.15 && arousal < -0.15) return 'Melancholic / Sad'
    return 'Neutral / Balanced'
  }

  return (
    <div className="space-y-4">
      <div
        className="relative w-full aspect-square rounded-2xl bg-aether-void/50 border border-aether-purple/30 cursor-crosshair overflow-hidden"
        onClick={handleClick}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-aether-purple/30" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-px bg-aether-purple/30" />
        </div>

        {/* Quadrant labels */}
        <div className="absolute top-3 left-3 text-xs text-aether-cream/30">Tense</div>
        <div className="absolute top-3 right-3 text-xs text-aether-cream/30">Excited</div>
        <div className="absolute bottom-3 left-3 text-xs text-aether-cream/30">Sad</div>
        <div className="absolute bottom-3 right-3 text-xs text-aether-cream/30">Calm</div>

        {/* Axis labels */}
        <div className="absolute top-1/2 left-2 -translate-y-1/2 text-xs text-aether-gold/50 -rotate-90">
          Arousal
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-aether-gold/50">
          Valence
        </div>

        {/* Color gradient background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(circle at 75% 25%, rgba(201, 169, 98, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 25% 25%, rgba(139, 115, 64, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(201, 169, 98, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 25% 75%, rgba(74, 44, 106, 0.4) 0%, transparent 50%)
            `,
          }}
        />

        {/* Position indicator */}
        <motion.div
          className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${xPos}%`, top: `${yPos}%` }}
          animate={{ left: `${xPos}%`, top: `${yPos}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-aether-gold/30 blur-md"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="absolute inset-0 rounded-full bg-aether-gold border-2 border-aether-gold-light" />
        </motion.div>
      </div>

      {/* Current mood display */}
      <motion.div
        className="text-center"
        key={getMoodLabel()}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-aether-gold font-medium">{getMoodLabel()}</span>
      </motion.div>
    </div>
  )
}

// EEG visualization placeholder
function EEGPlaceholder() {
  return (
    <div className="relative p-6 rounded-xl bg-aether-void/50 border border-aether-purple/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 rounded-full bg-aether-purple animate-pulse" />
        <span className="text-aether-cream/50 text-sm">EEG Device Not Connected</span>
      </div>

      {/* Simulated waveform */}
      <div className="h-24 relative overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
          <motion.path
            d="M0 50 Q25 30 50 50 T100 50 T150 50 T200 50 T250 50 T300 50 T350 50 T400 50"
            stroke="rgba(201, 169, 98, 0.3)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-aether-cream/30 text-sm">
            Connect Muse headband for neural input
          </p>
        </div>
      </div>

      <button className="mt-4 w-full py-2 rounded-lg border border-aether-purple/50 text-aether-cream/50 text-sm hover:border-aether-gold/50 hover:text-aether-gold transition-colors">
        Connect EEG Device
      </button>
    </div>
  )
}

// Suggested prompts
const suggestedPrompts = [
  'A misty morning in a Japanese garden after rain',
  'Warm amber light through honey-colored glass',
  'The last page of a leather-bound book in an old library',
  'Cool ocean breeze mingling with sun-warmed driftwood',
  'Velvet petals falling on ancient stone steps',
]

// Progress steps
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

export default function NeuroBriefPage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [valence, setValence] = useState(0.3)
  const [arousal, setArousal] = useState(0.2)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)

  useEffect(() => {
    // Check if calibration data exists
    const calibration = localStorage.getItem('sensora_calibration')
    if (!calibration) {
      router.push('/calibration')
    }
  }, [router])

  const canProceed = prompt.trim().length > 10

  const handleSubmit = async () => {
    if (!canProceed) return

    setIsSubmitting(true)

    // Store neuro-brief data
    const neuroBriefData = {
      prompt,
      valence,
      arousal,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem('sensora_neuro_brief', JSON.stringify(neuroBriefData))

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    router.push('/result')
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
        <Link href="/calibration" className="text-aether-cream/50 hover:text-aether-gold transition-colors text-sm">
          Back
        </Link>
      </motion.nav>

      <div className="max-w-4xl mx-auto">
        {/* Progress */}
        <ProgressSteps currentStep={1} />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Text prompt */}
          <motion.div
            className="glass-card p-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-6">
              <motion.p
                className="text-aether-gold uppercase tracking-[0.2em] text-sm mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Step 2 of 3
              </motion.p>
              <motion.h1
                className="font-display text-2xl md:text-3xl text-aether-cream mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Describe Your Vision
              </motion.h1>
              <motion.p
                className="text-aether-cream/60 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Paint a picture with words. Be poetic, be specific.
              </motion.p>
            </div>

            {/* Text input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value)
                  setShowSuggestions(false)
                }}
                placeholder="Describe your perfect scent..."
                className="input-aether h-40 resize-none"
                maxLength={500}
              />
              <div className="flex justify-between mt-2 text-xs text-aether-cream/40">
                <span>{prompt.length}/500 characters</span>
                <span>{prompt.length < 10 ? 'Minimum 10 characters' : 'Ready'}</span>
              </div>
            </motion.div>

            {/* Suggestions */}
            <AnimatePresence>
              {showSuggestions && prompt.length === 0 && (
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p className="text-aether-cream/50 text-sm mb-3">Need inspiration?</p>
                  <div className="space-y-2">
                    {suggestedPrompts.map((suggestion, i) => (
                      <motion.button
                        key={i}
                        className="block w-full text-left p-3 rounded-lg bg-aether-void/30 border border-aether-purple/20 text-aether-cream/60 text-sm hover:border-aether-gold/30 hover:text-aether-cream transition-all"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        onClick={() => {
                          setPrompt(suggestion)
                          setShowSuggestions(false)
                        }}
                      >
                        "{suggestion}"
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: Mood quadrant and EEG */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Mood quadrant */}
            <div className="glass-card p-6">
              <h3 className="text-aether-cream font-medium mb-4">Emotional Tone</h3>
              <p className="text-aether-cream/50 text-sm mb-4">
                Click to position your desired emotional atmosphere
              </p>
              <MoodQuadrant
                valence={valence}
                arousal={arousal}
                onPositionChange={(v, a) => {
                  setValence(v)
                  setArousal(a)
                }}
              />
            </div>

            {/* EEG placeholder */}
            <EEGPlaceholder />
          </motion.div>
        </div>

        {/* Submit button */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={handleSubmit}
            disabled={!canProceed || isSubmitting}
            className={`w-full btn-glow ${
              !canProceed || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-3">
                <motion.span
                  className="w-5 h-5 border-2 border-aether-void/30 border-t-aether-void rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Generating Your Formula...
              </span>
            ) : (
              'Create My Fragrance'
            )}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
