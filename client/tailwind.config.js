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
        slideDown: {
          '0%': { height: '0' },
          '100%': { height: 'var(--radix-collapsible-content-height)' },
        },
        slideUp: {
          '0%': { height: 'var(--radix-collapsible-content-height)' },
          '100%': { height: '0' },
        },
        pillDump: {
          '0%': { transform: 'rotate(0deg)' },
          '50%, 100%': { transform: 'rotate(-45deg)' },
        },
        errorFall: {
          '0%': { transform: 'translate(0, -50px)', opacity: '0' },
          '50%, 100%': { transform: 'translate(0, 0)', opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-down': 'slideDown 300ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
        'pill-404': 'errorFall 2s ease-out infinite alternate',
        'pill-bottle': 'pillDump 2s ease-in-out infinite alternate',
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
        greypink: '#ede5e5',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'bg-gradient': `linear-gradient(
    130deg,
    rgba(243, 243, 243, 1) 0% 45%,
    rgba(236, 188, 198, 0.7) 48% 73%,
    rgba(225, 29, 71, 0.7) 77% 100%
  );`,
      },
    },
  },
  plugins: ['tailwindcss-animate'],
};
