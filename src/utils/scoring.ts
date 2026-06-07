import { COLORS, SCORE } from "./constants";

export type ScoreClass = "score-good" | "score-warn" | "score-bad";

/** Higher value = healthier. */
export function goodScoreClass(v: number): ScoreClass {
  return v >= SCORE.goodHigh ? "score-good" : v >= SCORE.goodMid ? "score-warn" : "score-bad";
}

/** Higher value = riskier. */
export function riskScoreClass(v: number): ScoreClass {
  return v <= SCORE.riskLow ? "score-good" : v <= SCORE.riskMid ? "score-warn" : "score-bad";
}

export function goodBarColor(v: number): string {
  return v >= SCORE.goodHigh ? COLORS.green : v >= SCORE.goodMid ? COLORS.amber : COLORS.red;
}

export function riskBarColor(v: number): string {
  return v <= SCORE.riskLow ? COLORS.green : v <= SCORE.riskMid ? COLORS.amber : COLORS.red;
}

export type MetricKind = "good" | "risk" | "plain";

export function metricClass(kind: MetricKind, value: number): ScoreClass | "" {
  if (kind === "good") return goodScoreClass(value);
  if (kind === "risk") return riskScoreClass(value);
  return "";
}

export function metricBarColor(kind: MetricKind, value: number): string {
  if (kind === "good") return goodBarColor(value);
  if (kind === "risk") return riskBarColor(value);
  return COLORS.cyan;
}
