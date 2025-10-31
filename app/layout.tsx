import "./globals.css";
import React, { type ReactNode } from "react";
import { Container } from "@chakra-ui/react";
import { Provider as UIProvider } from "@/components/ui/provider";
import { NextAuthProvider } from "./providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UIProvider>
          <NextAuthProvider>
            <Container maxW="md" py={4}>
              {children}
            </Container>
          </NextAuthProvider>
        </UIProvider>
      </body>
    </html>
  );
}
