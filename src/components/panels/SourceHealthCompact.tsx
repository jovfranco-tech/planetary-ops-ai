import { useDataSourceStore } from "../../dataSources/useDataSources";
import { useCommandCenterStore } from "../../store/useCommandCenterStore";
import type { SignalMode } from "../../realSignals/types";

export function SourceHealthCompact() {
  const lang = useCommandCenterStore((s) => s.lang);
  const signals = useDataSourceStore((s) => s.signals);
  const isLoading = useDataSourceStore((s) => s.isLoading);
  const lastFetchTime = useDataSourceStore((s) => s.lastFetchTime);

  const getStatusColorClass = (mode: SignalMode) => {
    switch (mode) {
      case "live": return "status-live-dot";
      case "cached": return "status-cached-dot";
      case "curated": return "status-curated-dot";
      case "simulated": return "status-simulated-dot";
      case "reference": return "status-reference-dot";
      case "unavailable":
      case "error": return "status-error-dot";
      default: return "status-simulated-dot";
    }
  };

  return (
    <div className="health-compact" style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px dashed var(--stroke)", display: "flex", alignItems: "center", gap: "8px", fontSize: "9px", fontFamily: "var(--mono)", color: "var(--muted)" }}>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", maxWidth: "200px" }}>
        {signals.map(h => (
          <div key={h.id} className={`h-dot ${getStatusColorClass(h.mode)}`} title={`${h.sourceName}: ${h.mode}`} />
        ))}
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px" }}>
        <span>{isLoading ? "..." : (lastFetchTime ? new Date(lastFetchTime).toLocaleTimeString(lang === "es" ? "es-ES" : "en-US", { hour: "2-digit", minute: "2-digit" }) : "")}</span>
      </div>
    </div>
  );
}
