/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ruby: '#E11D47',
        redblack: '#2c0910',
        lightgray: '#f3f3f3',
        darkred: '#430d19',
        pink: '#ECBCC6',
        green: '#1A6B13',
        orange: '#fa9016',
      },
      fontFamily: {
        inter: ['Inter', 'serif'],
      },
    },
  },
  plugins: [],
};
