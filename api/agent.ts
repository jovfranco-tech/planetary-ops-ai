import type { VercelRequest, VercelResponse } from "@vercel/node";
import { AgentInputSchema } from "../src/server/llm/types.js";
import { callLLM } from "../src/server/llm/provider.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const input = AgentInputSchema.parse(req.body);
    
    const output = await callLLM(input);
    
    if (!output) {
      // LLM failed, timed out, or no API key. Tell frontend to fallback.
      return res.status(200).json({ mode: "fallback", limitation: "LLM output failed validation or no API key available; deterministic fallback used." });
    }

    return res.status(200).json(output);

  } catch (err) {
    console.error("Agent API Error:", err);
    return res.status(200).json({ mode: "fallback", limitation: "API error; deterministic fallback used." });
  }
}
