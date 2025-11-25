import { forwardRef } from "react";
import {
  Text as ChakraText,
  type TextProps as ChakraTextProps,
} from "@chakra-ui/react";

export interface TextProps extends ChakraTextProps {
  muted?: boolean;
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  (props, ref) => {
    const {
      muted = false,
      fontFamily = "body",
      fontSize = "md",
      lineHeight = "tall",
      color = muted ? "gray.500" : "gray.800",
      ...rest
    } = props;
    return (
      <ChakraText
        ref={ref}
        fontFamily={fontFamily}
        fontSize={fontSize}
        lineHeight={lineHeight}
        color={color}
        {...rest}
      />
    );
  },
);

Text.displayName = "Text";
