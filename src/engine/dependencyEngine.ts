import type { Language } from "../types/i18n";
import { nodeById, serviceById, workflowById } from "../data";
import { tv, t } from "../i18n";
import { shortName } from "../utils/formatting";

/** Short region/node label (drops the descriptive suffix). */
export function shortRegion(id: string, lang: Language): string {
  const n = nodeById(id);
  if (!n) return id;
  return shortName(n.name[lang] || n.name.en);
}

export function regionList(ids: string[] | undefined, lang: Language): string {
  if (!ids || !ids.length) return t("none", lang);
  return ids.map((i) => shortRegion(i, lang)).join(" · ");
}

export function serviceList(ids: string[] | undefined, lang: Language): string {
  if (!ids || !ids.length) return t("none", lang);
  return ids
    .map((i) => {
      const s = serviceById(i);
      return s ? tv(s.name, lang) : i;
    })
    .join(" · ");
}

export function workflowList(ids: string[] | undefined, lang: Language): string {
  if (!ids || !ids.length) return t("none", lang);
  return ids
    .map((i) => {
      const w = workflowById(i);
      return w ? tv(w.name, lang) : i;
    })
    .join(" · ");
}
