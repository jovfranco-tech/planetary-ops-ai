import { useCommandCenterStore, useScenario, useMetrics } from "../../store/useCommandCenterStore";
import { recommendedOption } from "../../engine/decisionEngine";
import { derivePosture } from "../../engine/riskEngine";
import { metricBarColor, metricClass, type MetricKind } from "../../utils/scoring";
import { t, tv } from "../../i18n";
import { useCountUp } from "../common/useCountUp";

interface WMProps {
  k: string;
  full?: string;
  value: number | string;
  unit?: string;
  kind?: MetricKind;
}

function WM({ k, full, value, unit, kind = "plain" }: WMProps) {
  const animated = typeof value === "number";
  const n = useCountUp(animated ? (value as number) : 0, 600);
  const cls = animated ? metricClass(kind, value as number) : "";
  const barC = metricBarColor(kind, animated ? (value as number) : 0);
  const showBar = kind === "risk" || kind === "good";
  return (
    <div className="wm" title={full || k}>
      <div className="wm-k">{k}</div>
      <div className={"wm-v " + cls}>
        {animated ? n : value}
        {unit ? <span className="wm-u">{unit}</span> : null}
      </div>
      {showBar && (
        <div className="wm-bar">
          <i style={{ width: (animated ? n : 0) + "%", background: barC }} />
        </div>
      )}
    </div>
  );
}

/** Right column: executive operational metrics and recommended posture. */
export function ExecutiveWarRoom() {
  const lang = useCommandCenterStore((s) => s.lang);
  const scenario = useScenario();
  const metrics = useMetrics();

  const rec = scenario ? recommendedOption(scenario) : null;
  const posture = derivePosture(scenario);
  const postureTxt = t(posture.labelKey, lang);
  const postureCls = posture.scoreClass;
  const recTxt = rec ? tv(rec.label, lang) : t("maintainRec", lang);
  const escTxt = t(posture.escalationKey, lang);
  const escCls = posture.escalationClass;

  return (
    <div className="glass panel-pad">
      <div className="phead">
        <div
          className="ic"
          style={{
            color: "var(--red)",
            borderColor: "rgba(255,93,108,0.35)",
            background: "rgba(255,93,108,0.08)",
          }}
        >
          ◎
        </div>
        <div className="grow">
          <div className="tt">{t("warRoom", lang)}</div>
          <div className="tsub">
            {scenario
              ? t("simState", lang) + " · " + scenario.risk.toUpperCase()
              : t("liveOps", lang)}
          </div>
        </div>
        <div className={"dot " + (metrics.incidents > 0 ? "red pulse" : "green")} />
      </div>

      <div className="warroom-grid">
        <WM k={t("mResilience", lang)} full={t("resilience", lang)} value={metrics.resilience} unit="%" kind="good" />
        <WM k={t("mContinuity", lang)} full={t("continuity", lang)} value={metrics.continuity} unit="%" kind="good" />
        <WM k={t("mAiRisk", lang)} full={t("aiRisk", lang)} value={metrics.aiRisk} kind="risk" />
        <WM k={t("mCyber", lang)} full={t("cyberRisk", lang)} value={metrics.cyberRisk} kind="risk" />
        <WM k={t("mIncidents", lang)} full={t("activeIncidents", lang)} value={metrics.incidents} />
        <div className="wm" title={t("exposure", lang)}>
          <div className="wm-k">{t("mExposure", lang)}</div>
          <div
            className="wm-v exp"
            style={{ color: metrics.incidents > 0 ? "var(--amber)" : "var(--text)" }}
          >
            {tv(metrics.exposure, lang)}
          </div>
        </div>
      </div>

      <div className="posture-strip">
        <div className="ps-row ps-inline">
          <span className="ps-item">
            <span className="ps-k">{t("postureL", lang)}</span>
            <span className={"ps-v-inline " + postureCls}>{postureTxt}</span>
          </span>
          <span className="ps-item">
            <span className="ps-k">{t("escalationL", lang)}</span>
            <span className={"ps-v-inline " + escCls}>{escTxt}</span>
          </span>
        </div>
        <div className="ps-rec-block">
          <span className="ps-k">{t("recShort", lang)}</span>
          <span className="ps-rec-v">{recTxt}</span>
        </div>
      </div>
    </div>
  );
}
