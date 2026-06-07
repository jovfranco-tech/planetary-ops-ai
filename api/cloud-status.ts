import type { VercelRequest, VercelResponse } from "@vercel/node";

const AWS_REGIONS = [
  "us-east-1", "us-east-2", "us-west-2", "eu-west-1",
  "eu-central-1", "sa-east-1", "ap-south-1", "ap-southeast-1"
];

const AZURE_REGIONS = [
  "eastus", "eastus2", "westus3", "brazilsouth",
  "westeurope", "northeurope", "centralindia", "southeastasia"
];

const GCP_REGIONS = [
  "us-central1", "us-east1", "us-east4", "southamerica-east1",
  "europe-west1", "europe-west3", "asia-south1", "asia-southeast1"
];

const SERVICES = [
  { id: "compute", name: "Compute", status: "operational" },
  { id: "storage", name: "Storage", status: "operational" },
  { id: "database", name: "Database", status: "operational" },
  { id: "networking", name: "Networking", status: "operational" },
  { id: "identity", name: "Identity / Control Plane", status: "operational" },
  { id: "ai-ml", name: "AI/ML", status: "operational" },
  { id: "analytics", name: "Analytics", status: "operational" },
  { id: "monitoring", name: "Monitoring", status: "operational" }
];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=120");
  res.setHeader("Content-Type", "application/json");

  // Since public unauthenticated cloud status APIs for specific regions are fragile or 
  // non-existent (e.g. AWS Health API requires enterprise support, GCP requires RSS parsing),
  // we default to the secure "reference" mode.
  // We do NOT invent live region outages.
  
  const now = new Date().toISOString();

  const providers = [
    {
      id: "aws",
      name: "Amazon Web Services",
      category: "cloud",
      sourceMode: "reference",
      attribution: "AWS Health Dashboard",
      sourceUrl: "https://health.aws.amazon.com",
      regions: AWS_REGIONS.map(r => ({
        id: r,
        name: `AWS ${r}`,
        status: "operational", // Reference-only, assume nominal unless known otherwise
        sourceMode: "reference",
        services: [...SERVICES]
      }))
    },
    {
      id: "azure",
      name: "Microsoft Azure",
      category: "cloud",
      sourceMode: "reference",
      attribution: "Azure Status",
      sourceUrl: "https://status.azure.com",
      regions: AZURE_REGIONS.map(r => ({
        id: r,
        name: `Azure ${r}`,
        status: "operational",
        sourceMode: "reference",
        services: [...SERVICES]
      }))
    },
    {
      id: "gcp",
      name: "Google Cloud Platform",
      category: "cloud",
      sourceMode: "reference",
      attribution: "Google Cloud Status",
      sourceUrl: "https://status.cloud.google.com",
      regions: GCP_REGIONS.map(r => ({
        id: r,
        name: `GCP ${r}`,
        status: "operational",
        sourceMode: "reference",
        services: [...SERVICES]
      }))
    }
  ];

  return res.status(200).json({
    source: "cloud-provider-status",
    status: "reference",
    lastCheckedAt: now,
    providers: providers
  });
}
