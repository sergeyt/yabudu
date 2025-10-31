import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import VkProvider from "next-auth/providers/vk";
import YandexProvider from "next-auth/providers/yandex";
import type { OAuthConfig } from "next-auth/providers/oauth";

// Generic OIDC provider factory (Sber ID, TBank/Tinkoff ID)
function OIDCProvider(
  name: string,
  issuer: string,
  clientId: string,
  clientSecret: string,
  scopes = ["openid", "profile", "email"],
): OAuthConfig<any> {
  return {
    id: name,
    name,
    type: "oidc" as any,
    style: {
      logo: "",
      brandColor: "#000000",
      bg: "",
      text: name,
    },
    issuer,
    clientId,
    clientSecret,
    wellKnown: `${issuer.replace(/\/$/, "")}/.well-known/openid-configuration`,
    authorization: { params: { scope: scopes.join(" ") } },
    checks: ["pkce", "state"],
    profile(profile: any) {
      return {
        id: profile.sub ?? profile.id,
        name:
          (profile.name ??
            `${profile.given_name ?? ""} ${profile.family_name ?? ""}`.trim()) ||
          profile.preferred_username,
        email: profile.email ?? null,
        image: profile.picture ?? null,
      };
    },
  } as OAuthConfig<any>;
}

export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID!,
      clientSecret: process.env.YANDEX_CLIENT_SECRET!,
    }),
    VkProvider({
      clientId: process.env.VK_CLIENT_ID!,
      clientSecret: process.env.VK_CLIENT_SECRET!,
    }),
    OIDCProvider(
      "sber",
      process.env.SBER_ISSUER!,
      process.env.SBER_CLIENT_ID!,
      process.env.SBER_CLIENT_SECRET!,
    ),
    OIDCProvider(
      "tbank",
      process.env.TBANK_ISSUER!,
      process.env.TBANK_CLIENT_ID!,
      process.env.TBANK_CLIENT_SECRET!,
    ),
  ],
  pages: { signIn: "/" },
  callbacks: {
    async session({ session, user }: any) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};

export const { handlers, auth } = NextAuth(authConfig);
