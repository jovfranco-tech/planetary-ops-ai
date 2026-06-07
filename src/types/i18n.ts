/**
 * Localization primitives.
 * Every user-facing string in the domain layer is `Localized` so the UI can
 * resolve it for the active language without branching on `lang` everywhere.
 */
export type Language = "en" | "es";

/** A single string available in both supported languages. */
export interface Localized {
  en: string;
  es: string;
}

/** A list of strings available in both supported languages. */
export interface LocalizedList {
  en: string[];
  es: string[];
}
