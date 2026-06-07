import type { InfrastructureRoute } from "../types/domain";

export const ROUTES: InfrastructureRoute[] = [
  { id: "r1", from: "sao", to: "iad", layer: "backbone", label: { en: "LATAM ↔ US-East", es: "LATAM ↔ US-East" } },
  { id: "r2", from: "mex", to: "dal", layer: "backbone", label: { en: "Mexico ↔ Dallas", es: "México ↔ Dallas" } },
  { id: "r3", from: "iad", to: "lon", layer: "backbone", label: { en: "Transatlantic US ↔ UK", es: "Transatlántico US ↔ UK" } },
  { id: "r4", from: "dal", to: "fra", layer: "backbone", label: { en: "US ↔ Frankfurt", es: "US ↔ Fráncfort" } },
  { id: "r5", from: "fra", to: "bom", layer: "backbone", label: { en: "Europe ↔ India", es: "Europa ↔ India" } },
  { id: "r6", from: "bom", to: "sin", layer: "backbone", label: { en: "India ↔ APAC", es: "India ↔ APAC" } },
  { id: "r7", from: "sin", to: "iad", layer: "backbone", label: { en: "Trans-Pacific APAC ↔ US", es: "Transpacífico APAC ↔ US" } },
  { id: "r8", from: "mad", to: "sao", layer: "backbone", label: { en: "Iberia ↔ LATAM", es: "Iberia ↔ LATAM" } },
  { id: "r9", from: "lon", to: "fra", layer: "backbone", label: { en: "UK ↔ Europe", es: "UK ↔ Europa" } },
  { id: "r10", from: "blr", to: "sin", layer: "backbone", label: { en: "Bangalore ↔ Singapore", es: "Bangalore ↔ Singapur" } },
  // AI dependency links (shown with the AI layer)
  { id: "a1", from: "ai_usw", to: "iad", layer: "ai", label: { en: "AI plane ↔ US-East", es: "Plano IA ↔ US-East" } },
  { id: "a2", from: "ai_usc", to: "dal", layer: "ai", label: { en: "AI plane ↔ Dallas", es: "Plano IA ↔ Dallas" } },
  { id: "a3", from: "ai_eu", to: "fra", layer: "ai", label: { en: "Sovereign AI ↔ Frankfurt", es: "IA soberana ↔ Fráncfort" } },
];

/** Ambient disaster-recovery / failover paths shown with the continuity layer. */
export const DR_PATHS: Array<[string, string]> = [
  ["iad", "fra"],
  ["sao", "mad"],
  ["sin", "bom"],
  ["dal", "iad"],
];
