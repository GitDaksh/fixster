/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          'slate-750': '#334155', // Custom color between slate-700 and slate-800
          'slate-850': '#1e293b', // Custom color between slate-800 and slate-900
        },
        boxShadow: {
          'code': '0 2px 8px rgba(0, 0, 0, 0.12)',
        },
        animation: {
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
      },
    },
    plugins: [],
  }