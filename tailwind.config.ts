import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:          'var(--color-bg)',
        surface:     'var(--color-surface)',
        card:        'var(--color-card)',
        accent:      'var(--color-accent)',
        'accent-dim': 'var(--color-accent-dim)',
        live:        'var(--color-live)',
      },
      animation: {
        'fade-in':   'fadeIn 0.4s ease forwards',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'slide-out-left':  'slideOutLeft 0.28s ease-in forwards',
        'slide-in-right':  'slideInRight 0.28s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.4', transform: 'scale(0.8)' },
        },
        slideOutLeft: {
          '0%':   { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateX(-110%) rotate(-6deg)', opacity: '0' },
        },
        slideInRight: {
          '0%':   { transform: 'translateX(110%) rotate(6deg)', opacity: '0' },
          '100%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
