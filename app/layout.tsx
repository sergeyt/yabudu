import "./globals.css";
import React, { type ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Center } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import { Provider as UIProvider } from "../ui/provider";
import { NextAuthProvider } from "./providers";
import { Toaster } from "@/ui/index";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-main",
});

export const metadata: Metadata = {
  // keep your existing title/description if you have them
  title: {
    default: "Ya Budu",
    template: "%s | Ya Budu",
  },
  description: "Event Registration App for managing event participation.",
  themeColor: "#0f172a",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <NextIntlClientProvider>
          <UIProvider>
            <NextAuthProvider>
              <Center maxW="md" minH="100vh" bg="bg.page">
                <Toaster />
                {children}
              </Center>
            </NextAuthProvider>
          </UIProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
