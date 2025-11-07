import { DateTime } from "luxon";
import type { DateLike } from "@/types/model";
import { toDateTime } from "@/lib/util";

export const formatCapacity = (val: number) =>
  Number.isFinite(val) ? val : "∞";

export function formatEventDate(
  dateInput: DateLike,
  options: {
    t: (key: string) => string;
    locale: string;
  },
): string {
  const { t, locale } = options;
  const dt = toDateTime(dateInput);
  const now = DateTime.local();
  const time = dt.toFormat("HH:mm");

  if (dt.hasSame(now, "day")) {
    return `${t("today")} ${time}`;
  }

  if (dt.hasSame(now.plus({ days: 1 }), "day")) {
    return `${t("tomorrow")} ${time}`;
  }

  // otherwise → short month and day (include year if different)
  const includeYear = dt.year !== now.year;
  const date = dt.toFormat(includeYear ? "MMM d, yyyy" : "MMM d", { locale });
  return `${date} at ${time}`;
}
