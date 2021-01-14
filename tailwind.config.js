const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', ...defaultTheme.fontFamily.sans],
        roboto: ['Roboto', 'sans-serif'],
      },
      spacing: {
        50: '12.5rem',
      },
      flexGrow: {
        2: '2',
        3: '3',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundColor: ['active'],
      textColor: ['active'],
      display: ['group-hover'],
      scale: ['group-hover'],
    },
  },
  plugins: [],
};
