import type { Scenario } from "../types/scenarios";
import type { WarRoomMetrics } from "../types/domain";
import { BASELINE, scenarioById } from "../data";

/** Resolve a scenario by id (or null when none active). */
export function getScenario(id: string | null): Scenario | null {
  if (!id) return null;
  return scenarioById(id) ?? null;
}

/**
 * Project the War Room metrics for a given posture.
 * Deterministic: a scenario carries its own metric snapshot; otherwise we
 * fall back to the nominal baseline. Returns a fresh object so callers can
 * safely treat it as immutable state.
 */
export function projectMetrics(scenario: Scenario | null): WarRoomMetrics {
  return scenario ? { ...scenario.metrics } : { ...BASELINE };
}

/** First geo node id to focus the camera on when a scenario activates. */
export function focusNodeFor(scenario: Scenario | null): string | null {
  if (!scenario || !scenario.degradedNodes.length) return null;
  return scenario.degradedNodes[0];
}
