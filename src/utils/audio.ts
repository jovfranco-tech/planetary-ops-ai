/**
 * Lightweight Web Audio API wrapper to synthesize UI sounds.
 * Avoids the need for downloading/bundling MP3 files and allows instant
 * reaction times and dynamic generation.
 */

let audioCtx: AudioContext | null = null;

function getContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/** Soft, high-pitched, extremely short sine wave for button hovers. */
export function playHover() {
  const ctx = getContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
  
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.05);
}

/** Crisp UI click sound. */
export function playClick() {
  const ctx = getContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);
}

/** Dual-tone pulsing alert sound for Red Alert scenarios. */
export function playAlert() {
  const ctx = getContext();
  if (!ctx) return;
  
  const now = ctx.currentTime;
  const dur = 1.0; // 1 second duration
  
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc1.type = "sawtooth";
  osc2.type = "square";
  
  // Wailing effect
  osc1.frequency.setValueAtTime(220, now);
  osc1.frequency.linearRampToValueAtTime(440, now + 0.5);
  osc1.frequency.linearRampToValueAtTime(220, now + dur);
  
  osc2.frequency.setValueAtTime(224, now); // slightly detuned
  osc2.frequency.linearRampToValueAtTime(444, now + 0.5);
  osc2.frequency.linearRampToValueAtTime(224, now + dur);

  // Fade in/out to avoid popping
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
  gain.gain.linearRampToValueAtTime(0.15, now + 0.8);
  gain.gain.linearRampToValueAtTime(0, now + dur);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);
  
  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + dur);
  osc2.stop(now + dur);
}
