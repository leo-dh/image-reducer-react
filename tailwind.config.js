module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      minWidth: {
        "8ch": "8ch",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
