import { useEffect, useRef } from "react";
import { useCommandCenterStore } from "../../store/useCommandCenterStore";
import { useDataSourceStore } from "../../dataSources/useDataSources";

/**
 * Invisible component that monitors live feeds and proactively triggers the AI Copilot
 * if anomalous or degraded conditions are detected.
 */
export function LiveFeedMonitor() {
  const outages = useDataSourceStore(s => s.outages);
  const cloudProviders = useDataSourceStore(s => s.cloudProviders);
  const aiProviders = useDataSourceStore(s => s.aiProviders);
  
  const setCopilotOpen = useCommandCenterStore((s) => s.setCopilotOpen);
  const setProactiveAlert = useCommandCenterStore((s) => s.setProactiveAlert);
  
  // Track previous state to only alert on *transitions* to degraded, not constantly
  const prevRef = useRef({
    outageCount: 0,
    cloudDegraded: 0,
    aiDegraded: 0
  });

  useEffect(() => {
    // Current counts
    const outageCount = outages.length;
    const cloudDegraded = cloudProviders.filter(c => c.status !== "operational").length;
    const aiDegraded = aiProviders.filter(a => a.status !== "operational").length;

    const prev = prevRef.current;
    let alertMsg = null;

    if (outageCount > prev.outageCount) {
      alertMsg = `⚠️ **Anomaly Detected:** I just picked up a new internet backbone outage from Cloudflare Radar. This could impact network routing. I recommend isolating dependencies in the affected region.`;
    } else if (cloudDegraded > prev.cloudDegraded) {
      alertMsg = `⚠️ **Anomaly Detected:** A major cloud provider just reported degradation. If you are relying on this provider for core infrastructure, prepare for potential latency or failovers.`;
    } else if (aiDegraded > prev.aiDegraded) {
      alertMsg = `⚠️ **Anomaly Detected:** An AI provider just changed status to degraded. If any of your autonomous workflows rely on this model, consider staging a multi-model fallback immediately.`;
    }

    // Trigger proactive copilot
    if (alertMsg) {
      setCopilotOpen(true);
      setProactiveAlert(alertMsg);
    }

    // Update refs
    prevRef.current = { outageCount, cloudDegraded, aiDegraded };

  }, [outages, cloudProviders, aiProviders, setCopilotOpen, setProactiveAlert]);

  return null;
}
