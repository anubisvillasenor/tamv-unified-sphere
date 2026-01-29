import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Globe,
  Shield,
  Gavel,
  Brain,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-background.jpg";
import { useNavigate } from "react-router-dom";
import { useIsabella } from "@/hooks/useIsabella";

/**
 * TAMV – Hero Civilizatorio
 * Entrada institucional al sistema real (Isabella + gobernanza + HITL)
 */

const STATIC_STATS = [
  {
    icon: Globe,
    value: "7",
    label: "Capas Federadas",
    description:
      "Ontología → Constitución → Política → Economía → Cognición → Técnica → Historia",
    color: "text-primary",
  },
];

export const HeroSection = () => {
  const navigate = useNavigate();
  const { meta } = useIsabella();

  const handleAccess = () => {
    navigate("/isabella");
  };

  const dynamicStats = [
    ...STATIC_STATS,
    {
      icon: Shield,
      value: meta.hitlRequired ? "HITL ACTIVO" : "HITL LISTO",
      label: "Gobernanza Algorítmica",
      description: meta.hitlRequired
        ? "Hay decisiones esperando revisión humana en el terminal civilizatorio."
        : "Ética, seguridad y humano-en-loop operativos por diseño.",
      color: meta.hitlRequired ? "text-amber-400" : "text-emerald-400",
    },
    {
      icon: Database,
      value: `${meta.aignScore ?? 100}%`,
      label: "Memoria Auditada",
      description:
        "Eventos civilizatorios registrados en isabella_events para auditoría y gobernanza cultural (AIGN).",
      color: "text-amber-400",
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background" />
      <div className="absolute inset-0 quantum-grid opacity-40" />

      {/* Orbes institucionales */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge institucional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Sistema civilizatorio federado · Isabella en operación
            </span>
          </motion.div>

          {/* Título */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-foreground">Infraestructura social</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              para civilizaciones digitales
            </span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            TAMV no es una red social.
            <br />
            Es un sistema operativo civilizatorio gobernado por Isabella Villaseñor
            que integra identidad soberana, gobernanza algorítmica, economía
            programable y memoria verificable sobre siete capas.
          </motion.p>

          {/* CTAs conectados */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Button variant="tamv" size="xl" className="group" onClick={handleAccess}>
              Acceder al sistema
              <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="glass"
              size="xl"
              className="gap-2"
              onClick={() => navigate("/constitution")}
            >
              <Gavel className="w-4 h-4" />
              Arquitectura & Constitución
            </Button>
          </motion.div>

          {/* Stats civilizatorios reales */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto"
          >
            {dynamicStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="glass rounded-2xl p-5 text-left"
              >
                <div className="flex items-center gap-3 mb-3">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                </div>
                <div className="font-semibold text-sm mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
