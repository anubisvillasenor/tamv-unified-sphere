import { useEffect, useMemo } from "react";
import {
  Shield,
  AlertTriangle,
  Gavel,
  UserCheck,
  Brain,
  Crown,
  ExternalLink,
} from "lucide-react";
import { useIsabella } from "@/hooks/useIsabella";
import { useNavigate } from "react-router-dom";

/**
 * Barra de estado civilizatoria – TAMV
 * Órgano institucional persistente
 */

export const CivilizationStatusBar = () => {
  const { meta } = useIsabella();
  const navigate = useNavigate();

  // Fallback defensivo
  const safeMeta = meta ?? {
    sessionId: "genesis",
    conversationHash: "000000",
    ethicalState: "normal",
    riskLevel: "low",
    layer: "COGNITIVE",
    governanceFlag: "none",
    hitlRequired: false,
    aignScore: 100,
    isCreator: false,
  };

  // Activar modo HITL global
  useEffect(() => {
    const root = document.documentElement;
    if (safeMeta.hitlRequired) {
      root.classList.add("hitl-active");
    } else {
      root.classList.remove("hitl-active");
    }
    return () => root.classList.remove("hitl-active");
  }, [safeMeta.hitlRequired]);

  const aignClass = useMemo(() => {
    const score = safeMeta.aignScore ?? 100;
    if (score > 85) return "aign-high";
    if (score > 65) return "aign-medium";
    return "aign-low";
  }, [safeMeta.aignScore]);

  const ethicalClass =
    safeMeta.ethicalState === "critical"
      ? "state-critical"
      : safeMeta.ethicalState === "sensitive"
      ? "state-warning"
      : "state-ok";

  const riskClass =
    safeMeta.riskLevel === "high"
      ? "state-critical"
      : safeMeta.riskLevel === "medium"
      ? "state-warning"
      : "state-ok";

  const roleClass = safeMeta.isCreator
    ? "role-creator"
    : safeMeta.hitlRequired
    ? "role-guardian"
    : "role-citizen";

  const shortSession =
    safeMeta.sessionId?.slice?.(0, 6) ?? "000000";

  return (
    <section
      className={`w-full border-b border-[var(--tamv-border)] bg-[var(--tamv-bg-elevated)]/95 backdrop-blur-md ${roleClass}`}
      aria-label="Estado civilizatorio TAMV"
    >
      <div className="container mx-auto px-3 py-2 text-xs flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        {/* Identidad del sistema */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[var(--tamv-primary-soft)] flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-[var(--tamv-primary)]" />
          </div>

          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold">Isabella Villaseñor</span>
              {safeMeta.isCreator && (
                <span
                  title="Creador del sistema"
                  className="flex items-center gap-1 text-[0.6rem] text-purple-400"
                >
                  <Crown className="w-3 h-3" />
                  CREATOR
                </span>
              )}
              <span className="heading-small ml-1">TAMV</span>
            </div>

            <div className="text-muted text-[0.65rem]">
              Sesión {shortSession} · Hash {safeMeta.conversationHash}
            </div>
          </div>
        </div>

        {/* Estados centrales */}
        <div className="flex flex-wrap items-center gap-2 md:justify-center">
          <span className={`layer-pill layer-pill--${safeMeta.layer}`}>
            {safeMeta.layer}
          </span>

          <span className="badge-state badge-state-ok flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span className={ethicalClass}>
              Ética: {safeMeta.ethicalState}
            </span>
          </span>

          <span className="badge-state badge-state-warning flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span className={riskClass}>
              Riesgo: {safeMeta.riskLevel}
            </span>
          </span>

          <span className="badge-state flex items-center gap-1">
            <Gavel className="w-3 h-3" />
            Gobernanza: {safeMeta.governanceFlag}
          </span>
        </div>

        {/* HITL + AIGN */}
        <div className="flex items-center gap-3 md:justify-end">
          <div
            className={`badge-state ${
              safeMeta.hitlRequired
                ? "badge-state-critical"
                : "badge-state-ok"
            } flex items-center gap-1`}
          >
            <UserCheck className="w-3 h-3" />
            {safeMeta.hitlRequired ? "HITL: REQUERIDO" : "HITL: no"}
          </div>

          <div className="flex items-center gap-1">
            <span className="heading-small">AIGN</span>
            <span className={`aign-score ${aignClass}`}>
              {safeMeta.aignScore ?? 100}
            </span>
          </div>

          {safeMeta.hitlRequired && (
            <button
              onClick={() => navigate("/guardian")}
              className="ml-2 flex items-center gap-1 text-[0.65rem] text-amber-400 hover:underline"
            >
              consola guardián
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Banner HITL */}
      {safeMeta.hitlRequired && (
        <div className="hitl-banner text-[0.7rem] px-3 py-1 text-center">
          Isabella ha detenido la automatización.  
          Esta sesión requiere revisión humana certificada.
        </div>
      )}
    </section>
  );
};
