import { DateTime } from "luxon";
import type { DateLike } from "@/types/model";

/**
 * @param val - value to check
 * @returns whether the given value is defined
 */
export function isDefined<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null;
}

export function toDateTime(val: DateLike): DateTime {
  if (val instanceof Date) {
    return DateTime.fromJSDate(val);
  }

  if (typeof val === "number") {
    // Assume it's a Unix timestamp in milliseconds
    return DateTime.fromMillis(val);
  }

  // Try ISO or common date formats
  const dt = DateTime.fromISO(val);
  if (dt.isValid) {
    return dt;
  }
  const alt = DateTime.fromRFC2822(val);
  if (alt.isValid) {
    return alt;
  }
  const num = Number(val);
  if (!Number.isNaN(num)) {
    return DateTime.fromMillis(num);
  }

  // Return invalid DateTime if nothing matched
  return DateTime.invalid("Invalid DateLike value");
}

export function canRegisterNow(start: DateLike) {
  const now = new Date();
  // TODO use luxon duration for sake of readability
  const openAt = new Date(
    toDateTime(start).toJSDate().getTime() - 24 * 60 * 60 * 1000,
  );
  return now >= openAt && now < start;
}
