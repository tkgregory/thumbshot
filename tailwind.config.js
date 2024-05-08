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
      }
    },
  },
  plugins: [require("daisyui")],
}

