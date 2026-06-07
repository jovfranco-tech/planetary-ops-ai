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

  useEffect(() => {
    if (!scenarioId || !scenario) {
      setDebate([]);
      return;
    }

    setIsDebating(true);
    setDebate([]);

    const runDebate = async () => {
      // Analyst
      setDebate((d) => [...d, { 
        role: "Analista de Riesgos", 
        message: `Evaluando vector de ataque: ${scenario.title.es}...`, 
        color: "var(--blue)" 
      }]);
      await new Promise((r) => setTimeout(r, 1200));

      // Red Team
      setDebate((d) => [...d, { 
        role: "Red Team (Atacante)", 
        message: `Si yo lanzara este ataque, aprovecharía la vulnerabilidad en ${scenario.reroute[0] || 'el nodo central'} para pivotar a bases de datos seguras. El riesgo es Crítico.`, 
        color: "var(--red)" 
      }]);
      await new Promise((r) => setTimeout(r, 1500));

      // Blue Team / Memory
      const pastIncidents = history.filter(h => h.scenarioId === scenarioId);
      const memoryNote = pastIncidents.length > 1 
        ? `Recuerdo que resolvimos esto ${pastIncidents.length - 1} veces antes. El protocolo estándar funcionará.` 
        : `Aislando enclaves. Sugiero aplicar el protocolo de mitigación inmediatamente.`;

      setDebate((d) => [...d, { 
        role: "Blue Team (Defensor)", 
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
        <span className="ph-title">IA ENJAMBRE: SALA DE DEBATE</span>
        <span className="ph-badge" style={{ color: isDebating ? "var(--amber)" : "var(--green)" }}>
          {isDebating ? "ANALIZANDO..." : "CONSENSO ALCANZADO"}
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
              <div style={{ color: msg.color, fontWeight: "bold", marginBottom: 4 }}>[{msg.role.toUpperCase()}]</div>
              <div style={{ color: "var(--text)", opacity: 0.85, lineHeight: 1.4 }}>{msg.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
