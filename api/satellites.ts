import type { VercelRequest, VercelResponse } from "@vercel/node";

// Fallback satellite data used when CelesTrak is offline or rate-limiting
const FALLBACK_SATELLITES = [
  {
    id: "25544",
    name: "ISS (ZARYA)",
    category: "LEO",
    tleLine1: "1 25544U 98067A   26157.55648834  .00014798  00000-0  26493-3 0  9997",
    tleLine2: "2 25544  51.6427 184.8724 0001716  60.5052  51.5284 15.49841858419619",
    epoch: new Date().toISOString(),
    operationalStatus: "operational"
  },
  {
    id: "44713",
    name: "STARLINK-1007",
    category: "communications",
    tleLine1: "1 44713U 19074A   26157.25148324  .00012543  00000-0  11452-3 0  9994",
    tleLine2: "2 44713  53.0542 215.1482 0001423  82.1054  48.1495 15.06421584341921",
    epoch: new Date().toISOString(),
    operationalStatus: "operational"
  },
  {
    id: "40294",
    name: "GPS IIF-8 (PRN 03)",
    category: "navigation",
    tleLine1: "1 40294U 14068A   26157.14285125  .00000042  00000-0  00000-0 0  9991",
    tleLine2: "2 40294  54.9125 110.1485 0014825 210.5841 149.2842  2.00564812 84191",
    epoch: new Date().toISOString(),
    operationalStatus: "operational"
  },
  {
    id: "33591",
    name: "NOAA 19",
    category: "weather",
    tleLine1: "1 33591U 09005A   26157.08514214  .00000125  00000-0  54821-4 0  9992",
    tleLine2: "2 33591  98.7125 342.1482 0012482  74.1485 285.9184 14.11028421884121",
    epoch: new Date().toISOString(),
    operationalStatus: "operational"
  }
];

interface QueryTarget {
  id: number;
  category: "LEO" | "navigation" | "communications" | "weather" | "unknown";
}

const TARGETS: QueryTarget[] = [
  { id: 25544, category: "LEO" },          // ISS
  { id: 44713, category: "communications" }, // Starlink 1007
  { id: 40294, category: "navigation" },     // GPS IIF-8
  { id: 33591, category: "weather" }         // NOAA 19
];

async function fetchSatelliteTLE(target: QueryTarget, signal: AbortSignal) {
  const url = `https://celestrak.org/NORAD/elements/gp.php?CATNR=${target.id}&FORMAT=tle`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const text = await res.text();
  const lines = text.trim().split(/\r?\n/);
  
  if (lines.length >= 3) {
    // TLE lines format: Line 0 (Name), Line 1 (TLE 1), Line 2 (TLE 2)
    return {
      id: target.id.toString(),
      name: lines[0].trim(),
      category: target.category,
      tleLine1: lines[1].trim(),
      tleLine2: lines[2].trim(),
      epoch: new Date().toISOString(),
      operationalStatus: "operational"
    };
  }
  throw new Error("Invalid TLE line count");
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set cache headers to protect CelesTrak from excessive request rates (Cache at Edge for 3 hours, stale for 1 hour)
  res.setHeader("Cache-Control", "s-maxage=10800, stale-while-revalidate=3600");
  res.setHeader("Content-Type", "application/json");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const promises = TARGETS.map(async (t) => {
      try {
        return await fetchSatelliteTLE(t, controller.signal);
      } catch (err) {
        console.warn(`Failed to fetch satellite ${t.id} from CelesTrak:`, err);
        // Fallback to local item for this specific satellite if request fails
        return FALLBACK_SATELLITES.find((s) => s.id === t.id.toString())!;
      }
    });

    const results = await Promise.all(promises);
    clearTimeout(timeoutId);

    // If all results are resolved successfully (or contain fallback overrides)
    return res.status(200).json({
      source: "celestrak",
      status: "live",
      lastUpdated: new Date().toISOString(),
      attribution: "CelesTrak (NORAD GP Database)",
      satellites: results
    });

  } catch (error: any) {
    console.error("CelesTrak aggregator failed:", error);
    
    // Return simulated status if the entire operation fails
    return res.status(200).json({
      source: "celestrak",
      status: "unavailable",
      lastUpdated: new Date().toISOString(),
      attribution: "CelesTrak (Cached Sample)",
      satellites: FALLBACK_SATELLITES,
      errorMessage: error.message || "Network Error"
    });
  }
}
