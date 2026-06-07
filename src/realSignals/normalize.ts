import type { RealPublicSignal, SignalMode, SignalSeverity } from "./types";

export function normalizeCloudflareOutages(apiData: any): RealPublicSignal[] {
  if (!apiData || !apiData.outages || apiData.status === "unavailable" || apiData.status === "simulated") {
    // If it's unavailable or simulated, we still might want to display a top-level signal indicating the source state.
    return [{
      id: "cf-radar-status",
      sourceName: "Cloudflare Radar",
      category: "network",
      mode: apiData?.status || "unavailable",
      lastCheckedAt: new Date().toISOString(),
      attribution: apiData?.attribution || "Cloudflare Radar",
      confidence: "high",
      summary: apiData?.errorMessage || "No live outage feeds available.",
      affectsGlobe: false,
      affectsDecisionModel: false,
      contextOnly: true
    }];
  }

  // If we have live outages:
  return apiData.outages.map((o: any) => ({
    id: o.id,
    sourceName: "Cloudflare Radar",
    category: "network",
    mode: "live" as SignalMode,
    lastCheckedAt: new Date().toISOString(),
    lastUpdatedAt: o.startedAt,
    attribution: "Cloudflare Radar API",
    confidence: "high",
    summary: o.summary || `Network outage at ${o.locationName}`,
    impactScope: o.scope || o.locationName,
    normalizedSeverity: (o.severity === "high" || o.severity === "critical") ? "critical" 
                      : (o.severity === "medium" ? "medium" : "low") as SignalSeverity,
    affectsGlobe: true, // We can map these to the globe if they have coordinates later
    affectsDecisionModel: false,
    contextOnly: true
  }));
}

export function normalizeCelesTrak(apiData: any): RealPublicSignal[] {
  const mode = apiData?.status === "live" ? "live" : "cached";
  const attribution = apiData?.attribution || "CelesTrak";
  
  return [{
    id: "celestrak-feed",
    sourceName: "CelesTrak (NORAD GP)",
    category: "space",
    mode: mode,
    lastCheckedAt: new Date().toISOString(),
    lastUpdatedAt: apiData?.lastUpdated,
    attribution: attribution,
    confidence: "high",
    summary: `Tracking ${apiData?.satellites?.length || 0} reference satellites in orbit.`,
    affectsGlobe: true, // we render the actual satellites
    affectsDecisionModel: false,
    contextOnly: true
  }];
}

export function normalizeAIStatus(apiData: any): RealPublicSignal[] {
  if (!apiData || !apiData.providers) return [];
  
  return apiData.providers.map((p: any) => ({
    id: `ai-status-${p.id}`,
    sourceName: p.name,
    category: "ai",
    mode: p.sourceMode as SignalMode,
    lastCheckedAt: p.lastCheckedAt || new Date().toISOString(),
    attribution: p.attribution,
    confidence: p.sourceMode === "live" ? "high" : "medium",
    summary: p.lastIncidentSummary || `Status: ${p.status}`,
    normalizedSeverity: p.status === "operational" ? "low" : (p.status === "degraded" ? "medium" : "critical"),
    affectsGlobe: false,
    affectsDecisionModel: false,
    contextOnly: true
  }));
}

export function normalizeHealth(apiData: any): RealPublicSignal[] {
  return [{
    id: "platform-health",
    sourceName: "Vercel Platform",
    category: "platform",
    mode: "live",
    lastCheckedAt: new Date().toISOString(),
    lastUpdatedAt: apiData?.timestamp,
    attribution: "Vercel /api/health",
    confidence: "high",
    summary: `App ${apiData?.app} running on v${apiData?.version}. Status: ${apiData?.status}`,
    normalizedSeverity: apiData?.status === "ok" ? "low" : "critical",
    affectsGlobe: false,
    affectsDecisionModel: false,
    contextOnly: true
  }];
}

export function normalizeCloudStatus(apiData: any): RealPublicSignal[] {
  if (!apiData || !apiData.providers) return [];
  
  return apiData.providers.map((p: any) => ({
    id: `cloud-${p.id}`,
    sourceName: p.name,
    category: "cloud",
    mode: p.sourceMode as SignalMode,
    lastCheckedAt: p.lastCheckedAt || new Date().toISOString(),
    attribution: p.attribution,
    confidence: p.sourceMode === "live" ? "high" : "medium",
    summary: `${p.name} status: ${p.status || "Reference mode"}`,
    normalizedSeverity: "low",
    affectsGlobe: false,
    affectsDecisionModel: false,
    contextOnly: true
  }));
}

export function normalizeSaaSStatus(apiData: any): RealPublicSignal[] {
  if (!apiData || !apiData.providers) return [];
  
  return apiData.providers.map((p: any) => ({
    id: `saas-${p.id}`,
    sourceName: p.name,
    category: p.category,
    mode: p.sourceMode as SignalMode,
    lastCheckedAt: p.lastCheckedAt || new Date().toISOString(),
    attribution: p.attribution,
    confidence: "medium",
    summary: `${p.name} status: ${p.status || "Reference mode"}`,
    normalizedSeverity: "low",
    affectsGlobe: false,
    affectsDecisionModel: false,
    contextOnly: true
  }));
}
