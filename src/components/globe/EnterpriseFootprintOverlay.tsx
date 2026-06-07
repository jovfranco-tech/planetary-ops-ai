import { useCommandCenterStore } from "../../store/useCommandCenterStore";
import { t as tFunc, type TranslationKey } from "../../i18n";

export function EnterpriseFootprintOverlay() {
  const layers = useCommandCenterStore((s) => s.layers);
  const lang = useCommandCenterStore((s) => s.lang);

  if (!layers.has("enterprise-footprint")) return null;

  return (
    <div
      className="panel"
      style={{
        position: "absolute",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
        background: "rgba(10, 15, 20, 0.85)",
        border: "1px solid rgba(255, 200, 91, 0.3)",
        borderTop: "3px solid #ffc85b",
        padding: "12px 24px",
        borderRadius: "8px",
        pointerEvents: "auto",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
      }}
    >
      <div style={{ display: "flex", gap: "32px", textAlign: "center" }}>
        <div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--fg)" }}>112</div>
          <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>{tFunc("footprintMarkets" as TranslationKey, lang).replace("112 ", "")}</div>
        </div>
        <div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--fg)" }}>8</div>
          <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>{tFunc("footprintHubs" as TranslationKey, lang).replace("8 ", "")}</div>
        </div>
        <div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--fg)" }}>23</div>
          <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>{tFunc("footprintCorridors" as TranslationKey, lang).replace("23 ", "")}</div>
        </div>
        <div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--fg)" }}>7</div>
          <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>{tFunc("footprintProviders" as TranslationKey, lang).replace("7 ", "")}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
        {["LATAM: 20", "Europe: 35", "APAC: 25", "MEA: 22", "North America: 3", "South Asia: 7"].map(b => (
          <span key={b} style={{ fontSize: "10px", padding: "2px 8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "var(--fg)" }}>
            {b}
          </span>
        ))}
      </div>

      <div style={{ fontSize: "10px", color: "var(--muted)", marginTop: "4px" }}>
        ⚠️ {tFunc("footprintDisclaimer" as TranslationKey, lang)}
      </div>
    </div>
  );
}
