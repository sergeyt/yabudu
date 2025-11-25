import "./globals.css";
import React, { type ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Container } from "@chakra-ui/react";
import { Provider as UIProvider } from "../ui/provider";
import { NextAuthProvider } from "./providers";
import { Toaster } from "../ui/toaster";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NextIntlClientProvider>
          <UIProvider>
            <NextAuthProvider>
              <Container maxW="md" maxH="full">
                <Toaster />
                {children}
              </Container>
            </NextAuthProvider>
          </UIProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
