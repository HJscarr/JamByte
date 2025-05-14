module.exports = {
  theme: {
    extend: {
      keyframes: {
        ripple: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        ripple: 'ripple 2s linear infinite'
      }
    }
  }
} 