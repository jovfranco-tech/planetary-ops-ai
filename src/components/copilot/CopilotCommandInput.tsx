import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import type { Language } from "../../types/i18n";
import { copilotSuggestions } from "../../ai";
import { t } from "../../i18n";

interface CopilotCommandInputProps {
  lang: Language;
  onSubmit: (text: string) => void;
}

/** Suggestion chips and free-text command entry for the copilot. */
export function CopilotCommandInput({ lang, onSubmit }: CopilotCommandInputProps) {
  const [input, setInput] = useState("");
  const suggestions = copilotSuggestions(lang).slice(0, 6);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    onSubmit(text);
  };

  return (
    <>
      <div className="cop-suggest">
        <div className="sg-k">{t("suggested", lang)}</div>
        <div className="chips">
          {suggestions.map((c, i) => (
            <button key={i} className="chip" onClick={() => onSubmit(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="cop-input">
        <input
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") send();
          }}
          placeholder={t("askPlaceholder", lang)}
          aria-label={t("askPlaceholder", lang)}
        />
        <button className="cop-send" onClick={send} aria-label="send">
          ➤
        </button>
      </div>
    </>
  );
}
