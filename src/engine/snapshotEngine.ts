import type { Language } from "../types/i18n";
import type { Scenario } from "../types/scenarios";
import type { WarRoomMetrics } from "../types/domain";
import type { RealPublicSignal } from "../realSignals/types";
import { generateBoardBrief } from "./briefingEngine";
import { recommendedOptionId } from "./decisionEngine";

export interface ExecutiveSnapshot {
  timestamp: string;
  lang: Language;
  scenario: Scenario | null;
  metrics: WarRoomMetrics;
  brief: string;
  recommendedId: string | null;
  signals: RealPublicSignal[];
}

export function generateSnapshot(
  scenario: Scenario | null,
  metrics: WarRoomMetrics,
  signals: RealPublicSignal[],
  lang: Language
): ExecutiveSnapshot {
  return {
    timestamp: new Date().toISOString(),
    lang,
    scenario,
    metrics,
    brief: generateBoardBrief(scenario, lang),
    recommendedId: recommendedOptionId(scenario),
    signals
  };
}
