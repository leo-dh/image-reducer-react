const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Nunito', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      minWidth: {
        '8ch': '8ch',
      },
      spacing: {
        50: '12.5rem',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundColor: ['active'],
      textColor: ['active'],
    },
  },
  plugins: [],
};
