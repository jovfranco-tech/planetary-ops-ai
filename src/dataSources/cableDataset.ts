export interface CuratedCableRoute {
  id: string;
  name: string;
  routeType: string;
  landingRegions: string[];
  approximateCoordinates: Array<[number, number]>;
  criticality: "High" | "Medium" | "Critical";
  status: "nominal" | "degraded" | "critical" | "unavailable";
  attribution: string;
}

export const CURATED_CABLES: CuratedCableRoute[] = [
  {
    id: "cable-latam-us",
    name: "LATAM-US (AMX-1)",
    routeType: "Submarine Fiber Backbone",
    landingRegions: ["Miami, US", "Barranquilla, Colombia", "Cancun, Mexico", "Fortaleza, Brazil"],
    approximateCoordinates: [[25.76, -80.19], [10.96, -74.79], [21.16, -86.85], [-3.73, -38.52]],
    criticality: "Critical",
    status: "nominal",
    attribution: "Curated demo route inspired by public submarine cable maps; not an authoritative cable map."
  },
  {
    id: "cable-brazil-us",
    name: "Brazil-US (Seabras-1)",
    routeType: "Submarine Fiber Backbone",
    landingRegions: ["New York, US", "Fortaleza, Brazil", "Sao Paulo, Brazil"],
    approximateCoordinates: [[40.71, -74.00], [-3.73, -38.52], [-23.55, -46.63]],
    criticality: "High",
    status: "nominal",
    attribution: "Curated demo route inspired by public submarine cable maps; not an authoritative cable map."
  },
  {
    id: "cable-us-europe",
    name: "US-Europe Transatlantic (TAT-14 / Marea)",
    routeType: "Submarine Fiber Backbone",
    landingRegions: ["Virginia Beach, US", "Bilbao, Spain", "Bude, UK"],
    approximateCoordinates: [[36.85, -75.97], [43.26, -2.93], [50.82, -4.54]],
    criticality: "Critical",
    status: "nominal",
    attribution: "Curated demo route inspired by public submarine cable maps; not an authoritative cable map."
  },
  {
    id: "cable-europe-india-apac",
    name: "Europe-India-APAC (SEA-ME-WE 5)",
    routeType: "Submarine Fiber Backbone",
    landingRegions: ["Marseille, France", "Mumbai, India", "Singapore"],
    approximateCoordinates: [[43.29, 5.36], [19.07, 72.87], [1.35, 103.82]],
    criticality: "Critical",
    status: "nominal",
    attribution: "Curated demo route inspired by public submarine cable maps; not an authoritative cable map."
  },
  {
    id: "cable-mexico-us",
    name: "Mexico-US Terrestrial Backbone",
    routeType: "Terrestrial Fiber Link",
    landingRegions: ["Dallas, US", "Monterrey, Mexico", "Mexico City, Mexico"],
    approximateCoordinates: [[32.78, -96.80], [25.68, -100.31], [19.43, -99.13]],
    criticality: "Medium",
    status: "nominal",
    attribution: "Curated demo route inspired by public submarine cable maps; not an authoritative cable map."
  }
];
