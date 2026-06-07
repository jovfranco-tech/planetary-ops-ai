import { useDataSourceStore } from "../../dataSources/useDataSources";
import { useCommandCenterStore } from "../../store/useCommandCenterStore";
import { t } from "../../i18n";
import type { SignalMode } from "../../realSignals/types";

export function DataSourceHealthPanel() {
  const lang = useCommandCenterStore((s) => s.lang);
  const signals = useDataSourceStore((s) => s.signals);
  const isLoading = useDataSourceStore((s) => s.isLoading);
  const fetchDataSources = useDataSourceStore((s) => s.fetchDataSources);

  const getStatusColorClass = (mode: SignalMode) => {
    switch (mode) {
      case "live":
        return "status-live-dot";
      case "cached":
        return "status-cached-dot";
      case "curated":
        return "status-curated-dot";
      case "simulated":
        return "status-simulated-dot";
      case "reference":
        return "status-reference-dot";
      case "unavailable":
      case "error":
        return "status-error-dot";
      default:
        return "status-simulated-dot";
    }
  };

  const getStatusText = (mode: SignalMode) => {
    switch (mode) {
      case "live":
        return t("feedLive", lang);
      case "cached":
        return t("feedCached", lang);
      case "curated":
        return t("feedCurated", lang);
      case "simulated":
        return t("feedSimulated", lang);
      case "reference":
        return "Reference";
      case "unavailable":
      case "error":
        return t("feedUnavailable", lang);
      default:
        return mode;
    }
  };

  const disclaimer = lang === "es" 
    ? "Las señales públicas reales sólo aportan contexto. El modelado de decisiones sigue siendo simulado."
    : "Real public signals provide context only. Decision modeling remains simulated.";

  return (
    <div className="glass panel-pad health-panel" style={{ flex: "0 0 auto", height: "auto" }}>
      <div className="phead">
        <div className="ic" style={{ color: "var(--cyan)", background: "rgba(54, 214, 231, 0.08)" }}>📡</div>
        <div className="grow">
          <div className="tt">{t("dataFeeds", lang)}</div>
          <div className="tsub">v1.5.0 Real Public Signals</div>
        </div>
        <button 
          className="mini-btn refresh-btn" 
          onClick={() => fetchDataSources()} 
          disabled={isLoading}
          style={{ padding: "4px 8px", cursor: isLoading ? "not-allowed" : "pointer" }}
        >
          {isLoading ? "..." : "↻"}
        </button>
      </div>

      <div style={{ fontSize: "10px", color: "var(--text-dim)", marginBottom: "8px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "8px" }}>
        {disclaimer}
      </div>

      <div className="scroll health-list" style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "240px" }}>
        {signals.map((h) => (
          <div key={h.id} className="health-row">
            <div className="health-meta">
              <div className="health-name">
                {h.sourceName}
              </div>
              <div className="health-category">{h.category}</div>
            </div>
            
            <div className="health-status-container">
              <div className={`health-status-pill ${h.mode}`}>
                <span className={`h-dot ${getStatusColorClass(h.mode)}`} />
                <span className="h-status-text">{getStatusText(h.mode)}</span>
              </div>
            </div>
            
            <div className="health-detail-drawer">
              <div className="detail-line">
                <span className="k">{t("feedSource", lang)}:</span>
                <span className="v">{h.attribution}</span>
              </div>
              <div className="detail-line">
                <span className="k">Summary:</span>
                <span className="v">{h.summary}</span>
              </div>
              {h.mode !== "curated" && h.mode !== "simulated" && h.mode !== "reference" && (
                <div className="detail-line">
                  <span className="k">{t("feedUpdated", lang)}:</span>
                  <span className="v">{new Date(h.lastCheckedAt).toLocaleTimeString(lang === "es" ? "es-ES" : "en-US")}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
