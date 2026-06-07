import { useState } from "react";
import type { Language } from "../../types/i18n";
import type { DecisionOption, DecisionOptionId } from "../../types/scenarios";
import { useCommandCenterStore, useScenario, useMetrics } from "../../store/useCommandCenterStore";
import {
  GHOST_OPTIONS,
  type GhostOption,
  automationLabel,
  nextActionLabel,
  recommendedOptionId,
} from "../../engine/decisionEngine";
import { generateBoardBrief } from "../../engine/briefingEngine";
import { generateSnapshot } from "../../engine/snapshotEngine";
import { buildMarkdownSnapshot } from "../../utils/markdownExport";
import { useDataSourceStore } from "../../dataSources/useDataSources";
import { t, tv } from "../../i18n";

function autoClassFor(id: DecisionOptionId): string {
  return id === "A" ? "approval-no" : id === "C" ? "approval-yes" : "";
}

function GhostCard({ o, lang }: { o: GhostOption; lang: Language }) {
  return (
    <div className={"dcard ghostcard" + (o.recommended ? " rec" : "")}>
      <div className="dcard-top">
        <div className="dcard-letter">{o.id}</div>
        <div className="dcard-label">{t(o.labelKey, lang)}</div>
        {o.recommended && <span className="rec-tag">{t("recBadge", lang)}</span>}
      </div>
      <div className="dcard-rr">
        <div className="dm-k">{t("riskReduction", lang)}</div>
        <div className="rr-line">
          <span className="rr-num" style={{ fontSize: 15 }}>
            {tv(o.riskReduction, lang)}
          </span>
          <div className="rr-bar">
            <i style={{ width: o.bar + "%", opacity: 0.7 }} />
          </div>
        </div>
      </div>
      <div className="dcard-strip">
        <div className="ds">
          <div className="k">{t("residualRisk", lang)}</div>
          <div className="v">{tv(o.residual, lang)}</div>
        </div>
        <div className="ds">
          <div className="k">{t("speed", lang)}</div>
          <div className="v">{tv(o.speed, lang)}</div>
        </div>
        <div className="ds">
          <div className="k">{t("businessImpact", lang)}</div>
          <div className="v">{tv(o.impact, lang)}</div>
        </div>
        <div className="ds">
          <div className="k">{t("approvalReq", lang)}</div>
          <div className={"v " + (o.approval ? "approval-yes" : "approval-no")}>
            {o.approval ? t("yes", lang) : t("no", lang)}
          </div>
        </div>
      </div>
      <div className="dcard-foot2">
        <div className="ds">
          <div className="k">{t("aiAutomation", lang)}</div>
          <div className={"v " + autoClassFor(o.id)}>{automationLabel(o.id, lang)}</div>
        </div>
        <div className="ds nextcell">
          <div className="k">{t("recBadge", lang)}</div>
          <div className="v nextval">{tv(o.note, lang)}</div>
        </div>
      </div>
    </div>
  );
}

function DecisionCard({ o, rec, lang }: { o: DecisionOption; rec: boolean; lang: Language }) {
  return (
    <div className={"dcard" + (rec ? " rec" : "")}>
      <div className="dcard-top">
        <div className="dcard-letter">{o.id}</div>
        <div className="dcard-label">{tv(o.label, lang)}</div>
        {rec && <span className="rec-tag">{t("recBadge", lang)}</span>}
      </div>
      <div className="dcard-rr">
        <div className="dm-k">{t("riskReduction", lang)}</div>
        <div className="rr-line">
          <span className="rr-num">{o.riskReduction}%</span>
          <div className="rr-bar">
            <i style={{ width: o.riskReduction + "%" }} />
          </div>
        </div>
      </div>
      <div className="dcard-strip">
        <div className="ds">
          <div className="k">{t("residualRisk", lang)}</div>
          <div className="v">{o.residualRisk}</div>
        </div>
        <div className="ds">
          <div className="k">{t("speed", lang)}</div>
          <div className="v">{o.speed}</div>
        </div>
        <div className="ds">
          <div className="k">{t("businessImpact", lang)}</div>
          <div className="v">{o.businessImpact}</div>
        </div>
        <div className="ds">
          <div className="k">{t("approvalReq", lang)}</div>
          <div className={"v " + (o.humanApproval ? "approval-yes" : "approval-no")}>
            {o.humanApproval ? t("yes", lang) : t("no", lang)}
          </div>
        </div>
      </div>
      <div className="dcard-foot2">
        <div className="ds">
          <div className="k">{t("aiAutomation", lang)}</div>
          <div className={"v " + autoClassFor(o.id)}>{automationLabel(o.id, lang)}</div>
        </div>
        <div className="ds nextcell">
          <div className="k">{t("nextActionL", lang)}</div>
          <div className="v nextval">{nextActionLabel(o.id, lang)}</div>
        </div>
      </div>
    </div>
  );
}

/** Bottom bar: board brief + always-present A/B/C executive options. */
export function DecisionBoard() {
  const lang = useCommandCenterStore((s) => s.lang);
  const scenario = useScenario();

  const recId = recommendedOptionId(scenario);
  const ghost = !scenario;
  const brief = generateBoardBrief(scenario, lang);
  const signals = useDataSourceStore((s) => s.signals);
  const metrics = useMetrics();

  const [copiedBrief, setCopiedBrief] = useState(false);
  const [copiedSnap, setCopiedSnap] = useState(false);

  const handleCopyBrief = () => {
    navigator.clipboard.writeText(brief).then(() => {
      setCopiedBrief(true);
      setTimeout(() => setCopiedBrief(false), 2000);
    });
  };

  const handleCopySnapshot = () => {
    const snap = generateSnapshot(scenario, metrics, signals, lang);
    const md = buildMarkdownSnapshot(snap);
    navigator.clipboard.writeText(md).then(() => {
      setCopiedSnap(true);
      setTimeout(() => setCopiedSnap(false), 2000);
    });
  };

  const handleDownloadMd = () => {
    const snap = generateSnapshot(scenario, metrics, signals, lang);
    const md = buildMarkdownSnapshot(snap);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = scenario ? `planetary-ops-${scenario.id}-snapshot.md` : "planetary-ops-executive-snapshot.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass decision-pad">
      <div className="decision-head">
        <div className="ic" style={{ color: "var(--cyan)" }}>
          ⌗
        </div>
        <div className="grow">
          <div className="dh-t">{t("decisionBoard", lang)}</div>
          <div className="dh-s">{t("decisionBoardSub", lang)}</div>
        </div>
        {scenario ? (
          <div className="dh-context">
            <span
              className={"state-chip state-" + (scenario.risk === "Critical" ? "CRITICAL" : "DEGRADED")}
              style={{ fontSize: 9, padding: "6px 11px" }}
            >
              {scenario.risk === "Critical" ? t("critical", lang) : t("degradedTag", lang)}
            </span>
            <b>{tv(scenario.title, lang)}</b>
          </div>
        ) : (
          <div className="dh-context">
            <span className="state-chip state-NOMINAL" style={{ fontSize: 9, padding: "6px 11px" }}>
              {t("nominal", lang)}
            </span>
          </div>
        )}
      </div>

      <div className="decision-body">
        <div className="board-brief">
          <div className="bb-head">
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="bb-spark">✦</span>
              <span className="bb-title">{t("boardBrief", lang)}</span>
            </div>
            <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
              <button className="panel-btn" onClick={handleCopyBrief} style={{ fontSize: 10, padding: "4px 8px" }}>
                {copiedBrief ? t("copied", lang) : t("copyBrief", lang)}
              </button>
              <button className="panel-btn" onClick={handleCopySnapshot} style={{ fontSize: 10, padding: "4px 8px" }}>
                {copiedSnap ? t("copied", lang) : t("copySnapshot", lang)}
              </button>
              <button className="panel-btn" onClick={handleDownloadMd} style={{ fontSize: 10, padding: "4px 8px" }}>
                {t("downloadMd", lang)}
              </button>
            </div>
          </div>
          {scenario && (
            <div className="bb-ribbons">
              <span className="bb-ribbon rib-live">
                <span className="dot red pulse" />
                {t("incidentRibbon", lang)}
              </span>
            </div>
          )}
          <div className="bb-text" style={{ whiteSpace: "pre-wrap" }}>{brief}</div>
          
          <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "9px", fontFamily: "var(--mono)", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}>
             <div style={{ background: "rgba(255,255,255,0.02)", padding: "8px", borderRadius: "4px", borderLeft: "2px solid var(--cyan)" }}>
                <div style={{ color: "var(--faint)", marginBottom: "4px" }}>CONFIDENCE LEVEL</div>
                <div style={{ color: "var(--text)", fontSize: "11px", fontWeight: 600 }}>
                  {scenario ? "HIGH (94%) - Modeled" : "N/A - Live Ops"}
                </div>
             </div>
             <div style={{ background: "rgba(255,255,255,0.02)", padding: "8px", borderRadius: "4px", borderLeft: "2px solid var(--amber)" }}>
                <div style={{ color: "var(--faint)", marginBottom: "4px" }}>ASSUMPTIONS</div>
                <div style={{ color: "var(--text)", fontSize: "10px", letterSpacing: "0.5px" }}>
                  {scenario ? "Current threat profile unchanged" : "Based on public signals"}
                </div>
             </div>
          </div>

          {scenario && (
            <div className="bb-next">
              <span className="bb-next-k">{t("nextActionL", lang)} · 24h</span>
              <span className="bb-next-v">{tv(scenario.next.h24, lang)}</span>
            </div>
          )}
        </div>

        <div className={"decision-grid" + (ghost ? " ghost" : "")}>
          {ghost
            ? GHOST_OPTIONS.map((o) => <GhostCard key={o.id} o={o} lang={lang} />)
            : scenario.options.map((o) => (
                <DecisionCard key={o.id} o={o} rec={o.id === recId} lang={lang} />
              ))}
        </div>
      </div>
    </div>
  );
}
