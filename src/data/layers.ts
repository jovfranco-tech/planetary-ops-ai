import type { InfrastructureLayer } from "../types/domain";

export const LAYERS: InfrastructureLayer[] = [
  {
    id: "space",
    glyph: "◦",
    color: "#8b9bff",
    name: { en: "Space Infrastructure", es: "Infraestructura espacial" },
    desc: {
      en: "Satellites · orbital coverage · degradation signals",
      es: "Satélites · cobertura orbital · señales de degradación",
    },
  },
  {
    id: "backbone",
    glyph: "≋",
    color: "#36d6e7",
    name: { en: "Internet Backbone", es: "Backbone de Internet" },
    desc: {
      en: "Submarine cables · landing points · latency exposure",
      es: "Cables submarinos · puntos de aterrizaje · latencia",
    },
  },
  {
    id: "cloud",
    glyph: "▦",
    color: "#5b8cff",
    name: { en: "Cloud & Data", es: "Nube y datos" },
    desc: {
      en: "Cloud regions · data centers · edge · redundancy",
      es: "Regiones cloud · centros de datos · edge · redundancia",
    },
  },
  {
    id: "enterprise",
    glyph: "◈",
    color: "#7ee0c0",
    name: { en: "Enterprise Dependencies", es: "Dependencias empresariales" },
    desc: {
      en: "Regional hubs · critical business services",
      es: "Hubs regionales · servicios críticos de negocio",
    },
  },
  {
    id: "cyber",
    glyph: "⛒",
    color: "#ff5d6c",
    name: { en: "Cyber Risk", es: "Riesgo cibernético" },
    desc: {
      en: "Identity · ransomware blast radius · SOC dependency",
      es: "Identidad · radio de ransomware · dependencia SOC",
    },
  },
  {
    id: "continuity",
    glyph: "⟳",
    color: "#f6b13e",
    name: { en: "Continuity & DR", es: "Continuidad y DR" },
    desc: {
      en: "RTO/RPO · failover paths · recovery maturity",
      es: "RTO/RPO · rutas de failover · madurez de recuperación",
    },
  },
  {
    id: "ai",
    glyph: "✦",
    color: "#b388ff",
    name: { en: "AI Services Resilience", es: "Resiliencia de servicios de IA" },
    desc: {
      en: "Provider concentration · model fallback · governance",
      es: "Concentración de proveedores · fallback de modelos · gobierno",
    },
  },
];

export const ALL_LAYER_IDS = LAYERS.map((l) => l.id);
