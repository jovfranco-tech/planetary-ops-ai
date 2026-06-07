import type { ExecutiveSnapshot } from "../engine/snapshotEngine";
import { t, tv } from "../i18n";

export function buildMarkdownSnapshot(snap: ExecutiveSnapshot): string {
  const { lang, scenario, metrics, brief, recommendedId, timestamp, signals } = snap;

  const disclaimer = lang === "es"
    ? "> **Entorno de demostración.** La infraestructura, los flujos y los modelos de decisión son simulados. Las señales públicas muestran el estado de proveedores. El motor de escenarios modela el impacto empresarial. Se requiere validación humana para operaciones reales."
    : "> **Demo environment.** Infrastructure, workflows and decision models are simulated. Public signals show provider status. Scenario engine models enterprise impact. Human validation is required for real operations.";

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


  const signalsTitle = lang === "es" ? "Inteligencia de Estado Público de Proveedores (Sólo Contexto)" : "Public Provider Status Intelligence (Context Only)";
  md += `## ${signalsTitle}\n`;
  
  if (signals && signals.length > 0) {
    const categories = ["cloud", "ai", "saas", "identity", "data-platform", "collaboration", "developer-platform", "network", "space", "platform"];
    categories.forEach(cat => {
      const catSignals = signals.filter(s => s.category === cat);
      if (catSignals.length > 0) {
        md += `\n### ${cat.toUpperCase()}\n`;
        catSignals.forEach(s => {
          md += `- **[${s.mode.toUpperCase()}] ${s.sourceName}**: ${s.summary} *(Checked: ${new Date(s.lastCheckedAt).toUTCString()})*\n`;
        });
      }
    });
  } else {
    md += `- No signals available.\n`;
  }
  md += `\n---\n\n`;
  md += `${disclaimer}\n`;

  return md;
}
