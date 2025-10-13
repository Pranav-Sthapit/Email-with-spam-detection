/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/css/login.css"
  ],
  theme: {
    extend: {
      colors:{
        primary:"#1E3A8A",
        secondary:"#2563EB",
        main_bg:"#EAEAEA",
        box_bg:"#FFFFFF",
        text_clr:"#111827"
      },
      fontFamily: {
        aldrich: ['Aldrich', 'sans-serif'],
        alegreyaSans: ['Alegreya Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
