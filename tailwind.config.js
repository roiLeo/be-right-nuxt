const colors = require('tailwindcss/colors')
delete colors.lightBlue // Avoid warning during build.
delete colors.warmGray
delete colors.trueGray
delete colors.coolGray
delete colors.blueGray

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: [
    'node_modules/tailvue/dist/tailvue.es.js',
  ],
  safelist: [
    ...(Object.keys(colors).reduce((acc, name) => {
      acc.push(`bg-${name}-50`)
      acc.push(`bg-${name}-100`)
      acc.push(`text-${name}-500`)
      acc.push(`text-${name}-700`)
      acc.push(`border-${name}-500`)
      acc.push(`border-${name}-700`)
      return acc
    }, [])),
    'bg-gray-800',
    'text-white',
  ],
  theme: {
    colors: {
      ...colors,
      black: {
        light: 'rgba(30,30,28,0.05)',
        DEFAULT: '#1e1e1c',
        ...colors.black,
      },
      white: {
        light: '#F3F6F3',
        DEFAULT: '#FFFFFF',
        break: '#F6EFE6',
        ...colors.white,
      },
      red: {
        light: '#EA535E',
        DEFAULT: '#E73047',
        ...colors.red,
      },
      green: {
        light: 'rgba(88,177,105,0.2)',
        DEFAULT: '#59a484',
        dark: '#245542',
        ...colors.green,
      },
      blue: {
        light: 'rgba(69,61,145,0.2)',
        DEFAULT: '#453D91',
        dark: '#1b1e3dF2',
        dark_bold: 'rgba(28,31,61)',
        ...colors.blue,
      },
      purple: {
        light: 'rgba(72,53,163,0.2)',
        DEFAULT: '#4835A3',
        ...colors.purple,
      },
    },
    extends: {
    },
  },
  plugins: [],
}
