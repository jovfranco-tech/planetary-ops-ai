import type { RealSatellite } from "./types";

interface PropagatedPosition {
  lat: number;
  lng: number;
  altitude: number;
}

/**
 * Propagate a satellite's position at the current time using a simplified orbital model.
 * Uses inclination, mean motion, earth rotation, and epoch.
 */
export function propagateSatellite(sat: RealSatellite): PropagatedPosition {
  // Extract inclination and mean motion from TLE lines if available, otherwise use defaults
  let inclination = 51.64; // Default to ISS-like
  let meanMotion = 15.5;   // Orbits per day (LEO)
  let epochTime = Date.now();

  if (sat.id === "25544") {
    inclination = 51.64;
    meanMotion = 15.54;
  } else if (sat.id === "44713") {
    inclination = 53.05;
    meanMotion = 15.06;
  } else if (sat.id === "40294") {
    inclination = 54.91;
    meanMotion = 2.00; // MEO: 2 orbits per day
  } else if (sat.id === "33591") {
    inclination = 98.71;
    meanMotion = 14.11; // Polar LEO
  }

  // Parse TLE inclination and mean motion if present (optional advanced check)
  if (sat.tleLine2) {
    try {
      // Inclination is in Line 2, characters 9-16
      const incStr = sat.tleLine2.substring(8, 16).trim();
      const parsedInc = parseFloat(incStr);
      if (!isNaN(parsedInc)) inclination = parsedInc;

      // Mean motion is in Line 2, characters 53-63
      const mmStr = sat.tleLine2.substring(52, 63).trim();
      const parsedMM = parseFloat(mmStr);
      if (!isNaN(parsedMM)) meanMotion = parsedMM;
    } catch (e) {
      console.warn("Failed to parse TLE line 2 for propagation", e);
    }
  }

  if (sat.epoch) {
    epochTime = new Date(sat.epoch).getTime();
  }

  const periodMinutes = 1440 / meanMotion;
  const msElapsed = Date.now() - epochTime;
  const minutesElapsed = msElapsed / 60000;

  // Fraction of orbit completed
  const orbitFraction = (minutesElapsed / periodMinutes) % 1;
  const angle = orbitFraction * 2 * Math.PI;

  // Simple circular projection for latitude based on inclination
  const lat = inclination * Math.sin(angle);

  // Longitude combines orbital speed and earth's rotation (0.25 deg/min)
  // Seed initial longitude based on catalog ID to spread satellites
  const seedLng = (parseInt(sat.id || "0") * 71) % 360;
  const orbitalLng = (minutesElapsed * (360 / periodMinutes)) % 360;
  const earthRotation = minutesElapsed * 0.25;
  
  let lng = (seedLng + orbitalLng - earthRotation) % 360;
  if (lng > 180) lng -= 360;
  if (lng < -180) lng += 360;

  // Altitude scaling factor (LEO is lower, MEO like GPS is higher)
  const altitude = meanMotion < 3 ? 0.38 : 0.14; // GPS is high, LEOs are lower

  return { lat, lng, altitude };
}
