/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        "gray-green": "#3B606A",
      },
      // fontFamily : {
      //   "primary": ['Inter','sans-serif']
      // }
    },
  },
  plugins: [],
}

