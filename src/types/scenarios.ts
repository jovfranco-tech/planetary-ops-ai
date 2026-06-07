import type { Localized } from "./i18n";
import type { LayerId, RiskLevel, WarRoomMetrics } from "./domain";

export type DecisionOptionId = "A" | "B" | "C";

/** How much autonomy AI is granted under a given decision option. */
export type AIAutomationStance = "Allowed" | "Fallback only" | "Restricted";

/**
 * A single executive decision option. The board always presents three:
 *   A — Monitor only
 *   B — Partial continuity / AI fallback
 *   C — Full DR / multi-provider failover
 */
export interface DecisionOption {
  id: DecisionOptionId;
  label: Localized;
  /** Estimated risk reduction, percentage 0..100. */
  riskReduction: number;
  residualRisk: string;
  businessImpact: string;
  effort: string;
  speed: string;
  humanApproval: boolean;
  recommended: boolean;
}

/** Decision option enriched with engine-derived governance fields. */
export interface ResolvedDecisionOption extends DecisionOption {
  aiAutomation: AIAutomationStance;
  nextAction: Localized;
}

export interface ScenarioHorizon {
  h24: Localized;
  h48: Localized;
  h72: Localized;
}

export interface Scenario {
  id: string;
  /** The layer this incident primarily lives on (drives accent color). */
  layer: LayerId;
  risk: RiskLevel;
  title: Localized;
  summary: Localized;

  /* visual + impact graph */
  affectedRoutes: string[];
  reroute: string[];
  degradedNodes: string[];
  affectedRegions: string[];
  affectedServices: string[];
  aiWorkflows: string[];

  businessImpact: Localized;
  metrics: WarRoomMetrics;
  options: DecisionOption[];
  next: ScenarioHorizon;
}
