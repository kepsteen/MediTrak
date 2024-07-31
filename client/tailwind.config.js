/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      colors: {
        ruby: '#E11D47',
        redblack: '#2c0910',
        lightgray: '#f3f3f3',
        darkred: '#430d19',
        pink: '#ECBCC6',
        green: '#1A6B13',
        orange: '#fa9016',
        black: '#0f0004',
      },
      fontFamily: {
        inter: ['Inter', 'serif'],
      },
      backgroundImage: {
        'bg-gradient': `linear-gradient(
    130deg,
    rgba(243, 243, 243, 1) 0% 45%,
    rgba(236, 188, 198, 0.7) 48% 73%,
    rgba(225, 29, 71, 0.8) 76% 100%
  );`,
      },
    },
  },
  plugins: ['tailwindcss-animate'],
};
