/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          600: '#1E3A5F',
          700: '#1A3354',
        },
        primary: {
          500: '#4A6FA5',
          600: '#3D5A89',
        },
        accent: {
          500: '#E07B39',
          600: '#D16A2A',
        },
        surface: '#F8F9FA',
        success: '#28A745',
        warning: '#FFC107',
        error: '#DC3545',
        info: '#17A2B8',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
},
    screens: {
      'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      'iframe-sm': '400px',
      'iframe-md': '600px',
      'iframe-lg': '800px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        'sm': '2rem',
        'lg': '4rem',
        'xl': '5rem',
        '2xl': '6rem',
      },
    },
  },
  plugins: [],
}