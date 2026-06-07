import type { LayerId, NodeKind } from "../types/domain";

/** Brand palette mirrored from the design tokens in global.css. */
export const COLORS = {
  cyan: "#36d6e7",
  blue: "#5b8cff",
  violet: "#b388ff",
  amber: "#f6b13e",
  red: "#ff5d6c",
  green: "#5be0a8",
  teal: "#7ee0c0",
} as const;

/** Node-kind → globe point color. */
export const KIND_COLOR: Record<NodeKind, string> = {
  enterprise: COLORS.teal,
  cloud: COLORS.blue,
  ai: COLORS.violet,
  landing: COLORS.cyan,
};

/** Default layers enabled after a "Reset". */
export const DEFAULT_LAYERS: LayerId[] = ["backbone", "cloud", "enterprise", "ai", "enterprise-footprint"];

/** Globe assets (loaded at runtime in the browser). */
export const GLOBE_TEXTURE_URL =
  "https://unpkg.com/three-globe/example/img/earth-night.jpg";
export const GLOBE_BUMP_URL =
  "https://unpkg.com/three-globe/example/img/earth-topology.png";

/** Initial camera point of view (Americas / LATAM facing). */
export const INITIAL_POV = { lat: 16, lng: -62, altitude: 1.85 };

/** Scoring thresholds (single source of truth for color bands). */
export const SCORE = {
  goodHigh: 70,
  goodMid: 50,
  riskLow: 45,
  riskMid: 65,
} as const;
