"use client";

import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { buttonRecipe } from "@/theme/recipes/button.recipe";

export const colors = {
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
  orange: {
    50: "#FFF7ED",
    100: "#FFEDD5",
    200: "#FED7AA",
    300: "#FDBA74",
    400: "#FB923C",
    500: "#F97316",
    600: "#EA580C",
    700: "#C2410C",
    800: "#9A3412",
    900: "#7C2D12",
  },
  yellow: {
    50: "#FEFCE8",
    100: "#FEF9C3",
    200: "#FEF08A",
    300: "#FDE047",
    400: "#FACC15",
    500: "#EAB308",
    600: "#CA8A04",
    700: "#A16207",
    800: "#854D0E",
    900: "#713F12",
  },
  green: {
    50: "#F0FDF4",
    100: "#DCFCE7",
    200: "#BBF7D0",
    300: "#86EFAC",
    400: "#4ADE80",
    500: "#22C55E",
    600: "#16A34A",
    700: "#15803D",
    800: "#166534",
    900: "#14532D",
  },
  teal: {
    50: "#F0FDFA",
    100: "#CCFBF1",
    200: "#99F6E4",
    300: "#5EEAD4",
    400: "#2DD4BF",
    500: "#14B8A6",
    600: "#0D9488",
    700: "#0F766E",
    800: "#115E59",
    900: "#134E4A",
  },
  blue: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#3B82F6",
    600: "#2563EB",
    700: "#1D4ED8",
    800: "#1E40AF",
    900: "#1E3A8A",
  },
  cyan: {
    50: "#ECFEFF",
    100: "#CFFAFE",
    200: "#A5F3FC",
    300: "#67E8F9",
    400: "#22D3EE",
    500: "#06B6D4",
    600: "#0891B2",
    700: "#0E7490",
    800: "#155E75",
    900: "#164E63",
  },
  purple: {
    50: "#FAF5FF",
    100: "#F3E8FF",
    200: "#E9D5FF",
    300: "#D8B4FE",
    400: "#C084FC",
    500: "#A855F7",
    600: "#9333EA",
    700: "#7E22CE",
    800: "#6B21A8",
    900: "#581C87",
  },
  pink: {
    50: "#FDF2F8",
    100: "#FCE7F3",
    200: "#FBCFE8",
    300: "#F9A8D4",
    400: "#F472B6",
    500: "#EC4899",
    600: "#DB2777",
    700: "#BE185D",
    800: "#9D174D",
    900: "#831843",
  },
  red: {
    50: "#FEF2F2",
    100: "#FEE2E2",
    200: "#FECACA",
    300: "#FCA5A5",
    400: "#F87171",
    500: "#EF4444",
    600: "#DC2626",
    700: "#B91C1C",
    800: "#991B1B",
    900: "#7F1D1D",
  },
  brand: {
    50: { value: "#f0f7ff" },
    100: { value: "#d9eaff" },
    200: { value: "#b3d6ff" },
    300: { value: "#84bbff" },
    400: { value: "#539aff" },
    500: { value: "#2b7cff" },
    600: { value: "#1f60db" },
    700: { value: "#184ab0" },
    800: { value: "#153e8f" },
    900: { value: "#133673" },
  },
};

export const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'Inter', ui-sans-serif" },
        body: { value: "'Inter', ui-sans-serif" },
        mono: { value: "'JetBrains Mono', ui-monospace" },
      },
      radii: {
        sm: { value: "6px" },
        md: { value: "10px" },
        lg: { value: "16px" },
      },
      sizes: {
        content: { value: "1120px" }, // container max width
      },
      shadows: {
        card: {
          value: "0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
        },
      },
      colors,
    },
    semanticTokens: {
      colors: {
        bg: { value: { base: "{colors.gray.50}", _dark: "{colors.gray.900}" } },
        surface: { value: { base: "white", _dark: "{colors.gray.800}" } },
        text: {
          value: { base: "{colors.gray.800}", _dark: "{colors.gray.100}" },
        },
        subtle: {
          value: { base: "{colors.gray.600}", _dark: "{colors.gray.400}" },
        },
        border: {
          value: { base: "{colors.gray.200}", _dark: "{colors.gray.700}" },
        },
        brand: {
          value: { base: "{colors.brand.600}", _dark: "{colors.brand.400}" },
        },
        success: {
          value: { base: "{colors.green.600}", _dark: "{colors.green.300}" },
        },
        warning: {
          value: { base: "{colors.orange.600}", _dark: "{colors.orange.300}" },
        },
        danger: {
          value: { base: "{colors.red.600}", _dark: "{colors.red.300}" },
        },
        focusRing: {
          value: { base: "{colors.brand.500}", _dark: "{colors.brand.300}" },
        },
      },
    },
    textStyles: {
      pageTitle: {
        value: { fontSize: "2xl", fontWeight: "semibold", lineHeight: "short" },
      },
      section: { value: { fontSize: "lg", fontWeight: "semibold" } },
      meta: { value: { fontSize: "sm", color: "{colors.subtle}" } },
    },
    recipes: {
      button: buttonRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);
