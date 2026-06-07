import { useEffect, useRef, useState } from "react";
import type { CopilotMessage } from "../../types/ai";
import { useCommandCenterStore, useScenario, useMetrics } from "../../store/useCommandCenterStore";
import { runCopilot } from "../../ai";
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
  const scenario = useScenario();
  const metrics = useMetrics();

  const greeting = t("copilotGreeting", lang);
  const [messages, setMessages] = useState<CopilotMessage[]>([{ from: "bot", text: greeting }]);
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

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

    window.setTimeout(async () => {
      const result = await runCopilot(trimmed, lang, { metrics, scenario });
      if (result.scenarioId) runScenario(result.scenarioId);
      setTyping(false);
      setMessages((m) => [
        ...m,
        result.report
          ? { from: "bot", report: result.report }
          : { from: "bot", text: result.note },
      ]);
    }, TYPING_DELAY);
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

      <CopilotCommandInput lang={lang} onSubmit={submit} />
    </div>
  );
}
