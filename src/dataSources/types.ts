export type SourceStatus = "live" | "cached" | "simulated" | "curated" | "unavailable" | "error";
export type SourceMode = "real" | "curated" | "simulated";
export type ConfidenceLevel = "high" | "medium" | "low";

export interface DataSourceHealth {
  id: string;
  name: string;
  category: string;
  status: SourceStatus;
  lastUpdated: string;
  freshnessSeconds: number;
  attribution: string;
  endpoint: string;
  errorMessage?: string;
  confidence: ConfidenceLevel;
  mode: SourceMode;
}

export interface RealOutage {
  id: string;
  locationName: string;
  countryCode?: string;
  region?: string;
  startedAt?: string;
  endedAt?: string;
  cause?: string;
  scope?: string;
  severity: "low" | "medium" | "high" | "critical";
  summary: string;
}

export interface RealSatellite {
  id: string;
  name: string;
  category: "LEO" | "MEO" | "GEO" | "weather" | "navigation" | "communications" | "unknown";
  tleLine1?: string;
  tleLine2?: string;
  epoch?: string;
  dataAgeHours?: number;
  operationalStatus?: string;
}

export interface RealAIProviderStatus {
  id: string;
  name: string;
  status: "operational" | "degraded" | "partial_outage" | "major_outage" | "unknown";
  sourceMode: "live" | "status-page" | "simulated" | "unavailable";
  lastIncidentSummary?: string;
  lastCheckedAt: string;
  attribution: string;
}
