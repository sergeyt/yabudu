import { defineRecipe } from "@chakra-ui/react";

export const buttonRecipe = defineRecipe({
  className: "btn",
  base: {
    borderRadius: "{radii.xl}",
    fontWeight: "600",
    lineHeight: "1",
    _focusVisible: { boxShadow: "{shadows.outline}" },
    transitionProperty:
      "background, border-color, color, box-shadow, transform",
    transitionDuration: "120ms",
    _active: { transform: "translateY(1px)" },
  },
  variants: {
    variant: {
      solid: {
        bg: "{colors.brand.600}",
        color: "white",
        _hover: { bg: "{colors.brand.700}" },
        _active: { bg: "{colors.brand.800}" },
      },
      outline: {
        borderWidth: "1px",
        borderColor: "{colors.brand.600}",
        color: "{colors.brand.600}",
        _hover: {
          bg: "color-mix(in oklab, {colors.brand.600} 12%, transparent)",
        },
        _active: {
          bg: "color-mix(in oklab, {colors.brand.600} 20%, transparent)",
        },
      },
      ghost: {
        color: "{colors.text}",
        _hover: { bg: "whiteAlpha.100" },
        _active: { bg: "whiteAlpha.200" },
      },
      danger: {
        bg: "{colors.red.600}",
        color: "white",
        _hover: { bg: "{colors.red.700}" },
        _active: { bg: "{colors.red.800}" },
      },
      link: {
        color: "{colors.brand.400}",
        _hover: { bg: "whiteAlpha.100" },
        _active: { bg: "whiteAlpha.200" },
      },
    },
    size: {
      sm: { px: "3", py: "1.5", fontSize: "sm" },
      md: { px: "4", py: "2", fontSize: "sm" },
      lg: { px: "5", py: "2.5", fontSize: "md" },
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});
