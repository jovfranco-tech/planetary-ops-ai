import { useEffect } from "react";
import { useCommandCenterStore } from "../store/useCommandCenterStore";
import { TopBar } from "../components/layout/TopBar";
import { Sidebar } from "../components/layout/Sidebar";
import { Footer } from "../components/layout/Footer";
import { StageOverlay } from "../components/layout/StageOverlay";
import { CommandGlobe } from "../components/globe/CommandGlobe";
import { ExecutiveWarRoom } from "../components/panels/ExecutiveWarRoom";
import { AIResiliencePanel } from "../components/panels/AIResiliencePanel";
import { ScenarioTimeline } from "../components/panels/ScenarioTimeline";
import { DecisionBoard } from "../components/panels/DecisionBoard";
import { DemoDisclaimer } from "../components/panels/DemoDisclaimer";
import { AICopilot } from "../components/copilot/AICopilot";
import { useDataSourceStore } from "../dataSources/useDataSources";
import { t } from "../i18n";

/** The cinematic command-center layout: top bar, three columns, decision bar. */
export function AppShell() {
  const lang = useCommandCenterStore((s) => s.lang);
  const copilotOpen = useCommandCenterStore((s) => s.copilotOpen);
  const setCopilotOpen = useCommandCenterStore((s) => s.setCopilotOpen);
  const scenarioActive = useCommandCenterStore((s) => s.appliedScenarioId !== null);
  
  const fetchDataSources = useDataSourceStore((s) => s.fetchDataSources);

  /* Load real data sources on mount */
  useEffect(() => {
    fetchDataSources();
  }, [fetchDataSources]);

  /* Keep the document language in sync for assistive technologies. */
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="app">
      <TopBar />

      <div className="body">
        <div className="col-left" style={{ display: "flex", flexDirection: "column", gap: "14px", height: "100%", minHeight: 0 }}>
          <Sidebar />
        </div>

        <div className="stage">
          <CommandGlobe />
          <StageOverlay />
          {scenarioActive && (
            <div className="scenario-active-banner glass" style={{
              position: "absolute",
              top: "14px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              padding: "6px 16px",
              borderRadius: "999px",
              backgroundColor: "rgba(246, 177, 62, 0.15)",
              border: "1px solid rgba(246, 177, 62, 0.4)",
              color: "var(--amber)",
              fontFamily: "var(--mono)",
              fontSize: "10px",
              letterSpacing: "0.08em",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 8px 32px rgba(246, 177, 62, 0.15)"
            }}>
              <span className="dot amber pulse" />
              {t("scenarioActiveBanner", lang)}
            </div>
          )}
          <ScenarioTimeline />
        </div>

        <div className="col-right">
          <ExecutiveWarRoom />
          <AIResiliencePanel />
        </div>

        <div className="decision-bar">
          <DecisionBoard />
        </div>
      </div>

      <Footer />

      {copilotOpen && <div className="cop-scrim" onClick={() => setCopilotOpen(false)} />}
      <AICopilot />

      <DemoDisclaimer />
    </div>
  );
}
