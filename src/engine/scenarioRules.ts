import type { SimulatedMarket, SimulatedHub } from "../data/footprint";

export interface ScenarioImpact {
  isCritical: boolean;
  isDegraded: boolean;
}

/**
 * Rules Engine for determining the impact of a scenario on a simulated footprint node (Market or Hub).
 * Decouples business logic from the 3D rendering loop.
 */
export function evaluateFootprintImpact(
  scenarioId: string | undefined,
  node: SimulatedMarket | SimulatedHub
): ScenarioImpact {
  if (!scenarioId) return { isCritical: false, isDegraded: false };

  let isDegraded = false;
  let isCritical = false;

  const inLatam = node.region === "LATAM";
  const inNorthAmerica = node.region === "North America";
  
  const isCloudDep = node.dependencyProfile === "cloud" || (node as SimulatedMarket).dependencyProfile === "analytics";
  const isAiDep = node.dependencyProfile === "ai";
  const isIdpDep = node.dependencyProfile === "identity";

  switch (scenarioId) {
    case "cable_cut":
      if (inLatam) isDegraded = true;
      break;

    case "ransomware":
      if (inLatam) isCritical = true;
      break;

    case "useast_cloud":
      if (inNorthAmerica || isCloudDep) isDegraded = true;
      break;

    case "openai_outage":
    case "copilot_outage":
    case "multi_ai":
      if (isAiDep) isDegraded = true;
      break;

    case "idp_outage":
      if (isIdpDep) isCritical = true;
      break;
  }

  return { isCritical, isDegraded };
}
