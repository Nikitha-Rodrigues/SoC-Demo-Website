/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0F2A24',
        section: '#0C1F1A',
        accent: '#1F5C4C',
        light: '#F5F5F5',
        subtext: '#B0B0B0'
      }
    }
  },
  plugins: [],
}
