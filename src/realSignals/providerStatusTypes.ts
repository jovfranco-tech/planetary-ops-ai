import type { SignalMode, SignalConfidence } from "./types";

export type ProviderCategory = 
  | "cloud" 
  | "ai" 
  | "saas" 
  | "internet" 
  | "cybersecurity" 
  | "collaboration" 
  | "developer-platform" 
  | "data-platform" 
  | "identity" 
  | "reference-only";

export type StatusSeverity = 
  | "operational" 
  | "degraded" 
  | "partial_outage" 
  | "major_outage" 
  | "maintenance" 
  | "unknown";

export interface ProviderComponentStatus {
  id: string;
  name: string;
  status: StatusSeverity;
}

export interface RegionStatus {
  id: string;
  name: string;
  status: StatusSeverity;
  sourceMode: SignalMode;
  services?: ProviderComponentStatus[];
}

export interface ProviderStatusSource {
  id: string;
  name: string;
  provider: string;
  category: ProviderCategory;
  service: string;
  region?: string;
  status: StatusSeverity;
  sourceMode: SignalMode;
  lastCheckedAt: string;
  lastUpdatedAt?: string;
  attribution: string;
  sourceUrl: string;
  summary: string;
  confidence: SignalConfidence;
  contextOnly: boolean; // Must be true
  affectsDecisionModel: boolean; // Must be false by default
  regions?: RegionStatus[];
  components?: ProviderComponentStatus[];
}

// Specialized interfaces
export interface CloudProviderStatus extends ProviderStatusSource {
  category: "cloud";
  regions: RegionStatus[];
}

export interface AIProviderStatus extends ProviderStatusSource {
  category: "ai";
}

export interface SaaSProviderStatus extends ProviderStatusSource {
  category: "saas" | "collaboration" | "developer-platform" | "data-platform" | "identity";
}
