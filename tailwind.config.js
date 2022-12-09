/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  safelist: [
    { pattern: /text-.+-(400|500|600)/ },
    { pattern: /bg-.+-(50|100|200|300|400|500)/ },
    { pattern: /bg-.+-(100|200)/, variants: ['hover', 'disabled'] },
    { pattern: /bg-.+-(100|800)/, variants: ['enabled:hover'] },
    { pattern: /border-.+-(300)/ },
    { pattern: /ring-.+-(500)/, variants: ['focus'] },
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
