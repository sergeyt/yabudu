import { forwardRef } from "react";
import { Box, type BoxProps } from "@chakra-ui/react";

export interface CardProps extends BoxProps {
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      hoverable = false,
      bg = "white",
      borderRadius = "lg",
      boxShadow = "card",
      borderWidth = "1px",
      borderColor = "gray.200",
      p = 6,
      transition = "all 0.15s ease-out",
      _hover,
      ...rest
    },
    ref,
  ) => (
    <Box
      ref={ref}
      bg={bg}
      borderRadius={borderRadius}
      boxShadow={boxShadow}
      borderWidth={borderWidth}
      borderColor={borderColor}
      p={p}
      transition={transition}
      _hover={
        hoverable
          ? {
              boxShadow: "0 10px 25px rgba(15, 23, 42, 0.15)",
              transform: "translateY(-2px)",
              ..._hover,
            }
          : _hover
      }
      {...rest}
    />
  ),
);

Card.displayName = "Card";
