// ============================================================
// TAMVAI API – Lenguaje Soberano de Interfaz v1.0
// IDL propietario del ecosistema TAMV / CITEMESH
// ============================================================

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// Guardianes de seguridad
export type SecurityTag = "ANUBIS" | "DEKATEOTL" | "AZTEK_GODS";

// Radares de monitoreo
export type MonitoringTag =
  | "HORUS"
  | "RADAR_QUETZALCOATL"
  | "RADAR_OJO_DE_RA"
  | "RADAR_GEMELOS_MOS";

// Plan de emergencia
export type EmergencyPlan = "NONE" | "READ_ONLY" | "FULL_LOCKDOWN";

// ============================
// Recurso lógico
// ============================
export interface TamvaiField {
  type: string;
  optional?: boolean;
  description?: string;
}

export interface TamvaiResource {
  id: string;
  description: string;
  fields: Record<string, TamvaiField>;
}

// ============================
// Auditoría integrada
// ============================
export interface TamvaiAuditConfig {
  logPayload: boolean;
  redactedFields: string[];
  emergencyPlan: EmergencyPlan;
}

// ============================
// Operación civilizatoria
// ============================
export interface TamvaiOperation {
  id: string;
  method: HttpMethod;
  path: string;
  resource: string;
  input: Record<string, string>;
  output: Record<string, string>;
  auth: {
    required: boolean;
    scope?: "user" | "guardian" | "service" | "admin" | "creator";
  };
  securityTags: SecurityTag[];
  monitoringTags: MonitoringTag[];
  audit?: TamvaiAuditConfig;
  description?: string;
}

// ============================
// Dominio civilizatorio
// ============================
export interface TamvaiDomain {
  id: string;
  description: string;
  resources: TamvaiResource[];
  operations: TamvaiOperation[];
}

// ============================
// Especificación completa
// ============================
export interface TamvaiSpec {
  version: string;
  name: string;
  description: string;
  domains: TamvaiDomain[];
}

// ============================
// Runtime context
// ============================
export interface TamvaiContext {
  user?: {
    id: string;
    roles: string[];
    trustLevel: number;
  };
  req: Request;
  timestamp: number;
  sessionId: string;
}

// ============================
// HRO Types (CITEMESH)
// ============================
export type PipelineType = "HFP" | "LLP" | "SAFE";
export type QualityLevel = "Q0" | "Q1" | "Q2" | "Q3";

export interface DeviceProfile {
  id: string;
  class: "desktop" | "mobile" | "xr";
  gpuTier: "low" | "mid" | "high";
  batteryPowered: boolean;
}

export interface RenderProfile {
  pipeline: PipelineType;
  quality: QualityLevel;
  overrides?: Record<string, unknown>;
}

export interface RenderMetrics {
  clientId: string;
  fpsAvg: number;
  fpsMin: number;
  frameTimeMsAvg: number;
  gpuUsagePct: number;
  cpuUsagePct: number;
  temperatureC: number;
  batteryPct: number | null;
  rttMs: number;
  lastProfile: RenderProfile;
  timestamp: number;
}
