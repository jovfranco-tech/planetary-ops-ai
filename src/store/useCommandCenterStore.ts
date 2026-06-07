import { useMemo } from "react";
import { create } from "zustand";
import type { Language } from "../types/i18n";
import type { LayerId, WarRoomMetrics } from "../types/domain";
import type { Scenario } from "../types/scenarios";
import { DEFAULT_LAYERS, INITIAL_POV } from "../utils/constants";
import { focusNodeFor, getScenario, projectMetrics } from "../engine/scenarioEngine";
import { ALL_LAYER_IDS, nodeById } from "../data";

const LANG_KEY = "poc_lang";

function initialLang(): Language {
  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "es") return saved;
  }
  return "en";
}

/** A camera focus request. `ts` makes each request a fresh reference so the
 *  globe effect re-fires even when the coordinates repeat. */
export interface FocusRequest {
  lat: number;
  lng: number;
  ts: number;
}

export interface SelectedNode {
  lat: number;
  lng: number;
  name: string;
  type?: string;
  region?: string;
}

interface CommandCenterState {
  /* ---- state ---- */
  lang: Language;
  layers: Set<LayerId>;
  appliedScenarioId: string | null;
  copilotOpen: boolean;
  showDisclaimer: boolean;
  focusRequest: FocusRequest | null;
  zenMode: boolean;
  perfMode: "high" | "low";
  thermalMode: boolean;
  colorBlindMode: boolean;
  proactiveAlert: string | null;
  selectedNode: SelectedNode | null;

  /* ---- actions ---- */
  setLang: (lang: Language) => void;
  toggleLayer: (id: LayerId) => void;
  allLayers: () => void;
  resetLayers: () => void;
  runScenario: (id: string) => void;
  clearScenario: () => void;
  toggleCopilot: () => void;
  setCopilotOpen: (open: boolean) => void;
  openDisclaimer: () => void;
  closeDisclaimer: () => void;
  toggleZenMode: () => void;
  togglePerfMode: () => void;
  toggleThermalMode: () => void;
  toggleColorBlindMode: () => void;
  setProactiveAlert: (msg: string | null) => void;
  setSelectedNode: (node: SelectedNode | null) => void;
}

export const useCommandCenterStore = create<CommandCenterState>((set) => ({
  lang: initialLang(),
  layers: new Set<LayerId>(ALL_LAYER_IDS),
  appliedScenarioId: null,
  copilotOpen: false,
  showDisclaimer: false,
  focusRequest: null,
  zenMode: false,
  perfMode: "high",
  thermalMode: false,
  colorBlindMode: false,
  proactiveAlert: null,
  selectedNode: null,

  setLang: (lang) => {
    if (typeof localStorage !== "undefined") localStorage.setItem(LANG_KEY, lang);
    set({ lang });
  },

  toggleLayer: (id) =>
    set((s) => {
      const next = new Set(s.layers);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { layers: next };
    }),

  allLayers: () => set({ layers: new Set<LayerId>(ALL_LAYER_IDS) }),

  resetLayers: () => set({ layers: new Set<LayerId>(DEFAULT_LAYERS) }),

  runScenario: (id) => {
    const scenario = getScenario(id);
    set({ appliedScenarioId: scenario ? id : null });
    const focusId = focusNodeFor(scenario);
    const node = focusId ? nodeById(focusId) : undefined;
    if (node) set({ focusRequest: { lat: node.lat, lng: node.lng, ts: Date.now() } });
    
    // Memory integration
    if (scenario) {
      import("./useMemoryStore").then(({ useMemoryStore }) => {
        useMemoryStore.getState().addIncident(id, scenario.title.en);
      });
    }
  },

  clearScenario: () =>
    set({
      appliedScenarioId: null,
      focusRequest: { lat: INITIAL_POV.lat, lng: INITIAL_POV.lng, ts: Date.now() },
    }),

  toggleCopilot: () => set((s) => ({ copilotOpen: !s.copilotOpen })),

  setCopilotOpen: (open) => set({ copilotOpen: open }),

  openDisclaimer: () => set({ showDisclaimer: true }),

  closeDisclaimer: () => set({ showDisclaimer: false }),
  toggleZenMode: () => set((state) => ({ zenMode: !state.zenMode })),
  togglePerfMode: () => set((state) => ({ perfMode: state.perfMode === "high" ? "low" : "high" })),
  toggleThermalMode: () => set((state) => ({ thermalMode: !state.thermalMode })),
  toggleColorBlindMode: () => set((state) => ({ colorBlindMode: !state.colorBlindMode })),
  setProactiveAlert: (msg) => set({ proactiveAlert: msg }),
  setSelectedNode: (node) => set({ selectedNode: node }),
}));

/* ------------------------------------------------------------------ */
/* Reactive derived selectors                                          */
/*                                                                     */
/* These must NOT be exposed as stable functions on the store: a       */
/* component subscribing to a stable function reference would never    */
/* re-render when `appliedScenarioId` changes. Instead we subscribe    */
/* to the primitive and derive via pure engine functions. `getScenario`*/
/* returns a stable object reference per id, so the selector is stable  */
/* across unrelated updates and changes only when the scenario does.   */
/* ------------------------------------------------------------------ */

/** Reactively resolve the currently applied scenario (or null). */
export function useScenario(): Scenario | null {
  return useCommandCenterStore((s) => getScenario(s.appliedScenarioId));
}

/** Reactively project executive metrics for the active scenario. */
export function useMetrics(): WarRoomMetrics {
  const scenario = useScenario();
  return useMemo(() => projectMetrics(scenario), [scenario]);
}
