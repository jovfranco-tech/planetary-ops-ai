import type { Language } from "../types/i18n";
import type { Scenario } from "../types/scenarios";
import { tv } from "../i18n";
import { serviceById } from "../data";
import { recommendedOption } from "./decisionEngine";

/**
 * Deterministic Board Brief generator. Reads like a concise note a CIO /
 * Technology Transformation Leader would send to leadership.
 */
export function generateBoardBrief(scenario: Scenario | null, lang: Language): string {
  if (!scenario) {
    return lang === "es"
      ? "Postura nominal. La operación global se mantiene dentro de tolerancia. La mayor exposición actual está en la concentración de proveedores de IA y la dependencia del control plane US-East. Recomendación: mantener monitoreo, validar el fallback multimodelo y preparar continuidad parcial para los flujos críticos de IA."
      : "Nominal posture. Global operations remain within tolerance. Current exposure concentrates in AI provider dependency and reliance on the US-East control plane. Recommendation: maintain monitoring, validate multi-model fallback and stage partial continuity for critical AI workflows.";
  }

  const rec = recommendedOption(scenario);
  const svc = (scenario.affectedServices || [])
    .slice(0, 3)
    .map((id) => {
      const s = serviceById(id);
      return s ? tv(s.name, lang) : id;
    })
    .join(", ");
  const recLabel = tv(rec.label, lang).toLowerCase();

  if (lang === "es") {
    return (
      "Incidente simulado: " +
      tv(scenario.title, lang) +
      ". Se eleva el riesgo de dependencia en " +
      (svc || "servicios críticos") +
      " y los flujos asociados operan en modo degradado. Recomendación: " +
      recLabel +
      ", restringir datos sensibles a IA local/privada y requerir aprobación humana para comunicaciones externas."
    );
  }
  return (
    "Simulated incident: " +
    tv(scenario.title, lang) +
    ". Dependency risk rises across " +
    (svc || "critical services") +
    " and associated workflows operate in degraded mode. Recommendation: " +
    recLabel +
    ", restrict sensitive data to local/private AI and require human approval for external communications."
  );
}
