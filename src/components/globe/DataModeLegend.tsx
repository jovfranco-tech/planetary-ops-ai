import { useCommandCenterStore } from "../../store/useCommandCenterStore";
import { t } from "../../i18n";

export function DataModeLegend() {
  const lang = useCommandCenterStore((s) => s.lang);

  return (
    <div className="data-mode-legend glass" style={{
      position: "absolute",
      bottom: "22px",
      right: "22px",
      padding: "12px 14px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      zIndex: 5
    }}>
      <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", color: "var(--cyan)", marginBottom: "4px" }}>
        {t("globeIntelligence", lang).toUpperCase()}
      </div>
      
      <div className="legend-row">
        <span className="source-badge badge-live" />
        <span>{t("feedLive", lang)}</span>
      </div>
      <div className="legend-row">
        <span className="source-badge badge-cached" />
        <span>{t("feedCached", lang)}</span>
      </div>
      <div className="legend-row">
        <span className="source-badge badge-simulated" />
        <span>{t("feedSimulated", lang)}</span>
      </div>
      <div className="legend-row">
        <span className="source-badge badge-curated" />
        <span>{t("feedCurated", lang)}</span>
      </div>
      <div className="legend-row">
        <span className="source-badge badge-unavailable" />
        <span>{t("feedUnavailable", lang)}</span>
      </div>

      <style>{`
        .data-mode-legend .legend-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--mono);
          font-size: 9px;
          color: var(--muted);
          letter-spacing: 0.05em;
        }
        .source-badge {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 2px;
          flex: none;
        }
        .badge-live { background: rgba(91, 224, 168, 0.2); border: 1px solid var(--green); box-shadow: 0 0 6px rgba(91, 224, 168, 0.4); }
        .badge-cached { background: rgba(54, 214, 231, 0.2); border: 1px solid var(--cyan); box-shadow: 0 0 6px rgba(54, 214, 231, 0.4); }
        .badge-simulated { background: rgba(179, 136, 255, 0.2); border: 1px solid var(--violet); }
        .badge-curated { background: rgba(91, 140, 255, 0.2); border: 1px solid var(--blue); }
        .badge-unavailable { background: rgba(255, 93, 108, 0.2); border: 1px solid var(--red); }
      `}</style>
    </div>
  );
}
