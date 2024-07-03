/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,vue}'],
  daisyui: {
    themes: ["light", "dark"],
  },
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'Arial', 'sans-serif']
      },
      fontSize: {
        youtube: '1.6em',
        "youtube-parent": '10px',
      },
      lineHeight: {
        'youtube': '22px'
      },
      gridTemplateColumns: {
        'auto-fill-300': 'repeat(auto-fill, minmax(300px, 1fr))',
      },
      colors: {
        'youtube-dark': '#0F0F0F',
      },
      borderRadius: {
        'left': 'var(--rounded-btn, 0.5rem) 0 0 var(--rounded-btn, 0.5rem)',
        'right': '0 var(--rounded-btn, 0.5rem) var(--rounded-btn, 0.5rem) 0',
      },
    },
  },
  plugins: [require("daisyui")],
}

