/** @type {import('tailwindcss').Config} */
module.exports = {
  // Include all files under the `app` directory and other likely places where
  // NativeWind/Tailwind classes appear so Tailwind can generate the utilities.
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
    './app.{js,jsx,ts,tsx}',
    './index.{js,jsx,ts,tsx}'
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#00C897',
        darkGreen: '#0EBE7F',
        lightGrey: '#B3B3B3',
      },
    },
  },
  plugins: [],
}