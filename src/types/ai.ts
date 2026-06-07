import type { RiskLevel, WarRoomMetrics } from "./domain";
import type { Scenario } from "./scenarios";

/** All intents the deterministic copilot can resolve. */
export type CopilotIntentId =
  | "sim" // run a scenario simulation
  | "claude"
  | "deps_mx"
  | "exposed"
  | "fallback"
  | "brief"
  | "cyber"
  | "latam"
  | "approval"
  | "automate"
  | "help";

/** Parsed user command. `scenario` is set only when `id === "sim"`. */
export interface CopilotCommand {
  id: CopilotIntentId;
  scenario?: string;
}

export interface CopilotReportLine {
  k: string;
  v: string;
  /** When present, renders the value as a colored risk pill. */
  lvl?: RiskLevel | string;
}

export interface CopilotReport {
  title: string;
  level: RiskLevel | string;
  lines: CopilotReportLine[];
}

export interface CopilotMessage {
  from: "user" | "bot";
  text?: string;
  report?: CopilotReport;
  mode?: "llm" | "fallback";
}

/** Live context handed to the copilot so answers reflect current posture. */
export interface CopilotContext {
  metrics: WarRoomMetrics;
  scenario: Scenario | null;
}

/**
 * Result of running the copilot against a command.
 * `scenarioId` is non-null when the copilot wants the app to apply a scenario.
 * Returning a plain object (not JSX) keeps this swappable for a future
 * async `/api/agent` backend without touching UI components.
 */
export interface CopilotResult {
  command: CopilotCommand;
  report?: CopilotReport;
  note?: string;
  scenarioId?: string;
}
