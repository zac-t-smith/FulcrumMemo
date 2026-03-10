/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'navy-dark': '#0a0f1e',
        'navy-mid': '#1B2A4A',
        'orange-fm': '#F96302',
        'blue-accent': '#2E5C8A',
      },
    },
  },
  plugins: [],
}
