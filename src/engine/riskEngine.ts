import type { Scenario } from "../types/scenarios";
import type { WarRoomMetrics } from "../types/domain";
import type { ScoreClass } from "../utils/scoring";
import { SCORE } from "../utils/constants";

export type GlobalStatus = "nominal" | "elevated" | "critical";

/** Top-bar global status derived purely from current metrics. */
export function globalStatus(metrics: WarRoomMetrics): GlobalStatus {
  if (metrics.incidents <= 0) return "nominal";
  return metrics.resilience < 55 ? "critical" : "elevated";
}

export interface Posture {
  /** i18n key for the posture label. */
  labelKey: "nominal" | "critical" | "degradedTag";
  scoreClass: ScoreClass;
  /** i18n key for executive escalation. */
  escalationKey: "escNotReq" | "escDirector";
  escalationClass: ScoreClass;
}

/** Executive posture + escalation derived from the active scenario. */
export function derivePosture(scenario: Scenario | null): Posture {
  if (!scenario) {
    return {
      labelKey: "nominal",
      scoreClass: "score-good",
      escalationKey: "escNotReq",
      escalationClass: "score-good",
    };
  }
  const critical = scenario.risk === "Critical";
  return {
    labelKey: critical ? "critical" : "degradedTag",
    scoreClass: critical ? "score-bad" : "score-warn",
    escalationKey: "escDirector",
    escalationClass: "score-warn",
  };
}

/** Convenience re-export so consumers share the same thresholds. */
export { SCORE };
