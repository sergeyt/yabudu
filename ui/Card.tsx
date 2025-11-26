"use client";

import React from "react";
import {
  Card as ChakraCard,
  type CardRootProps,
  type CardHeaderProps,
  type CardBodyProps,
  type CardFooterProps,
  type CardTitleProps,
  type CardDescriptionProps,
} from "@chakra-ui/react";

// ----------- ROOT -----------
const Root = React.forwardRef<HTMLDivElement, CardRootProps>(function CardRoot(
  {
    bg = "bg.surface",
    borderRadius = "lg",
    borderWidth = "1px",
    borderColor = "border.subtle",
    boxShadow = "shadow.card",
    p = 6,
    ...rest
  },
  ref,
) {
  return (
    <ChakraCard.Root
      ref={ref}
      bg={bg}
      borderRadius={borderRadius}
      borderWidth={borderWidth}
      borderColor={borderColor}
      boxShadow={boxShadow}
      p={p}
      {...rest}
    />
  );
});

// ----------- HEADER -----------
const Header = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ py = 0, ...rest }, ref) {
    return <ChakraCard.Header ref={ref} py={py} {...rest} />;
  },
);

// ----------- BODY -----------
const Body = React.forwardRef<HTMLDivElement, CardBodyProps>(function CardBody(
  { p = 4, ...rest },
  ref,
) {
  return <ChakraCard.Body ref={ref} p={p} {...rest} />;
});

// ----------- FOOTER -----------
const Footer = React.forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({ pt = 4, ...rest }, ref) {
    return <ChakraCard.Footer ref={ref} pt={pt} {...rest} />;
  },
);

// ----------- TITLE -----------
const Title = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle(
    {
      color = "text.heading",
      fontWeight = "semibold",
      fontSize = "lg",
      ...rest
    },
    ref,
  ) {
    return (
      <ChakraCard.Title
        ref={ref}
        color={color}
        fontWeight={fontWeight}
        fontSize={fontSize}
        {...rest}
      />
    );
  },
);

// ----------- DESCRIPTION -----------
const Description = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(function CardDescription(
  { color = "text.body", fontSize = "md", ...rest },
  ref,
) {
  return (
    <ChakraCard.Description
      ref={ref}
      color={color}
      fontSize={fontSize}
      {...rest}
    />
  );
});

// Export in Chakra-style namespace
export const Card = {
  Root,
  Header,
  Body,
  Footer,
  Title,
  Description,
};
