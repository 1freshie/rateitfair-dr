const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
    colors: {
      'primary--orange': '#F58A07',
      'primary--blue': '#084887',
      'secondary--orange': '#F9AB55',
      'secondary--gray': '#909CC2',
      'background--white': '#F7F5FB',
    },
    fontFamily: {
      Montserrat: ['Montserrat', ...fontFamily.sans],
    },
  },
  plugins: [],
};
