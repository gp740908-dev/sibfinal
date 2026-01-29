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
          light: '#F4F1EA',
          dark: '#B8BA7F',
        },
        forest: {
          DEFAULT: '#537F5D',
          dark: '#243326',
          light: '#709977',
        },
        accent: {
          light: '#9BB784',
          DEFAULT: '#719669',
        },
        gold: {
          DEFAULT: '#C4A35A',
        },
        // NEW: Semantic Text Color System
        text: {
          DEFAULT: '#243326',           // forest-dark - headings, primary text
          body: 'rgba(36, 51, 38, 0.8)', // forest-dark/80 - body paragraphs
          muted: 'rgba(36, 51, 38, 0.6)', // forest-dark/60 - secondary info
          subtle: 'rgba(36, 51, 38, 0.4)', // forest-dark/40 - captions, placeholders
          inverse: '#F4F1EA',            // sand-light - on dark backgrounds
          'inverse-muted': 'rgba(244, 241, 234, 0.8)', // sand-light/80
          accent: '#9BB784',             // accent-light - links, emphasis
          error: '#DC2626',              // error states
          success: '#537F5D',            // forest - success states
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards', // Dikurangi dari 1s
        'slide-up': 'slideUp 0.5s ease-out forwards', // Dikurangi dari 0.8s
        'scale-y': 'scaleY 0.5s ease-out forwards',
        // HAPUS 'ken-burns' atau ganti dengan static
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' }, // Reduced from 20px
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleY: {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
        // HAPUS kenBurns atau buat versi ringan
        // kenBurns: {
        //   '0%': { transform: 'scale(1.05)' }, // Start sudah zoomed
        //   '100%': { transform: 'scale(1.05)' }, // Static, no animation
        // }
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
        '.transform-gpu': {
          'transform': 'translateZ(0)',
          '-webkit-transform': 'translateZ(0)',
        },
      })
      addUtilities({
        '.focus-ring': {
          '@apply focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2': {},
        },
        '.focus-ring-inset': {
          '@apply focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/50': {},
        },
      })
    }
  ],
}
