import type { Language } from "../types/i18n";
import type { Scenario } from "../types/scenarios";
import type { WarRoomMetrics } from "../types/domain";
import type { DataSourceHealth } from "../dataSources/types";
import { generateBoardBrief } from "./briefingEngine";
import { recommendedOptionId } from "./decisionEngine";

export interface ExecutiveSnapshot {
  timestamp: string;
  lang: Language;
  scenario: Scenario | null;
  metrics: WarRoomMetrics;
  brief: string;
  recommendedId: string | null;
  sourceHealth: DataSourceHealth[];
}

export function generateSnapshot(
  scenario: Scenario | null,
  metrics: WarRoomMetrics,
  sourceHealth: DataSourceHealth[],
  lang: Language
): ExecutiveSnapshot {
  return {
    timestamp: new Date().toISOString(),
    lang,
    scenario,
    metrics,
    brief: generateBoardBrief(scenario, lang),
    recommendedId: recommendedOptionId(scenario),
    sourceHealth
  };
}
