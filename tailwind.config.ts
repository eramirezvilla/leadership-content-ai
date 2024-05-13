/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { Config } from "tailwindcss"

const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontSize: {
        large_title: ["34.58px", "42.56px"],
        title_1: ["29.26px", "34.58px"],
        title_2: ["22.61px", "29.26px"],
        title_3: ["19.95px", "26.6px"],
        headline: ["17.29px", "21.28px"],
        body: ["17.29px", "21.28px"],
        callout: ["15.96px", "19.95px"],
        subheadline: ["14.63px", "18.62px"],
        footnote: ["13.3px", "17.29px"],
        caption_1: ["13.3px", "17.29px"],
        caption_2: ["13.3px", "17.29px"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        brand_purple: "#AB47F6",
        brand_background: "#093A3E",
        brand_primary: "#3AAFB9",
        brand_secondary: "#64E9EE",
        brand_alternate: "#97C8EB",
        brand_black: "#001011",
        brand_white: "#E9E8DC"
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    addVariablesForColors,
  ],
} satisfies Config

export default config

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}