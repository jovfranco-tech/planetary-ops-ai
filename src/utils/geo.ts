import { hexWithAlpha } from "./formatting";

/**
 * Returns a globe ring color function `t -> rgba` that fades out as the ring
 * propagates (t goes 0 → 1). Mirrors the prototype's `ringFn`.
 */
export function ringFade(hex: string): (t: number) => string {
  return (t: number) => hexWithAlpha(hex, (1 - t) * 0.9);
}
