import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCommandCenterStore, useScenario } from "../../store/useCommandCenterStore";
import { useMemoryStore } from "../../store/useMemoryStore";

export function AIDebateRoom() {
  const scenarioId = useCommandCenterStore((s) => s.appliedScenarioId);
  const scenario = useScenario();
  const history = useMemoryStore((s) => s.incidentHistory);
  
  const [debate, setDebate] = useState<{ role: string; message: string; color: string }[]>([]);
  const [isDebating, setIsDebating] = useState(false);

  const renderMessageWithReasoning = (msg: string) => {
    // Si contiene <thought>, dividirlo visualmente
    if (msg.includes("<thought>")) {
      const parts = msg.split(/<thought>|<\/thought>/);
      if (parts.length >= 3) {
        return (
          <>
            <div style={{ color: "var(--faint)", background: "rgba(255,255,255,0.03)", padding: "4px 8px", borderRadius: "4px", marginBottom: "6px", fontSize: "10px", fontStyle: "italic", borderLeft: "2px solid var(--faint)" }}>
              {parts[1].trim()}
            </div>
            <div style={{ color: "var(--text)", opacity: 0.85, lineHeight: 1.4 }}>
              {parts[2].trim()}
            </div>
          </>
        );
      }
    }
    return <div style={{ color: "var(--text)", opacity: 0.85, lineHeight: 1.4 }}>{msg}</div>;
  };

  useEffect(() => {
    if (!scenarioId || !scenario) {
      setDebate([]);
      return;
    }

    setIsDebating(true);
    setDebate([]);

    const runDebate = async () => {
      // Risk Analyst
      setDebate((d) => [...d, { 
        role: "Risk Intel (Watcher)", 
        message: `<thought>Retrieving historical precedents for ${scenario.title.en}... Correlating cross-region dependencies. Probability of cascading failure estimated at 73%.</thought>Vector analysis complete. High risk of collateral impact if not mitigated within 14 minutes.`, 
        color: "var(--cyan)" 
      }]);
      await new Promise((r) => setTimeout(r, 1800));

      // Red Team
      setDebate((d) => [...d, { 
        role: "Red Team (Adversary)", 
        message: `<thought>Simulating exploitation path. Primary targets: ${scenario.reroute[0] || 'core routing nodes'}. Defenses are currently focused on perimeter.</thought>If I were the actor, I'd pivot through the tertiary subnet. Current posture leaves data layer exposed. Risk is Critical.`, 
        color: "var(--red)" 
      }]);
      await new Promise((r) => setTimeout(r, 2200));

      // Blue Team / Strategy
      const pastIncidents = history.filter(h => h.scenarioId === scenarioId);
      const memoryNote = pastIncidents.length > 1 
        ? `<thought>Pattern recognized. We've encountered this ${pastIncidents.length - 1} times. Standard playbook #4 applies.</thought>Executing automated defense. Applying mitigation protocol without human-in-the-loop.` 
        : `<thought>Novel attack vector detected. Need to isolate enclaves while maintaining critical services.</thought>Isolating enclaves. I strongly suggest implementing the recommended posture immediately.`;

      setDebate((d) => [...d, { 
        role: "Blue Team (Strategy)", 
        message: memoryNote, 
        color: "var(--green)" 
      }]);
      
      setIsDebating(false);
    };

    runDebate();
  }, [scenarioId, scenario, history]);

  if (!scenarioId) return null;

  return (
    <div className="panel-box glass" style={{ marginTop: 20 }}>
      <div className="panel-header">
        <span className="ph-title" style={{ color: "var(--cyan)", letterSpacing: "1px" }}>AI SWARM: DEBATE ROOM</span>
        <span className="ph-badge" style={{ color: isDebating ? "var(--amber)" : "var(--green)", fontFamily: "var(--mono)", fontSize: "9px" }}>
          {isDebating ? "ANALYZING..." : "CONSENSUS REACHED"}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12, fontFamily: "var(--mono)", fontSize: "11px" }}>
        <AnimatePresence>
          {debate.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ borderLeft: `2px solid ${msg.color}`, paddingLeft: 8 }}
            >
              <div style={{ color: msg.color, fontWeight: "bold", marginBottom: 4, letterSpacing: "0.5px" }}>[{msg.role.toUpperCase()}]</div>
              {renderMessageWithReasoning(msg.message)}
            </motion.div>
          ))}
          {isDebating && (
             <motion.div
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               style={{ color: "var(--faint)", fontStyle: "italic", fontSize: "10px", marginTop: "4px" }}
             >
               Synthesizing response...
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
