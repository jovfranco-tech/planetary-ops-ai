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
        bottom: 24,
        left: 24,
        zIndex: 20,
        background: "rgba(10, 15, 20, 0.85)",
        border: "1px solid rgba(255, 200, 91, 0.3)",
        borderLeft: "3px solid #ffc85b",
        padding: "16px",
        borderRadius: "4px",
        maxWidth: "320px",
        pointerEvents: "none",
        backdropFilter: "blur(12px)",
      }}
    >
      <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#ffc85b", marginBottom: "12px", textTransform: "uppercase" }}>
        {tFunc("layerEnterpriseFootprint" as TranslationKey, lang)}
      </h3>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--fg)" }}>105</div>
          <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: 1.2 }}>{tFunc("footprintMarkets" as TranslationKey, lang).replace("105 ", "")}</div>
        </div>
        <div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--fg)" }}>8</div>
          <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: 1.2 }}>{tFunc("footprintHubs" as TranslationKey, lang).replace("8 ", "")}</div>
        </div>
        <div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--fg)" }}>24</div>
          <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: 1.2 }}>{tFunc("footprintCorridors" as TranslationKey, lang).replace("24 ", "")}</div>
        </div>
        <div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--fg)" }}>7</div>
          <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: 1.2 }}>{tFunc("footprintProviders" as TranslationKey, lang).replace("7 ", "")}</div>
        </div>
      </div>

      <div style={{ fontSize: "10px", color: "var(--muted)", lineHeight: 1.4, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "12px" }}>
        ⚠️ {tFunc("footprintDisclaimer" as TranslationKey, lang)}
      </div>
    </div>
  );
}
