/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
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
        blob: 'blob 7s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: '#3b82f6',
              '&:hover': {
                color: '#2563eb',
              },
            },
            blockquote: {
              borderLeftColor: '#e5e7eb',
              color: 'inherit',
            },
            'h1, h2, h3, h4': {
              color: 'inherit',
            },
            hr: {
              borderColor: '#e5e7eb',
            },
            'ol > li::before': {
              color: 'inherit',
            },
            'ul > li::before': {
              backgroundColor: 'currentColor',
            },
            code: {
              color: 'inherit',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
            },
            pre: {
              backgroundColor: '#1f2937',
              color: '#e5e7eb',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar'),
  ],
};
