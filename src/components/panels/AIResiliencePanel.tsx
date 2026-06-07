import { useState } from "react";
import { useCommandCenterStore, useScenario, useMetrics } from "../../store/useCommandCenterStore";
import { PROVIDERS } from "../../data";
import {
  getPanelWorkflows,
  summarizeAIResilience,
  workflowStatus,
} from "../../engine/aiResilienceEngine";
import { t, tv } from "../../i18n";
import { useDataSourceStore } from "../../dataSources/useDataSources";

const mapStoreId = (id: string): string => {
  switch (id) {
    case "openai": return "openai";
    case "claude": return "anthropic";
    case "gemini": return "gemini";
    case "mscop": return "ms-copilot";
    case "ghcop": return "github-copilot";
    case "azoai": return "azure-openai";
    default: return "";
  }
};

/** AI-as-critical-infrastructure module: concentration, fallback, governance. */
export function AIResiliencePanel() {
  const lang = useCommandCenterStore((s) => s.lang);
  const scenario = useScenario();
  const metrics = useMetrics();
  const [tab, setTab] = useState<"providers" | "workflows">("providers");
  const realProviders = useDataSourceStore((s) => s.aiProviders);

  const summary = summarizeAIResilience(metrics.aiRisk, scenario);
  const concLabel = summary.concentrationHigh
    ? lang === "es"
      ? "Alta"
      : "High"
    : lang === "es"
      ? "Media"
      : "Moderate";
  const workflows = getPanelWorkflows(lang);
  const localStatus = t("ready", lang);

  const getDotClass = (status: string) => {
    if (status === "operational") return "green";
    if (status === "degraded" || status === "partial_outage") return "amber pulse";
    if (status === "major_outage") return "red pulse";
    return "faint";
  };

  return (
    <div className="glass panel-pad">
      <div className="phead">
        <div
          className="ic"
          style={{
            color: "var(--violet)",
            borderColor: "rgba(179,136,255,0.4)",
            background: "rgba(179,136,255,0.1)",
          }}
        >
          ✦
        </div>
        <div className="grow">
          <div className="tt" style={{ color: "var(--violet)" }}>
            {t("aiResilience", lang)}
          </div>
          <div className="tsub">
            {PROVIDERS.length} {t("providersTracked", lang)}
          </div>
        </div>
      </div>

      <div className="ai-summary">{t("aiSummary", lang)}</div>

      <div className="ai-scores">
        <div className="score-cell" title={t("aiRisk", lang)}>
          <div className="sc-k">{t("mAiRisk", lang)}</div>
          <div className="sc-v" style={{ color: summary.depColor }}>
            {summary.depRisk}
          </div>
        </div>
        <div className="score-cell" title={t("concentrationRisk", lang)}>
          <div className="sc-k">{t("mConc", lang)}</div>
          <div className="sc-v" style={{ color: "var(--amber)" }}>
            {summary.topShare}
            <span className="sc-u">% · {concLabel}</span>
          </div>
        </div>
        <div className="score-cell" title={t("fallbackReadinessL", lang)}>
          <div className="sc-k">{t("mFallback", lang)}</div>
          <div className="sc-v" style={{ color: summary.readinessColor }}>
            {summary.readiness}
            <span className="sc-u">%</span>
          </div>
        </div>
      </div>

      <div className="ai-tabs">
        <button
          className={"ai-tab" + (tab === "providers" ? " on" : "")}
          onClick={() => setTab("providers")}
        >
          {t("tabProviders", lang)}
        </button>
        <button
          className={"ai-tab" + (tab === "workflows" ? " on" : "")}
          onClick={() => setTab("workflows")}
        >
          {t("tabWorkflows", lang)}
        </button>
      </div>

      <div className="ai-cols">
        {tab === "providers" && (
          <div className="ai-col">
            <div className="ai-coltitle">
              <span>{t("concentrationRisk", lang)}</span>
              <span className="ct-meta">
                {t("localFallback", lang)}:{" "}
                <b style={{ color: "var(--green)" }}>{localStatus}</b>
              </span>
            </div>
            <div className="conc-bars">
              {PROVIDERS.map((p) => {
                const realP = realProviders.find((rp) => rp.id === mapStoreId(p.id));
                const statusVal = realP ? realP.status : "operational";
                const dotClass = getDotClass(statusVal);
                return (
                  <div className="conc-row" key={p.id}>
                    <div className="cl" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className={"dot " + dotClass} style={{ width: "6px", height: "6px" }} title={realP ? `Live status: ${realP.status} (${realP.attribution})` : "Simulated"} />
                      {p.label}
                    </div>
                    <div className="conc-track">
                      <i
                        style={{
                          width: p.concentration * 2.5 + "%",
                          background: p.tone,
                          boxShadow: "0 0 7px " + p.tone,
                        }}
                      />
                    </div>
                    <div className="cv">{p.concentration}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "workflows" && (
          <div className="ai-col">
            <div className="ai-coltitle">
              <span>{t("workflowStatus", lang)}</span>
              <span className="ct-meta">
                {summary.approvalGated}/{summary.totalWorkflows} {t("approvalReqS", lang)}
              </span>
            </div>
            <div className="wf-list">
              {workflows.map((w) => {
                const s = workflowStatus(w, scenario);
                return (
                  <div className="wf-row" key={w.id}>
                    <div className="wf-main">
                      <div className="wf-n">{tv(w.name, lang)}</div>
                      <div className="wf-route">
                        {w.primary} <span className="wf-arr">→</span> {w.fallback}
                      </div>
                    </div>
                    <div className={"wf-s " + s.cls}>{t(s.labelKey, lang)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
