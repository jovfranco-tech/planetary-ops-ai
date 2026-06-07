import type { VercelRequest, VercelResponse } from "@vercel/node";

// Default/fallback provider statuses
const DEFAULT_PROVIDERS = [
  {
    id: "openai",
    name: "OpenAI",
    status: "operational",
    sourceMode: "simulated",
    lastCheckedAt: new Date().toISOString(),
    attribution: "https://status.openai.com"
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    status: "operational",
    sourceMode: "simulated",
    lastCheckedAt: new Date().toISOString(),
    attribution: "https://status.anthropic.com"
  },
  {
    id: "gemini",
    name: "Google Gemini / Google AI",
    status: "operational",
    sourceMode: "simulated",
    lastCheckedAt: new Date().toISOString(),
    attribution: "https://status.cloud.google.com"
  },
  {
    id: "ms-copilot",
    name: "Microsoft Copilot",
    status: "operational",
    sourceMode: "simulated",
    lastCheckedAt: new Date().toISOString(),
    attribution: "https://status.office.com"
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    status: "operational",
    sourceMode: "simulated",
    lastCheckedAt: new Date().toISOString(),
    attribution: "https://www.githubstatus.com"
  },
  {
    id: "azure-openai",
    name: "Azure OpenAI",
    status: "operational",
    sourceMode: "simulated",
    lastCheckedAt: new Date().toISOString(),
    attribution: "https://status.azure.com"
  }
];

// Map Atlassian Statuspage indicators to our normalized values
function mapIndicator(indicator: string): "operational" | "degraded" | "partial_outage" | "major_outage" {
  switch (indicator?.toLowerCase()) {
    case "none":
      return "operational";
    case "minor":
      return "degraded";
    case "major":
      return "partial_outage";
    case "critical":
      return "major_outage";
    default:
      return "operational";
  }
}

async function fetchStatuspage(url: string, signal: AbortSignal) {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const json = (await res.json()) as any;
  const indicator = json.status?.indicator || "none";
  const description = json.status?.description || "Operational";
  
  return {
    status: mapIndicator(indicator),
    summary: description
  };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set cache control for AI statuses (Cache for 2 minutes, stale for 1 minute)
  res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=60");
  res.setHeader("Content-Type", "application/json");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    // Fetch live statuses for OpenAI, Anthropic, and GitHub Status pages
    const [openAIResult, anthropicResult, githubResult] = await Promise.allSettled([
      fetchStatuspage("https://status.openai.com/api/v2/status.json", controller.signal),
      fetchStatuspage("https://status.anthropic.com/api/v2/status.json", controller.signal),
      fetchStatuspage("https://www.githubstatus.com/api/v2/status.json", controller.signal)
    ]);

    clearTimeout(timeoutId);

    let hasLiveFeeds = false;

    const providers = DEFAULT_PROVIDERS.map((p) => {
      let statusInfo: any = null;
      let attribution = p.attribution;
      let sourceMode: "live" | "status-page" | "simulated" | "unavailable" = "simulated";

      if (p.id === "openai" && openAIResult.status === "fulfilled") {
        statusInfo = openAIResult.value;
        attribution = "OpenAI Statuspage API";
        sourceMode = "live";
        hasLiveFeeds = true;
      } else if (p.id === "anthropic" && anthropicResult.status === "fulfilled") {
        statusInfo = anthropicResult.value;
        attribution = "Anthropic Statuspage API";
        sourceMode = "live";
        hasLiveFeeds = true;
      } else if (p.id === "github-copilot" && githubResult.status === "fulfilled") {
        statusInfo = githubResult.value;
        attribution = "GitHub Statuspage API";
        sourceMode = "live";
        hasLiveFeeds = true;
      }

      return {
        id: p.id,
        name: p.name,
        status: statusInfo ? statusInfo.status : p.status,
        sourceMode: sourceMode,
        lastIncidentSummary: statusInfo ? statusInfo.summary : undefined,
        lastCheckedAt: new Date().toISOString(),
        attribution: attribution
      };
    });

    return res.status(200).json({
      source: "ai-provider-status",
      status: hasLiveFeeds ? "live" : "partial",
      lastUpdated: new Date().toISOString(),
      providers: providers
    });

  } catch (error: any) {
    console.error("AI Status Aggregator failed:", error);

    return res.status(200).json({
      source: "ai-provider-status",
      status: "unavailable",
      lastUpdated: new Date().toISOString(),
      providers: DEFAULT_PROVIDERS,
      errorMessage: error.message || "Failed to fetch status updates"
    });
  }
}
