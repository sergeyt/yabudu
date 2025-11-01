import React from "react";
import { useTranslations } from "next-intl";
import { Heading } from "@chakra-ui/react";

// TODO display some logo image
export default function HomePromo() {
  const t = useTranslations("home");
  return (
    <Heading as="h1" size="lg" textAlign="center">
      {t("title")}
    </Heading>
  );
}
