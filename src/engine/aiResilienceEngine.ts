import type { Language } from "../types/i18n";
import type { AIWorkflow } from "../types/domain";
import type { Scenario } from "../types/scenarios";
import type { TranslationKey } from "../i18n";
import { AI_WORKFLOWS, PROVIDERS } from "../data";

const GREEN = "var(--green)";
const AMBER = "var(--amber)";
const RED = "var(--red)";

export interface AIResilienceSummary {
  /** AI dependency risk (mirrors metrics.aiRisk) + color band. */
  depRisk: number;
  depColor: string;
  /** Top provider concentration share + qualitative label key. */
  topShare: number;
  concentrationHigh: boolean;
  /** Fallback readiness 0..100 + color band. */
  readiness: number;
  readinessColor: string;
  approvalGated: number;
  totalWorkflows: number;
}

/** Compute the AI Dependency Resilience headline figures. */
export function summarizeAIResilience(
  aiRisk: number,
  scenario: Scenario | null,
): AIResilienceSummary {
  const hit = scenario ? scenario.aiWorkflows.length : 0;
  const readiness = scenario ? Math.max(38, 88 - hit * 7) : 88;
  const topShare = Math.max(...PROVIDERS.map((p) => p.concentration));
  return {
    depRisk: aiRisk,
    depColor: aiRisk <= 45 ? GREEN : aiRisk <= 65 ? AMBER : RED,
    topShare,
    concentrationHigh: topShare >= 30,
    readiness,
    readinessColor: readiness >= 75 ? GREEN : readiness >= 55 ? AMBER : RED,
    approvalGated: AI_WORKFLOWS.filter((w) => w.approval).length,
    totalWorkflows: AI_WORKFLOWS.length,
  };
}

export interface WorkflowStatus {
  labelKey: TranslationKey;
  cls: "cont-available" | "cont-degraded" | "cont-restricted";
}

/** Resolve the continuity status of a workflow under the active scenario. */
export function workflowStatus(w: AIWorkflow, scenario: Scenario | null): WorkflowStatus {
  const hit = !!scenario && scenario.aiWorkflows.indexOf(w.id) >= 0;
  if (hit) {
    if (w.sensitivity === "High") return { labelKey: "approvalReqS", cls: "cont-restricted" };
    if (w.approval) return { labelKey: "approvalReqS", cls: "cont-degraded" };
    return { labelKey: "degraded", cls: "cont-degraded" };
  }
  if (w.approval && w.sensitivity === "High") return { labelKey: "approvalReqS", cls: "cont-restricted" };
  if (w.continuity === "available") return { labelKey: "available", cls: "cont-available" };
  if (w.continuity === "degraded") return { labelKey: "degraded", cls: "cont-degraded" };
  return { labelKey: "manualFallbackS", cls: "cont-restricted" };
}

/** Workflows highlighted in the panel (stable, representative subset). */
export const PANEL_WORKFLOW_IDS = ["brief", "triage", "code", "support", "pmo"] as const;

export function getPanelWorkflows(lang: Language): AIWorkflow[] {
  void lang;
  return PANEL_WORKFLOW_IDS.map((id) => AI_WORKFLOWS.find((w) => w.id === id)).filter(
    (w): w is AIWorkflow => Boolean(w),
  );
}
