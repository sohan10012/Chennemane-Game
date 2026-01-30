/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wood-light': '#D4A373',
        'wood-medium': '#bc8a5f',
        'wood-dark': '#8B5E3C',
        'wood-darker': '#5D4037',
        'pit-shadow': '#3E2723',
      },
      animation: {
        'bounce-slight': 'bounce-slight 0.3s ease-in-out infinite',
      },
      keyframes: {
        'bounce-slight': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5%)' },
        }
      }
    },
  },
  plugins: [],
}
