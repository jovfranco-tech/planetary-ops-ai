import type { Region } from "../types/domain";

/** Logical regions grouping geo nodes — used for dependency roll-ups. */
export const REGIONS: Region[] = [
  { id: "latam", name: { en: "LATAM", es: "LATAM" }, nodes: ["mex", "sao"] },
  { id: "namer", name: { en: "North America", es: "Norteamérica" }, nodes: ["dal", "iad"] },
  { id: "emea", name: { en: "EMEA", es: "EMEA" }, nodes: ["fra", "mad", "lon"] },
  { id: "apac", name: { en: "APAC", es: "APAC" }, nodes: ["blr", "bom", "sin"] },
  { id: "aiplane", name: { en: "AI Provider Plane", es: "Plano de proveedores IA" }, nodes: ["ai_usw", "ai_usc", "ai_eu"] },
];
