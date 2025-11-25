import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { buttonRecipe } from "./button.recipe";

// 2) System config with brand tokens + recipes
const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Treat Chakra's `blue` palette as your brand palette
        blue: {
          50: { value: "#eff6ff" },
          100: { value: "#dbeafe" },
          200: { value: "#bfdbfe" },
          300: { value: "#93c5fd" },
          400: { value: "#60a5fa" },
          500: { value: "#3b82f6" }, // primary brand
          600: { value: "#2563eb" },
          700: { value: "#1d4ed8" },
          800: { value: "#1e40af" },
          900: { value: "#1e3a8a" },
        },
        gray: {
          50: { value: "#f9fafb" },
          100: { value: "#f3f4f6" },
          200: { value: "#e5e7eb" },
          300: { value: "#d1d5db" },
          400: { value: "#9ca3af" },
          500: { value: "#6b7280" },
          600: { value: "#4b5563" },
          700: { value: "#374151" },
          800: { value: "#1f2937" },
          900: { value: "#111827" },
        },
      },
      fonts: {
        body: {
          value:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
        heading: {
          value:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
      },
      radii: {
        lg: { value: "12px" },
        full: { value: "9999px" },
      },
      shadows: {
        card: { value: "0 1px 2px rgba(15, 23, 42, 0.08)" },
      },
      spacing: {
        4: { value: "1rem" },
        6: { value: "1.5rem" },
        8: { value: "2rem" },
      },
      fontSizes: {
        sm: { value: "0.875rem" },
        md: { value: "1rem" },
        lg: { value: "1.125rem" },
        xl: { value: "1.25rem" },
        "2xl": { value: "1.5rem" },
      },
    },

    // Attach our custom button recipe – this EXTENDS the built-in Button
    recipes: {
      button: buttonRecipe,
    },
  },
});

// export system for <ChakraProvider value={system}>
export const system = createSystem(defaultConfig, config);
