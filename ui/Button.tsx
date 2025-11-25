import { forwardRef } from "react";
import {
  Button as ChakraButton,
  type ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react";

type Variant = ChakraButtonProps["variant"] | "gradient" | "danger" | "warning";

export interface ButtonProps extends Omit<ChakraButtonProps, "variant"> {
  /** Call-to-action preset: big, pill, gradient */
  cta?: boolean;
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      cta = false,
      variant = cta ? "gradient" : "solid",
      colorPalette = "blue",
      size = cta ? "lg" : "md",
      borderRadius = cta ? "full" : "lg",
      ...rest
    },
    ref,
  ) => (
    <ChakraButton
      ref={ref}
      variant={variant as any}
      colorPalette={colorPalette}
      size={size}
      borderRadius={borderRadius}
      {...rest}
    />
  ),
);

Button.displayName = "Button";
