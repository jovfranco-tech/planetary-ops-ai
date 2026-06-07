import { useEffect } from "react";
import { useCommandCenterStore, useMetrics } from "../../store/useCommandCenterStore";
import { globalStatus } from "../../engine/riskEngine";
import { t } from "../../i18n";
import { playHover, playClick } from "../../utils/audio";

/** Top command bar: identity, global status, language and copilot controls. */
export function TopBar() {
  const lang = useCommandCenterStore((s) => s.lang);
  const setLang = useCommandCenterStore((s) => s.setLang);
  const copilotOpen = useCommandCenterStore((s) => s.copilotOpen);
  const toggleCopilot = useCommandCenterStore((s) => s.toggleCopilot);
  const openDisclaimer = useCommandCenterStore((s) => s.openDisclaimer);
  const metrics = useMetrics();

  const status = globalStatus(metrics);
  const dotClass =
    status === "critical" ? "red pulse" : status === "elevated" ? "amber pulse" : "green";

  useEffect(() => {
    if (status === "critical") {
      document.body.classList.add("theme-critical");
    } else {
      document.body.classList.remove("theme-critical");
    }
  }, [status]);

  return (
    <div className="topbar">
      <div className="brand">
        <div className="brand-mark" />
        <div>
          <div className="brand-name">{t("appName", lang)}</div>
          <div className="brand-kicker">{t("appKicker", lang)}</div>
        </div>
      </div>

      <div className="top-divider" />

      <div className="status-pill">
        <span className={"dot " + dotClass} />
        <span className="label">{t("globalStatus", lang)}</span>
        <span className="val">{t(status, lang)}</span>
      </div>

      <div className="top-spacer" />

      <div className="statusline">
        <div className="demo-badge">{t("demoMode", lang)}</div>
        <button 
          className={"icon-btn" + (useCommandCenterStore(s => s.perfMode) === "low" ? " on" : "")} 
          title="Performance Mode" 
          aria-label="Toggle Performance Mode"
          onMouseEnter={playHover}
          onClick={() => { playClick(); useCommandCenterStore.getState().togglePerfMode(); }}
        >
          {useCommandCenterStore(s => s.perfMode) === "high" ? "⚡️" : "🔋"}
        </button>
        <button 
          className={"icon-btn" + (useCommandCenterStore(s => s.thermalMode) ? " on" : "")} 
          title="Thermal Vision" 
          aria-label="Toggle Thermal Vision"
          onMouseEnter={playHover}
          onClick={() => { playClick(); useCommandCenterStore.getState().toggleThermalMode(); }}
        >
          🌡️
        </button>
        <button 
          className={"icon-btn" + (useCommandCenterStore(s => s.colorBlindMode) ? " on" : "")} 
          title="Colorblind Safe Mode" 
          aria-label="Toggle Colorblind Mode"
          onMouseEnter={playHover}
          onClick={() => { playClick(); useCommandCenterStore.getState().toggleColorBlindMode(); }}
        >
          👁️
        </button>
        <button 
          className="icon-btn" 
          title="Export Report" 
          aria-label="Export PDF Report"
          onMouseEnter={playHover}
          onClick={() => { playClick(); window.print(); }}
        >
          🖨️
        </button>
        <button 
          className={"icon-btn" + (useCommandCenterStore(s => s.zenMode) ? " on" : "")} 
          title="Zen Mode" 
          aria-label="Toggle Zen Mode"
          onMouseEnter={playHover}
          onClick={() => { playClick(); useCommandCenterStore.getState().toggleZenMode(); }}
        >
          {useCommandCenterStore(s => s.zenMode) ? "▣" : "▤"}
        </button>
        <div className="lang-toggle">
          <button className={lang === "en" ? "on" : ""} onMouseEnter={playHover} onClick={() => { playClick(); setLang("en"); }}>
            EN
          </button>
          <button className={lang === "es" ? "on" : ""} onMouseEnter={playHover} onClick={() => { playClick(); setLang("es"); }}>
            ES
          </button>
        </div>
        <button
          className={"cop-trigger" + (copilotOpen ? " active" : "")}
          onMouseEnter={playHover}
          onClick={() => { playClick(); toggleCopilot(); }}
        >
          ✦ {t("copilot", lang)}
        </button>
        <button className="icon-btn" title="info" aria-label="information" onMouseEnter={playHover} onClick={() => { playClick(); openDisclaimer(); }}>
          ⓘ
        </button>
      </div>
    </div>
  );
}
