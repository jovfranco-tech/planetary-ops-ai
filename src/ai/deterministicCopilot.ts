import type { Language } from "../types/i18n";
import type { CopilotContext, CopilotResult } from "../types/ai";
import { scenarioById } from "../data";
import { t } from "../i18n";
import { parseCommand, SUGGESTIONS } from "./commandParser";
import { buildInfoReport, buildScenarioReport } from "./copilotResponses";

/**
 * Run the deterministic copilot against a free-text command.
 *
 * This is intentionally `async` and returns a plain `CopilotResult` (never
 * JSX). UI components only depend on this contract, so a future real backend
 * can replace the body with `fetch("/api/agent", …)` without any component
 * changes — the deterministic logic here becomes the offline fallback.
 */
export async function runCopilot(
  text: string,
  lang: Language,
  ctx: CopilotContext,
): Promise<CopilotResult> {
  const command = parseCommand(text);

  // 1) Simulation intents: resolve the scenario report and ask the app to
  //    apply it via `scenarioId`.
  if (command.id === "sim" && command.scenario) {
    const scenario = scenarioById(command.scenario);
    if (scenario) {
      return {
        command,
        scenarioId: scenario.id,
        report: buildScenarioReport(scenario, lang),
      };
    }
  }

  // 2) Help / unmatched intent: return a guidance note.
  if (command.id === "help") {
    return { command, note: t("copilotHelp", lang) };
  }

  // 3) Informational intents.
  const report = buildInfoReport(command.id, lang, ctx);
  if (report) return { command, report };

  return { command, note: t("copilotHelp", lang) };
}

/** Suggested command chips for the active language. */
export function copilotSuggestions(lang: Language): string[] {
  return SUGGESTIONS[lang] ?? SUGGESTIONS.en;
}
