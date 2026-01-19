'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Mood quadrant visualization - light theme
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

  const getMoodColor = () => {
    if (valence > 0.15 && arousal > 0.15) return '#FBBF24' // gold - excited
    if (valence > 0.15 && arousal < -0.15) return '#10B981' // teal - calm
    if (valence < -0.15 && arousal > 0.15) return '#F43F5E' // rose - tense
    if (valence < -0.15 && arousal < -0.15) return '#6366F1' // indigo - melancholic
    return '#6B7280' // gray - neutral
  }

  return (
    <div className="space-y-4">
      <div
        className="relative w-full aspect-square rounded-2xl bg-white border-2 border-sensora-gray-100 cursor-crosshair overflow-hidden shadow-soft"
        onClick={handleClick}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-sensora-gray-200" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-px bg-sensora-gray-200" />
        </div>

        {/* Quadrant labels */}
        <div className="absolute top-3 left-3 text-xs text-sensora-text-muted font-medium">Tense</div>
        <div className="absolute top-3 right-3 text-xs text-sensora-text-muted font-medium">Excited</div>
        <div className="absolute bottom-3 left-3 text-xs text-sensora-text-muted font-medium">Sad</div>
        <div className="absolute bottom-3 right-3 text-xs text-sensora-text-muted font-medium">Calm</div>

        {/* Axis labels */}
        <div className="absolute top-1/2 left-2 -translate-y-1/2 text-xs text-sensora-teal-500 font-medium -rotate-90 origin-center">
          Arousal
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-sensora-teal-500 font-medium">
          Valence
        </div>

        {/* Color gradient background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 75% 25%, rgba(251, 191, 36, 0.4) 0%, transparent 40%),
              radial-gradient(circle at 25% 25%, rgba(244, 63, 94, 0.3) 0%, transparent 40%),
              radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.4) 0%, transparent 40%),
              radial-gradient(circle at 25% 75%, rgba(99, 102, 241, 0.3) 0%, transparent 40%)
            `,
          }}
        />

        {/* Position indicator */}
        <motion.div
          className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${xPos}%`, top: `${yPos}%` }}
          animate={{ left: `${xPos}%`, top: `${yPos}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full blur-md"
            style={{ backgroundColor: `${getMoodColor()}40` }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div
            className="absolute inset-0 rounded-full border-3 border-white shadow-lg"
            style={{ backgroundColor: getMoodColor() }}
          />
        </motion.div>
      </div>

      {/* Current mood display */}
      <motion.div
        className="text-center"
        key={getMoodLabel()}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span
          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: `${getMoodColor()}15`,
            color: getMoodColor()
          }}
        >
          {getMoodLabel()}
        </span>
      </motion.div>
    </div>
  )
}

// EEG visualization placeholder - light theme
function EEGPlaceholder() {
  return (
    <div className="relative p-6 rounded-2xl bg-white border border-sensora-gray-100 shadow-soft">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 rounded-full bg-sensora-gray-300 animate-pulse" />
        <span className="text-sensora-text-soft text-sm">EEG Device Not Connected</span>
      </div>

      {/* Simulated waveform */}
      <div className="h-20 relative overflow-hidden rounded-xl bg-sensora-gray-50">
        <svg className="w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none">
          <motion.path
            d="M0 40 Q25 25 50 40 T100 40 T150 40 T200 40 T250 40 T300 40 T350 40 T400 40"
            stroke="rgba(16, 185, 129, 0.3)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sensora-text-muted text-sm">
            Connect Muse headband for neural input
          </p>
        </div>
      </div>

      <button className="mt-4 w-full py-2.5 rounded-xl border-2 border-sensora-gray-200 text-sensora-text-soft text-sm font-medium hover:border-sensora-teal-300 hover:text-sensora-teal-600 transition-colors">
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
      {/* Decorative background elements */}
      <div className="wellness-blob w-80 h-80 -top-40 -right-40 opacity-40" />
      <div className="wellness-blob w-64 h-64 bottom-20 -left-32 opacity-30" style={{ animationDelay: '3s' }} />

      {/* Header */}
      <motion.nav
        className="max-w-5xl mx-auto flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link href="/" className="font-display text-xl text-teal-gradient">
          SENSORA
        </Link>
        <Link href="/calibration" className="text-sensora-text-soft hover:text-sensora-teal-600 transition-colors text-sm font-medium">
          Back
        </Link>
      </motion.nav>

      <div className="max-w-5xl mx-auto">
        {/* Progress */}
        <ProgressSteps currentStep={1} />

        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="badge-teal mb-3 inline-block">Step 2 of 3</span>
          <h1 className="font-display text-3xl md:text-4xl text-sensora-text mb-2">
            Describe Your Vision
          </h1>
          <p className="text-sensora-text-soft max-w-md mx-auto">
            Paint a picture with words. Be poetic, be specific.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Text prompt */}
          <motion.div
            className="wellness-card p-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sensora-teal-100 to-sensora-teal-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-sensora-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sensora-text font-semibold">Your Scent Story</h3>
                <p className="text-sensora-text-soft text-sm">Describe your perfect fragrance</p>
              </div>
            </div>

            {/* Text input */}
            <div>
              <textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value)
                  setShowSuggestions(false)
                }}
                placeholder="Describe your perfect scent..."
                className="input-sensora h-40 resize-none"
                maxLength={500}
              />
              <div className="flex justify-between mt-2 text-xs text-sensora-text-muted">
                <span>{prompt.length}/500 characters</span>
                <span className={prompt.length >= 10 ? 'text-sensora-teal-600' : ''}>
                  {prompt.length < 10 ? 'Minimum 10 characters' : 'Ready'}
                </span>
              </div>
            </div>

            {/* Suggestions */}
            <AnimatePresence>
              {showSuggestions && prompt.length === 0 && (
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p className="text-sensora-text-soft text-sm mb-3 font-medium">Need inspiration?</p>
                  <div className="space-y-2">
                    {suggestedPrompts.map((suggestion, i) => (
                      <motion.button
                        key={i}
                        className="block w-full text-left p-3 rounded-xl bg-sensora-gray-50 border border-transparent text-sensora-text-soft text-sm hover:border-sensora-teal-200 hover:bg-sensora-teal-50 hover:text-sensora-text transition-all"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        onClick={() => {
                          setPrompt(suggestion)
                          setShowSuggestions(false)
                        }}
                      >
                        &ldquo;{suggestion}&rdquo;
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
            <div className="wellness-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sensora-gold-100 to-sensora-gold-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-sensora-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sensora-text font-semibold">Emotional Tone</h3>
                  <p className="text-sensora-text-soft text-sm">Click to position your mood</p>
                </div>
              </div>
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
                Generating Your Formula...
              </span>
            ) : (
              'Create My Fragrance'
            )}
          </button>
          {!canProceed && (
            <p className="text-center text-sensora-text-muted text-sm mt-3">
              Describe your ideal scent to continue (minimum 10 characters)
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
