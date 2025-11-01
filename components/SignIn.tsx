"use client";
import { signIn } from "next-auth/react";
import { Stack, IconButton, Image, Wrap, WrapItem } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { useColorModeValue } from "@/components/ui/color-mode";

export default function SignIn() {
  const providers = [
    { id: "yandex", label: "Sign in with Yandex", icon: "/icons/yandex.svg" },
    { id: "vk", label: "Sign in with VK", icon: "/icons/vk.svg" },
    { id: "sberid", label: "Sign in with Sber ID", icon: "/icons/sber.svg" },
    {
      id: "tbankid",
      label: "Sign in with TBank ID",
      icon: "/icons/tbank.svg",
    },
  ];

  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.750");
  const focusRing = useColorModeValue("blue.400", "blue.300");
  const shadow = useColorModeValue("sm", "sm-dark");

  return (
    <Stack gap={5} align="center">
      {/* Icon row */}
      <Wrap gap={3} justify="center">
        {providers.map(({ id, label, icon }) => (
          <WrapItem key={id}>
            <Tooltip content={label} openDelay={250}>
              <IconButton
                aria-label={label}
                variant="outline"
                size="lg"
                rounded="full"
                onClick={() => signIn(id)}
                bg={bg}
                borderColor={border}
                boxShadow={shadow}
                transition="transform 120ms ease, background-color 120ms ease, border-color 120ms ease"
                _hover={{
                  bg: hoverBg,
                  transform: "translateY(-1px)",
                  borderColor: "blue.300",
                }}
                _active={{ transform: "translateY(0)", bg: hoverBg }}
                _focusVisible={{ boxShadow: `0 0 0 3px ${focusRing}` }}
              >
                <Image
                  src={icon}
                  alt={label}
                  boxSize="24px"
                  objectFit="contain"
                  borderRadius="full"
                />
              </IconButton>
            </Tooltip>
          </WrapItem>
        ))}
      </Wrap>
    </Stack>
  );
}
