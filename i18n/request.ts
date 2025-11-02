import { auth } from "@/lib/auth";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const session = await auth();
  const user = session?.user;
  // TODO add preferredLanguage prop to user
  const locale = (user as any)?.preferredLanguage || "ru";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
