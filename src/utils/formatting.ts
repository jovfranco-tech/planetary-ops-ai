/** Zero-pad a 1-based index for the scenario rail ("01", "02"…). */
export function padIndex(i: number): string {
  return String(i + 1).padStart(2, "0");
}

/** Strip the descriptive suffix from a node name ("Mexico City — Ops" → "Mexico City"). */
export function shortName(name: string): string {
  return name.split("—")[0].trim();
}

/** rgba() string from a #hex color and alpha 0..1. */
export function hexWithAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
}
