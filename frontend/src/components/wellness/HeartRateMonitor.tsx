'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface HeartRateMonitorProps {
  heartRate: number
  onChange: (rate: number) => void
  isSimulating?: boolean
}

export default function HeartRateMonitor({
  heartRate,
  onChange,
  isSimulating = true,
}: HeartRateMonitorProps) {
  const [isAnimating, setIsAnimating] = useState(true)
  const [displayRate, setDisplayRate] = useState(heartRate)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  // Simulate slight heart rate variations
  useEffect(() => {
    if (!isSimulating) return

    const interval = setInterval(() => {
      const variation = (Math.random() - 0.5) * 4
      const newRate = Math.max(55, Math.min(100, heartRate + variation))
      setDisplayRate(Math.round(newRate))
    }, 1000)

    return () => clearInterval(interval)
  }, [heartRate, isSimulating])

  // Draw ECG line
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    let offset = 0

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw background grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)'
      ctx.lineWidth = 1
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.stroke()
      }
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(width, i)
        ctx.stroke()
      }

      // Draw ECG waveform
      ctx.beginPath()
      ctx.strokeStyle = '#F43F5E'
      ctx.lineWidth = 2
      ctx.shadowColor = 'rgba(244, 63, 94, 0.5)'
      ctx.shadowBlur = 4

      const beatInterval = 60 / displayRate * 60 // pixels per beat based on rate

      for (let x = 0; x < width; x++) {
        const phase = ((x + offset) % beatInterval) / beatInterval
        let y = height / 2

        // Create ECG-like waveform
        if (phase < 0.1) {
          // P wave
          y = height / 2 - Math.sin(phase / 0.1 * Math.PI) * 10
        } else if (phase >= 0.15 && phase < 0.2) {
          // Q wave
          y = height / 2 + (phase - 0.15) / 0.05 * 8
        } else if (phase >= 0.2 && phase < 0.25) {
          // R wave (main spike)
          y = height / 2 - Math.sin((phase - 0.2) / 0.05 * Math.PI) * 40
        } else if (phase >= 0.25 && phase < 0.3) {
          // S wave
          y = height / 2 + (0.3 - phase) / 0.05 * 12
        } else if (phase >= 0.35 && phase < 0.5) {
          // T wave
          y = height / 2 - Math.sin((phase - 0.35) / 0.15 * Math.PI) * 15
        }

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()
      ctx.shadowBlur = 0

      offset += 1.5
      animationRef.current = requestAnimationFrame(draw)
    }

    if (isAnimating) {
      draw()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [displayRate, isAnimating])

  const getRateCategory = (rate: number) => {
    if (rate < 60) return { label: 'Relaxed', color: '#10B981' }
    if (rate < 80) return { label: 'Normal', color: '#10B981' }
    if (rate < 90) return { label: 'Slightly Elevated', color: '#FBBF24' }
    return { label: 'Elevated', color: '#F43F5E' }
  }

  const category = getRateCategory(displayRate)

  return (
    <div className="wellness-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-sensora-rose-100 to-sensora-rose-50 flex items-center justify-center"
              animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 60 / displayRate, repeat: Infinity }}
            >
              <svg className="w-6 h-6 text-sensora-rose-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </motion.div>
            {isAnimating && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-sensora-rose-300"
                animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                transition={{ duration: 60 / displayRate, repeat: Infinity }}
              />
            )}
          </div>
          <div>
            <h3 className="text-sensora-text font-semibold">Heart Rate</h3>
            <p className="text-sensora-text-soft text-sm">Simulated biometric</p>
          </div>
        </div>

        <div className="text-right">
          <motion.div
            className="text-3xl font-bold"
            style={{ color: category.color }}
            key={displayRate}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
          >
            {displayRate}
          </motion.div>
          <p className="text-sensora-text-muted text-xs">BPM</p>
        </div>
      </div>

      {/* ECG Visualization */}
      <div className="relative h-24 mb-4 rounded-xl overflow-hidden bg-sensora-gray-50">
        <canvas
          ref={canvasRef}
          width={400}
          height={96}
          className="w-full h-full"
        />
      </div>

      {/* Rate Status */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="badge-teal"
          style={{
            backgroundColor: `${category.color}15`,
            color: category.color,
          }}
        >
          {category.label}
        </span>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="text-sm text-sensora-text-soft hover:text-sensora-teal-600 transition-colors"
        >
          {isAnimating ? 'Pause' : 'Resume'}
        </button>
      </div>

      {/* Heart Rate Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-sensora-text-soft">Adjust baseline</span>
          <span className="text-sensora-teal-600 font-medium">{heartRate} BPM</span>
        </div>
        <input
          type="range"
          min="55"
          max="100"
          value={heartRate}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="slider-sensora"
        />
        <div className="flex justify-between text-xs text-sensora-text-muted">
          <span>55 BPM</span>
          <span>Resting</span>
          <span>100 BPM</span>
        </div>
      </div>

      {/* Info */}
      <motion.div
        className="mt-4 p-3 rounded-xl bg-sensora-rose-50 border border-sensora-rose-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm text-sensora-text">
          <span className="text-sensora-rose-600 font-medium">Fragrance tip:</span>{' '}
          Higher heart rates increase skin warmth, enhancing top note projection.
          We&apos;ll balance your formula accordingly.
        </p>
      </motion.div>
    </div>
  )
}
