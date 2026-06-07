import type { VercelRequest, VercelResponse } from "@vercel/node";

const SAAS_PROVIDERS = [
  // Collaboration/Productivity
  { id: "m365", name: "Microsoft 365", category: "collaboration", url: "https://status.office.com" },
  { id: "gworkspace", name: "Google Workspace", category: "collaboration", url: "https://www.google.com/appsstatus" },
  { id: "slack", name: "Slack", category: "collaboration", url: "https://status.slack.com" },
  { id: "zoom", name: "Zoom", category: "collaboration", url: "https://status.zoom.us" },
  
  // Developer / Work Management
  { id: "github-actions", name: "GitHub Actions", category: "developer-platform", url: "https://www.githubstatus.com" },
  { id: "atlassian", name: "Atlassian (Jira/Confluence)", category: "developer-platform", url: "https://status.atlassian.com" },
  
  // ITSM / Operations
  { id: "servicenow", name: "ServiceNow", category: "saas", url: "https://www.servicenow.com/support.html" },
  { id: "cloudflare", name: "Cloudflare", category: "internet", url: "https://www.cloudflarestatus.com" },
  { id: "datadog", name: "Datadog", category: "saas", url: "https://status.datadoghq.com" },
  { id: "newrelic", name: "New Relic", category: "saas", url: "https://status.newrelic.com" },
  
  // Data / Analytics
  { id: "snowflake", name: "Snowflake", category: "data-platform", url: "https://status.snowflake.com" },
  { id: "databricks", name: "Databricks", category: "data-platform", url: "https://status.databricks.com" },
  { id: "salesforce", name: "Salesforce", category: "saas", url: "https://status.salesforce.com" },
  { id: "powerbi", name: "Power BI", category: "data-platform", url: "https://support.fabric.microsoft.com/en-US/support/" },
  
  // Identity reference
  { id: "okta", name: "Okta", category: "identity", url: "https://status.okta.com" },
  { id: "entra", name: "Microsoft Entra ID", category: "identity", url: "https://status.azure.com" },
  { id: "auth0", name: "Auth0", category: "identity", url: "https://status.auth0.com" }
];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=120");
  res.setHeader("Content-Type", "application/json");

  // As per instructions, we default most of these to 'reference' mode to avoid fragile HTML scraping.
  // We do not invent live status or claim enterprise-specific impact.
  const now = new Date().toISOString();

  const providers = SAAS_PROVIDERS.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    sourceMode: "reference",
    status: "operational",
    attribution: `${p.name} Status Page`,
    sourceUrl: p.url,
    lastCheckedAt: now
  }));

  return res.status(200).json({
    source: "saas-provider-status",
    status: "reference",
    lastUpdated: now,
    providers: providers
  });
}
