import type { RealOutage } from "./types";

interface GeoCoords {
  lat: number;
  lng: number;
}

const COUNTRY_COORDS: Record<string, GeoCoords> = {
  US: { lat: 37.09, lng: -95.71 },
  BR: { lat: -14.23, lng: -51.92 },
  DE: { lat: 51.16, lng: 10.45 },
  GB: { lat: 55.37, lng: -3.43 },
  FR: { lat: 46.22, lng: 2.21 },
  IN: { lat: 20.59, lng: 78.96 },
  SG: { lat: 1.35, lng: 103.82 },
  MX: { lat: 23.63, lng: -102.55 },
  CN: { lat: 35.86, lng: 104.19 },
  JP: { lat: 36.20, lng: 138.25 },
  IT: { lat: 41.87, lng: 12.56 },
  ES: { lat: 40.46, lng: -3.74 },
  CA: { lat: 56.13, lng: -106.34 },
  AU: { lat: -25.27, lng: 133.77 },
  ZA: { lat: -30.55, lng: 22.93 },
  RU: { lat: 61.52, lng: 105.31 }
};

/**
 * Resolve coordinates for a real-world outage based on its country code or region.
 */
export function getOutageCoords(outage: RealOutage): GeoCoords | null {
  const code = outage.countryCode?.toUpperCase();
  if (code && COUNTRY_COORDS[code]) {
    return COUNTRY_COORDS[code];
  }
  
  // Fallbacks based on region names
  const region = outage.region?.toLowerCase() || "";
  if (region.includes("latam") || region.includes("south america")) {
    return COUNTRY_COORDS.BR;
  }
  if (region.includes("europe") || region.includes("eu")) {
    return COUNTRY_COORDS.DE;
  }
  if (region.includes("asia") || region.includes("apac")) {
    return COUNTRY_COORDS.SG;
  }
  if (region.includes("north america")) {
    return COUNTRY_COORDS.US;
  }

  return null;
}
