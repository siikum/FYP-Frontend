/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // <-- MUST point to your React files!
  ],
  theme: {
    extend: {
      animation: {
        "slide-left": "slideLeft 60s linear infinite",
      },
      keyframes: {
        slideLeft: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [],
};
