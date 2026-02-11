// ============================================================
// TAMVAI Runtime – Security, Monitoring, Audit
// Client-side enforcement and telemetry
// ============================================================

import type {
  TamvaiOperation,
  SecurityTag,
  MonitoringTag,
} from "./core";
import { TAMVAI_SPEC, getDomainStats } from "./spec";

// ============================
// Security Runtime (Anubis/Dekateotl)
// ============================
export interface SecurityResult {
  allowed: boolean;
  reason?: string;
  tags: SecurityTag[];
}

export function evaluateSecurity(
  op: TamvaiOperation,
  userRoles: string[],
  trustLevel: number
): SecurityResult {
  const tags = op.securityTags;

  // ANUBIS: basic auth check
  if (tags.includes("ANUBIS") && op.auth.required && !userRoles.length) {
    return { allowed: false, reason: "Autenticación requerida", tags };
  }

  // DEKATEOTL: scope/role check
  if (tags.includes("DEKATEOTL") && op.auth.scope) {
    const scopeMap: Record<string, string[]> = {
      user: ["user", "creator", "moderator", "admin", "guardian"],
      creator: ["creator", "admin", "guardian"],
      guardian: ["guardian", "admin"],
      admin: ["admin"],
      service: ["admin"],
    };
    const allowed = scopeMap[op.auth.scope] || [];
    if (!userRoles.some((r) => allowed.includes(r))) {
      return { allowed: false, reason: `Scope ${op.auth.scope} requerido`, tags };
    }
  }

  // AZTEK_GODS: high-trust check
  if (tags.includes("AZTEK_GODS") && trustLevel < 50) {
    return { allowed: false, reason: "Trust level insuficiente para operación crítica", tags };
  }

  return { allowed: true, tags };
}

// ============================
// Monitoring Runtime (Radares)
// ============================
export interface MonitoringEvent {
  operationId: string;
  tags: MonitoringTag[];
  timestamp: number;
  duration?: number;
  statusCode?: number;
  metadata?: Record<string, unknown>;
}

const monitoringBuffer: MonitoringEvent[] = [];

export function recordMonitoringEvent(event: MonitoringEvent) {
  monitoringBuffer.push(event);

  // Keep buffer bounded
  if (monitoringBuffer.length > 1000) {
    monitoringBuffer.splice(0, 500);
  }
}

export function getMonitoringEvents(limit = 50): MonitoringEvent[] {
  return monitoringBuffer.slice(-limit);
}

export function getMonitoringStats() {
  const total = monitoringBuffer.length;
  const byTag: Record<string, number> = {};
  const byOp: Record<string, number> = {};

  for (const e of monitoringBuffer) {
    for (const tag of e.tags) {
      byTag[tag] = (byTag[tag] || 0) + 1;
    }
    byOp[e.operationId] = (byOp[e.operationId] || 0) + 1;
  }

  return { total, byTag, byOp };
}

// ============================
// Audit Runtime
// ============================
export interface AuditEntry {
  operationId: string;
  timestamp: number;
  userId?: string;
  payload?: Record<string, unknown>;
  emergencyPlan: string;
}

const auditLog: AuditEntry[] = [];
let emergencyModeActive = false;

export function logAudit(entry: AuditEntry) {
  auditLog.push(entry);
}

export function getAuditLog(limit = 50): AuditEntry[] {
  return auditLog.slice(-limit);
}

export function isEmergencyModeActive(): boolean {
  return emergencyModeActive;
}

export function setEmergencyMode(active: boolean) {
  emergencyModeActive = active;
}

// ============================
// Sovereignty Validator
// ============================
export interface IntegrationCallLog {
  path: string;
  method: string;
  body?: Record<string, unknown>;
}

export function validateSovereignty(
  logs: IntegrationCallLog[]
): string[] {
  const errors: string[] = [];

  for (const call of logs) {
    let found = false;
    for (const domain of TAMVAI_SPEC.domains) {
      const op = domain.operations.find(
        (o) => o.path === call.path && o.method === call.method
      );
      if (op) {
        found = true;
        // Validate required input fields
        const requiredFields = Object.keys(op.input);
        if (call.body) {
          const missing = requiredFields.filter(
            (f) => !(f in (call.body || {}))
          );
          if (missing.length) {
            errors.push(
              `Op ${op.id}: campos faltantes: ${missing.join(", ")}`
            );
          }
        }
        break;
      }
    }
    if (!found) {
      errors.push(
        `${call.method} ${call.path} no existe en TAMVAI Spec`
      );
    }
  }

  return errors;
}

// ============================
// Platform Stats
// ============================
export function getTamvaiPlatformStats() {
  const domainStats = getDomainStats(TAMVAI_SPEC);
  const totalOps = domainStats.reduce((s, d) => s + d.operationCount, 0);
  const totalResources = domainStats.reduce((s, d) => s + d.resourceCount, 0);
  const totalAudited = domainStats.reduce((s, d) => s + d.auditedOperations, 0);

  return {
    version: TAMVAI_SPEC.version,
    domains: domainStats.length,
    totalOperations: totalOps,
    totalResources,
    auditedOperations: totalAudited,
    securityCoverage: `${Math.round(
      (domainStats.reduce((s, d) => s + d.securityCoverage, 0) / totalOps) * 100
    )}%`,
    domainStats,
    emergencyMode: emergencyModeActive,
    monitoringEvents: monitoringBuffer.length,
  };
}
