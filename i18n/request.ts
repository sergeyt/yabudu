import { auth } from "@/lib/auth";
import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "./routing";

export default getRequestConfig(async ({ locale: locale0 }) => {
  const session = await auth();
  const user = session?.user;

  // TODO add preferredLanguage prop to user
  const locale1 = locale0 || (user as any)?.preferredLanguage || defaultLocale;
  const locale = locales.includes(locale1) ? locale1 : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
