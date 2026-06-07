interface OrbitLayerProps {
  visible: boolean;
}

interface Orbit {
  R: number;
  k: number;
  tilt: number;
  dur: number;
  dir: 1 | -1;
  c: string;
}

const ORBITS: Orbit[] = [
  { R: 360, k: 0.34, tilt: -18, dur: 26, dir: 1, c: "#cfe0ff" },
  { R: 420, k: 0.5, tilt: 24, dur: 34, dir: -1, c: "#9fd6ff" },
  { R: 300, k: 0.28, tilt: 8, dur: 20, dir: 1, c: "#b8c8ff" },
];

/** Decorative orbital satellites shown when the Space layer is enabled. */
export function OrbitLayer({ visible }: OrbitLayerProps) {
  return (
    <svg
      className="orbit-svg"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid meet"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity .6s ease",
      }}
    >
      {ORBITS.map((o, i) => (
        <g key={i} transform={`translate(500 500) rotate(${o.tilt}) scale(1 ${o.k})`}>
          <ellipse
            cx="0"
            cy="0"
            rx={o.R}
            ry={o.R}
            fill="none"
            stroke="rgba(140,170,255,0.22)"
            strokeWidth="1.2"
            strokeDasharray="3 7"
          />
          <g
            style={{
              animation: `orbitSpin ${o.dur}s linear infinite`,
              animationDirection: o.dir > 0 ? "normal" : "reverse",
              transformOrigin: "0px 0px",
            }}
          >
            <circle
              cx={o.R}
              cy="0"
              r="5.5"
              fill={o.c}
              style={{ filter: "drop-shadow(0 0 6px rgba(160,190,255,0.95))" }}
            />
            <circle cx={o.R} cy="0" r="11" fill="none" stroke="rgba(160,190,255,0.45)" strokeWidth="1" />
          </g>
        </g>
      ))}
    </svg>
  );
}
