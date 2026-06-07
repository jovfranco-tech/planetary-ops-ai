import type {
  AIProvider,
  AIWorkflow,
  InfrastructureNode,
  InfrastructureRoute,
  Region,
  Service,
} from "../types/domain";
import type { Scenario } from "../types/scenarios";

import { LAYERS, ALL_LAYER_IDS } from "./layers";
import { NODES, KEY_LABELS, SATELLITES } from "./infrastructureNodes";
import { ROUTES, DR_PATHS } from "./infrastructureRoutes";
import { SERVICES } from "./services";
import { REGIONS } from "./regions";
import { PROVIDERS } from "./aiProviders";
import { AI_WORKFLOWS } from "./aiWorkflows";
import { SCENARIOS } from "./scenarios";
import { BASELINE } from "./baseline";

export {
  LAYERS,
  ALL_LAYER_IDS,
  NODES,
  KEY_LABELS,
  SATELLITES,
  ROUTES,
  DR_PATHS,
  SERVICES,
  REGIONS,
  PROVIDERS,
  AI_WORKFLOWS,
  SCENARIOS,
  BASELINE,
};

/* ----------------------------- lookups ----------------------------- */

export function nodeById(id: string): InfrastructureNode | undefined {
  return NODES.find((n) => n.id === id);
}
export function routeById(id: string): InfrastructureRoute | undefined {
  return ROUTES.find((r) => r.id === id);
}
export function serviceById(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}
export function scenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}
export function workflowById(id: string): AIWorkflow | undefined {
  return AI_WORKFLOWS.find((w) => w.id === id);
}
export function providerById(id: string): AIProvider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}
export function regionById(id: string): Region | undefined {
  return REGIONS.find((r) => r.id === id);
}
