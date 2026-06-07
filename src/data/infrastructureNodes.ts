import type { InfrastructureNode, KeyLabel, Satellite } from "../types/domain";

/**
 * Geo nodes. `kind` drives glyph/size on the globe; `layers` decides
 * visibility against the active layer toggles. All data is fictional.
 */
export const NODES: InfrastructureNode[] = [
  // Enterprise + cloud hubs
  {
    id: "mex",
    lat: 19.43,
    lng: -99.13,
    kind: "enterprise",
    cyber: 0.62,
    layers: ["enterprise"],
    name: { en: "Mexico City — Enterprise Operations", es: "Ciudad de México — Operaciones" },
  },
  {
    id: "sao",
    lat: -23.55,
    lng: -46.63,
    kind: "cloud",
    cyber: 0.55,
    layers: ["enterprise", "cloud"],
    name: { en: "São Paulo — LATAM Hub", es: "São Paulo — Hub LATAM" },
  },
  {
    id: "dal",
    lat: 32.78,
    lng: -96.8,
    kind: "cloud",
    cyber: 0.4,
    layers: ["enterprise", "cloud"],
    name: { en: "Dallas — Technology Hub", es: "Dallas — Hub tecnológico" },
  },
  {
    id: "iad",
    lat: 38.95,
    lng: -77.45,
    kind: "cloud",
    cyber: 0.48,
    layers: ["cloud", "enterprise"],
    name: { en: "Virginia — US-East Cloud Region", es: "Virginia — Región cloud US-East" },
  },
  {
    id: "fra",
    lat: 50.11,
    lng: 8.68,
    kind: "cloud",
    cyber: 0.36,
    layers: ["enterprise", "cloud"],
    name: { en: "Frankfurt — Europe Hub", es: "Fráncfort — Hub Europa" },
  },
  {
    id: "mad",
    lat: 40.41,
    lng: -3.7,
    kind: "enterprise",
    cyber: 0.44,
    layers: ["enterprise"],
    name: { en: "Madrid — Europe Business Services", es: "Madrid — Servicios de negocio Europa" },
  },
  {
    id: "lon",
    lat: 51.5,
    lng: -0.12,
    kind: "enterprise",
    cyber: 0.5,
    layers: ["enterprise"],
    name: { en: "London — Global Risk Office", es: "Londres — Oficina global de riesgo" },
  },
  {
    id: "blr",
    lat: 12.97,
    lng: 77.59,
    kind: "enterprise",
    cyber: 0.46,
    layers: ["enterprise"],
    name: { en: "Bangalore — India Technology Center", es: "Bangalore — Centro tecnológico India" },
  },
  {
    id: "bom",
    lat: 19.07,
    lng: 72.87,
    kind: "enterprise",
    cyber: 0.42,
    layers: ["enterprise"],
    name: { en: "Mumbai — India Technology Center", es: "Mumbai — Centro tecnológico India" },
  },
  {
    id: "sin",
    lat: 1.35,
    lng: 103.82,
    kind: "cloud",
    cyber: 0.38,
    layers: ["enterprise", "cloud"],
    name: { en: "Singapore — APAC Hub", es: "Singapur — Hub APAC" },
  },
  // AI service plane (generic regional references)
  {
    id: "ai_usw",
    lat: 37.4,
    lng: -122.0,
    kind: "ai",
    cyber: 0.3,
    layers: ["ai"],
    name: {
      en: "AI Service Region — US-West (OpenAI · Anthropic · Gemini)",
      es: "Región de IA — US-West (OpenAI · Anthropic · Gemini)",
    },
  },
  {
    id: "ai_usc",
    lat: 41.25,
    lng: -95.9,
    kind: "ai",
    cyber: 0.3,
    layers: ["ai"],
    name: {
      en: "AI Service Region — US-Central (Azure OpenAI · Copilot)",
      es: "Región de IA — US-Central (Azure OpenAI · Copilot)",
    },
  },
  {
    id: "ai_eu",
    lat: 53.33,
    lng: -6.25,
    kind: "ai",
    cyber: 0.32,
    layers: ["ai"],
    name: {
      en: "AI Service Region — EU (Sovereign / Private models)",
      es: "Región de IA — UE (modelos soberanos / privados)",
    },
  },
];

/** Premium floating annotations rendered above key nodes. */
export const KEY_LABELS: KeyLabel[] = [
  { ref: "mex", en: "Mexico Operations", es: "Operaciones México" },
  { ref: "sao", en: "São Paulo LATAM Hub", es: "Hub LATAM São Paulo" },
  { ref: "iad", en: "US-East Cloud Control Plane", es: "Control Plane US-East" },
  { ref: "fra", en: "Frankfurt EU Hub", es: "Hub UE Fráncfort" },
  { ref: "blr", en: "India Technology Center", es: "Centro Tecnológico India" },
  { ref: "ai_usw", en: "AI Provider Layer", es: "Capa de Proveedores IA", layer: "ai" },
  { lat: 6, lng: -44, layer: "backbone", route: true, en: "Submarine Backbone Route", es: "Backbone Submarino" },
];

/** Decorative orbital objects for the space layer. */
export const SATELLITES: Satellite[] = [
  { id: "s1", lat: 12, lngOffset: 0, altitude: 0.55, speed: 0.02, inclination: 18 },
  { id: "s2", lat: -8, lngOffset: 120, altitude: 0.62, speed: 0.016, inclination: -22 },
  { id: "s3", lat: 30, lngOffset: 240, altitude: 0.58, speed: 0.018, inclination: 34 },
];
