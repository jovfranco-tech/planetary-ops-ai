import { z } from "zod";

export const AgentInputSchema = z.object({
  text: z.string().max(1000, "Input text too long"),
  lang: z.enum(["en", "es"]),
  context: z.object({
    activeScenarioId: z.string().optional(),
    currentMetrics: z.record(z.string(), z.any()).optional(),
    affectedRegions: z.array(z.string()).optional(),
    affectedServices: z.array(z.string()).optional(),
    affectedAIProviders: z.array(z.string()).optional(),
    affectedAIWorkflows: z.array(z.string()).optional(),
    decisionOptions: z.array(z.record(z.string(), z.any())).optional(),
    boardBrief: z.string().optional(),
    sourceModes: z.array(z.record(z.string(), z.any())).optional(),
    appMode: z.literal("demo").optional(),
  }).optional(),
});

export type AgentInput = z.infer<typeof AgentInputSchema>;

export const AgentOutputSchema = z.object({
  mode: z.enum(["llm", "fallback"]),
  intent: z.string(),
  executiveSummary: z.string(),
  affectedRegions: z.array(z.string()),
  affectedServices: z.array(z.string()),
  affectedAIWorkflows: z.array(z.string()),
  businessImpact: z.string(),
  riskLevel: z.enum(["low", "medium", "high", "critical"]),
  recommendedAction: z.string(),
  decisionRequired: z.string(),
  humanApprovalRequired: z.boolean(),
  fallbackPath: z.string(),
  next24Hours: z.array(z.string()),
  next48Hours: z.array(z.string()),
  next72Hours: z.array(z.string()),
  limitations: z.array(z.string()),
  dataBoundary: z.string(),
});

export type AgentOutput = z.infer<typeof AgentOutputSchema>;
