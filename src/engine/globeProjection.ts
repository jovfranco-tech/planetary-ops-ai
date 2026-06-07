import type { Language } from "../types/i18n";
import type { LayerId } from "../types/domain";
import type { Scenario } from "../types/scenarios";
import { COLORS, KIND_COLOR } from "../utils/constants";
import { DR_PATHS, KEY_LABELS, NODES, ROUTES, nodeById } from "../data";
import { SIMULATED_HUBS, SIMULATED_MARKETS } from "../data/footprint";
import { ringFade } from "../utils/geo";

/* ------------------------------------------------------------------ */
/* Globe datum shapes (consumed declaratively by react-globe.gl)       */
/* ------------------------------------------------------------------ */

export interface GlobePoint {
  id: string;
  lat: number;
  lng: number;
  color: string;
  alt: number;
  rad: number;
  tip: string;
}

export interface GlobeRing {
  lat: number;
  lng: number;
  ringColor: (t: number) => string;
  maxR: number;
  speed: number;
  period: number;
}

export interface GlobeLabel {
  lat: number;
  lng: number;
  halt: number;
  text: string;
  state: "" | "crit" | "warn";
}

export interface GlobeArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string | string[];
  stroke: number;
  dashLen: number;
  dashGap: number;
  dashTime: number;
}

export interface GlobeData {
  points: GlobePoint[];
  rings: GlobeRing[];
  labels: GlobeLabel[];
  arcs: GlobeArc[];
}

export interface GlobeInput {
  layers: Set<LayerId>;
  scenario: Scenario | null;
  lang: Language;
}

/* ------------------------------------------------------------------ */

function nodeColor(kind: string, id: string, scenario: Scenario | null): string {
  if (scenario) {
    if (scenario.degradedNodes.includes(id)) return COLORS.red;
    if (scenario.affectedRegions.includes(id)) return COLORS.amber;
  }
  return KIND_COLOR[kind as keyof typeof KIND_COLOR] ?? COLORS.cyan;
}

function tip(name: string, kind: string): string {
  return `<div class="node-tip"><span class="nt-k">${kind.toUpperCase()}</span>${name}</div>`;
}

/** Pure projection of application state into globe datasets. */
export function projectGlobe({ layers, scenario, lang }: GlobeInput): GlobeData {
  const visible = (layerIds: LayerId[]) => layerIds.some((l) => layers.has(l));

  /* ---- points ---- */
  const points: GlobePoint[] = [];
  for (const n of NODES) {
    if (!visible(n.layers)) continue;
    const degraded = !!scenario && scenario.degradedNodes.includes(n.id);
    const affected = !!scenario && scenario.affectedRegions.includes(n.id);
    points.push({
      id: n.id,
      lat: n.lat,
      lng: n.lng,
      color: nodeColor(n.kind, n.id, scenario),
      alt: n.kind === "ai" ? 0.06 : 0.025,
      rad: degraded ? 0.85 : affected ? 0.62 : n.kind === "ai" ? 0.55 : 0.48,
      tip: tip(n.name[lang] || n.name.en, n.kind),
    });
  }

  /* ---- rings ---- */
  const rings: GlobeRing[] = [];
  if (scenario) {
    for (const n of NODES) {
      if (!visible(n.layers)) continue;
      if (scenario.degradedNodes.includes(n.id)) {
        rings.push({ lat: n.lat, lng: n.lng, ringColor: ringFade(COLORS.red), maxR: 5.5, speed: 2.2, period: 900 });
      } else if (scenario.affectedRegions.includes(n.id)) {
        rings.push({ lat: n.lat, lng: n.lng, ringColor: ringFade(COLORS.amber), maxR: 4, speed: 1.7, period: 1400 });
      }
    }
  }
  if (layers.has("ai") && !scenario) {
    for (const n of NODES.filter((x) => x.kind === "ai")) {
      rings.push({ lat: n.lat, lng: n.lng, ringColor: ringFade(COLORS.violet), maxR: 3.2, speed: 1.1, period: 2200 });
    }
  }
  if (layers.has("cyber") && !scenario) {
    for (const n of NODES) {
      if (visible(n.layers) && n.cyber >= 0.52) {
        rings.push({ lat: n.lat, lng: n.lng, ringColor: ringFade(COLORS.red), maxR: 3.6, speed: 1.3, period: 1900 });
      }
    }
  }

  /* ---- labels ---- */
  const labels: GlobeLabel[] = [];
  for (const kl of KEY_LABELS) {
    let lat: number | undefined;
    let lng: number | undefined;
    let state: GlobeLabel["state"] = "";
    if (kl.ref) {
      const n = nodeById(kl.ref);
      if (!n) continue;
      let vis = visible(n.layers);
      if (kl.layer && !layers.has(kl.layer)) vis = false;
      if (!vis) continue;
      lat = n.lat;
      lng = n.lng;
      if (scenario && scenario.degradedNodes.includes(n.id)) state = "crit";
      else if (scenario && scenario.affectedRegions.includes(n.id)) state = "warn";
    } else {
      if (kl.layer && !layers.has(kl.layer)) continue;
      lat = kl.lat;
      lng = kl.lng;
    }
    if (lat === undefined || lng === undefined) continue;
    labels.push({ lat, lng, halt: 0.07, text: (kl[lang] || kl.en) as string, state });
  }

  /* ---- arcs ---- */
  const arcs: GlobeArc[] = [];
  for (const r of ROUTES) {
    if (!layers.has(r.layer)) continue;
    const a = nodeById(r.from);
    const b = nodeById(r.to);
    if (!a || !b) continue;
    const cut = !!scenario && scenario.affectedRoutes.includes(r.id);
    const fail = !!scenario && scenario.reroute.includes(r.id);
    const atRisk =
      !cut &&
      !fail &&
      !!scenario &&
      (scenario.affectedRegions.includes(r.from) || scenario.affectedRegions.includes(r.to));

    let color: string[];
    let stroke: number;
    let dashLen: number;
    let dashGap: number;
    let dashTime: number;
    if (cut) {
      color = [COLORS.red, COLORS.red];
      stroke = 0.95;
      dashLen = 0.25;
      dashGap = 0.18;
      dashTime = 600;
    } else if (fail) {
      color = [COLORS.green, COLORS.green];
      stroke = 0.85;
      dashLen = 0.5;
      dashGap = 0.1;
      dashTime = 1400;
    } else if (atRisk) {
      color = [COLORS.amber, COLORS.amber];
      stroke = 0.6;
      dashLen = 0.35;
      dashGap = 0.2;
      dashTime = 1200;
    } else if (r.layer === "ai") {
      color = ["rgba(179,136,255,0.6)", "rgba(91,140,255,0.45)"];
      stroke = 0.45;
      dashLen = 0.4;
      dashGap = 0.22;
      dashTime = 4000;
    } else {
      color = ["rgba(54,214,231,0.5)", "rgba(91,140,255,0.4)"];
      stroke = 0.4;
      dashLen = 0.45;
      dashGap = 0.25;
      dashTime = 5200;
    }
    arcs.push({
      startLat: a.lat,
      startLng: a.lng,
      endLat: b.lat,
      endLng: b.lng,
      color,
      stroke,
      dashLen,
      dashGap,
      dashTime,
    });
  }

  if (layers.has("continuity") && !scenario) {
    for (const [fromId, toId] of DR_PATHS) {
      const a = nodeById(fromId);
      const b = nodeById(toId);
      if (!a || !b) continue;
      arcs.push({
        startLat: a.lat,
        startLng: a.lng,
        endLat: b.lat,
        endLng: b.lng,
        color: ["rgba(91,224,168,0.5)", "rgba(126,224,192,0.35)"],
        stroke: 0.4,
        dashLen: 0.18,
        dashGap: 0.5,
        dashTime: 3000,
      });
    }
  }

  if (layers.has("enterprise-footprint")) {
    const isCableCut = scenario?.id === "cable_cut";
    const isRansomware = scenario?.id === "ransomware";
    const isCloud = scenario?.id === "useast_cloud";
    const isAi = scenario?.id === "openai_outage" || scenario?.id === "multi_ai";

    for (const m of SIMULATED_MARKETS) {
      let color = "rgba(126,224,192,0.4)";
      let rad = 0.25;

      // Scenario integrations
      if (isCableCut && m.lat < 25 && m.lat > -60 && m.lng > -100 && m.lng < -30) {
        color = COLORS.amber;
        rad = 0.4;
      }
      if (isRansomware && m.lat < 25 && m.lat > -60 && m.lng > -100 && m.lng < -30) {
        color = COLORS.red;
        rad = 0.5;
      }
      if (isCloud && m.lng < -60 && m.lng > -130 && m.lat > 20) {
        color = COLORS.amber;
        rad = 0.4;
      }
      if (isAi) {
        color = COLORS.violet;
        rad = 0.35;
      }

      points.push({
        id: `m-${m.lat}-${m.lng}`,
        lat: m.lat,
        lng: m.lng,
        color,
        alt: 0.01,
        rad,
        tip: "",
      });
    }

    for (const h of SIMULATED_HUBS) {
      let color: string = COLORS.cyan;
      let rad = 0.6;
      let state: GlobeLabel["state"] = "";

      if ((isCableCut || isRansomware) && h.region === "LATAM") {
        color = isRansomware ? COLORS.red : COLORS.amber;
        state = isRansomware ? "crit" : "warn";
      }
      if (isCloud && h.region === "NA") {
        color = COLORS.amber;
        state = "warn";
      }
      if (isAi) {
        color = COLORS.violet;
        state = "warn";
      }

      points.push({
        id: h.id,
        lat: h.lat,
        lng: h.lng,
        color,
        alt: 0.02,
        rad,
        tip: tip(h.name, "REGIONAL HUB"),
      });

      labels.push({ lat: h.lat, lng: h.lng, halt: 0.08, text: h.name, state });

      const targetMap: Record<string, string> = {
        NA: "iad",
        LATAM: "sao",
        EU: "lon",
        MEA: "fra",
        SA: "bom",
        APAC: "hnd",
      };
      const targetId = targetMap[h.region];
      const targetNode = targetId ? nodeById(targetId) : null;
      if (targetNode) {
        arcs.push({
          startLat: h.lat,
          startLng: h.lng,
          endLat: targetNode.lat,
          endLng: targetNode.lng,
          color: ["rgba(126,224,192,0.6)", "rgba(91,140,255,0.4)"],
          stroke: 0.3,
          dashLen: 0.2,
          dashGap: 0.4,
          dashTime: 2500,
        });
      }
    }
  }

  return { points, rings, labels, arcs };
}
