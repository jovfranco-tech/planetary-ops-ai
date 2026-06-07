import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { useCommandCenterStore, useScenario } from "../../store/useCommandCenterStore";
import { GLOBE_BUMP_URL, GLOBE_TEXTURE_URL, INITIAL_POV, COLORS } from "../../utils/constants";
import { projectGlobe } from "../../engine/globeProjection";
import { OrbitLayer } from "./OrbitLayer";
import { useDataSourceStore } from "../../dataSources/useDataSources";
import { propagateSatellite } from "../../dataSources/satelliteAdapter";
import { getOutageCoords } from "../../dataSources/radarAdapter";
import { ringFade } from "../../utils/geo";

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

  const data = useMemo(
    () => projectGlobe({ layers, scenario, lang }),
    [layers, scenario, lang],
  );

  const satellites = useDataSourceStore((s) => s.satellites);
  const outages = useDataSourceStore((s) => s.outages);
  const [timeTick, setTimeTick] = useState(0);

  // Satellite orbit tick animation
  useEffect(() => {
    const timer = setInterval(() => setTimeTick((t) => t + 1), 1500);
    return () => clearInterval(timer);
  }, []);

  const enrichedPoints = useMemo(() => {
    const pts = [...data.points];
    if (layers.has("space")) {
      satellites.forEach((sat) => {
        const pos = propagateSatellite(sat);
        pts.push({
          id: `sat-${sat.id}`,
          lat: pos.lat,
          lng: pos.lng,
          color: "#8b9bff", // Space layer color
          alt: pos.altitude, // high above the earth
          rad: 0.36,
          tip: `<div class="node-tip">
            <span class="nt-k">SATELLITE (${sat.category.toUpperCase()})</span>
            <b>${sat.name}</b><br/>
            <span style="font-size: 8px; color: var(--faint);">NORAD ID: ${sat.id}</span><br/>
            <span style="font-size: 8px; color: var(--muted);">Status: ${sat.operationalStatus}</span>
          </div>`
        });
      });
    }
    return pts;
  }, [data.points, layers, satellites, timeTick]);

  const enrichedRings = useMemo(() => {
    const rgs = [...data.rings];
    if (!scenario && (layers.has("backbone") || layers.has("cyber"))) {
      outages.forEach((out) => {
        const coords = getOutageCoords(out);
        if (coords) {
          const isHigh = out.severity === "high" || out.severity === "critical";
          rgs.push({
            lat: coords.lat,
            lng: coords.lng,
            ringColor: ringFade(isHigh ? COLORS.red : COLORS.amber),
            maxR: isHigh ? 5.2 : 3.8,
            speed: isHigh ? 2.0 : 1.4,
            period: isHigh ? 1000 : 1500
          });
        }
      });
    }
    return rgs;
  }, [data.rings, layers, outages, scenario]);


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
            pointsData={enrichedPoints}
            pointLat="lat"
            pointLng="lng"
            pointAltitude="alt"
            pointRadius="rad"
            pointColor="color"
            pointResolution={18}
            pointsTransitionDuration={500}
            pointLabel="tip"
            /* arcs */
            arcsData={data.arcs}
            arcColor="color"
            arcStroke="stroke"
            arcDashLength="dashLen"
            arcDashGap="dashGap"
            arcDashAnimateTime="dashTime"
            arcAltitudeAutoScale={0.42}
            arcsTransitionDuration={400}
            /* rings */
            ringsData={enrichedRings}
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
