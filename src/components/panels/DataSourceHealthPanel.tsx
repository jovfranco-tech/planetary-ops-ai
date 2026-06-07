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

  return (
    <div className="glass panel-pad health-panel" style={{ flex: "0 0 auto", height: "auto" }}>
      <div className="phead">
        <div className="ic" style={{ color: "var(--cyan)", background: "rgba(54, 214, 231, 0.08)" }}>📡</div>
        <div className="grow">
          <div className="tt">{t("pubProviderStatusIntel", lang)}</div>
          <div className="tsub">v1.6.0 Real Public Signals</div>
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

      <div style={{ fontSize: "11px", color: "var(--text-bright)", marginBottom: "12px", background: "rgba(255,255,255,0.05)", padding: "8px", borderRadius: "4px", borderLeft: "2px solid var(--cyan)" }}>
        {t("scenarioBoundaryDesc", lang)}
      </div>

      <div className="scroll health-list" style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "240px" }}>
        {["cloud", "ai", "saas", "identity", "data-platform", "collaboration", "developer-platform", "network", "space", "platform"].map(category => {
          const catSignals = signals.filter(s => s.category === category);
          if (catSignals.length === 0) return null;
          
          return (
            <div key={category} style={{ marginBottom: "8px" }}>
              <div style={{ fontSize: "9px", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "4px", letterSpacing: "1px" }}>
                {category}
              </div>
              {catSignals.map((h) => (
                <div key={h.id} className="health-row" style={{ display: "flex", flexDirection: "column", padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "4px", marginBottom: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 600, fontSize: "12px", color: "var(--text-bright)" }}>{h.sourceName}</div>
                    <div className={`health-status-pill ${h.mode}`}>
                      <span className={`h-dot ${getStatusColorClass(h.mode)}`} />
                      <span className="h-status-text" style={{ textTransform: "uppercase" }}>{getStatusText(h.mode)}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "8px", fontSize: "10px", color: "var(--text-dim)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ color: "var(--faint)" }}>Status:</span> 
                      <span style={{ 
                        color: h.status?.toLowerCase() === "operational" ? "var(--green)" : 
                               (h.status?.toLowerCase().includes("degrad") || h.status?.toLowerCase().includes("outage")) ? "var(--amber)" : "var(--text-dim)",
                        fontWeight: 600,
                        textTransform: "uppercase" 
                      }}>
                        {h.status || "UNKNOWN"}
                      </span>
                    </div>
                    <div><span style={{ color: "var(--faint)" }}>Checked:</span> {new Date(h.lastCheckedAt).toLocaleTimeString(lang === "es" ? "es-ES" : "en-US")}</div>
                    <div style={{ width: "100%" }}><span style={{ color: "var(--faint)" }}>Source:</span> {h.attribution}</div>
                  </div>
                  
                  <div style={{ marginTop: "8px" }}>
                    <span style={{ background: "rgba(246, 177, 62, 0.15)", color: "var(--amber)", padding: "2px 6px", borderRadius: "3px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.5px" }}>
                      {lang === "es" ? "SÓLO CONTEXTO" : "CONTEXT ONLY"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
