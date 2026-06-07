import { useDataSourceStore } from "../../dataSources/useDataSources";
import { useCommandCenterStore } from "../../store/useCommandCenterStore";
import { t } from "../../i18n";


export function DataSourceHealthPanel() {
  const lang = useCommandCenterStore((s) => s.lang);
  const signals = useDataSourceStore((s) => s.signals);
  const isLoading = useDataSourceStore((s) => s.isLoading);
  const fetchDataSources = useDataSourceStore((s) => s.fetchDataSources);



  return (
    <div className="glass panel-pad health-panel" style={{ flex: "0 0 auto", height: "auto" }}>
      <div className="phead" style={{ borderBottom: "1px solid var(--stroke)", paddingBottom: "12px", marginBottom: "12px" }}>
        <div className="ic" style={{ color: "var(--cyan)", background: "transparent", border: "none", fontSize: "18px" }}>◈</div>
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
        {[
          { label: "Cloud & Infrastructure", keys: ["cloud", "network", "space", "data-platform"] },
          { label: "AI & APIs", keys: ["ai", "platform", "developer-platform"] },
          { label: "Identity & SaaS", keys: ["saas", "identity", "collaboration"] }
        ].map(group => {
          const catSignals = signals.filter(s => group.keys.includes(s.category));
          if (catSignals.length === 0) return null;
          
          return (
            <div key={group.label} style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--cyan)", marginBottom: "8px", letterSpacing: "0.1em", borderBottom: "1px solid rgba(54,214,231,0.2)", paddingBottom: "4px" }}>
                {group.label}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {catSignals.map((h) => {
                  const isOp = h.status?.toLowerCase() === "operational";
                  return (
                    <div key={h.id} className="health-row" style={{ display: "flex", flexDirection: "column", padding: "8px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "6px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <div style={{ fontWeight: 600, fontSize: "11px", color: "var(--text)" }}>{h.sourceName}</div>
                        <div style={{
                          fontFamily: "var(--mono)", fontSize: "9px", fontWeight: 600, padding: "2px 0",
                          color: isOp ? "var(--green)" : "var(--amber)",
                        }}>
                          {h.status || "UNKNOWN"}
                        </div>
                      </div>
                      <div style={{ fontSize: "9px", color: "var(--faint)", fontFamily: "var(--mono)", display: "flex", justifyContent: "space-between" }}>
                        <span>{h.attribution}</span>
                        <span>{new Date(h.lastCheckedAt).toLocaleTimeString(lang === "es" ? "es-ES" : "en-US")}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
