import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // New light wellness theme
        sensora: {
          // Base colors
          bg: '#F8FAFB',
          'bg-soft': '#F0F5F4',
          'bg-card': '#FFFFFF',
          // Primary teal palette
          teal: {
            50: '#ECFDF5',
            100: '#D1FAE5',
            200: '#A7F3D0',
            300: '#6EE7B7',
            400: '#34D399',
            500: '#10B981',
            600: '#059669',
            700: '#047857',
            800: '#065F46',
            900: '#064E3B',
          },
          // Accent gold (warm contrast)
          gold: {
            50: '#FFFBEB',
            100: '#FEF3C7',
            200: '#FDE68A',
            300: '#FCD34D',
            400: '#FBBF24',
            500: '#F59E0B',
            600: '#D97706',
          },
          // Rose for stress/wellness
          rose: {
            50: '#FFF1F2',
            100: '#FFE4E6',
            200: '#FECDD3',
            300: '#FDA4AF',
            400: '#FB7185',
            500: '#F43F5E',
          },
          // Neutral grays
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          },
          // Text colors
          text: '#1F2937',
          'text-soft': '#6B7280',
          'text-muted': '#9CA3AF',
        },
        // Legacy aether colors (for gradual migration)
        aether: {
          void: '#0a0612',
          deep: '#1a0a2e',
          purple: '#2d1b4e',
          violet: '#4a2c6a',
          gold: '#c9a962',
          'gold-light': '#e8d5a3',
          'gold-dark': '#8b7340',
          cream: '#f5f0e8',
          mist: 'rgba(201, 169, 98, 0.1)',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'wellness-gradient': 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 50%, #F8FAFB 100%)',
        'teal-shimmer': 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.1), transparent)',
        'card-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)',
        // Legacy
        'aurora': 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 25%, #1a0a2e 50%, #4a2c6a 75%, #1a0a2e 100%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.3), transparent)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'particle': 'particle 8s linear infinite',
        'aurora': 'aurora 15s ease infinite',
        'heartbeat': 'heartbeat 1.2s ease-in-out infinite',
        'wave': 'wave 2s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(1deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' },
        },
        particle: {
          '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100vh) rotate(720deg)', opacity: '0' },
        },
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        heartbeat: {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.15)' },
          '70%': { transform: 'scale(1)' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.95)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'gold': '0 0 30px rgba(201, 169, 98, 0.3)',
        'gold-lg': '0 0 60px rgba(201, 169, 98, 0.4)',
        'inner-gold': 'inset 0 0 30px rgba(201, 169, 98, 0.1)',
        // New light theme shadows
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 24px rgba(0, 0, 0, 0.06)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.05), 0 10px 40px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08), 0 20px 60px rgba(0, 0, 0, 0.12)',
        'teal': '0 0 30px rgba(16, 185, 129, 0.2)',
        'teal-lg': '0 0 60px rgba(16, 185, 129, 0.3)',
        'wellness': '0 4px 20px rgba(16, 185, 129, 0.15)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config
