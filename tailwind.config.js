/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primario: {
          DEFAULT: "#1d5d97"
        }
      }
    },
  },
  plugins: [
    // Puedes añadir plugins adicionales de Tailwind CSS aquí, por ejemplo:
    // require('@tailwindcss/forms'),
  ],
};
