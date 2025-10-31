"use client";

import { signIn } from "next-auth/react";
import { Stack, Button } from "@chakra-ui/react";

export default function SignInButtons() {
  const providers = [
    { id: "yandex", label: "Continue with Yandex" },
    { id: "vk", label: "Continue with VK" },
    { id: "sberid", label: "Continue with Sber ID" },
    { id: "tbankid", label: "Continue with TBank ID" },
  ];
  return (
    <Stack>
      {providers.map((p) => (
        <Button key={p.id} onClick={() => signIn(p.id)} variant="outline">
          {p.label}
        </Button>
      ))}
    </Stack>
  );
}
