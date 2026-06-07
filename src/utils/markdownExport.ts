import type { ExecutiveSnapshot } from "../engine/snapshotEngine";
import { t, tv } from "../i18n";

export function buildMarkdownSnapshot(snap: ExecutiveSnapshot): string {
  const { lang, scenario, metrics, brief, recommendedId, timestamp, signals } = snap;

  const disclaimer = lang === "es"
    ? "> **Entorno de demostración.** La infraestructura, los flujos y los modelos de decisión son simulados. Las fuentes en vivo/contextuales, cuando están disponibles, sólo se usan como contexto operativo. Se requiere validación humana para operaciones reales."
    : "> **Demo environment.** Infrastructure, workflows and decision models are simulated. Live/contextual feeds, when available, are used for situational awareness only. Human validation is required for real operations.";

  const title = lang === "es" ? "Snapshot Ejecutivo" : "Executive Snapshot";
  const scenarioTitle = scenario ? tv(scenario.title, lang) : t("nominal", lang);
  const statusLine = scenario 
    ? (scenario.risk === "Critical" ? t("critical", lang) : t("degradedTag", lang))
    : t("nominal", lang);

  let md = `# ${title} — Planetary Operations AI\n\n`;
  md += `**Date:** ${new Date(timestamp).toUTCString()}\n`;
  md += `**Posture:** ${statusLine} — ${scenarioTitle}\n\n`;

  md += `## ${t("boardBrief", lang)}\n${brief}\n\n`;

  md += `## ${t("globalStatus", lang)}\n`;
  md += `- **${t("mResilience", lang)}:** ${metrics.resilience}%\n`;
  md += `- **${t("mContinuity", lang)}:** ${metrics.continuity}%\n`;
  md += `- **${t("mAiRisk", lang)}:** ${metrics.aiRisk}%\n`;
  md += `- **${t("mCyber", lang)}:** ${metrics.cyberRisk}%\n\n`;

  if (scenario) {
    md += `### ${t("affectedRegionsL", lang)}\n${scenario.affectedRegions.join(", ")}\n\n`;
    md += `### ${t("affectedServicesL", lang)}\n${scenario.affectedServices.join(", ")}\n\n`;
    
    md += `## ${t("decisionBoard", lang)}\n`;
    scenario.options.forEach(o => {
      const isRec = o.id === recommendedId ? ` **[${t("recBadge", lang)}]**` : "";
      md += `### Option ${o.id}: ${tv(o.label, lang)}${isRec}\n`;
      md += `- **${t("riskReduction", lang)}:** ${o.riskReduction}%\n`;
      md += `- **${t("businessImpact", lang)}:** ${o.businessImpact}\n`;
      md += `- **${t("speed", lang)}:** ${o.speed}\n`;
      md += `- **${t("approvalReq", lang)}:** ${o.humanApproval ? t("yes", lang) : t("no", lang)}\n\n`;
    });
  }


  md += `## Real Public Signals (Context Only)\n`;
  if (signals && signals.length > 0) {
    signals.forEach(s => {
      md += `- **[${s.mode.toUpperCase()}] ${s.sourceName}**: ${s.summary} *(Checked: ${new Date(s.lastCheckedAt).toUTCString()})*\n`;
    });
  } else {
    md += `- No signals available.\n`;
  }
  md += `\n---\n\n`;
  md += `${disclaimer}\n`;

  return md;
}
