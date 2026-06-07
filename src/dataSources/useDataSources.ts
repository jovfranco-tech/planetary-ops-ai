import { create } from "zustand";
import type { DataSourceHealth, RealAIProviderStatus, RealOutage, RealSatellite } from "./types";

interface DataSourceStore {
  health: DataSourceHealth[];
  outages: RealOutage[];
  satellites: RealSatellite[];
  aiProviders: RealAIProviderStatus[];
  isLoading: boolean;
  lastFetchTime: string | null;
  fetchDataSources: () => Promise<void>;
}

const DEFAULT_HEALTH: DataSourceHealth[] = [
  {
    id: "cloudflare-radar",
    name: "Cloudflare Radar",
    category: "Network Anomaly & Outage Feed",
    status: "simulated",
    lastUpdated: new Date().toISOString(),
    freshnessSeconds: 60,
    attribution: "Cloudflare Radar API",
    endpoint: "/api/radar-outages",
    confidence: "high",
    mode: "simulated"
  },
  {
    id: "celestrak",
    name: "CelesTrak GP Database",
    category: "Orbital Mechanics / TLE",
    status: "simulated",
    lastUpdated: new Date().toISOString(),
    freshnessSeconds: 10800,
    attribution: "CelesTrak NORAD GP",
    endpoint: "/api/satellites",
    confidence: "high",
    mode: "simulated"
  },
  {
    id: "ai-status",
    name: "AI Provider Status Aggregator",
    category: "AI Service Mesh Health",
    status: "simulated",
    lastUpdated: new Date().toISOString(),
    freshnessSeconds: 120,
    attribution: "Provider Public Status Pages",
    endpoint: "/api/ai-status",
    confidence: "high",
    mode: "simulated"
  },
  {
    id: "cloud-status",
    name: "Enterprise Cloud Status",
    category: "Multi-Cloud Hyperplane",
    status: "simulated",
    lastUpdated: new Date().toISOString(),
    freshnessSeconds: 86400,
    attribution: "Enterprise Service Catalog",
    endpoint: "local-planned",
    confidence: "high",
    mode: "simulated"
  },
  {
    id: "submarine-cables",
    name: "Submarine Cable Dataset",
    category: "Physical Fiber Routes",
    status: "curated",
    lastUpdated: new Date().toISOString(),
    freshnessSeconds: 0,
    attribution: "Curated TeleGeography inspired layout",
    endpoint: "local-curated",
    confidence: "high",
    mode: "curated"
  },
  {
    id: "scenario-engine",
    name: "Deterministic Simulation Engine",
    category: "Crisis Decision Logic",
    status: "simulated",
    lastUpdated: new Date().toISOString(),
    freshnessSeconds: 0,
    attribution: "Planetary Operations Core",
    endpoint: "local-simulation",
    confidence: "high",
    mode: "simulated"
  }
];

export const useDataSourceStore = create<DataSourceStore>((set, get) => ({
  health: DEFAULT_HEALTH,
  outages: [],
  satellites: [],
  aiProviders: [],
  isLoading: false,
  lastFetchTime: null,

  fetchDataSources: async () => {
    // Avoid double fetching
    if (get().isLoading) return;
    set({ isLoading: true });

    try {
      const [outagesRes, satellitesRes, aiStatusRes] = await Promise.allSettled([
        fetch("/api/radar-outages").then((r) => r.json()),
        fetch("/api/satellites").then((r) => r.json()),
        fetch("/api/ai-status").then((r) => r.json())
      ]);

      const nowStr = new Date().toISOString();
      const nextHealth = [...DEFAULT_HEALTH];

      let outagesData: RealOutage[] = [];
      let satellitesData: RealSatellite[] = [];
      let aiProvidersData: RealAIProviderStatus[] = [];

      // Process Cloudflare Radar result
      const hRadarIdx = nextHealth.findIndex((h) => h.id === "cloudflare-radar");
      if (outagesRes.status === "fulfilled" && outagesRes.value) {
        const data = outagesRes.value;
        outagesData = data.outages || [];
        nextHealth[hRadarIdx] = {
          ...nextHealth[hRadarIdx],
          status: data.status,
          lastUpdated: data.lastUpdated || nowStr,
          attribution: data.attribution,
          mode: data.status === "live" ? "real" : "simulated",
          errorMessage: data.errorMessage || undefined,
          confidence: data.status === "live" ? "high" : "medium"
        };
      } else {
        nextHealth[hRadarIdx] = {
          ...nextHealth[hRadarIdx],
          status: "unavailable",
          lastUpdated: nowStr,
          mode: "simulated",
          confidence: "low",
          errorMessage: outagesRes.status === "rejected" ? String(outagesRes.reason) : "Malformed response"
        };
      }

      // Process CelesTrak result
      const hCelesTrakIdx = nextHealth.findIndex((h) => h.id === "celestrak");
      if (satellitesRes.status === "fulfilled" && satellitesRes.value) {
        const data = satellitesRes.value;
        satellitesData = data.satellites || [];
        nextHealth[hCelesTrakIdx] = {
          ...nextHealth[hCelesTrakIdx],
          status: data.status,
          lastUpdated: data.lastUpdated || nowStr,
          attribution: data.attribution,
          mode: data.status === "live" ? "real" : "simulated",
          errorMessage: data.errorMessage || undefined,
          confidence: data.status === "live" ? "high" : "medium"
        };
      } else {
        nextHealth[hCelesTrakIdx] = {
          ...nextHealth[hCelesTrakIdx],
          status: "unavailable",
          lastUpdated: nowStr,
          mode: "simulated",
          confidence: "low",
          errorMessage: satellitesRes.status === "rejected" ? String(satellitesRes.reason) : "Malformed response"
        };
      }

      // Process AI Status result
      const hAIStatusIdx = nextHealth.findIndex((h) => h.id === "ai-status");
      if (aiStatusRes.status === "fulfilled" && aiStatusRes.value) {
        const data = aiStatusRes.value;
        aiProvidersData = data.providers || [];
        nextHealth[hAIStatusIdx] = {
          ...nextHealth[hAIStatusIdx],
          status: data.status,
          lastUpdated: data.lastUpdated || nowStr,
          attribution: "Statuspage API aggregator",
          mode: data.status === "live" || data.status === "partial" ? "real" : "simulated",
          errorMessage: data.errorMessage || undefined,
          confidence: data.status === "live" ? "high" : "medium"
        };
      } else {
        nextHealth[hAIStatusIdx] = {
          ...nextHealth[hAIStatusIdx],
          status: "unavailable",
          lastUpdated: nowStr,
          mode: "simulated",
          confidence: "low",
          errorMessage: aiStatusRes.status === "rejected" ? String(aiStatusRes.reason) : "Malformed response"
        };
      }

      set({
        health: nextHealth,
        outages: outagesData,
        satellites: satellitesData,
        aiProviders: aiProvidersData,
        lastFetchTime: nowStr,
        isLoading: false
      });

    } catch (err: any) {
      console.error("Failed to load real data sources:", err);
      set({ isLoading: false });
    }
  },
}));
