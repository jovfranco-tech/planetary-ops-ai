import type { Language, Localized } from "../types/i18n";
import { en, type TranslationKey } from "./en";
import { es } from "./es";

const DICTS: Record<Language, Record<string, string | readonly string[]>> = {
  en,
  es,
};

/** Translate a catalog key to a single string for the active language. */
export function t(key: TranslationKey, lang: Language): string {
  const value = DICTS[lang]?.[key] ?? en[key];
  return Array.isArray(value) ? value.join(" · ") : (value as string);
}

/** Translate a catalog key that holds a string list. */
export function tList(key: TranslationKey, lang: Language): string[] {
  const value = DICTS[lang]?.[key] ?? en[key];
  return Array.isArray(value) ? [...value] : [String(value)];
}

/** Resolve an inline `Localized` value with English fallback. */
export function tv(obj: Localized | undefined | null, lang: Language): string {
  if (!obj) return "";
  return obj[lang] || obj.en || "";
}

export type { TranslationKey };
export { en, es };
