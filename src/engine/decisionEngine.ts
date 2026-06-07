import type { Language } from "../types/i18n";
import type {
  DecisionOption,
  DecisionOptionId,
  Scenario,
} from "../types/scenarios";
import { t } from "../i18n";

/** Id of the recommended option for a scenario (B is the usual default). */
export function recommendedOptionId(scenario: Scenario | null): DecisionOptionId | null {
  if (!scenario) return "B";
  const rec = scenario.options.find((o) => o.recommended) ?? scenario.options[0];
  return rec ? rec.id : null;
}

/** The recommended option object (or first) for a scenario. */
export function recommendedOption(scenario: Scenario): DecisionOption {
  return scenario.options.find((o) => o.recommended) ?? scenario.options[0];
}

export function automationLabel(id: DecisionOptionId, lang: Language): string {
  if (id === "A") return t("autoAllowed", lang);
  if (id === "B") return t("autoFallback", lang);
  return t("autoRestricted", lang);
}

export function nextActionLabel(id: DecisionOptionId, lang: Language): string {
  if (id === "A") return t("nextA", lang);
  if (id === "B") return t("nextB", lang);
  return t("nextC", lang);
}

/* ------------------------------------------------------------------ */
/* Ghost options shown under nominal posture (no active scenario).     */
/* ------------------------------------------------------------------ */

import type { Localized } from "../types/i18n";

export interface GhostOption {
  id: DecisionOptionId;
  labelKey: "archA" | "archB" | "archC";
  recommended: boolean;
  riskReduction: Localized;
  bar: number;
  residual: Localized;
  speed: Localized;
  impact: Localized;
  approval: boolean;
  note: Localized;
}

export const GHOST_OPTIONS: GhostOption[] = [
  {
    id: "A",
    labelKey: "archA",
    recommended: false,
    riskReduction: { en: "Low", es: "Baja" },
    bar: 22,
    residual: { en: "Medium", es: "Media" },
    speed: { en: "Immediate", es: "Inmediata" },
    impact: { en: "Low", es: "Bajo" },
    approval: false,
    note: { en: "Only if no degradation", es: "Solo sin degradación" },
  },
  {
    id: "B",
    labelKey: "archB",
    recommended: true,
    riskReduction: { en: "Med / High", es: "Media / Alta" },
    bar: 64,
    residual: { en: "Low / Med", es: "Baja / Media" },
    speed: { en: "30–60 min", es: "30–60 min" },
    impact: { en: "Controlled", es: "Controlado" },
    approval: true,
    note: { en: "Preferred default", es: "Predeterminada" },
  },
  {
    id: "C",
    labelKey: "archC",
    recommended: false,
    riskReduction: { en: "High", es: "Alta" },
    bar: 90,
    residual: { en: "Low", es: "Bajo" },
    speed: { en: "2–4 h", es: "2–4 h" },
    impact: { en: "High op. change", es: "Alto cambio op." },
    approval: true,
    note: { en: "Critical escalation only", es: "Solo escalación crítica" },
  },
];
