import type { Config } from 'tailwindcss';
const config: Config = { darkMode: "class",
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: { colors: { brand: { DEFAULT: "#0d9488", dark: "#096a61" }, },} },
  plugins: [],
};
export default config;
