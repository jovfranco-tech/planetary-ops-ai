import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IncidentRecord {
  id: string;
  scenarioId: string;
  timestamp: number;
  resolution: string;
}

interface MemoryState {
  incidentHistory: IncidentRecord[];
  addIncident: (scenarioId: string, resolution: string) => void;
  clearHistory: () => void;
}

export const useMemoryStore = create<MemoryState>()(
  persist(
    (set) => ({
      incidentHistory: [],
      addIncident: (scenarioId, resolution) => 
        set((state) => ({
          incidentHistory: [
            ...state.incidentHistory,
            { id: Math.random().toString(36).substring(7), scenarioId, timestamp: Date.now(), resolution }
          ]
        })),
      clearHistory: () => set({ incidentHistory: [] }),
    }),
    {
      name: "command-center-memory",
    }
  )
);
