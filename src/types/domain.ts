import type { Localized } from "./i18n";

/* ------------------------------------------------------------------ */
/* Enumerations (avoid magic strings across the codebase)              */
/* ------------------------------------------------------------------ */

export type LayerId =
  | "space"
  | "backbone"
  | "cloud"
  | "enterprise"
  | "cyber"
  | "continuity"
  | "ai"
  | "enterprise-footprint";

export type NodeKind = "enterprise" | "cloud" | "ai" | "landing";

/** Operational risk posture, ordered from calm to severe. */
export type RiskLevel = "Nominal" | "Low" | "Elevated" | "High" | "Critical";

/** Live status of an AI provider or AI-dependent service. */
export type ServiceStatus = "nominal" | "degraded" | "critical" | "unavailable";

/** Whether a workflow can keep running, and under what constraints. */
export type ContinuityMode = "available" | "degraded" | "restricted";

/** Data-sensitivity classification allowed through a provider / workflow. */
export type Sensitivity = "Low" | "Medium" | "High";

/** How much autonomy AI is granted in a workflow. */
export type AutomationLevel = "Automated" | "Assisted" | "Restricted";

/* ------------------------------------------------------------------ */
/* Infrastructure topology                                             */
/* ------------------------------------------------------------------ */

export interface InfrastructureLayer {
  id: LayerId;
  glyph: string;
  color: string;
  name: Localized;
  desc: Localized;
}

export interface InfrastructureNode {
  id: string;
  lat: number;
  lng: number;
  kind: NodeKind;
  /** Normalized cyber-exposure score 0..1 used for ambient risk rings. */
  cyber: number;
  /** Layers under which this node is visible. */
  layers: LayerId[];
  name: Localized;
}

export interface InfrastructureRoute {
  id: string;
  from: string;
  to: string;
  layer: LayerId;
  label: Localized;
}

export interface Satellite {
  id: string;
  lat: number;
  lngOffset: number;
  altitude: number;
  speed: number;
  inclination: number;
}

/** A floating annotation rendered on the globe. */
export interface KeyLabel {
  /** When set, the label is anchored to the referenced node. */
  ref?: string;
  lat?: number;
  lng?: number;
  /** Only shown when this layer is enabled. */
  layer?: LayerId;
  route?: boolean;
  en: string;
  es: string;
}

export interface Region {
  id: string;
  name: Localized;
  /** Node ids that belong to this region. */
  nodes: string[];
}

export interface Service {
  id: string;
  name: Localized;
}

/* ------------------------------------------------------------------ */
/* AI as critical digital infrastructure                               */
/* ------------------------------------------------------------------ */

export interface AIProvider {
  id: string;
  label: string;
  category: string;
  /** Share of total AI dependency, percentage 0..100. */
  concentration: number;
  /** Accent color used in concentration bars / globe. */
  tone: string;
  status: ServiceStatus;
  useCases: Localized;
  /** Ordered fallback provider labels. */
  fallback: string[];
  sensitivityAllowed: Sensitivity;
  humanApproval: boolean;
  modelRisk: RiskLevel;
  continuity: ContinuityMode;
  notes: Localized;
}

export interface AIWorkflow {
  id: string;
  name: Localized;
  primary: string;
  fallback: string;
  criticality: RiskLevel;
  sensitivity: Sensitivity;
  businessImpact: Localized;
  automation: AutomationLevel;
  approval: boolean;
  continuity: ContinuityMode;
  status: ServiceStatus;
}

/* ------------------------------------------------------------------ */
/* Executive metrics                                                   */
/* ------------------------------------------------------------------ */

export interface WarRoomMetrics {
  /** Higher is better. */
  resilience: number;
  /** Higher is worse. */
  aiRisk: number;
  /** Higher is worse. */
  cyberRisk: number;
  /** Higher is better. */
  continuity: number;
  incidents: number;
  degradedRegions: number;
  servicesAffected: number;
  providersDegraded: number;
  exposure: Localized;
  rto: Localized;
}
