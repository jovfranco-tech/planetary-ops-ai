import type { VercelRequest, VercelResponse } from "@vercel/node";

// Mock/fallback payload used when API is unavailable or unauthenticated
const FALLBACK_OUTAGES: any[] = [];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set cache headers to protect upstream APIs and optimize load times (Cache at Edge for 60s, serve stale for 30s)
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=30");
  res.setHeader("Content-Type", "application/json");

  const token = process.env.CLOUDFLARE_RADAR_TOKEN || process.env.CLOUDFLARE_API_TOKEN;

  if (!token) {
    // Cloudflare Radar token missing. Return unavailable safely.
    return res.status(200).json({
      source: "cloudflare-radar",
      status: "unavailable",
      lastUpdated: new Date().toISOString(),
      attribution: "Cloudflare Radar",
      outages: FALLBACK_OUTAGES
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout protection

    const apiResponse = await fetch("https://api.cloudflare.com/client/v4/radar/annotations/outages?limit=10", {
      headers: {
        "Authorization": `Bearer ${token}`
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!apiResponse.ok) {
      throw new Error(`Cloudflare API returned status ${apiResponse.status}`);
    }

    const json = (await apiResponse.json()) as any;

    // Map Cloudflare Radar response format to our internal typed shape
    // Cloudflare Radar response typically has: { success: true, result: { outages: [...] } }
    const radarOutages = json.result?.outages || [];
    const normalizedOutages = radarOutages.map((o: any, idx: number) => ({
      id: o.id?.toString() || `cf-outage-${idx}-${Date.now()}`,
      locationName: o.location?.name || "Global Node",
      countryCode: o.location?.code || undefined,
      region: o.location?.region || undefined,
      startedAt: o.startDate || o.start || undefined,
      endedAt: o.endDate || o.end || undefined,
      cause: o.cause || undefined,
      scope: o.scope || undefined,
      severity: o.severity || "medium",
      summary: o.description || `Network disruption detected at ${o.location?.name || "unspecified location"}`
    }));

    return res.status(200).json({
      source: "cloudflare-radar",
      status: "live",
      lastUpdated: new Date().toISOString(),
      attribution: "Cloudflare Radar API",
      outages: normalizedOutages.length > 0 ? normalizedOutages : FALLBACK_OUTAGES
    });

  } catch (error: any) {
    console.error("Error fetching Cloudflare Radar outages:", error);
    
    // Graceful fallback to cached simulated data on error
    return res.status(200).json({
      source: "cloudflare-radar",
      status: "unavailable",
      lastUpdated: new Date().toISOString(),
      attribution: "Cloudflare Radar (Fallback)",
      outages: FALLBACK_OUTAGES,
      errorMessage: error.message || "Timeout or Network Error"
    });
  }
}
