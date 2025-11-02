import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { buttonRecipe } from "./recipes/button.recipe";

const config = defineConfig({
  theme: {
    // Design tokens
    tokens: {
      fonts: {
        heading: {
          value:
            "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        },
        body: {
          value:
            "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        },
      },
      radii: {
        md: { value: "12px" },
        lg: { value: "16px" },
        xl: { value: "22px" },
        "2xl": { value: "28px" },
      },
      shadows: {
        soft: { value: "0 10px 40px rgba(0,0,0,.25)" },
        outline: { value: "0 0 0 2px rgba(108,92,231,.6)" },
      },
      colors: {
        brand: {
          50: { value: "#F3F1FF" },
          100: { value: "#E7E4FF" },
          200: { value: "#D4D0FF" },
          300: { value: "#B7B2FF" },
          400: { value: "#9E98FF" },
          500: { value: "#867FFF" },
          600: { value: "#6C5CE7" },
          700: { value: "#5648B5" },
          800: { value: "#3D3482" },
          900: { value: "#27234F" },
        },
      },
    },

    // Light/Dark aware semantic tokens (use these in components)
    semanticTokens: {
      colors: {
        bg: { value: { base: "#F7F7FB", _dark: "#0B0B0F" } },
        surface: {
          value: { base: "#FFFFFF", _dark: "rgba(255,255,255,0.06)" },
        },
        border: {
          value: { base: "rgba(0,0,0,0.08)", _dark: "rgba(255,255,255,0.16)" },
        },
        text: { value: { base: "#1F2430", _dark: "rgba(255,255,255,0.92)" } },
        muted: {
          value: {
            base: "rgba(31,36,48,0.65)",
            _dark: "rgba(255,255,255,0.70)",
          },
        },
      },
    },

    recipes: {
      button: buttonRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);
