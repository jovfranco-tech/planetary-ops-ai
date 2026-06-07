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
    const isAi = scenario?.id === "openai_outage" || scenario?.id === "copilot_outage" || scenario?.id === "multi_ai";
    const isIdp = scenario?.id === "idp_outage";

    // ── Market presence dots (112 points) ──
    for (const m of SIMULATED_MARKETS) {
      // Colors MUST be bright enough to contrast against the dark night-earth texture.
      // Previous attempts with muted teal (#4d9e87) blended into the ocean.
      // Altitude must be high enough for dots to float visibly above the surface.
      let color: string;
      let rad: number;
      let alt: number;

      switch (m.marketTier) {
        case "critical_market":
          color = "#5be0a8";  // bright green — stands out sharply
          rad = 0.7;
          alt = 0.035;
          break;
        case "support_market":
          color = "#36d6e7";  // bright cyan — matches brand, highly visible
          rad = 0.5;
          alt = 0.028;
          break;
        default: // country_presence
          color = "#7ee0c0";  // teal — bright enough to see on dark globe
          rad = 0.55;
          alt = 0.025;
          break;
      }

      // ── Scenario integrations ──
      const inLatam = m.region === "LATAM";
      const isCloudDep = m.dependencyProfile === "cloud" || m.dependencyProfile === "analytics";
      const isAiDep = m.dependencyProfile === "ai";
      const isIdpDep = m.dependencyProfile === "identity";

      let isDegraded = false;
      let isCritical = false;

      if (isCableCut && inLatam) isDegraded = true;
      if (isRansomware && inLatam) isCritical = true;
      if (isCloud && (m.region === "North America" || isCloudDep)) isDegraded = true;
      if (isAi && isAiDep) isDegraded = true;
      if (isIdp && isIdpDep) isCritical = true;

      if (isCritical) {
        color = COLORS.red;
        rad = m.marketTier === "critical_market" ? 0.8 : 0.65;
        rings.push({ lat: m.lat, lng: m.lng, ringColor: ringFade(COLORS.red), maxR: 2.8, speed: 1.8, period: 1000 });
      } else if (isDegraded) {
        color = COLORS.amber;
        rad = m.marketTier === "critical_market" ? 0.75 : 0.6;
        if (m.marketTier === "critical_market") {
          rings.push({ lat: m.lat, lng: m.lng, ringColor: ringFade(COLORS.amber), maxR: 2.2, speed: 1.2, period: 1500 });
        }
      } else if (!scenario && (m.marketTier === "critical_market")) {
        rings.push({ lat: m.lat, lng: m.lng, ringColor: ringFade("#5be0a8"), maxR: 2.0, speed: 0.8, period: 2500 });
      }

      points.push({
        id: `fp-${m.region}-${m.lat}-${m.lng}`,
        lat: m.lat,
        lng: m.lng,
        color,
        alt,
        rad,
        tip: tip(m.countryName, m.marketTier.replace("_", " ")),
      });
    }

    // ── Regional hubs (8 points + labels) ──
    for (const h of SIMULATED_HUBS) {
      let color: string = COLORS.cyan;
      let state: GlobeLabel["state"] = "";

      const inLatam = h.region === "LATAM";
      const isCloudDep = h.dependencyProfile === "cloud";
      const isAiDep = h.dependencyProfile === "ai";
      const isIdpDep = h.dependencyProfile === "identity";

      let isDegraded = false;
      let isCritical = false;

      if (isCableCut && inLatam) isDegraded = true;
      if (isRansomware && inLatam) isCritical = true;
      if (isCloud && (h.region === "North America" || isCloudDep)) isDegraded = true;
      if (isAi && isAiDep) isDegraded = true;
      if (isIdp && isIdpDep) isCritical = true;

      if (isCritical) {
        color = COLORS.red;
        state = "crit";
        rings.push({ lat: h.lat, lng: h.lng, ringColor: ringFade(COLORS.red), maxR: 5.0, speed: 2.0, period: 900 });
      } else if (isDegraded) {
        color = COLORS.amber;
        state = "warn";
        rings.push({ lat: h.lat, lng: h.lng, ringColor: ringFade(COLORS.amber), maxR: 4.0, speed: 1.5, period: 1200 });
      } else {
        // Nominal hub glow — always visible
        rings.push({ lat: h.lat, lng: h.lng, ringColor: ringFade(COLORS.cyan), maxR: 3.5, speed: 1.0, period: 2000 });
      }

      points.push({
        id: h.id,
        lat: h.lat,
        lng: h.lng,
        color,
        alt: 0.04,
        rad: 1.1,
        tip: tip(h.name, "REGIONAL HUB"),
      });

      labels.push({ lat: h.lat, lng: h.lng, halt: 0.09, text: h.name, state });
    }

    // ── Dependency corridors: hubs → infrastructure nodes ──
    const hubTargets: Record<string, string[]> = {
      "North America": ["iad"],
      LATAM: ["sao", "iad"],
      Europe: ["lon", "fra"],
      MEA: ["fra"],
      "South Asia": ["bom"],
      APAC: ["hnd", "sin"],
    };

    for (const h of SIMULATED_HUBS) {
      const targets = hubTargets[h.region] || [];
      for (const targetId of targets) {
        const targetNode = nodeById(targetId);
        if (targetNode) {
          arcs.push({
            startLat: h.lat,
            startLng: h.lng,
            endLat: targetNode.lat,
            endLng: targetNode.lng,
            color: ["rgba(126,224,192,0.55)", "rgba(54,214,231,0.35)"],
            stroke: 0.45,
            dashLen: 0.25,
            dashGap: 0.35,
            dashTime: 3500,
          });
        }
      }
    }

    // ── Inter-hub corridors for visual density ──
    const interHubRoutes: [string, string][] = [
      ["hub-na", "hub-eu"],
      ["hub-na", "hub-mex"],
      ["hub-mex", "hub-sao"],
      ["hub-eu", "hub-lon"],
      ["hub-eu", "hub-mea"],
      ["hub-lon", "hub-sa"],
      ["hub-sa", "hub-apac"],
      ["hub-mea", "hub-sa"],
      ["hub-apac", "hub-na"],
      ["hub-sao", "hub-eu"],
    ];

    for (const [fromId, toId] of interHubRoutes) {
      const from = SIMULATED_HUBS.find(h => h.id === fromId);
      const to = SIMULATED_HUBS.find(h => h.id === toId);
      if (from && to) {
        arcs.push({
          startLat: from.lat,
          startLng: from.lng,
          endLat: to.lat,
          endLng: to.lng,
          color: ["rgba(255,200,91,0.35)", "rgba(126,224,192,0.25)"],
          stroke: 0.35,
          dashLen: 0.3,
          dashGap: 0.5,
          dashTime: 5000,
        });
      }
    }
  }

  return { points, rings, labels, arcs };
}
