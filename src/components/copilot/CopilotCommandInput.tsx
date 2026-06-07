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

  const [listening, setListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(lang === "es" ? "Reconocimiento de voz no soportado en este navegador." : "Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === "es" ? "es-MX" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // Auto submit after half a second to let the user see it
      setTimeout(() => {
        onSubmit(transcript);
        setInput("");
      }, 500);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
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
        <button 
          className={`icon-btn mic-btn ${listening ? "listening" : ""}`} 
          onClick={startListening} 
          aria-label="voice input"
          style={{ padding: "0 8px", color: listening ? "var(--red)" : "inherit" }}
        >
          {listening ? "🎙" : "🎤"}
        </button>
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
