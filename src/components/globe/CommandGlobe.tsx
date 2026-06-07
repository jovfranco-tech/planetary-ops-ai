import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { useCommandCenterStore, useScenario } from "../../store/useCommandCenterStore";
import { GLOBE_BUMP_URL, GLOBE_TEXTURE_URL, INITIAL_POV } from "../../utils/constants";
import { projectGlobe } from "../../engine/globeProjection";
import { projectLiveGlobe } from "../../engine/liveGlobeProjection";
import { OrbitLayer } from "./OrbitLayer";
import { DataModeLegend } from "./DataModeLegend";
import { useDataSourceStore } from "../../dataSources/useDataSources";

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function buildLabelEl(d: object): HTMLElement {
  const label = d as { text: string; state: string };
  const el = document.createElement("div");
  el.className = "globe-label" + (label.state ? " gl-" + label.state : "");
  el.style.pointerEvents = "none";
  const dot = document.createElement("span");
  dot.className = "gl-dot";
  const text = document.createElement("span");
  text.className = "gl-text";
  text.textContent = label.text; // textContent (not innerHTML) — no injection sink
  el.append(dot, text);
  return el;
}

/** The cinematic 3D operational globe — the visual hero of the command center. */
export function CommandGlobe() {
  const layers = useCommandCenterStore((s) => s.layers);
  const lang = useCommandCenterStore((s) => s.lang);
  const focusRequest = useCommandCenterStore((s) => s.focusRequest);
  const scenario = useScenario();

  const hostRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [supported] = useState(webglAvailable);

  const aiProviders = useDataSourceStore((s) => s.aiProviders);
  const satellites = useDataSourceStore((s) => s.satellites);
  const outages = useDataSourceStore((s) => s.outages);

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
    () => projectLiveGlobe({ layers, scenario, lang, outages, satellites, aiProviders }),
    [layers, scenario, lang, outages, satellites, aiProviders, timeTick]
  );

  const combinedPoints = useMemo(() => [...data.points, ...liveData.points], [data.points, liveData.points]);
  const combinedRings = useMemo(() => [...data.rings, ...liveData.rings], [data.rings, liveData.rings]);
  const combinedArcs = useMemo(() => [...data.arcs, ...liveData.arcs], [data.arcs, liveData.arcs]);


  /* Track container size. */
  useEffect(() => {
    if (!hostRef.current) return;
    const el = hostRef.current;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize({ width: r.width, height: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Initial camera + auto-rotate + brighten the scene. */
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    g.pointOfView(INITIAL_POV, 0);
    const controls = g.controls() as {
      autoRotate: boolean;
      autoRotateSpeed: number;
      enableDamping: boolean;
      dampingFactor: number;
      minDistance: number;
      maxDistance: number;
    };
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.42;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 150;
    controls.maxDistance = 520;

    try {
      const scene = g.scene();
      scene.traverse((o) => {
        const light = o as { isDirectionalLight?: boolean; isAmbientLight?: boolean; intensity?: number };
        if (light.isDirectionalLight) light.intensity = 2.2;
        if (light.isAmbientLight) light.intensity = 2.6;
      });
    } catch {
      /* lighting tweak is best-effort */
    }
  }, [supported, size.width]);

  /* React to focus requests. */
  useEffect(() => {
    const g = globeRef.current;
    if (!g || !focusRequest) return;
    g.pointOfView({ lat: focusRequest.lat, lng: focusRequest.lng, altitude: 1.9 }, 1200);
  }, [focusRequest]);

  return (
    <div className="stage-frame">
      <div className="stage-scan" />
      <div className="globe-host" ref={hostRef}>
        {supported && size.width > 0 && (
          <Globe
            ref={globeRef}
            width={size.width}
            height={size.height}
            rendererConfig={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl={GLOBE_TEXTURE_URL}
            bumpImageUrl={GLOBE_BUMP_URL}
            showAtmosphere
            atmosphereColor="#5fb0ff"
            atmosphereAltitude={0.3}
            /* points */
            pointsData={combinedPoints}
            pointLat="lat"
            pointLng="lng"
            pointAltitude="alt"
            pointRadius="rad"
            pointColor="color"
            pointResolution={18}
            pointsTransitionDuration={500}
            pointLabel="tip"
            /* arcs */
            arcsData={combinedArcs}
            arcColor="color"
            arcStroke="stroke"
            arcDashLength="dashLen"
            arcDashGap="dashGap"
            arcDashAnimateTime="dashTime"
            arcAltitudeAutoScale={0.42}
            arcsTransitionDuration={400}
            /* rings */
            ringsData={combinedRings}
            ringColor="ringColor"
            ringMaxRadius="maxR"
            ringPropagationSpeed="speed"
            ringRepeatPeriod="period"
            /* html labels */
            htmlElementsData={data.labels}
            htmlLat="lat"
            htmlLng="lng"
            htmlAltitude="halt"
            htmlElement={buildLabelEl}
          />
        )}
      </div>
      <OrbitLayer visible={layers.has("space")} />
      <DataModeLegend />
      <div className="stage-vignette" />
      {!supported && (
        <div className="globe-fallback">
          3D globe engine unavailable offline.
          <br />
          Command layers, scenarios &amp; decision intelligence remain fully operational.
        </div>
      )}
    </div>
  );
}
