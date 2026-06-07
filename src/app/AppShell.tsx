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

/** The cinematic command-center layout: top bar, three columns, decision bar. */
export function AppShell() {
  const lang = useCommandCenterStore((s) => s.lang);
  const copilotOpen = useCommandCenterStore((s) => s.copilotOpen);
  const setCopilotOpen = useCommandCenterStore((s) => s.setCopilotOpen);

  /* Keep the document language in sync for assistive technologies. */
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="app">
      <TopBar />

      <div className="body">
        <div className="col-left">
          <Sidebar />
        </div>

        <div className="stage">
          <CommandGlobe />
          <StageOverlay />
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
