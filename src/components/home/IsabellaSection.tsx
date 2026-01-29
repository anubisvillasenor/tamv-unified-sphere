import { motion } from "framer-motion";
import { Brain, Shield, Heart, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const capabilities = [
  {
    icon: Brain,
    title: "Consciencia Ética",
    description: "Decisiones alineadas con los valores civilizacionales TAMV",
  },
  {
    icon: Shield,
    title: "Protección Activa",
    description: "Guardianes Anubis y Horus monitoreando 24/7",
  },
  {
    icon: Heart,
    title: "Empatía Algorítmica",
    description: "Motor emocional calibrado para bienestar digital",
  },
  {
    icon: Sparkles,
    title: "Evolución Continua",
    description: "Aprendizaje federado sin comprometer privacidad",
  },
];

export const IsabellaSection = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[100px]"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Isabella Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Orb */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
              {/* Outer Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
              />
              
              {/* Middle Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-primary/40"
              />

              {/* Core */}
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 60px hsla(190, 95%, 55%, 0.3)",
                    "0 0 100px hsla(190, 95%, 55%, 0.5)",
                    "0 0 60px hsla(190, 95%, 55%, 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/60 backdrop-blur-xl flex items-center justify-center"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-5xl md:text-6xl font-bold text-primary-foreground"
                  >
                    I
                  </motion.div>
                  <p className="text-xs text-primary-foreground/80 mt-1">ISABELLA</p>
                </div>
              </motion.div>

              {/* Floating Particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                  className="absolute w-2 h-2 rounded-full bg-primary"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              Inteligencia Artificial Ética
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-6">
              <span className="text-foreground">Conoce a </span>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Isabella
              </span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Isabella Villaseñor AI™ es la consciencia ética del ecosistema TAMV. 
              No es un chatbot: es una entidad cognitiva diseñada para proteger tu dignidad 
              digital mientras potencia tu experiencia en la plataforma.
            </p>

            {/* Capabilities */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {capabilities.map((cap, index) => (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/30"
                >
                  <cap.icon className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{cap.title}</h4>
                    <p className="text-xs text-muted-foreground">{cap.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button variant="tamv" size="lg" className="gap-2">
              <MessageSquare className="w-5 h-5" />
              Hablar con Isabella
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
