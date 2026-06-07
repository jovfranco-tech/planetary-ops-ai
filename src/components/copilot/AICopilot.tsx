import { useEffect, useRef, useState } from "react";
import type { CopilotMessage } from "../../types/ai";
import { useCommandCenterStore, useScenario, useMetrics } from "../../store/useCommandCenterStore";
import { runCopilot } from "../../ai";
import { runGeminiCopilot } from "../../ai/geminiCopilot";
import { t } from "../../i18n";
import { CopilotResponseCard } from "./CopilotResponseCard";
import { CopilotCommandInput } from "./CopilotCommandInput";
/** Simulated typing latency, in ms. */
const TYPING_DELAY = 620;

/** Floating decision-support assistant. Deterministic; no real LLM. */
export function AICopilot() {
  const lang = useCommandCenterStore((s) => s.lang);
  const open = useCommandCenterStore((s) => s.copilotOpen);
  const toggle = useCommandCenterStore((s) => s.toggleCopilot);
  const runScenario = useCommandCenterStore((s) => s.runScenario);
  const clearScenario = useCommandCenterStore((s) => s.clearScenario);
  const scenario = useScenario();
  const metrics = useMetrics();

  const greeting = t("copilotGreeting", lang);
  const [messages, setMessages] = useState<CopilotMessage[]>([{ from: "bot", text: greeting }]);
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  
  const proactiveAlert = useCommandCenterStore((s) => s.proactiveAlert);
  const setProactiveAlert = useCommandCenterStore((s) => s.setProactiveAlert);

  /* Proactive AI alerts */
  useEffect(() => {
    if (proactiveAlert) {
      setMessages((m) => [...m, { from: "bot", text: proactiveAlert }]);
      setProactiveAlert(null); // Clear after displaying
    }
  }, [proactiveAlert, setProactiveAlert]);

  /* Refresh the greeting when language changes (only if untouched). */
  useEffect(() => {
    setMessages((m) =>
      m.length === 1 && m[0].from === "bot" ? [{ from: "bot", text: greeting }] : m,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing]);

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { from: "user", text: trimmed }]);
    setTyping(true);

    const performFallback = async (err?: any) => {
      if (err) console.error("LLM Agent failed, falling back:", err);
      const result = await runCopilot(trimmed, lang, { metrics, scenario });
      if (result.scenarioId) runScenario(result.scenarioId);
      if ((result as any).action === "clear_scenario") clearScenario();
      setMessages((m) => [
        ...m,
        result.report
          ? { from: "bot", report: result.report, mode: "fallback" }
          : { from: "bot", text: result.note, mode: "fallback" },
      ]);
      setTyping(false);
    };

    const callAgent = async () => {
      try {
        const result = await runGeminiCopilot(trimmed, { metrics, scenario }, lang);
        
        if (!result) {
          throw new Error("Gemini fallback triggered");
        }

        if (result.command.id === "action") {
          clearScenario();
        }

        setMessages((m) => [
          ...m,
          result.report 
            ? { from: "bot", report: result.report, mode: "llm" }
            : { from: "bot", text: result.note, mode: "llm" }
        ]);
        setTyping(false);
      } catch (e) {
        performFallback(e);
      }
    };

    // Small delay for UI feel, then call LLM backend
    window.setTimeout(callAgent, TYPING_DELAY);
  };

  if (!open) return null;

  return (
    <div className="copilot-panel glass">
      <div className="copilot-head">
        <div className="cop-avatar">✦</div>
        <div>
          <div className="cop-title">{t("copilot", lang)}</div>
          <div className="cop-sub">{t("copilotHint", lang)}</div>
        </div>
        <button className="icon-btn cop-close" onClick={toggle} aria-label="close">
          ✕
        </button>
      </div>

      <div className="cop-body" ref={bodyRef}>
        {messages.map((m, i) => (
          <div key={i} className={"msg " + m.from}>
            <div className="bubble">
              {m.mode && (
                <div style={{ fontSize: "10px", fontWeight: "bold", opacity: 0.6, marginBottom: 6, textTransform: "uppercase" }}>
                  {m.mode === "llm" 
                    ? (lang === "es" ? "✦ Agente LLM" : "✦ LLM Agent") 
                    : (lang === "es" ? "⚬ Fallback Determinístico" : "⚬ Deterministic Fallback")}
                </div>
              )}
              {m.report ? <CopilotResponseCard report={m.report} /> : m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="msg bot">
            <div className="bubble">
              <span className="typing">
                <i />
                <i />
                <i />
              </span>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "0 12px 10px", fontSize: "11px", color: "rgba(255,255,255,0.5)", lineHeight: 1.3, textAlign: "center" }}>
        {lang === "es"
          ? "Las respuestas de IA son sólo apoyo a la decisión. Las métricas de escenario siguen siendo simuladas. Se requiere validación humana para operaciones reales."
          : "AI responses are decision-support only. Scenario metrics remain simulated. Human validation is required for real operations."}
      </div>

      <CopilotCommandInput lang={lang} onSubmit={submit} />
    </div>
  );
}
