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
        background: "transparent",
        border: "none",
        padding: "6px 16px",
        pointerEvents: "none",
        display: "flex",
        alignItems: "baseline",
        gap: "24px",
      }}
    >
      <div style={{ display: "flex", gap: "24px", textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>112</div>
          <div style={{ fontSize: "9px", color: "var(--muted)" }}>{tFunc("footprintMarkets" as TranslationKey, lang).replace("112 ", "")}</div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>8</div>
          <div style={{ fontSize: "9px", color: "var(--muted)" }}>{tFunc("footprintHubs" as TranslationKey, lang).replace("8 ", "")}</div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>23</div>
          <div style={{ fontSize: "9px", color: "var(--muted)" }}>{tFunc("footprintCorridors" as TranslationKey, lang).replace("23 ", "")}</div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>7</div>
          <div style={{ fontSize: "9px", color: "var(--muted)" }}>{tFunc("footprintProviders" as TranslationKey, lang).replace("7 ", "")}</div>
        </div>
      </div>
    </div>
  );
}
