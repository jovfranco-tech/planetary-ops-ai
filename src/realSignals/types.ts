export type SignalMode = 
  | "live" 
  | "cached" 
  | "reference" 
  | "simulated" 
  | "curated" 
  | "unavailable" 
  | "error";

export type SignalSeverity = "low" | "medium" | "high" | "critical";
export type SignalConfidence = "low" | "medium" | "high";

export interface RealPublicSignal {
  id: string;
  sourceName: string;
  category: "space" | "network" | "ai" | "cloud" | "platform" | "infrastructure";
  mode: SignalMode;
  lastCheckedAt: string;
  lastUpdatedAt?: string;
  attribution: string;
  confidence: SignalConfidence;
  freshnessSeconds?: number;
  summary: string;
  impactScope?: string;
  normalizedSeverity?: SignalSeverity;
  
  // Strict deterministic boundaries
  affectsGlobe: boolean;
  affectsDecisionModel: boolean; // Must be false by default
  contextOnly: boolean; // Must be true by default
}

export interface SignalAggregatorResponse {
  signals: RealPublicSignal[];
  hasLiveFeeds: boolean;
  lastUpdated: string;
}
