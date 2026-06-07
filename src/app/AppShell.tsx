import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { LiveFeedMonitor } from "../components/ai/LiveFeedMonitor";
import { useDataSourceStore } from "../dataSources/useDataSources";
import { t } from "../i18n";

/** The cinematic command-center layout: top bar, three columns, decision bar. */
export function AppShell() {
  const lang = useCommandCenterStore((s) => s.lang);
  const copilotOpen = useCommandCenterStore((s) => s.copilotOpen);
  const setCopilotOpen = useCommandCenterStore((s) => s.setCopilotOpen);
  const scenarioActive = useCommandCenterStore((s) => s.appliedScenarioId !== null);
  const zenMode = useCommandCenterStore((s) => s.zenMode);
  
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
        <AnimatePresence>
          {!zenMode && (
            <motion.div 
              className="col-left" 
              style={{ display: "flex", flexDirection: "column", gap: "14px", height: "100%", minHeight: 0 }}
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            >
              <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>

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
        <AnimatePresence>
          {!zenMode && (
            <motion.div 
              className="col-right"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            >
              <ExecutiveWarRoom />
              <AIResiliencePanel />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!zenMode && (
            <motion.div 
              className="decision-bar"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            >
              <DecisionBoard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />

      {copilotOpen && <div className="cop-scrim" onClick={() => setCopilotOpen(false)} />}
      <AICopilot />

      <DemoDisclaimer />
      <LiveFeedMonitor />
    </div>
  );
}
