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
      color = muted ? "text.muted" : "text.body",
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
