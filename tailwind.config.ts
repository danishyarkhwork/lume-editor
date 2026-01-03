import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './editor/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        editor: {
          bg: 'var(--editor-bg)',
          text: 'var(--editor-text)',
          border: 'var(--editor-border)',
          hover: 'var(--editor-hover)',
          active: 'var(--editor-active)',
        },
      },
    },
  },
  plugins: [],
}
export default config

