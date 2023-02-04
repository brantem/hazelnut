/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  safelist: [
    { pattern: /text-.+-(500|600)/ },
    { pattern: /text-.+-(600|700)/, variants: ['dark'] },
    { pattern: /bg-.+-(50|300|500)/ },
    { pattern: /bg-.+-(900)\/(30)/, variants: ['dark'] },
    { pattern: /border-.+-(300)/ },
    { pattern: /ring-.+-(500)/, variants: ['focus'] },
    { pattern: /ring-.+-(700)/, variants: ['dark:focus'] },
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
