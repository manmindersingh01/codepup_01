import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7fa',
          100: '#c3cfe2',
          500: '#667eea',
          600: '#764ba2',
          700: '#1a202c',
          800: '#2d3748'
        },
        accent: {
          pink: '#f093fb',
          purple: '#9f7aea',
          blue: '#4299e1',
          teal: '#38b2ac'
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(26, 32, 44, 0.1)',
          blur: 'rgba(255, 255, 255, 0.05)'
        }
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(102, 126, 234, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(102, 126, 234, 0.6)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
} satisfies Config