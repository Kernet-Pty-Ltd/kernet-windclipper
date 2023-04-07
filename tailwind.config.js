/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./popup.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  darkMode: 'class',
  prefix: 'wcp-',
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}

