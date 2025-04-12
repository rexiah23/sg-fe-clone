/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f3ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#1a237e',
          600: '#141b63',
          700: '#0d1342',
          800: '#070c2b',
          900: '#040718',
        },
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        }
      },
      animation: {
        'shine': 'shine 1.5s infinite',
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'pulse-gold': {
          '0%, 100%': {
            opacity: 0.8,
            transform: 'scale(1)',
          },
          '50%': {
            opacity: 0.95,
            transform: 'scale(1.05)',
          },
        },
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1.2rem', { lineHeight: '1.5rem' }],
        'lg': ['1.32rem', { lineHeight: '1.75rem' }],
        'xl': ['1.5rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.8rem', { lineHeight: '2rem' }],
        '3xl': ['2.16rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.64rem', { lineHeight: '2.5rem' }],
        '5xl': ['3.36rem', { lineHeight: '1' }],
        '6xl': ['4.2rem', { lineHeight: '1' }],
        '7xl': ['4.8rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['9.6rem', { lineHeight: '1' }],
      },
    },
  },
  plugins: [],
};