/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'blue': '#0075FF',
        'gray': '#8692A6',
        'whiteBg': 'rgba(163, 163, 163, 0.09)',
      },
    },
  },
  plugins: [],
};
