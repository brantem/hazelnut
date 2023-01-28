/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  safelist: [
    { pattern: /text-.+-(400|500|600)/ },
    { pattern: /bg-.+-(50|100|200|300|400|500)/ },
    { pattern: /bg-.+-(900)\/(20)/, variants: ['dark'] },
    { pattern: /bg-.+-(100|200)/, variants: ['hover', 'disabled'] },
    { pattern: /bg-.+-(100|800)/, variants: ['enabled:hover', 'dark:enabled:hover'] },
    { pattern: /border-.+-(300)/ },
    { pattern: /ring-.+-(500)/, variants: ['focus'] },
    { pattern: /ring-.+-(700)/, variants: ['dark:focus'] },
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
