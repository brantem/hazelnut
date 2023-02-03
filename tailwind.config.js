/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  safelist: [
    { pattern: /text-.+-(500|600)/ },
    { pattern: /bg-.+-(50|300|500)/ },
    { pattern: /bg-.+-(900)\/(40)/, variants: ['dark'] },
    { pattern: /border-.+-(300)/ },
    { pattern: /ring-.+-(500)/, variants: ['focus'] },
    { pattern: /ring-.+-(700)/, variants: ['dark:focus'] },
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
