import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Shield, Brain, Fingerprint, Globe, Cpu,
  Radio, Wallet, GraduationCap, Users
} from "lucide-react";
import logoTamv from "@/assets/logo-tamv-official.jpg";

const INTRO_LINES = [
  "Iniciando protocolo de consciencia digital...",
  "Conectando 7 federaciones soberanas...",
  "Isabella Villaseñor AI — en línea.",
  "Bienvenido a TAMV.",
];

const FEATURES = [
  { icon: Fingerprint, label: "ID-NVIDA", desc: "Identidad digital soberana" },
  { icon: Brain, label: "Isabella AI", desc: "Consciencia ética algorítmica" },
  { icon: Shield, label: "Seguridad Zero-Trust", desc: "Blindaje civilizatorio" },
  { icon: Globe, label: "7 Federaciones", desc: "Arquitectura heptagonal" },
  { icon: Wallet, label: "NubiWallet", desc: "Economía MSR programable" },
  { icon: Radio, label: "Streaming 4D", desc: "Contenido inmersivo" },
  { icon: GraduationCap, label: "UTAMV", desc: "Universidad soberana" },
  { icon: Users, label: "Social", desc: "Interacción federada" },
];

export const CinematicHero = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0); // 0=intro, 1=reveal, 2=full
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    if (phase === 0) {
      const timer = setInterval(() => {
        setCurrentLine((prev) => {
          if (prev >= INTRO_LINES.length - 1) {
            clearInterval(timer);
            setTimeout(() => setPhase(1), 800);
            return prev;
          }
          return prev + 1;
        });
      }, 900);
      return () => clearInterval(timer);
    }
    if (phase === 1) {
      setTimeout(() => setPhase(2), 1200);
    }
  }, [phase]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Deep gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      {/* Subtle orbital light */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-[600px] h-[600px] rounded-full border border-primary/5" />
        <div className="absolute w-[400px] h-[400px] rounded-full border border-accent/5" />
        <div className="absolute w-[200px] h-[200px] rounded-full border border-secondary/5" />
      </motion.div>

      {/* Glow orbs */}
      <motion.div
        animate={{ opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-[120px]"
        style={{ background: "hsl(210, 80%, 58%)" }}
      />
      <motion.div
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-[150px]"
        style={{ background: "hsl(210, 30%, 80%)" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <AnimatePresence mode="wait">
          {/* Phase 0: Boot sequence */}
          {phase === 0 && (
            <motion.div
              key="boot"
              exit={{ opacity: 0, y: -30 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="mb-10"
              >
                <div className="relative">
                  <img
                    src={logoTamv}
                    alt="TAMV"
                    className="h-24 w-24 rounded-2xl shadow-2xl"
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -inset-2 rounded-2xl border border-primary/30"
                  />
                </div>
              </motion.div>

              <div className="space-y-2 text-center font-mono">
                {INTRO_LINES.slice(0, currentLine + 1).map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-sm md:text-base ${
                      i === currentLine
                        ? "text-primary text-glow"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-primary/50 mr-2">{">"}</span>
                    {line}
                    {i === currentLine && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="ml-1 text-primary"
                      >
                        █
                      </motion.span>
                    )}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}

          {/* Phase 1+2: Full reveal */}
          {phase >= 1 && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center max-w-5xl mx-auto py-16"
            >
              {/* Logo + Title */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="mb-8"
              >
                <img
                  src={logoTamv}
                  alt="TAMV"
                  className="h-16 w-16 rounded-xl mx-auto mb-4 shadow-lg"
                />
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                  <span className="text-metallic">TAMV</span>
                </h1>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto max-w-md mt-4"
                />
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-secondary mb-4 max-w-2xl mx-auto"
              >
                Sistema Operativo de Civilización Digital
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed"
              >
                Identidad soberana · IA ética · Economía programable · Gobernanza algorítmica
                <br />
                7 federaciones · Un ecosistema inmersivo
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
              >
                <Button
                  variant="tamv"
                  size="xl"
                  className="group min-w-[200px]"
                  onClick={() => navigate("/auth")}
                >
                  <Fingerprint className="w-5 h-5" />
                  Crear ID-NVIDA
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="glass"
                  size="lg"
                  onClick={() => navigate("/auth")}
                >
                  Iniciar Sesión
                </Button>
              </motion.div>

              {/* Feature grid */}
              {phase === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto"
                >
                  {FEATURES.map((f, i) => (
                    <motion.div
                      key={f.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="glass rounded-xl p-3 text-center hover:border-primary/30 transition-colors cursor-default group"
                    >
                      <f.icon className="w-5 h-5 mx-auto mb-2 text-primary group-hover:text-accent transition-colors" />
                      <div className="text-xs font-semibold text-foreground">{f.label}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{f.desc}</div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
