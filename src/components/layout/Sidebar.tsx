import type { CSSProperties, KeyboardEvent } from "react";
import { useCommandCenterStore } from "../../store/useCommandCenterStore";
import { LAYERS } from "../../data";
import { t, tv } from "../../i18n";

/** Left column: toggleable planetary infrastructure layers. */
export function Sidebar() {
  const lang = useCommandCenterStore((s) => s.lang);
  const layers = useCommandCenterStore((s) => s.layers);
  const toggleLayer = useCommandCenterStore((s) => s.toggleLayer);
  const allLayers = useCommandCenterStore((s) => s.allLayers);
  const resetLayers = useCommandCenterStore((s) => s.resetLayers);

  return (
    <div className="glass panel-pad">
      <div className="phead">
        <div className="ic">▦</div>
        <div className="grow">
          <div className="tt">{t("layersTitle", lang)}</div>
          <div className="tsub">{t("layersHint", lang)}</div>
        </div>
      </div>

      <div className="layer-toolbar">
        <button className="mini-btn" onClick={allLayers}>
          {t("allOn", lang)}
        </button>
        <button className="mini-btn" onClick={resetLayers}>
          {t("reset", lang)}
        </button>
      </div>

      <div className="layer-list" style={{ flex: "0 0 auto" }}>
        {LAYERS.map((l) => {
          const on = layers.has(l.id);
          return (
            <div
              key={l.id}
              className={"layer-row" + (on ? " on" : "")}
              style={{ "--c": l.color } as CSSProperties}
              onClick={() => toggleLayer(l.id)}
              role="switch"
              aria-checked={on}
              aria-label={tv(l.name, lang)}
              tabIndex={0}
              onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleLayer(l.id);
                }
              }}
            >
              <div className="layer-glyph">{l.glyph}</div>
              <div className="layer-meta">
                <div className="name">{tv(l.name, lang)}</div>
              </div>
              <div className="layer-toggle" />
            </div>
          );
        })}
      </div>

      <div className="ai-flag">
        <b>✦ AI RESILIENCE</b>
        {t("aiDiff", lang)}
      </div>
    </div>
  );
}
