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
        brand_purple_black: "#000021",
        brand_light_grey: "#F5F5F5",
        brand_gradient1_purple: "#784DFF",
        brand_gradient1_blue: "#1F69FF",
        brand_gradient2_purple: "#784DFF",
        brand_gradient2_blue: "#1898FF",
        brand_periwinkle: "#7070FF",
        brand_dark_purple_grey: "#727392",
        brand_light_purple_grey: "#82839F",
        brand_word_mark_purple: "#240053"
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