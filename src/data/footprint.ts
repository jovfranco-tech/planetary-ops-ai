/**
 * Simulated multinational enterprise footprint.
 * No real company locations or sensitive operational data are used.
 */

export type MarketTier = 'hub' | 'critical_market' | 'country_presence' | 'support_market';
export type DependencyProfile = 'cloud' | 'ai' | 'internet' | 'identity' | 'analytics' | 'customer_support';
export type MarketStatus = 'nominal' | 'degraded' | 'affected' | 'failover';

export interface SimulatedMarket {
  countryName: string;
  region: string;
  lat: number;
  lng: number;
  marketTier: MarketTier;
  operationalWeight: number;
  dependencyProfile: DependencyProfile;
  status: MarketStatus;
}

export interface SimulatedHub extends SimulatedMarket {
  id: string;
  name: string;
}

export const SIMULATED_HUBS: SimulatedHub[] = [
  {
    "id": "hub-na",
    "name": "North America Hub",
    "countryName": "North America Hub",
    "lat": 41.8781,
    "lng": -87.6298,
    "region": "North America",
    "marketTier": "hub",
    "dependencyProfile": "cloud",
    "status": "nominal",
    "operationalWeight": 1000
  },
  {
    "id": "hub-mex",
    "name": "Mexico Operations",
    "countryName": "Mexico Operations",
    "lat": 19.4326,
    "lng": -99.1332,
    "region": "LATAM",
    "marketTier": "hub",
    "dependencyProfile": "cloud",
    "status": "nominal",
    "operationalWeight": 800
  },
  {
    "id": "hub-sao",
    "name": "São Paulo LATAM Hub",
    "countryName": "São Paulo LATAM Hub",
    "lat": -23.5505,
    "lng": -46.6333,
    "region": "LATAM",
    "marketTier": "hub",
    "dependencyProfile": "analytics",
    "status": "nominal",
    "operationalWeight": 900
  },
  {
    "id": "hub-eu",
    "name": "Frankfurt EU Hub",
    "countryName": "Frankfurt EU Hub",
    "lat": 50.1109,
    "lng": 8.6821,
    "region": "Europe",
    "marketTier": "hub",
    "dependencyProfile": "cloud",
    "status": "nominal",
    "operationalWeight": 950
  },
  {
    "id": "hub-lon",
    "name": "London Risk Office",
    "countryName": "London Risk Office",
    "lat": 51.5074,
    "lng": -0.1278,
    "region": "Europe",
    "marketTier": "hub",
    "dependencyProfile": "identity",
    "status": "nominal",
    "operationalWeight": 900
  },
  {
    "id": "hub-sa",
    "name": "India Technology Center",
    "countryName": "India Technology Center",
    "lat": 19.076,
    "lng": 72.8777,
    "region": "South Asia",
    "marketTier": "hub",
    "dependencyProfile": "ai",
    "status": "nominal",
    "operationalWeight": 850
  },
  {
    "id": "hub-apac",
    "name": "Singapore APAC Hub",
    "countryName": "Singapore APAC Hub",
    "lat": 1.3521,
    "lng": 103.8198,
    "region": "APAC",
    "marketTier": "hub",
    "dependencyProfile": "customer_support",
    "status": "nominal",
    "operationalWeight": 850
  },
  {
    "id": "hub-mea",
    "name": "Middle East & Africa Hub",
    "countryName": "Middle East & Africa Hub",
    "lat": 25.2048,
    "lng": 55.2708,
    "region": "MEA",
    "marketTier": "hub",
    "dependencyProfile": "cloud",
    "status": "nominal",
    "operationalWeight": 750
  }
];

export const SIMULATED_MARKETS: SimulatedMarket[] = [
  {
    "countryName": "Simulated Market North America-0",
    "region": "North America",
    "lat": 44.4061,
    "lng": -86.4997,
    "marketTier": "support_market",
    "operationalWeight": 61,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market North America-1",
    "region": "North America",
    "lat": 43.1736,
    "lng": -118.4359,
    "marketTier": "country_presence",
    "operationalWeight": 47,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market North America-2",
    "region": "North America",
    "lat": 42.1237,
    "lng": -83.2382,
    "marketTier": "country_presence",
    "operationalWeight": 34,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market LATAM-0",
    "region": "LATAM",
    "lat": -29.7586,
    "lng": -58.5633,
    "marketTier": "support_market",
    "operationalWeight": 80,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market LATAM-1",
    "region": "LATAM",
    "lat": -31.4676,
    "lng": -70.3333,
    "marketTier": "country_presence",
    "operationalWeight": 72,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market LATAM-2",
    "region": "LATAM",
    "lat": -37.1346,
    "lng": -79.4621,
    "marketTier": "country_presence",
    "operationalWeight": 48,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market LATAM-3",
    "region": "LATAM",
    "lat": 18.8432,
    "lng": -45.2938,
    "marketTier": "country_presence",
    "operationalWeight": 39,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market LATAM-4",
    "region": "LATAM",
    "lat": 7.5334,
    "lng": -54.3937,
    "marketTier": "critical_market",
    "operationalWeight": 43,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market LATAM-5",
    "region": "LATAM",
    "lat": -23.7933,
    "lng": -60.7665,
    "marketTier": "country_presence",
    "operationalWeight": 79,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market LATAM-6",
    "region": "LATAM",
    "lat": -11.8479,
    "lng": -54.3667,
    "marketTier": "country_presence",
    "operationalWeight": 43,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market LATAM-7",
    "region": "LATAM",
    "lat": 3.6154,
    "lng": -73.8534,
    "marketTier": "support_market",
    "operationalWeight": 58,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market LATAM-8",
    "region": "LATAM",
    "lat": 9.8954,
    "lng": -74.9594,
    "marketTier": "critical_market",
    "operationalWeight": 66,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market LATAM-9",
    "region": "LATAM",
    "lat": -39.7848,
    "lng": -57.0464,
    "marketTier": "country_presence",
    "operationalWeight": 89,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market LATAM-10",
    "region": "LATAM",
    "lat": -29.2195,
    "lng": -70.0995,
    "marketTier": "country_presence",
    "operationalWeight": 12,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market LATAM-11",
    "region": "LATAM",
    "lat": -1.5559,
    "lng": -57.0684,
    "marketTier": "country_presence",
    "operationalWeight": 82,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market LATAM-12",
    "region": "LATAM",
    "lat": -27.6268,
    "lng": -46.7979,
    "marketTier": "critical_market",
    "operationalWeight": 18,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market LATAM-13",
    "region": "LATAM",
    "lat": -16.7489,
    "lng": -41.1329,
    "marketTier": "country_presence",
    "operationalWeight": 93,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market LATAM-14",
    "region": "LATAM",
    "lat": 14.8071,
    "lng": -70.085,
    "marketTier": "support_market",
    "operationalWeight": 94,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market LATAM-15",
    "region": "LATAM",
    "lat": -4.4807,
    "lng": -41.9789,
    "marketTier": "country_presence",
    "operationalWeight": 84,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market LATAM-16",
    "region": "LATAM",
    "lat": -22.0576,
    "lng": -53.172,
    "marketTier": "critical_market",
    "operationalWeight": 74,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market LATAM-17",
    "region": "LATAM",
    "lat": 5.0933,
    "lng": -44.4509,
    "marketTier": "country_presence",
    "operationalWeight": 27,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market LATAM-18",
    "region": "LATAM",
    "lat": -4.038,
    "lng": -66.9976,
    "marketTier": "country_presence",
    "operationalWeight": 71,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market LATAM-19",
    "region": "LATAM",
    "lat": 11.3589,
    "lng": -74.4255,
    "marketTier": "country_presence",
    "operationalWeight": 52,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-0",
    "region": "Europe",
    "lat": 50.8268,
    "lng": 27.0515,
    "marketTier": "support_market",
    "operationalWeight": 63,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-1",
    "region": "Europe",
    "lat": 56.093,
    "lng": 16.3203,
    "marketTier": "country_presence",
    "operationalWeight": 30,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-2",
    "region": "Europe",
    "lat": 57.141,
    "lng": 26.539,
    "marketTier": "country_presence",
    "operationalWeight": 41,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-3",
    "region": "Europe",
    "lat": 44.1334,
    "lng": 28.6769,
    "marketTier": "country_presence",
    "operationalWeight": 51,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-4",
    "region": "Europe",
    "lat": 48.115,
    "lng": -6.5532,
    "marketTier": "critical_market",
    "operationalWeight": 81,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-5",
    "region": "Europe",
    "lat": 48.2228,
    "lng": -8.5667,
    "marketTier": "country_presence",
    "operationalWeight": 97,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-6",
    "region": "Europe",
    "lat": 42.7471,
    "lng": 9.6032,
    "marketTier": "country_presence",
    "operationalWeight": 23,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-7",
    "region": "Europe",
    "lat": 40.0068,
    "lng": 27.6809,
    "marketTier": "support_market",
    "operationalWeight": 28,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-8",
    "region": "Europe",
    "lat": 43.5237,
    "lng": 10.1376,
    "marketTier": "critical_market",
    "operationalWeight": 35,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-9",
    "region": "Europe",
    "lat": 36.4235,
    "lng": 20.1467,
    "marketTier": "country_presence",
    "operationalWeight": 55,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-10",
    "region": "Europe",
    "lat": 57.8665,
    "lng": 17.6478,
    "marketTier": "country_presence",
    "operationalWeight": 28,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-11",
    "region": "Europe",
    "lat": 45.8943,
    "lng": 5.811,
    "marketTier": "country_presence",
    "operationalWeight": 87,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-12",
    "region": "Europe",
    "lat": 44.1219,
    "lng": 14.6044,
    "marketTier": "critical_market",
    "operationalWeight": 14,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-13",
    "region": "Europe",
    "lat": 47.5605,
    "lng": 5.4554,
    "marketTier": "country_presence",
    "operationalWeight": 48,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-14",
    "region": "Europe",
    "lat": 42.3495,
    "lng": 3.9358,
    "marketTier": "support_market",
    "operationalWeight": 81,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-15",
    "region": "Europe",
    "lat": 47.1213,
    "lng": 11.8512,
    "marketTier": "country_presence",
    "operationalWeight": 10,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-16",
    "region": "Europe",
    "lat": 54.6327,
    "lng": -3.0325,
    "marketTier": "critical_market",
    "operationalWeight": 51,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-17",
    "region": "Europe",
    "lat": 41.4605,
    "lng": 23.3426,
    "marketTier": "country_presence",
    "operationalWeight": 82,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-18",
    "region": "Europe",
    "lat": 50.6871,
    "lng": 15.4102,
    "marketTier": "country_presence",
    "operationalWeight": 60,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-19",
    "region": "Europe",
    "lat": 51.4447,
    "lng": -5.1715,
    "marketTier": "country_presence",
    "operationalWeight": 88,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-20",
    "region": "Europe",
    "lat": 36.6826,
    "lng": 7.4017,
    "marketTier": "critical_market",
    "operationalWeight": 72,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-21",
    "region": "Europe",
    "lat": 48.6289,
    "lng": -1.7095,
    "marketTier": "support_market",
    "operationalWeight": 29,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-22",
    "region": "Europe",
    "lat": 43.8177,
    "lng": 23.0132,
    "marketTier": "country_presence",
    "operationalWeight": 50,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-23",
    "region": "Europe",
    "lat": 42.0298,
    "lng": 4.9499,
    "marketTier": "country_presence",
    "operationalWeight": 54,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-24",
    "region": "Europe",
    "lat": 37.5312,
    "lng": 28.4909,
    "marketTier": "critical_market",
    "operationalWeight": 22,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-25",
    "region": "Europe",
    "lat": 45.9885,
    "lng": 26.0296,
    "marketTier": "country_presence",
    "operationalWeight": 80,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-26",
    "region": "Europe",
    "lat": 42.441,
    "lng": 21.8014,
    "marketTier": "country_presence",
    "operationalWeight": 14,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-27",
    "region": "Europe",
    "lat": 56.8582,
    "lng": -6.5298,
    "marketTier": "country_presence",
    "operationalWeight": 86,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-28",
    "region": "Europe",
    "lat": 43.571,
    "lng": -6.0468,
    "marketTier": "support_market",
    "operationalWeight": 35,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-29",
    "region": "Europe",
    "lat": 53.4113,
    "lng": 6.1582,
    "marketTier": "country_presence",
    "operationalWeight": 36,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-30",
    "region": "Europe",
    "lat": 36.3244,
    "lng": 25.5494,
    "marketTier": "country_presence",
    "operationalWeight": 52,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-31",
    "region": "Europe",
    "lat": 49.5224,
    "lng": 29.3266,
    "marketTier": "country_presence",
    "operationalWeight": 70,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-32",
    "region": "Europe",
    "lat": 56.3431,
    "lng": 16.9121,
    "marketTier": "critical_market",
    "operationalWeight": 10,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-33",
    "region": "Europe",
    "lat": 41.8986,
    "lng": -6.8504,
    "marketTier": "country_presence",
    "operationalWeight": 49,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market Europe-34",
    "region": "Europe",
    "lat": 58.8712,
    "lng": 11.1411,
    "marketTier": "country_presence",
    "operationalWeight": 50,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-0",
    "region": "MEA",
    "lat": 15.2956,
    "lng": 17.4952,
    "marketTier": "support_market",
    "operationalWeight": 24,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-1",
    "region": "MEA",
    "lat": 17.2854,
    "lng": 26.6461,
    "marketTier": "country_presence",
    "operationalWeight": 13,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-2",
    "region": "MEA",
    "lat": 1.5029,
    "lng": 13.358,
    "marketTier": "country_presence",
    "operationalWeight": 84,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-3",
    "region": "MEA",
    "lat": 11.1545,
    "lng": 42.0198,
    "marketTier": "country_presence",
    "operationalWeight": 31,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-4",
    "region": "MEA",
    "lat": 2.4234,
    "lng": 12.2231,
    "marketTier": "critical_market",
    "operationalWeight": 36,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-5",
    "region": "MEA",
    "lat": 5.8598,
    "lng": 43.6571,
    "marketTier": "country_presence",
    "operationalWeight": 93,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-6",
    "region": "MEA",
    "lat": -24.4667,
    "lng": 23.9543,
    "marketTier": "country_presence",
    "operationalWeight": 87,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-7",
    "region": "MEA",
    "lat": 5.6448,
    "lng": 46.5527,
    "marketTier": "support_market",
    "operationalWeight": 55,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-8",
    "region": "MEA",
    "lat": 17.4261,
    "lng": 41.282,
    "marketTier": "critical_market",
    "operationalWeight": 72,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-9",
    "region": "MEA",
    "lat": 11.3426,
    "lng": 45.8052,
    "marketTier": "country_presence",
    "operationalWeight": 97,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-10",
    "region": "MEA",
    "lat": 21.237,
    "lng": 21.455,
    "marketTier": "country_presence",
    "operationalWeight": 46,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-11",
    "region": "MEA",
    "lat": -17.5445,
    "lng": 29.9434,
    "marketTier": "country_presence",
    "operationalWeight": 50,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-12",
    "region": "MEA",
    "lat": -20.7604,
    "lng": 48.3819,
    "marketTier": "critical_market",
    "operationalWeight": 38,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-13",
    "region": "MEA",
    "lat": 25.7309,
    "lng": 22.8658,
    "marketTier": "country_presence",
    "operationalWeight": 79,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-14",
    "region": "MEA",
    "lat": 29.4393,
    "lng": 45.2249,
    "marketTier": "support_market",
    "operationalWeight": 89,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-15",
    "region": "MEA",
    "lat": -3.2991,
    "lng": 36.2858,
    "marketTier": "country_presence",
    "operationalWeight": 51,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-16",
    "region": "MEA",
    "lat": -15.8312,
    "lng": 26.4158,
    "marketTier": "critical_market",
    "operationalWeight": 31,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-17",
    "region": "MEA",
    "lat": -9.4303,
    "lng": 42.9813,
    "marketTier": "country_presence",
    "operationalWeight": 47,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-18",
    "region": "MEA",
    "lat": 16.4864,
    "lng": 34.014,
    "marketTier": "country_presence",
    "operationalWeight": 91,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-19",
    "region": "MEA",
    "lat": 21.7333,
    "lng": 43.4141,
    "marketTier": "country_presence",
    "operationalWeight": 33,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-20",
    "region": "MEA",
    "lat": 0.3303,
    "lng": 49.3944,
    "marketTier": "critical_market",
    "operationalWeight": 16,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market MEA-21",
    "region": "MEA",
    "lat": -26.0464,
    "lng": 13.1147,
    "marketTier": "support_market",
    "operationalWeight": 13,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market South Asia-0",
    "region": "South Asia",
    "lat": 27.296,
    "lng": 78.5923,
    "marketTier": "support_market",
    "operationalWeight": 96,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market South Asia-1",
    "region": "South Asia",
    "lat": 12.6807,
    "lng": 89.8338,
    "marketTier": "country_presence",
    "operationalWeight": 15,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market South Asia-2",
    "region": "South Asia",
    "lat": 17.4794,
    "lng": 70.6695,
    "marketTier": "country_presence",
    "operationalWeight": 49,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market South Asia-3",
    "region": "South Asia",
    "lat": 13.3724,
    "lng": 75.2563,
    "marketTier": "country_presence",
    "operationalWeight": 47,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market South Asia-4",
    "region": "South Asia",
    "lat": 16.4996,
    "lng": 83.5909,
    "marketTier": "critical_market",
    "operationalWeight": 47,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market South Asia-5",
    "region": "South Asia",
    "lat": 18.5561,
    "lng": 72.3243,
    "marketTier": "country_presence",
    "operationalWeight": 46,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market South Asia-6",
    "region": "South Asia",
    "lat": 21.857,
    "lng": 65.3723,
    "marketTier": "country_presence",
    "operationalWeight": 93,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-0",
    "region": "APAC",
    "lat": 16.6877,
    "lng": 121.6872,
    "marketTier": "support_market",
    "operationalWeight": 75,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-1",
    "region": "APAC",
    "lat": -7.8597,
    "lng": 139.5884,
    "marketTier": "country_presence",
    "operationalWeight": 86,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-2",
    "region": "APAC",
    "lat": 26.2401,
    "lng": 111.0189,
    "marketTier": "country_presence",
    "operationalWeight": 82,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-3",
    "region": "APAC",
    "lat": 35.4314,
    "lng": 100.2846,
    "marketTier": "country_presence",
    "operationalWeight": 71,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-4",
    "region": "APAC",
    "lat": -2.4248,
    "lng": 116.407,
    "marketTier": "critical_market",
    "operationalWeight": 83,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-5",
    "region": "APAC",
    "lat": -22.5117,
    "lng": 101.5954,
    "marketTier": "country_presence",
    "operationalWeight": 45,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-6",
    "region": "APAC",
    "lat": -7.9043,
    "lng": 145.1571,
    "marketTier": "country_presence",
    "operationalWeight": 60,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-7",
    "region": "APAC",
    "lat": -33.7603,
    "lng": 119.3701,
    "marketTier": "support_market",
    "operationalWeight": 57,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-8",
    "region": "APAC",
    "lat": 28.0584,
    "lng": 143.2156,
    "marketTier": "critical_market",
    "operationalWeight": 22,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-9",
    "region": "APAC",
    "lat": -5.8358,
    "lng": 134.2002,
    "marketTier": "country_presence",
    "operationalWeight": 74,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-10",
    "region": "APAC",
    "lat": -0.8417,
    "lng": 148.3803,
    "marketTier": "country_presence",
    "operationalWeight": 10,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-11",
    "region": "APAC",
    "lat": -11.5986,
    "lng": 112.0897,
    "marketTier": "country_presence",
    "operationalWeight": 77,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-12",
    "region": "APAC",
    "lat": -21.5187,
    "lng": 149.2926,
    "marketTier": "critical_market",
    "operationalWeight": 93,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-13",
    "region": "APAC",
    "lat": 5.5914,
    "lng": 131.3897,
    "marketTier": "country_presence",
    "operationalWeight": 30,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-14",
    "region": "APAC",
    "lat": -3.0992,
    "lng": 111.2547,
    "marketTier": "support_market",
    "operationalWeight": 29,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-15",
    "region": "APAC",
    "lat": 29.0668,
    "lng": 110.7567,
    "marketTier": "country_presence",
    "operationalWeight": 50,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-16",
    "region": "APAC",
    "lat": 37.5248,
    "lng": 144.2475,
    "marketTier": "critical_market",
    "operationalWeight": 78,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-17",
    "region": "APAC",
    "lat": 22.2258,
    "lng": 144.7142,
    "marketTier": "country_presence",
    "operationalWeight": 43,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-18",
    "region": "APAC",
    "lat": 4.6679,
    "lng": 127.1999,
    "marketTier": "country_presence",
    "operationalWeight": 54,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-19",
    "region": "APAC",
    "lat": 35.7638,
    "lng": 115.1487,
    "marketTier": "country_presence",
    "operationalWeight": 18,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-20",
    "region": "APAC",
    "lat": 21.9318,
    "lng": 143.7496,
    "marketTier": "critical_market",
    "operationalWeight": 98,
    "dependencyProfile": "identity",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-21",
    "region": "APAC",
    "lat": 24.3403,
    "lng": 129.4329,
    "marketTier": "support_market",
    "operationalWeight": 52,
    "dependencyProfile": "ai",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-22",
    "region": "APAC",
    "lat": -31.1902,
    "lng": 147.7553,
    "marketTier": "country_presence",
    "operationalWeight": 24,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-23",
    "region": "APAC",
    "lat": 6.4593,
    "lng": 128.9497,
    "marketTier": "country_presence",
    "operationalWeight": 55,
    "dependencyProfile": "cloud",
    "status": "nominal"
  },
  {
    "countryName": "Simulated Market APAC-24",
    "region": "APAC",
    "lat": -20.0741,
    "lng": 149.5024,
    "marketTier": "critical_market",
    "operationalWeight": 11,
    "dependencyProfile": "ai",
    "status": "nominal"
  }
];
