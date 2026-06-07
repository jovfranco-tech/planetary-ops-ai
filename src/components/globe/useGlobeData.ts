import { useState, useEffect, useMemo } from "react";
import { useCommandCenterStore } from "../../store/useCommandCenterStore";
import { useDataSourceStore } from "../../dataSources/useDataSources";
import { projectGlobe } from "../../engine/globeProjection";
import { projectLiveGlobe } from "../../engine/liveGlobeProjection";
import { getScenario } from "../../engine/scenarioEngine";

export function useGlobeData() {
  const layers = useCommandCenterStore((s) => s.layers);
  const lang = useCommandCenterStore((s) => s.lang);
  const scenarioId = useCommandCenterStore((s) => s.appliedScenarioId);
  const scenario = useMemo(() => getScenario(scenarioId), [scenarioId]);

  const aiProviders = useDataSourceStore((s) => s.aiProviders);
  const satellites = useDataSourceStore((s) => s.satellites);
  const outages = useDataSourceStore((s) => s.outages);
  const cloudProviders = useDataSourceStore((s) => s.cloudProviders);

  const [timeTick, setTimeTick] = useState(0);

  // Satellite orbit tick animation
  useEffect(() => {
    const timer = setInterval(() => setTimeTick((t) => t + 1), 2500);
    return () => clearInterval(timer);
  }, []);

  const data = useMemo(
    () => projectGlobe({ layers, scenario, lang }),
    [layers, scenario, lang],
  );

  const liveData = useMemo(
    () => projectLiveGlobe({ layers, scenario, lang, outages, satellites, aiProviders, cloudProviders }),
    [layers, scenario, lang, outages, satellites, aiProviders, cloudProviders, timeTick]
  );

  const combinedPoints = useMemo(() => [...data.points, ...liveData.points], [data.points, liveData.points]);
  const combinedArcs = useMemo(() => [...data.arcs, ...liveData.arcs], [data.arcs, liveData.arcs]);

  return { combinedPoints, combinedArcs, scenario };
}
