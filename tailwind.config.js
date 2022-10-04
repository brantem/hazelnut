/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  safelist: [
    { pattern: /text-.+-(400|600)/ },
    { pattern: /bg-.+-(50|300)/ },
    { pattern: /border-.+-(300)/ },
    { pattern: /bg-.+-(100|200)/, variants: ['hover', 'disabled'] },
    { pattern: /ring-.+-(500)/, variants: ['focus'] },
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
