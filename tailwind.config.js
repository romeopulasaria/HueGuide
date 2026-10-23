/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDFBF7',
          100: '#F8F4EE',
          200: '#EFE6DA',
          300: '#E2D3BF',
          400: '#C7AC8F',
          500: '#A68764',
          600: '#8A6D4B',
          700: '#6C5438',
          800: '#4D3C28',
          900: '#2F2417',
          950: '#1A140D',
        },
        rosewood: {
          50: '#FAF5F5',
          100: '#F5ECEC',
          200: '#EBD8D8',
          300: '#D9BCBC',
          400: '#BF9494',
          500: '#A67070',
          600: '#895353',
          700: '#6E4040',
          800: '#522F2F',
          900: '#382020',
        },
        sand: {
          50: '#FAF8F5',
          100: '#F3EFE9',
          200: '#E7DFD4',
          300: '#D8CAB7',
          400: '#C4AF94',
          500: '#A89073',
          600: '#8A7257',
          700: '#6A563F',
          800: '#4B3C2A',
          900: '#2E2419',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'Cambria', 'serif'],
      }
    },
  },
  plugins: [],
}
