import { useCommandCenterStore } from "../../store/useCommandCenterStore";
import { t } from "../../i18n";

/** Subtle footer: data-honesty pills and a single portfolio credit line. */
export function Footer() {
  const lang = useCommandCenterStore((s) => s.lang);
  return (
    <div className="footer" style={{ 
      position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", 
      zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" 
    }}>
      <div style={{ fontSize: "9px", color: "var(--faint)", letterSpacing: "0.02em", textAlign: "center" }}>
        Public signals show live provider status. Enterprise impact and market footprint are simulated via the Scenario Engine.
      </div>
      <div className="footer-by" style={{ marginTop: 0 }}>
        <b>{t("builtBy", lang)}</b>
      </div>
    </div>
  );
}
