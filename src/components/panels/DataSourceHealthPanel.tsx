import { useDataSourceStore } from "../../dataSources/useDataSources";
import { useCommandCenterStore } from "../../store/useCommandCenterStore";
import { t } from "../../i18n";
import type { SourceStatus } from "../../dataSources/types";

export function DataSourceHealthPanel() {
  const lang = useCommandCenterStore((s) => s.lang);
  const health = useDataSourceStore((s) => s.health);
  const isLoading = useDataSourceStore((s) => s.isLoading);
  const fetchDataSources = useDataSourceStore((s) => s.fetchDataSources);

  const getStatusColorClass = (status: SourceStatus) => {
    switch (status) {
      case "live":
        return "status-live-dot";
      case "cached":
        return "status-cached-dot";
      case "curated":
        return "status-curated-dot";
      case "simulated":
        return "status-simulated-dot";
      case "unavailable":
      case "error":
        return "status-error-dot";
      default:
        return "status-simulated-dot";
    }
  };

  const getStatusText = (status: SourceStatus) => {
    switch (status) {
      case "live":
        return t("feedLive", lang);
      case "cached":
        return t("feedCached", lang);
      case "curated":
        return t("feedCurated", lang);
      case "simulated":
        return t("feedSimulated", lang);
      case "unavailable":
      case "error":
        return t("feedUnavailable", lang);
      default:
        return status;
    }
  };

  return (
    <div className="glass panel-pad health-panel" style={{ flex: "0 0 auto", height: "auto" }}>
      <div className="phead">
        <div className="ic" style={{ color: "var(--cyan)", background: "rgba(54, 214, 231, 0.08)" }}>📡</div>
        <div className="grow">
          <div className="tt">{t("dataFeeds", lang)}</div>
          <div className="tsub">v1.1.0 Real-Data Foundation</div>
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

      <div className="scroll health-list" style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "240px" }}>
        {health.map((h) => (
          <div key={h.id} className="health-row">
            <div className="health-meta">
              <div className="health-name">
                {h.name}
              </div>
              <div className="health-category">{h.category}</div>
            </div>
            
            <div className="health-status-container">
              <div className={`health-status-pill ${h.status}`}>
                <span className={`h-dot ${getStatusColorClass(h.status)}`} />
                <span className="h-status-text">{getStatusText(h.status)}</span>
              </div>
            </div>
            
            <div className="health-detail-drawer">
              <div className="detail-line">
                <span className="k">{t("feedSource", lang)}:</span>
                <span className="v">{h.attribution}</span>
              </div>
              {h.status !== "curated" && h.status !== "simulated" && (
                <div className="detail-line">
                  <span className="k">{t("feedUpdated", lang)}:</span>
                  <span className="v">{new Date(h.lastUpdated).toLocaleTimeString(lang === "es" ? "es-ES" : "en-US")}</span>
                </div>
              )}
              {h.errorMessage && (
                <div className="detail-line error-line">
                  <span className="k">Error:</span>
                  <span className="v">{h.errorMessage}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
