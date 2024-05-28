/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          '50': '#f0f8ff',
          '100': '#e0f0fe',
          '200': '#b9e2fe',
          '300': '#7ccdfd',
          '400': '#36b3fa',
          '500': '#1fa6f4',
          '600': '#007ac9',
          '700': '#0161a3',
          '800': '#065286',
          '900': '#0b446f',
          '950': '#072b4a'
        },
        yellow: {
          '50': '#fefce8',
          '100': '#fff9c2',
          '200': '#fff087',
          '300': '#ffe043',
          '400': '#ffcb0d',
          '500': '#efb303',
          '600': '#ce8900',
          '700': '#a46104',
          '800': '#884b0b',
          '900': '#733e10',
          '950': '#431f05'
        }
      }
    },
  },
  plugins: [],
}

