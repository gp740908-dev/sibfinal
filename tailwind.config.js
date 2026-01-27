
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          DEFAULT: '#D3D49F',
          light: '#F4F1EA',      // HIGH CONTRAST - For text on dark
          dark: '#B8BA7F',       // For backgrounds
        },
        forest: {
          DEFAULT: '#537F5D',
          dark: '#243326',       // HIGH CONTRAST - For text on light
          light: '#709977',      // For hover states
        },
        accent: {
          light: '#9BB784',
          DEFAULT: '#719669',
        },
        gold: {
          DEFAULT: '#C4A35A',
        },
        // Ensure all text colors meet WCAG AA
        'text-primary': '#1A1A1A',     // Near black for body text
        'text-secondary': '#4A4A4A',   // Dark gray (still 7:1 contrast)
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'scale-y': 'scaleY 0.8s ease-out forwards',
        'ken-burns': 'kenBurns 6s linear forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleY: {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        }
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.backface-hidden': {
          'backface-visibility': 'hidden',
          '-webkit-backface-visibility': 'hidden',
        },
        '.backface-visible': {
          'backface-visibility': 'visible',
          '-webkit-backface-visibility': 'visible',
        },
      })
      addUtilities({
        '.focus-ring': {
          '@apply focus:outline-none focus-visible:ring-4 focus-visible:ring-gold/50 focus-visible:ring-offset-2': {},
        },
        '.focus-ring-inset': {
          '@apply focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-gold/50': {},
        },
      })
    }
  ],
}
