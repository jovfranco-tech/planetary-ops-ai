import { buildSystemPrompt } from "./prompt.js";
import type { AgentInput, AgentOutput } from "./types.js";
import { AgentOutputSchema } from "./types.js";

export async function callLLM(input: AgentInput): Promise<AgentOutput | null> {
  const { GEMINI_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY } = process.env;

  const systemPrompt = buildSystemPrompt(input.lang);
  const userPrompt = `Context:\n${JSON.stringify(input.context, null, 2)}\n\nUser Request: ${input.text}\n\nRespond with valid JSON ONLY matching the required schema.`;

  try {
    if (GEMINI_API_KEY) {
      return await callGemini(GEMINI_API_KEY, systemPrompt, userPrompt);
    } else if (OPENAI_API_KEY) {
      return await callOpenAI(OPENAI_API_KEY, systemPrompt, userPrompt);
    } else if (ANTHROPIC_API_KEY) {
      return await callAnthropic(ANTHROPIC_API_KEY, systemPrompt, userPrompt);
    }
  } catch (err) {
    console.error("LLM Provider Error:", err);
    return null;
  }
  
  return null;
}

async function callGemini(apiKey: string, systemPrompt: string, userPrompt: string): Promise<AgentOutput | null> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 8000); // 8s timeout

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    }),
    signal: controller.signal,
  });
  clearTimeout(id);

  if (!res.ok) {
    const err = await res.text();
    console.error("Gemini error", err);
    return null;
  }

  const data = await res.json() as any;
  const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawContent) return null;

  try {
    const parsed = JSON.parse(rawContent);
    parsed.mode = "llm";
    return AgentOutputSchema.parse(parsed);
  } catch (e) {
    console.error("Gemini Zod parsing error", e);
    return null;
  }
}

async function callOpenAI(apiKey: string, systemPrompt: string, userPrompt: string): Promise<AgentOutput | null> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 8000); // 8s timeout

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    }),
    signal: controller.signal,
  });
  clearTimeout(id);

  if (!res.ok) {
    const err = await res.text();
    console.error("OpenAI error", err);
    return null;
  }

  const data = await res.json() as any;
  const rawContent = data.choices?.[0]?.message?.content;
  if (!rawContent) return null;

  try {
    const parsed = JSON.parse(rawContent);
    // Force mode to llm if the LLM didn't set it correctly
    parsed.mode = "llm";
    return AgentOutputSchema.parse(parsed);
  } catch (e) {
    console.error("OpenAI Zod parsing error", e);
    return null;
  }
}

async function callAnthropic(apiKey: string, systemPrompt: string, userPrompt: string): Promise<AgentOutput | null> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 8000); // 8s timeout

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      system: systemPrompt,
      messages: [
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 1000,
    }),
    signal: controller.signal,
  });
  clearTimeout(id);

  if (!res.ok) {
    const err = await res.text();
    console.error("Anthropic error", err);
    return null;
  }

  const data = await res.json() as any;
  const rawContent = data.content?.[0]?.text;
  if (!rawContent) return null;

  try {
    const parsed = JSON.parse(rawContent);
    parsed.mode = "llm";
    return AgentOutputSchema.parse(parsed);
  } catch (e) {
    console.error("Anthropic Zod parsing error", e);
    return null;
  }
}
