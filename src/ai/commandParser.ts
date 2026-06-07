import type { CopilotCommand } from "../types/ai";

/**
 * Deterministic intent matcher. Order matters: more specific scenario
 * triggers are checked before generic informational intents.
 */
export function parseCommand(raw: string): CopilotCommand {
  const q = raw.toLowerCase();
  const has = (...ks: string[]) => ks.some((k) => q.includes(k));
  const sim = has("simulate", "simular", "run", "ejecuta");

  // Agentic Actions
  if (has("mitig", "resolv", "arregl", "fix", "solve", "aisla", "conside", "contain")) {
    return { id: "action" };
  }

  if (has("multi") || (has("openai") && has("claude"))) return { id: "sim", scenario: "multi_ai" };
  if (has("openai", "chatgpt", "gpt")) return { id: "sim", scenario: "openai_outage" };
  if (has("github") || (has("copilot") && has("cod"))) return { id: "sim", scenario: "copilot_outage" };
  if (has("claude", "anthropic")) return { id: "claude" };
  if (has("identity", "identidad", "idp", "login", "sso", "acceso")) return { id: "sim", scenario: "idp_outage" };
  if (has("cable", "submarine", "submarino")) return { id: "sim", scenario: "cable_cut" };
  if (has("ransomware", "ransom")) return { id: "sim", scenario: "ransomware" };
  if (has("governance", "gobierno", "lockdown", "bloqueo")) return { id: "sim", scenario: "ai_governance" };
  if (
    has("us-east", "useast", "cloud region", "región cloud", "region cloud") &&
    (sim || has("degrad"))
  ) {
    return { id: "sim", scenario: "useast_cloud" };
  }

  if (has("mexico", "méxico")) return { id: "deps_mx" };
  if (has("most exposed", "exposed", "expuesto", "más expuest", "mas expuest")) return { id: "exposed" };
  if (has("fallback", "multi-model", "multimodelo", "estrategia", "strategy")) return { id: "fallback" };
  if (has("board", "briefing", "brief", "consejo")) return { id: "brief" };
  if (has("cyber", "cibern")) return { id: "cyber" };
  if (has("latam") && has("continuity", "continuidad")) return { id: "latam" };
  if (has("approval", "aprobación", "aprobacion", "human", "humana")) return { id: "approval" };
  if (has("automat")) return { id: "automate" };
  return { id: "help" };
}

/** Suggested command chips per language. */
export const SUGGESTIONS: Record<"en" | "es", string[]> = {
  en: [
    "Simulate OpenAI outage",
    "What happens if identity fails?",
    "Simulate GitHub Copilot degradation",
    "Which AI workflows are most exposed?",
    "Recommend multi-model fallback strategy",
    "Generate board briefing",
    "Show LATAM continuity risk",
    "What requires human approval?",
  ],
  es: [
    "Simular caída de OpenAI",
    "¿Qué pasa si falla la identidad?",
    "Simular degradación de GitHub Copilot",
    "¿Qué flujos de IA están más expuestos?",
    "Recomendar estrategia de fallback multimodelo",
    "Generar brief al consejo",
    "Mostrar riesgo de continuidad LATAM",
    "¿Qué requiere aprobación humana?",
  ],
};
