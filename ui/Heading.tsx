import { forwardRef } from "react";
import {
  Heading as ChakraHeading,
  type HeadingProps as ChakraHeadingProps,
} from "@chakra-ui/react";

export type HeadingProps = ChakraHeadingProps;

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      fontFamily = "heading",
      fontWeight = "semibold",
      color = "text.heading",
      ...rest
    },
    ref,
  ) => (
    <ChakraHeading
      ref={ref}
      fontFamily={fontFamily}
      fontWeight={fontWeight}
      color={color}
      {...rest}
    />
  ),
);

Heading.displayName = "Heading";
