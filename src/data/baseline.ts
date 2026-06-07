import type { WarRoomMetrics } from "../types/domain";

/** Nominal posture used when no scenario is applied. */
export const BASELINE: WarRoomMetrics = {
  resilience: 87,
  aiRisk: 41,
  cyberRisk: 34,
  continuity: 83,
  incidents: 0,
  degradedRegions: 0,
  servicesAffected: 0,
  providersDegraded: 0,
  exposure: { en: "$0.2M / day", es: "0,2 M$ / día" },
  rto: { en: "Low", es: "Bajo" },
};
