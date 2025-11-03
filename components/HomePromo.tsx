import React from "react";
import { useTranslations } from "next-intl";
import { Box, Heading, HStack } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";

// TODO display some logo image
export default function HomePromo() {
  const t = useTranslations("home");
  return (
    <HStack w="full" justifyContent="center">
      <Heading as="h1" size="lg" textAlign="center" color="text">
        {t("title")}
      </Heading>
      <Box>
        <ColorModeButton />
      </Box>
    </HStack>
  );
}
