/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        text: 'hsl(var(--text))',
        accent: 'hsl(var(--accent))',
        'accent-text': 'hsl(var(--accent-text))',
        'result-bg': 'hsl(var(--result-bg))',
        'result-text': 'hsl(var(--result-text))',
        background: 'hsl(var(--background))',
        error: 'hsl(var(--error))',
      },
      fontFamily: {
        sans: ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Helvetica Neue', 'sans-serif'],
        outfit: ['Outfit', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        widget: 'var(--border-radius)',
      },
      boxShadow: {
        'widget-sm': 'var(--shadow-sm)',
        'widget-md': 'var(--shadow-md)',
        'widget-lg': 'var(--shadow-lg)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};