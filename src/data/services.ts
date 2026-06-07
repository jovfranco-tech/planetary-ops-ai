import type { Service } from "../types/domain";

export const SERVICES: Service[] = [
  { id: "iam", name: { en: "Identity & Access", es: "Identidad y acceso" } },
  { id: "erp", name: { en: "ERP", es: "ERP" } },
  { id: "crm", name: { en: "CRM", es: "CRM" } },
  { id: "anly", name: { en: "Analytics Platform", es: "Plataforma de analítica" } },
  { id: "collab", name: { en: "Collaboration", es: "Colaboración" } },
  { id: "soc", name: { en: "Security Operations", es: "Operaciones de seguridad" } },
  { id: "aigov", name: { en: "AI Governance", es: "Gobierno de IA" } },
  { id: "data", name: { en: "Data Platform", es: "Plataforma de datos" } },
  { id: "cs", name: { en: "Customer Support", es: "Soporte al cliente" } },
  { id: "dev", name: { en: "Developer Productivity", es: "Productividad de desarrollo" } },
  { id: "exec", name: { en: "Executive Reporting", es: "Reporting ejecutivo" } },
  { id: "im", name: { en: "Incident Management", es: "Gestión de incidentes" } },
];
