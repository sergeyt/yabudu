import { forwardRef } from "react";
import {
  Input as ChakraInput,
  type InputProps as ChakraInputProps,
} from "@chakra-ui/react";

export type InputProps = ChakraInputProps;

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    size = "md",
    borderRadius = "lg",
    borderColor = "gray.300",
    _focusVisible = {
      borderColor: "blue.500",
      boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
    },
    ...rest
  } = props;
  return (
    <ChakraInput
      ref={ref}
      size={size}
      borderRadius={borderRadius}
      borderColor={borderColor}
      _focusVisible={_focusVisible}
      {...rest}
    />
  );
});

Input.displayName = "Input";
