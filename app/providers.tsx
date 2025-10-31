"use client";

import React, { type ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

export function NextAuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
