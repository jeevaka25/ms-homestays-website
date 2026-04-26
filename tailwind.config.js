export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        linen: '#F8F5EF',
        ink: '#171717',
        olive: '#6F745B',
        clay: '#A36A48',
        mist: '#E7E2D8',
      },
      letterSpacing: {
        widestLuxury: '.22em',
      },
    },
  },
  plugins: [],
}
