import { create } from "zustand";
import type { RealAIProviderStatus, RealOutage, RealSatellite } from "./types";
import { fetchAllPublicSignals } from "../realSignals/publicSignalEngine";
import type { RealPublicSignal } from "../realSignals/types";

interface DataSourceStore {
  signals: RealPublicSignal[];
  outages: RealOutage[];
  satellites: RealSatellite[];
  aiProviders: RealAIProviderStatus[];
  cloudProviders: any[];
  saasProviders: any[];
  isLoading: boolean;
  lastFetchTime: string | null;
  fetchDataSources: () => Promise<void>;
}

export const useDataSourceStore = create<DataSourceStore>((set, get) => ({
  signals: [],
  outages: [],
  satellites: [],
  aiProviders: [],
  cloudProviders: [],
  saasProviders: [],
  isLoading: false,
  lastFetchTime: null,

  fetchDataSources: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });

    try {
      const res = await fetchAllPublicSignals();
      
      set({
        signals: res.signals,
        outages: res.rawOutages,
        satellites: res.rawSatellites,
        aiProviders: res.rawAiProviders,
        cloudProviders: res.rawCloudProviders,
        saasProviders: res.rawSaaSProviders,
        lastFetchTime: new Date().toISOString(),
        isLoading: false
      });

    } catch (err: any) {
      console.error("Failed to load real data sources:", err);
      set({ isLoading: false });
    }
  },
}));
