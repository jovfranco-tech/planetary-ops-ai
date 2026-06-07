import type { CSSProperties } from "react";
import { useCommandCenterStore } from "../../store/useCommandCenterStore";
import { LAYERS, SCENARIOS } from "../../data";
import { en, t, tv, type TranslationKey } from "../../i18n";
import { padIndex } from "../../utils/formatting";
import { COLORS } from "../../utils/constants";
import type { LayerId, RiskLevel } from "../../types/domain";

function layerColor(id: LayerId): string {
  return LAYERS.find((l) => l.id === id)?.color ?? COLORS.cyan;
}

function riskLabel(risk: RiskLevel, lang: "en" | "es"): string {
  const key = risk.toLowerCase();
  if (key in en) return t(key as TranslationKey, lang).toUpperCase();
  return risk.toUpperCase();
}

/** Scenario selector rail rendered over the globe stage. */
export function ScenarioTimeline() {
  const lang = useCommandCenterStore((s) => s.lang);
  const activeId = useCommandCenterStore((s) => s.appliedScenarioId);
  const runScenario = useCommandCenterStore((s) => s.runScenario);
  const clearScenario = useCommandCenterStore((s) => s.clearScenario);

  return (
    <div className="scenario-rail-wrap">
      <div className="rail-head">
        <span className="rh-t">{t("scenarios", lang)}</span>
        <span className="rh-s">— {t("scenarioHint", lang)}</span>
        <span className="grow" />
        {activeId && (
          <button className="rail-clear" onClick={clearScenario}>
            ✕ {t("clear", lang)}
          </button>
        )}
      </div>
      <div className="scenario-rail">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            className={"scn-card" + (activeId === s.id ? " on" : "")}
            style={{ "--c": layerColor(s.layer) } as CSSProperties}
            onClick={() => runScenario(s.id)}
          >
            <div className="scn-top">
              <span className="scn-idx">{padIndex(i)}</span>
              <span className={"scn-risk risk-" + s.risk}>{riskLabel(s.risk, lang)}</span>
            </div>
            <div className="scn-name">{tv(s.title, lang)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
