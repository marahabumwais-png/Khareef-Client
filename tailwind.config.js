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
        khaki: {
          50:  '#faf8f4',
          100: '#f2ede0',
          200: '#e5dbc1',
          300: '#d4c49a',
          400: '#c2a96f',
          500: '#b49250',
          600: '#9a7940',
          700: '#7e6235',
          800: '#675030',
          900: '#57432b',
        },
        sage: {
          50:  '#f4f7f4',
          100: '#e4ede3',
          200: '#c9dbc8',
          300: '#a3c1a1',
          400: '#77a274',
          500: '#558552',
          600: '#416841',
          700: '#345436',
          800: '#2c442e',
          900: '#253927',
        },
        cream: '#fdf8f0',
        gold:  '#c9a84c',
      },
      fontFamily: {
        // Arabic + Latin combination
        display: ['Playfair Display', 'Georgia', 'serif'],
        body:    ['DM Sans', 'system-ui', 'sans-serif'],
        arabic:  ['Cairo', 'Amiri', 'serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-in-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'shimmer':    'shimmer 1.5s infinite',
        'float':      'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp:   { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        slideDown: { '0%': { opacity: 0, transform: 'translateY(-10px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float:     { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
    },
  },
  plugins: [],
};
