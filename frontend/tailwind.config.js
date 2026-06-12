// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx,js,jsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        navy: {
          dark:  '#1B1512', // Warm deep cocoa dark background
          mid:   '#28201B', // Warm dark chocolate container background
          light: '#3C3029', // Warm stone/cocoa border
        },
        electric: '#A3704C',    // Warm terracotta primary accent
        'blue-glow': '#D4AF37', // Soft gold accent/glow
        cyan: '#B38E70',        // Warm stone brown
        gold: '#D4AF37',        // Soft gold
        'fm-red': '#C2593F',    // Warm terracotta red
        'fm-green': '#8F9779',  // Warm olive green
        artisan: {
          bg: '#FAF7F2',        // Warm off-white / linen
          primary: '#3D1F0D',   // Deep walnut brown
          accent: '#B8860B',    // Antique gold
          highlight: '#C1440E', // Terracotta
          card: '#FFFFFF',      // Pure white
          text: '#1C1C1C',      // Dark charcoal
          subtle: '#7A6A5A',    // Warm gray
        }
      },
      fontFamily: {
        heading: ['Cinzel', 'serif'],
        body:    ['Plus Jakarta Sans', 'sans-serif'],
        'artisan-heading': ['Cormorant Garamond', 'serif'],
        'artisan-body': ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(163,112,76,0.4)',
        'glow-gold': '0 0 20px rgba(212,175,55,0.35)',
        'card':      '0 4px 24px rgba(0,0,0,0.12)',
        'card-hover':'0 8px 40px rgba(163,112,76,0.2)',
      },
      animation: {
        'fade-up':    'fadeUp 0.5s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-in':   'slideIn 0.3s ease forwards',
        'bounce-cart':'bounceCart 0.4s ease',
        'float':       'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:      { '0%': { opacity:'0', transform:'translateY(24px)' }, '100%': { opacity:'1', transform:'translateY(0)' } },
        fadeIn:      { '0%': { opacity:'0' },                               '100%': { opacity:'1' } },
        pulseGlow:   { '0%,100%': { boxShadow:'0 0 10px rgba(163,112,76,0.3)' }, '50%': { boxShadow:'0 0 28px rgba(163,112,76,0.7)' } },
        slideIn:     { '0%': { opacity:'0', transform:'translateX(-16px)' }, '100%': { opacity:'1', transform:'translateX(0)' } },
        bounceCart:  { '0%,100%': { transform:'scale(1)' }, '50%': { transform:'scale(1.3)' } },
        float:        { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
      },
    },
  },
  plugins: [],
};
