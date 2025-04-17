/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lavender: {
          100: '#f3e8ff',
          500: '#8b5cf6',
          600: '#7c3aed',
          800: '#5b21b6',
        },
        pink: {
          100: '#fce7f3',
        },
      },
    },
  },
  plugins: [],
}
