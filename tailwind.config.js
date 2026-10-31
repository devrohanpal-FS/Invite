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
        cosmic: {
          50: '#fdfbf7',
          100: '#fff8e7',
          200: '#f7edd5',
          300: '#eddcaa',
          DEFAULT: '#fff8e7',
          latte: '#fff8e7',
          bg: '#fbf8f1',
        },
        mocha: {
          50: '#f8f4ec',
          100: '#f2ebe0',
          200: '#e8dcc6',
          300: '#d7c5a4',
          400: '#c5ae84',
          DEFAULT: '#e8dcc6',
          cream: '#e8dcc6',
        },
        burgundy: {
          50: '#f9f1f2',
          100: '#f0d9db',
          200: '#dfb4b9',
          300: '#c7858d',
          400: '#9b4c56',
          500: '#722f37',
          600: '#64272f',
          700: '#531f25',
          800: '#43191e',
          900: '#38161a',
          DEFAULT: '#722f37',
          deep: '#722f37',
        },
        royalGold: {
          DEFAULT: '#c59b2d',
          light: '#e1c276',
          dark: '#9a751a',
        },
        charcoal: {
          DEFAULT: '#1c1716',
          soft: '#2e2624',
          muted: '#5f5552',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft-luxury': '0 10px 30px -5px rgba(114, 47, 55, 0.08), 0 4px 12px -2px rgba(232, 220, 198, 0.4)',
        'card-glow': '0 15px 35px rgba(197, 155, 45, 0.12)',
      }
    },
  },
  plugins: [],
};
