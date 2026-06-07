import type { LayerId } from "../types/domain";
import type { Scenario } from "../types/scenarios";
import type { Language } from "../types/i18n";
import { t as tFunc, type TranslationKey } from "../i18n";
import type { RealOutage, RealSatellite, RealAIProviderStatus } from "../dataSources/types";
import { getOutageCoords } from "../dataSources/radarAdapter";
import { propagateSatellite } from "../dataSources/satelliteAdapter";
import { CURATED_CABLES } from "../dataSources/cableDataset";
import { COLORS } from "../utils/constants";
import { ringFade } from "../utils/geo";
import type { GlobePoint, GlobeRing, GlobeArc } from "./globeProjection";

interface LiveGlobeInput {
  layers: Set<LayerId>;
  scenario: Scenario | null;
  lang: Language;
  outages: RealOutage[];
  satellites: RealSatellite[];
  aiProviders: RealAIProviderStatus[];
  cloudProviders: any[];
}

interface LiveGlobeData {
  points: GlobePoint[];
  rings: GlobeRing[];
  arcs: GlobeArc[];
}

export function projectLiveGlobe(input: LiveGlobeInput): LiveGlobeData {
  const { layers, lang, outages, satellites, aiProviders, cloudProviders, scenario } = input;
  
  const points: GlobePoint[] = [];
  const rings: GlobeRing[] = [];
  const arcs: GlobeArc[] = [];

  // HTML Tooltip Generator
  const buildTip = (
    title: string,
    subtitle: string,
    sourceMode: string,
    sourceName: string,
    lastUpdated?: string
  ) => {
    let modeBadgeClass = "badge-live";
    if (sourceMode === "simulated") modeBadgeClass = "badge-simulated";
    if (sourceMode === "curated") modeBadgeClass = "badge-curated";
    if (sourceMode === "unavailable") modeBadgeClass = "badge-unavailable";
    if (sourceMode === "cached") modeBadgeClass = "badge-cached";
    if (sourceMode === "reference") modeBadgeClass = "badge-reference";

    const updateStr = lastUpdated ? `<br/><span style="font-size: 9px; color: var(--faint);">${tFunc("lastUpdated" as TranslationKey, lang)}: ${lastUpdated}</span>` : "";

    return `<div class="node-tip" style="min-width: 180px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <span class="nt-k">${title.toUpperCase()}</span>
        <span class="source-badge ${modeBadgeClass}" style="font-size: 8px; padding: 2px 4px; border-radius: 4px; text-transform: uppercase;">${tFunc((sourceMode === "real" ? "feedLive" : `feed${sourceMode.charAt(0).toUpperCase() + sourceMode.slice(1)}`) as TranslationKey, lang) || sourceMode}</span>
      </div>
      <b style="font-size: 13px;">${subtitle}</b>
      <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.1);">
        <span style="font-size: 10px; color: var(--muted);">${tFunc("dataSource" as TranslationKey, lang)}: ${sourceName}</span>
        ${updateStr}
        <br/><br/>
        <span style="font-size: 9px; color: ${COLORS.amber}; font-weight: 600;">⚠️ ${tFunc("contextOnly" as TranslationKey, lang)}</span><br/>
        <span style="font-size: 9px; color: var(--muted);">${tFunc("notAffectDecision" as TranslationKey, lang)}</span>
      </div>
    </div>`;
  };

  // 1. Radar Outages (Backbone / Cyber Layer)
  if (layers.has("backbone") || layers.has("cyber")) {
    outages.forEach((out) => {
      const coords = getOutageCoords(out);
      if (coords) {
        const isHigh = out.severity === "high" || out.severity === "critical";
        const isLive = out.id !== "outage-sam1-latam"; // simple heuristic or we could use health store, but outages array is pure data
        rings.push({
          lat: coords.lat,
          lng: coords.lng,
          ringColor: ringFade(isHigh ? COLORS.red : COLORS.amber),
          maxR: isHigh ? 5.2 : 3.8,
          speed: isHigh ? 2.0 : 1.4,
          period: isHigh ? 1000 : 1500
        });
        
        points.push({
          id: `outage-${out.id}`,
          lat: coords.lat,
          lng: coords.lng,
          color: "rgba(0,0,0,0)",
          alt: 0.01,
          rad: 0.5,
          tip: buildTip(
            "INTERNET ANOMALY",
            out.locationName,
            isLive ? "live" : "simulated",
            "Cloudflare Radar"
          )
        });
      }
    });
  }

  // 2. Satellites (Space Layer)
  if (layers.has("space")) {
    // Limit to 10 satellites for performance and clean UI
    const sampledSats = satellites.slice(0, 10);
    
    sampledSats.forEach((sat) => {
      const pos = propagateSatellite(sat);
      const isLive = !!sat.dataAgeHours && sat.dataAgeHours < 24;
      
      points.push({
        id: `sat-${sat.id}`,
        lat: pos.lat,
        lng: pos.lng,
        color: isLive ? "#5fb0ff" : COLORS.violet,
        alt: pos.altitude,
        rad: sat.id === "25544" ? 0.6 : 0.36, // Make ISS larger
        tip: buildTip(
          `SATELLITE (${sat.category.toUpperCase()})`,
          sat.name,
          isLive ? "live" : "cached",
          "CelesTrak NORAD GP",
          sat.epoch
        )
      });
    });
  }

  // 3. AI Providers (AI Layer)
  if (layers.has("ai")) {
    const spacing = 360 / Math.max(1, aiProviders.length);
    aiProviders.forEach((prov, i) => {
      // Orbit them along the equator
      const lng = -180 + (i * spacing);
      const lat = 0;
      const isLive = prov.sourceMode === "live";
      const isDegraded = prov.status !== "operational" && prov.status !== "unknown";

      points.push({
        id: `ai-prov-${prov.id}`,
        lat,
        lng,
        color: isDegraded ? COLORS.red : (isLive ? COLORS.cyan : COLORS.violet),
        alt: 0.15,
        rad: 0.8,
        tip: buildTip(
          "AI PROVIDER",
          prov.name,
          prov.sourceMode === "live" ? "real" : prov.sourceMode,
          "Provider Statuspage API",
          prov.lastCheckedAt
        )
      });
      
      if (isDegraded) {
        rings.push({
          lat, lng,
          ringColor: ringFade(COLORS.red),
          maxR: 3.5, speed: 1.5, period: 1000
        });
      }
    });
  }

  // 3.5 Cloud Providers (Infrastructure/Core Layer)
  if (layers.has("backbone") || layers.has("cyber") || true) { // Display on base
    const REGION_COORDS: Record<string, {lat: number, lng: number}> = {
      // AWS
      "us-east-1": { lat: 38.0, lng: -78.0 },
      "us-east-2": { lat: 40.0, lng: -83.0 },
      "us-west-2": { lat: 45.0, lng: -119.0 },
      "eu-west-1": { lat: 53.0, lng: -8.0 },
      "eu-central-1": { lat: 50.1, lng: 8.6 },
      "sa-east-1": { lat: -23.5, lng: -46.6 },
      "ap-south-1": { lat: 19.0, lng: 72.8 },
      "ap-southeast-1": { lat: 1.3, lng: 103.8 },
      // Azure
      "eastus": { lat: 37.3, lng: -79.8 },
      "eastus2": { lat: 36.6, lng: -78.3 },
      "westus3": { lat: 33.4, lng: -112.0 },
      "brazilsouth": { lat: -23.5, lng: -46.6 }, // Offset slightly from sa-east-1 below visually if needed
      "westeurope": { lat: 52.3, lng: 4.9 },
      "northeurope": { lat: 53.3, lng: -6.2 },
      "centralindia": { lat: 18.5, lng: 73.8 },
      "southeastasia": { lat: 1.3, lng: 103.8 },
      // GCP
      "us-central1": { lat: 41.2, lng: -95.8 },
      "us-east1": { lat: 33.2, lng: -80.0 },
      "us-east4": { lat: 39.0, lng: -77.5 },
      "southamerica-east1": { lat: -23.5, lng: -46.6 },
      "europe-west1": { lat: 50.4, lng: 3.8 },
      "europe-west3": { lat: 50.1, lng: 8.6 },
      "asia-south1": { lat: 19.0, lng: 72.8 },
      "asia-southeast1": { lat: 1.3, lng: 103.8 }
    };

    if (cloudProviders) {
      cloudProviders.forEach((prov: any) => {
        if (prov.regions) {
          prov.regions.forEach((r: any) => {
            const coords = REGION_COORDS[r.id];
            if (!coords) return; // Unknown region

            // Slight random offset to prevent exact overlap
            const hash = r.id.split("").reduce((a: number, b: string) => a + b.charCodeAt(0), 0);
            const lat = coords.lat + ((hash % 10) - 5) * 0.2;
            const lng = coords.lng + ((hash % 12) - 6) * 0.2;

            const isLive = prov.sourceMode === "live";
            let isDegraded = r.status !== "operational" && r.status !== "unknown";
            let isScenarioDegraded = false;

            if (scenario && scenario.affectedRegions.some((reg: string) => reg === r.id || reg === prov.id || r.id.includes(reg))) {
              isDegraded = true;
              isScenarioDegraded = true;
            }

            let pointColor: string = COLORS.violet;
            if (prov.sourceMode === "reference") pointColor = "rgba(100, 150, 255, 0.8)";
            if (isLive) pointColor = COLORS.cyan;
            if (isDegraded) pointColor = COLORS.amber;
            
            let tipModeDesc = r.sourceMode || prov.sourceMode;
            let tipBoundary = tFunc("pubStatusContextGlobe" as TranslationKey, lang) as string;

            if (isScenarioDegraded) {
              tipBoundary = tFunc("scenarioStatusBoundary" as TranslationKey, lang) as string;
            }

            points.push({
              id: `cloud-${prov.id}-${r.id}`,
              lat,
              lng,
              color: pointColor,
              alt: 0.05,
              rad: 0.4,
              tip: buildTip(
                `CLOUD REGION: ${prov.name}`,
                r.name,
                tipModeDesc,
                prov.attribution,
                prov.lastCheckedAt
              ).replace(tFunc("notAffectDecision" as TranslationKey, lang) as string, tipBoundary)
            });

            if (isDegraded) {
              rings.push({
                lat, lng,
                ringColor: ringFade(COLORS.amber),
                maxR: 2.0, speed: 1.2, period: 1200
              });
            }
          });
        }
      });
    }
  }

  // 4. Curated Submarine Cables (Backbone Layer)
  if (layers.has("backbone")) {
    CURATED_CABLES.forEach((cable) => {
      const coords = cable.approximateCoordinates;
      for (let i = 0; i < coords.length - 1; i++) {
        arcs.push({
          startLat: coords[i][0],
          startLng: coords[i][1],
          endLat: coords[i+1][0],
          endLng: coords[i+1][1],
          color: ["rgba(0, 255, 255, 0.4)", "rgba(0, 150, 255, 0.2)"], // Cyan/Teal
          stroke: 0.25,
          dashLen: 0.2,
          dashGap: 0.3,
          dashTime: 4000
        });
      }

      // Add a hover point at the middle of the first segment
      if (coords.length >= 2) {
        const midLat = (coords[0][0] + coords[1][0]) / 2;
        const midLng = (coords[0][1] + coords[1][1]) / 2;
        points.push({
          id: `cable-mid-${cable.id}`,
          lat: midLat,
          lng: midLng,
          color: "rgba(0,0,0,0)",
          alt: 0.02,
          rad: 0.6,
          tip: buildTip(
            "SUBMARINE FIBER",
            cable.name,
            "curated",
            "Curated Dataset",
            undefined
          ).replace(tFunc("notAffectDecision" as TranslationKey, lang) as string, tFunc("notOfficialMap" as TranslationKey, lang) as string)
        });
      }
    });
  }

  return { points, rings, arcs };
}
