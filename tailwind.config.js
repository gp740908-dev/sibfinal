/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: 'class',
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
          body: '#3B523E',              // forest-dark/80 -> solid #3B523E
          muted: '#5C7A60',             // forest-dark/60 -> solid #5C7A60
          subtle: '#8CA390',            // forest-dark/40 -> solid #8CA390
          inverse: '#F4F1EA',            // sand-light - on dark backgrounds
          'inverse-muted': '#D6D2C4',   // sand-light/80 -> solid #D6D2C4
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
        'slow-zoom': 'slowZoom 20s linear forwards', // New slow zoom
        'reveal-up': 'revealUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards', // Smooth text reveal
        'menu-reveal': 'menuReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'menu-item-slide': 'menuItemSlide 0.5s ease-out forwards',
        'menu-bg-reveal': 'menuBgReveal 0.6s cubic-bezier(0.87, 0, 0.13, 1) forwards',
        'scroll': 'scroll 2s ease-in-out infinite', // New scroll animation
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
        revealUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.15)' },
        },
        scaleY: {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
        menuReveal: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        menuBgReveal: {
          '0%': { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' },
          '100%': { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' },
        },
        menuItemSlide: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scroll: {
          '0%': { transform: 'translateY(4px)', opacity: '1' },
          '100%': { transform: 'translateY(14px)', opacity: '0' },
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
