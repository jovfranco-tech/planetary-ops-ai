import { useCommandCenterStore, useMetrics } from "../../store/useCommandCenterStore";
import { globalStatus } from "../../engine/riskEngine";
import { t } from "../../i18n";

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
        <div className="lang-toggle">
          <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>
            EN
          </button>
          <button className={lang === "es" ? "on" : ""} onClick={() => setLang("es")}>
            ES
          </button>
        </div>
        <button
          className={"cop-trigger" + (copilotOpen ? " active" : "")}
          onClick={toggleCopilot}
        >
          ✦ {t("copilot", lang)}
        </button>
        <button className="icon-btn" title="info" aria-label="information" onClick={openDisclaimer}>
          ⓘ
        </button>
      </div>
    </div>
  );
}
