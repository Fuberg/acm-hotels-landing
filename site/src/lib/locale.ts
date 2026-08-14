export type Locale = "ru" | "en";

export const LOCALES: readonly Locale[] = ["ru", "en"];

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
