/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'scan-pink': '#FF9FFC',
        'grid-purple': '#392e4e',
      }
    },
  },
  plugins: [],
}
