/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#a68543', // From preloader and branding
        secondary: '#00263D', // From arrows and dark sections
      },
      fontFamily: {
        sans: ['AeonikTRIAL', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
