import { forwardRef } from "react";
import {
  Link as ChakraLink,
  type LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";

export type LinkProps = ChakraLinkProps;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      color = "blue.600",
      fontWeight = "medium",
      textDecoration = "none",
      _hover = { textDecoration: "underline" },
      ...rest
    },
    ref,
  ) => (
    <ChakraLink
      ref={ref}
      color={color}
      fontWeight={fontWeight}
      textDecoration={textDecoration}
      _hover={_hover}
      {...rest}
    />
  ),
);

Link.displayName = "Link";
