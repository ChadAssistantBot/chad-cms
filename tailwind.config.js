/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#08111f',
        panel: 'rgba(17, 27, 46, 0.86)',
        'panel-strong': '#111c31',
        line: 'rgba(148, 163, 184, 0.18)',
        gold: '#f5c451',
        blue: '#69a7ff',
        green: '#53d18d',
        red: '#ff6b7a',
        muted: '#94a3b8',
      },
    },
  },
  plugins: [],
}
