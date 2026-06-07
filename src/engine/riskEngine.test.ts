import { describe, it, expect } from 'vitest';
import { globalStatus, derivePosture } from './riskEngine';

describe('Risk Engine', () => {
  it('should calculate global status correctly', () => {
    const base = { degradedRegions: 0, servicesAffected: 0, providersDegraded: 0, rto: { en: "0h", es: "0h" } };
    expect(globalStatus({ ...base, incidents: 0, resilience: 99, continuity: 99, cyberRisk: 10, aiRisk: 10, exposure: { en: "Low", es: "Bajo" } })).toBe('nominal');
    expect(globalStatus({ ...base, incidents: 3, resilience: 99, continuity: 99, cyberRisk: 10, aiRisk: 10, exposure: { en: "High", es: "Alto" } })).toBe('elevated');
    expect(globalStatus({ ...base, incidents: 6, resilience: 50, continuity: 85, cyberRisk: 60, aiRisk: 50, exposure: { en: "Critical", es: "Crítico" } })).toBe('critical');
  });

  it('should derive posture based on scenario', () => {
    const nominalPosture = derivePosture(null);
    expect(nominalPosture.scoreClass).toBe('score-good');
    expect(nominalPosture.labelKey).toBe('nominal');
  });
});
