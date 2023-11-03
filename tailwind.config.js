/** @type {import('tailwindcss').Config} */
const { nextui } = require('@nextui-org/react');
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    darkMode: 'class',
    extend: {
      colors: {
        'blue-gazin': 'rgb(61, 63, 149)',
      },
    },
  },
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: 'rgb(61, 63, 149)',
        }
      },
      dark: {
        colors: {
          primary: 'rgb(61, 63, 149)',
        }
      }
    }
  })],
}