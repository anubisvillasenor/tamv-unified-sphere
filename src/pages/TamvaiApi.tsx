import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TAMVAI_SPEC, getDomainStats } from "@/tamvai/spec";
import { getTamvaiPlatformStats, getMonitoringStats } from "@/tamvai/runtime";
import type { TamvaiDomain, TamvaiOperation } from "@/tamvai/core";
import {
  Cpu, Shield, Eye, Activity, AlertTriangle, ChevronDown, ChevronRight,
  Lock, Unlock, Zap, Database, Globe, Brain, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DOMAIN_ICONS: Record<string, typeof Cpu> = {
  IDNVIDA: Lock,
  SOCIAL: Globe,
  MESSAGING: Zap,
  ECONOMY: Database,
  COGNITION: Brain,
  XRVERSE: Activity,
  EDUCATION: BookOpen,
  MEMORY: Shield,
  ART: Eye,
  STREAMING: Activity,
};

const SECURITY_COLORS: Record<string, string> = {
  ANUBIS: "bg-primary/20 text-primary border-primary/30",
  DEKATEOTL: "bg-secondary/20 text-secondary border-secondary/30",
  AZTEK_GODS: "bg-destructive/20 text-destructive border-destructive/30",
};

const MONITOR_COLORS: Record<string, string> = {
  HORUS: "bg-primary/10 text-primary",
  RADAR_QUETZALCOATL: "bg-secondary/10 text-secondary",
  RADAR_OJO_DE_RA: "bg-accent/10 text-accent",
  RADAR_GEMELOS_MOS: "bg-destructive/10 text-destructive",
};

const TamvaiPage = () => {
  const stats = getTamvaiPlatformStats();
  const monitoring = getMonitoringStats();
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-12 max-w-6xl">
        {/* Title */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Cpu className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">TAMVAI API</h1>
              <p className="text-xs text-muted-foreground">Lenguaje Soberano de Interfaz v{TAMVAI_SPEC.version}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
            {TAMVAI_SPEC.description}
          </p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
          {[
            { label: "Dominios", value: stats.domains, icon: Globe },
            { label: "Operaciones", value: stats.totalOperations, icon: Zap },
            { label: "Recursos", value: stats.totalResources, icon: Database },
            { label: "Auditadas", value: stats.auditedOperations, icon: Shield },
            { label: "Seguridad", value: stats.securityCoverage, icon: Lock },
            { label: "Eventos", value: stats.monitoringEvents, icon: Activity },
          ].map((s) => (
            <div key={s.label} className="glass rounded-xl p-3">
              <s.icon className="w-4 h-4 text-primary mb-1" />
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-[10px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Domains */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            Dominios Civilizatorios
          </h2>

          {TAMVAI_SPEC.domains.map((domain) => {
            const Icon = DOMAIN_ICONS[domain.id] || Cpu;
            const isExpanded = expandedDomain === domain.id;

            return (
              <motion.div
                key={domain.id}
                layout
                className="glass rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedDomain(isExpanded ? null : domain.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <div className="font-semibold text-sm">{domain.id}</div>
                      <div className="text-[11px] text-muted-foreground">{domain.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-[10px]">
                      {domain.resources.length} recursos
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {domain.operations.length} ops
                    </Badge>
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-border/50 p-4 space-y-3"
                  >
                    {/* Resources */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-2">RECURSOS</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {domain.resources.map((res) => (
                          <div key={res.id} className="bg-muted/30 rounded-lg p-2.5">
                            <div className="font-medium text-xs">{res.id}</div>
                            <div className="text-[10px] text-muted-foreground">{res.description}</div>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {Object.entries(res.fields).map(([key, field]) => (
                                <span
                                  key={key}
                                  className={`text-[9px] px-1.5 py-0.5 rounded ${
                                    field.optional ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                                  }`}
                                >
                                  {key}: {field.type}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operations */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-2">OPERACIONES</h4>
                      <div className="space-y-2">
                        {domain.operations.map((op) => (
                          <OperationCard key={op.id} op={op} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </section>

        {/* HRO Dashboard Preview */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-primary" />
            CITEMESH HRO – Estado del Orquestador
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(["HFP", "LLP", "SAFE"] as const).map((pipeline) => (
              <div key={pipeline} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm">{pipeline}</span>
                  <Badge variant={pipeline === "SAFE" ? "destructive" : "outline"} className="text-[10px]">
                    {pipeline === "HFP" ? "High Fidelity" : pipeline === "LLP" ? "Low Latency" : "Emergency"}
                  </Badge>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lumen/RT</span>
                    <span>{pipeline === "HFP" ? "ON" : "OFF"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nanite</span>
                    <span>{pipeline === "HFP" ? "Full" : pipeline === "LLP" ? "LOD" : "Min"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Volumétricos</span>
                    <span>{pipeline === "HFP" ? "Full" : pipeline === "LLP" ? "Reducidos" : "OFF"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target FPS</span>
                    <span>{pipeline === "HFP" ? "60" : pipeline === "LLP" ? "45" : "30"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quality Levels */}
          <div className="mt-4 glass rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-3">Niveles de Calidad Isabella-Driven</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { level: "Q0", shadows: "OFF", volumetrics: "OFF", rt: false },
                { level: "Q1", shadows: "Low", volumetrics: "Low", rt: false },
                { level: "Q2", shadows: "Medium", volumetrics: "Medium", rt: true },
                { level: "Q3", shadows: "High", volumetrics: "High", rt: true },
              ].map((q) => (
                <div key={q.level} className="bg-muted/30 rounded-lg p-2.5 text-xs">
                  <div className="font-bold text-primary mb-1">{q.level}</div>
                  <div className="space-y-0.5 text-muted-foreground">
                    <div>Sombras: {q.shadows}</div>
                    <div>Volumétricos: {q.volumetrics}</div>
                    <div>Ray Tracing: {q.rt ? "✓" : "✗"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const OperationCard = ({ op }: { op: TamvaiOperation }) => {
  const methodColors: Record<string, string> = {
    GET: "bg-emerald-500/20 text-emerald-400",
    POST: "bg-primary/20 text-primary",
    PUT: "bg-secondary/20 text-secondary",
    DELETE: "bg-destructive/20 text-destructive",
    PATCH: "bg-accent/20 text-accent",
  };

  return (
    <div className="bg-muted/20 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${methodColors[op.method] || ""}`}>
          {op.method}
        </span>
        <span className="text-xs font-mono text-muted-foreground">{op.path}</span>
        <span className="text-xs font-semibold ml-auto">{op.id}</span>
      </div>

      {op.description && (
        <p className="text-[10px] text-muted-foreground mb-2">{op.description}</p>
      )}

      <div className="flex flex-wrap gap-1">
        {op.auth.required ? (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary flex items-center gap-0.5">
            <Lock className="w-2.5 h-2.5" />
            {op.auth.scope || "auth"}
          </span>
        ) : (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground flex items-center gap-0.5">
            <Unlock className="w-2.5 h-2.5" />
            public
          </span>
        )}
        {op.securityTags.map((tag) => (
          <span key={tag} className={`text-[9px] px-1.5 py-0.5 rounded border ${SECURITY_COLORS[tag] || ""}`}>
            {tag}
          </span>
        ))}
        {op.monitoringTags.map((tag) => (
          <span key={tag} className={`text-[9px] px-1.5 py-0.5 rounded ${MONITOR_COLORS[tag] || ""}`}>
            {tag}
          </span>
        ))}
        {op.audit && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive flex items-center gap-0.5">
            <AlertTriangle className="w-2.5 h-2.5" />
            {op.audit.emergencyPlan}
          </span>
        )}
      </div>
    </div>
  );
};

export default TamvaiPage;
