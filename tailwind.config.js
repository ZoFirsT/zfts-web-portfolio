/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A192F",
        secondary: "#112240",
        textPrimary: "#CCD6F6",
        textSecondary: "#8892B0",
        accent: "#64FFDA"
      },
      animation: {
        fadeIn: 'fadeIn 1.5s ease-in-out forwards',
        bounce: 'bounce 0.5s alternate cubic-bezier(0.95,0.05,0.795,0.035) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar'),
  ],
};
