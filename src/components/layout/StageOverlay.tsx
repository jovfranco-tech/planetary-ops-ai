import { useCommandCenterStore, useScenario } from "../../store/useCommandCenterStore";
import { recommendedOption } from "../../engine/decisionEngine";
import { t, tv } from "../../i18n";
import { COLORS } from "../../utils/constants";

function StageStatus() {
  const lang = useCommandCenterStore((s) => s.lang);
  const scenario = useScenario();

  if (!scenario) {
    return (
      <div className="stage-status">
        <div className="state-chip state-NOMINAL">
          <span className="dot green" />
          {t("nominal", lang)}
        </div>
      </div>
    );
  }

  const rec = recommendedOption(scenario);
  const crit = scenario.risk === "Critical";
  return (
    <div className="stage-status">
      <div className={"state-chip state-" + (crit ? "CRITICAL" : "DEGRADED")}>
        <span className={"dot " + (crit ? "red" : "amber") + " pulse"} />
        {crit ? t("critical", lang) : t("degradedTag", lang)}
      </div>
      {scenario.reroute.length > 0 && (
        <div className="state-chip state-FAILOVER">{t("failoverReady", lang)}</div>
      )}
      {rec.humanApproval && <div className="state-chip state-APPROVAL">{t("approvalTag", lang)}</div>}
    </div>
  );
}

const LEGEND: Array<{ color: string; en: string; es: string }> = [
  { color: COLORS.teal, en: "Enterprise", es: "Empresa" },
  { color: COLORS.blue, en: "Cloud", es: "Nube" },
  { color: COLORS.violet, en: "AI services", es: "Servicios IA" },
  { color: COLORS.amber, en: "Affected", es: "Afectado" },
  { color: COLORS.red, en: "Degraded", es: "Degradado" },
  { color: COLORS.green, en: "Failover", es: "Failover" },
];

/** Cinematic overlay layered above the globe inside the stage. */
export function StageOverlay() {
  const lang = useCommandCenterStore((s) => s.lang);
  const scenario = useScenario();

  return (
    <div className="stage-overlay">
      {scenario && (
        <div className="incident-ribbon">
          <span className="dot red pulse" />
          <span className="ir-t">{t("incidentRibbon", lang)}</span>
          <span className="ir-sep">·</span>
          <span className="ir-s">{tv(scenario.title, lang)}</span>
        </div>
      )}

      <div className="stage-title">
        <div className="t">{t("appKicker", lang)}</div>
        <div className="s">{t("subtitle", lang)}</div>
      </div>

      <StageStatus />

      {scenario && (
        <div className="live-incident">
          <div className="li-t">{tv(scenario.title, lang)}</div>
          <div className="li-s">{tv(scenario.summary, lang)}</div>
        </div>
      )}

      <div className="legend">
        {LEGEND.map((l) => (
          <span className="lg" key={l.en}>
            <span className="sw" style={{ background: l.color, color: l.color }} />
            {lang === "es" ? l.es : l.en}
          </span>
        ))}
      </div>
    </div>
  );
}
