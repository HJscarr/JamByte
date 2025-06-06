import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      height: {
        '500': '500px',
      },
      gridTemplateRows: {
        '[auto,auto,1fr]': 'auto auto 1fr',
      },
      backgroundImage: {
        'rainbow-gradient': 'linear-gradient(to left, red, orange, yellow, green, blue, indigo, violet)',
      },
      colors: {
        primary: "#FFFFFF",
        secondary: "#E66482"
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        shine: 'shine 3s ease-in-out infinite'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
export default config;
