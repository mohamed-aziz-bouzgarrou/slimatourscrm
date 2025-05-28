/** @type {import('tailwindcss').Config} */
const plugin = require('flowbite/plugin');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      colors: {
        'custom-gray': '#D0D1D1',
        'custom-green': "#20B486",
        'custom-light-green': "#E8F5EF",
        'background': "F8F8F8",
        'second': "#003366",
        'primaly': "#252B42",
        'b1': '#003A20',
        'b2': '#F8F8FA',
        'bout': '#1d9a5f',
        'bla': '#282828',
        'g1': '#919895',
        'logtex': '#003a20',
        'pro': '#f0f0f0',
        'catName': '#5d5b70',
        'ord': '#fbbc31',
        'catbg': '#f5efe1',
        'chekou': '#09b52f',
        'hist': "#f7fbfe",
        'cancel': "#ed8097",
        'ger': "#7ebc7b",
        'worheader': "#f9fafc",
        'inventbar': "#f7f8fc",
        'card': "#F2613F",
        'gris': "#8F8F8F",
        'filterText': "#737373",
        'prbg': "#fbf9fa"
      },
      
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        normal: ['Montserrat', 'sans-serif'],
        custom: ['Playfair Display', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        typing: {
          '0%': { width: '0ch' },
          '100%': { width: '100%' },
        },
        dotBounce1: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.5)' },
        },
        dotBounce2: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.5)' },
        },
      },
      animation: {
        typing: 'typing 3.5s',
        dot1: 'dotBounce1 1.5s infinite ease-in-out',
        dot2: 'dotBounce2 1.5s infinite ease-in-out',
        dot3: 'dotBounce1 1.5s infinite ease-in-out',
        dot4: 'dotBounce2 1.5s infinite ease-in-out',
      }
      
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
