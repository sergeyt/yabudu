/**
 * @param val - value to check
 * @returns whether the given value is defined
 */
export function isDefined<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null;
}
