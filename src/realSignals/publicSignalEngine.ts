import { 
  normalizeCloudflareOutages, 
  normalizeCelesTrak, 
  normalizeAIStatus, 
  normalizeHealth,
  normalizeCloudStatus,
  normalizeSaaSStatus
} from "./normalize";
import type { RealPublicSignal } from "./types";

export interface SignalEngineResult {
  signals: RealPublicSignal[];
  rawSatellites: any[];
  rawOutages: any[];
  rawAiProviders: any[];
  rawCloudProviders: any[];
  rawSaaSProviders: any[];
}

export async function fetchAllPublicSignals(): Promise<SignalEngineResult> {
  let cfData = null;
  let celestrakData = null;
  let aiData = null;
  let healthData = null;
  let cloudData = null;
  let saasData = null;

  // We fetch all endpoints concurrently to minimize load time.
  const [cfRes, ctRes, aiRes, healthRes, cloudRes, saasRes] = await Promise.allSettled([
    fetch("/api/radar-outages").then(r => r.json()),
    fetch("/api/satellites").then(r => r.json()),
    fetch("/api/ai-status").then(r => r.json()),
    fetch("/api/health").then(r => r.json()),
    fetch("/api/cloud-status").then(r => r.json()),
    fetch("/api/saas-status").then(r => r.json())
  ]);

  if (cfRes.status === "fulfilled") cfData = cfRes.value;
  if (ctRes.status === "fulfilled") celestrakData = ctRes.value;
  if (aiRes.status === "fulfilled") aiData = aiRes.value;
  if (healthRes.status === "fulfilled") healthData = healthRes.value;
  if (cloudRes.status === "fulfilled") cloudData = cloudRes.value;
  if (saasRes.status === "fulfilled") saasData = saasRes.value;

  const signals: RealPublicSignal[] = [];

  // Normalize and aggregate
  signals.push(...normalizeHealth(healthData));
  signals.push(...normalizeCloudStatus(cloudData));
  signals.push(...normalizeSaaSStatus(saasData));
  signals.push(...normalizeCloudflareOutages(cfData));
  signals.push(...normalizeCelesTrak(celestrakData));
  signals.push(...normalizeAIStatus(aiData));

  return {
    signals,
    rawSatellites: celestrakData?.satellites || [],
    rawOutages: cfData?.outages || [],
    rawAiProviders: aiData?.providers || [],
    rawCloudProviders: cloudData?.providers || [],
    rawSaaSProviders: saasData?.providers || []
  };
}
