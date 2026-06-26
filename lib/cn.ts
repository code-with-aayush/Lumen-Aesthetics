/**
 * Class-name combiner. Joins truthy strings with a single space and drops
 * falsy values (`false`, `null`, `undefined`, `""`). No clsx dependency —
 * the project doesn't need its edge cases.
 *
 *   cn("base", condition && "active", isX && "x")
 */

export function cn(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter((v): v is string => Boolean(v)).join(" ");
}