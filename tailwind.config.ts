import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        upcoming: '#bae6fd',    // soft blue
        completed: '#bbf7d0',   // soft green
        prediction: '#fbcfe8',  // soft pink
      },
    },
  },
  plugins: [],
} satisfies Config
