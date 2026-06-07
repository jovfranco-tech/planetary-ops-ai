import type { Language } from "../types/i18n";
import type { Scenario } from "../types/scenarios";
import type { CopilotContext, CopilotIntentId, CopilotReport } from "../types/ai";
import { t, tv } from "../i18n";
import { AI_WORKFLOWS, NODES } from "../data";
import { recommendedOption } from "../engine/decisionEngine";
import {
  regionList,
  serviceList,
  shortRegion,
  workflowList,
} from "../engine/dependencyEngine";

/** Structured executive report for an applied scenario. */
export function buildScenarioReport(s: Scenario, lang: Language): CopilotReport {
  const rec = recommendedOption(s);
  const fb =
    s.reroute && s.reroute.length
      ? lang === "es"
        ? "enrutamiento secundario / fallback activo"
        : "secondary routing / fallback active"
      : s.layer === "ai"
        ? lang === "es"
          ? "modelo de respaldo / local-privado"
          : "fallback model / local-private"
        : t("none", lang);

  return {
    title: tv(s.title, lang),
    level: s.risk,
    lines: [
      { k: t("summary", lang), v: tv(s.summary, lang) },
      { k: t("affectedRegionsL", lang), v: regionList(s.affectedRegions, lang) },
      { k: t("affectedServicesL", lang), v: serviceList(s.affectedServices, lang) },
      { k: t("aiWorkflowsL", lang), v: workflowList(s.aiWorkflows, lang) },
      { k: t("businessImpact", lang), v: tv(s.businessImpact, lang) },
      { k: t("riskLevel", lang), v: s.risk, lvl: s.risk },
      { k: t("recAction", lang), v: rec.id + " · " + tv(rec.label, lang) },
      { k: t("approvalReq", lang), v: rec.humanApproval ? t("yes", lang) : t("no", lang) },
      { k: t("fallbackPath", lang), v: fb },
      {
        k: t("horizon", lang),
        v: `${tv(s.next.h24, lang)}  →  ${tv(s.next.h48, lang)}  →  ${tv(s.next.h72, lang)}`,
      },
    ],
  };
}

/** Informational (non-simulation) reports keyed by intent. */
export function buildInfoReport(
  intent: CopilotIntentId,
  lang: Language,
  ctx: CopilotContext,
): CopilotReport | null {
  const L = (k: Parameters<typeof t>[0]) => t(k, lang);
  const es = lang === "es";

  switch (intent) {
    case "claude":
      return {
        title: es ? "Caída de Claude / Anthropic — análisis de respaldo" : "Claude / Anthropic outage — fallback analysis",
        level: "High",
        lines: [
          {
            k: L("summary"),
            v: es
              ? "Claude degradado afecta análisis de documentos largos, revisión de código y razonamiento de políticas. El copiloto reencamina a respaldo."
              : "Claude degraded affects long-document analysis, code review and policy reasoning. Copilot reroutes to fallback.",
          },
          { k: L("aiWorkflowsL"), v: workflowList(["doc", "gov", "code"], lang) },
          { k: L("riskLevel"), v: "High", lvl: "High" },
          {
            k: L("recAction"),
            v: es
              ? "Fallback a Azure OpenAI / Gemini; flujos sensibles a modelo local-privado."
              : "Fallback to Azure OpenAI / Gemini; route sensitive flows to local-private model.",
          },
          { k: L("approvalReq"), v: L("yes") },
          { k: L("fallbackPath"), v: "Azure OpenAI · Gemini · Local / Private" },
        ],
      };

    case "deps_mx":
      return {
        title: es ? "Dependencias críticas — Ciudad de México" : "Critical dependencies — Mexico City",
        level: "Elevated",
        lines: [
          {
            k: L("summary"),
            v: es
              ? "Operaciones MX dependen del enlace México↔Dallas y de la región US-East para identidad, CRM y analítica."
              : "MX operations depend on the Mexico↔Dallas link and the US-East region for identity, CRM and analytics.",
          },
          { k: L("affectedServicesL"), v: serviceList(["iam", "crm", "anly", "erp"], lang) },
          { k: L("aiWorkflowsL"), v: workflowList(["support", "sales", "brief"], lang) },
          { k: L("riskLevel"), v: "Elevated", lvl: "Elevated" },
          {
            k: L("recAction"),
            v: es
              ? "Asegurar diversidad de carrier y réplica multirregión para servicios MX."
              : "Ensure carrier diversity and multi-region replicas for MX services.",
          },
          {
            k: L("fallbackPath"),
            v: es ? "Ruta Iberia↔LATAM + región São Paulo" : "Iberia↔LATAM path + São Paulo region",
          },
        ],
      };

    case "exposed": {
      const exposed = AI_WORKFLOWS.filter((w) => w.sensitivity === "High" || w.approval);
      return {
        title: es ? "Flujos de IA más expuestos" : "Most exposed AI workflows",
        level: "High",
        lines: [
          {
            k: L("summary"),
            v: es
              ? "Flujos de alta sensibilidad y/o que requieren aprobación humana concentran el mayor riesgo de dependencia."
              : "High-sensitivity and approval-gated workflows concentrate the greatest dependency risk.",
          },
          { k: L("aiWorkflowsL"), v: exposed.map((w) => tv(w.name, lang)).join(" · ") },
          { k: L("riskLevel"), v: "High", lvl: "High" },
          {
            k: L("recAction"),
            v: es
              ? "Garantizar ≥3 proveedores viables y modelo local-privado para sensibilidad Alta."
              : "Guarantee ≥3 viable providers and a local-private model for High sensitivity.",
          },
          { k: L("approvalReq"), v: L("yes") },
        ],
      };
    }

    case "fallback":
      return {
        title: es ? "Estrategia de fallback multimodelo" : "Multi-model fallback strategy",
        level: "Elevated",
        lines: [
          {
            k: L("summary"),
            v: es
              ? "Cada flujo crítico debe mapear primario → respaldo → local/privado, con degradación graceful y revisión humana en comunicaciones externas."
              : "Each critical workflow maps primary → fallback → local/private, with graceful degradation and human review on external comms.",
          },
          { k: L("recAction"), v: "OpenAI → Claude/Gemini → Azure OpenAI → Local/Private" },
          { k: L("aiWorkflowsL"), v: workflowList(["brief", "code", "triage", "doc"], lang) },
          { k: L("riskLevel"), v: "Elevated", lvl: "Elevated" },
          {
            k: L("approvalReq"),
            v: es ? "Requerida para sensibilidad Alta y salida externa" : "Required for High sensitivity & external output",
          },
        ],
      };

    case "brief": {
      const m = ctx.metrics;
      const sc = ctx.scenario;
      const rec = sc ? recommendedOption(sc) : null;
      return {
        title: L("boardBrief"),
        level: m.incidents > 0 ? (sc ? sc.risk : "Elevated") : "Nominal",
        lines: [
          {
            k: L("summary"),
            v: sc
              ? `${tv(sc.title, lang)}. ${tv(sc.businessImpact, lang)}`
              : es
                ? "Sin incidente activo. Postura global dentro de tolerancia."
                : "No active incident. Global posture within tolerance.",
          },
          { k: L("resilience"), v: `${m.resilience}%   ·   ${L("continuity")} ${m.continuity}%` },
          { k: L("aiRisk"), v: `${m.aiRisk}   ·   ${L("cyberRisk")} ${m.cyberRisk}` },
          { k: L("exposure"), v: `${tv(m.exposure, lang)}   ·   RTO ${tv(m.rto, lang)}` },
          {
            k: L("recAction"),
            v: rec
              ? `${rec.id} · ${tv(rec.label, lang)}`
              : es
                ? "Mantener postura · monitoreo continuo"
                : "Maintain posture · continuous monitoring",
          },
        ],
      };
    }

    case "cyber": {
      const top = NODES.filter((n) => n.kind !== "ai")
        .slice()
        .sort((a, b) => b.cyber - a.cyber)
        .slice(0, 4);
      return {
        title: es ? "Regiones de mayor riesgo cibernético" : "Highest cyber-risk regions",
        level: "Elevated",
        lines: [
          {
            k: L("affectedRegionsL"),
            v: top.map((n) => `${shortRegion(n.id, lang)} (${Math.round(n.cyber * 100)})`).join(" · "),
          },
          {
            k: L("summary"),
            v: es
              ? "Exposición de identidad y dependencia de SOC elevan el riesgo en hubs LATAM y Europa."
              : "Identity exposure and SOC dependency elevate risk across LATAM and Europe hubs.",
          },
          { k: L("riskLevel"), v: "Elevated", lvl: "Elevated" },
          {
            k: L("recAction"),
            v: es
              ? "Priorizar PAM, EDR/SIEM y validación de inmutabilidad de backups."
              : "Prioritize PAM, EDR/SIEM coverage and backup-immutability validation.",
          },
        ],
      };
    }

    case "latam":
      return {
        title: es ? "Riesgo de continuidad — LATAM" : "LATAM continuity risk",
        level: "High",
        lines: [
          { k: L("affectedRegionsL"), v: regionList(["mex", "sao"], lang) },
          {
            k: L("summary"),
            v: es
              ? "Dependencia de subsea LATAM↔US-East y región São Paulo; failover disponible con modo degradado."
              : "Dependency on LATAM↔US-East subsea and São Paulo region; failover available in degraded mode.",
          },
          { k: L("riskLevel"), v: "High", lvl: "High" },
          {
            k: L("recAction"),
            v: es
              ? "Validar diversidad de carriers y RTO/RPO de São Paulo."
              : "Validate carrier diversity and São Paulo RTO/RPO.",
          },
          { k: L("fallbackPath"), v: "Iberia↔LATAM + US↔Frankfurt" },
        ],
      };

    case "approval": {
      const need = AI_WORKFLOWS.filter((w) => w.approval);
      return {
        title: es ? "Flujos que requieren aprobación humana" : "Workflows requiring human approval",
        level: "Elevated",
        lines: [
          { k: L("aiWorkflowsL"), v: need.map((w) => tv(w.name, lang)).join(" · ") },
          {
            k: L("summary"),
            v: es
              ? "Salida externa, sensibilidad Alta y decisiones de gobierno exigen validación humana antes de ejecutar."
              : "External output, High sensitivity and governance decisions require human validation before execution.",
          },
          { k: L("approvalReq"), v: L("yes") },
        ],
      };
    }

    case "automate": {
      const safe = AI_WORKFLOWS.filter((w) => !w.approval && w.sensitivity !== "High");
      return {
        title: es ? "Qué se puede automatizar con seguridad" : "What can be automated safely",
        level: "Nominal",
        lines: [
          { k: L("aiWorkflowsL"), v: safe.map((w) => tv(w.name, lang)).join(" · ") },
          {
            k: L("summary"),
            v: es
              ? "Flujos de baja sensibilidad sin aprobación pueden automatizarse con respaldo multimodelo."
              : "Low-sensitivity, no-approval workflows can be automated with multi-model fallback.",
          },
          { k: L("approvalReq"), v: L("no") },
        ],
      };
    }

    default:
      return null;
  }
}
