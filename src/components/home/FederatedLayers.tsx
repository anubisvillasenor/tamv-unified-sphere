import { motion } from "framer-motion";
import {
  Server, Database, Shield, Layout, Rocket, Scale, Zap
} from "lucide-react";

const federatedLayers = [
  { id: 1, name: "Infraestructura", desc: "Hardware, nodos FAR++, fog/edge distribuido", icon: Server, color: "hsl(220, 40%, 45%)" },
  { id: 2, name: "Datos & Lógica", desc: "Algoritmos, BBDD federadas, computación autónoma", icon: Database, color: "hsl(190, 95%, 55%)" },
  { id: 3, name: "Seguridad", desc: "Anubis Sentinel, cifrado PQC, Zero-Trust", icon: Shield, color: "hsl(0, 72%, 55%)" },
  { id: 4, name: "Interfaz", desc: "UX, capas visuales, CITEMESH HRO, XR/4D", icon: Layout, color: "hsl(270, 80%, 60%)" },
  { id: 5, name: "Expansión", desc: "Escalabilidad, módulos nuevos, SDK", icon: Rocket, color: "hsl(210, 100%, 60%)" },
  { id: 6, name: "Ética & Regulación", desc: "Compliance, GDPR, AI Act, LFPDPPP", icon: Scale, color: "hsl(42, 95%, 55%)" },
  { id: 7, name: "Energía & Recursos", desc: "Sostenibilidad, gestión térmica DM-X4", icon: Zap, color: "hsl(150, 60%, 45%)" },
];

export const FederatedLayers = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-tamv-surface/30 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-secondary">7 Federaciones</span>
            <span className="text-foreground"> Soberanas</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Arquitectura heptagonal. Cada federación es operativamente autónoma,
            criptográfica y semánticamente acoplada a las demás mediante BookPI + MSR.
          </p>
        </motion.div>

        {/* Hexagonal Visual */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {federatedLayers.map((layer, index) => (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className="relative mb-3"
              >
                <div
                  className="flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer"
                  style={{
                    background: `linear-gradient(90deg, ${layer.color}15 0%, transparent 100%)`,
                    borderColor: `${layer.color}40`,
                  }}
                >
                  {/* Layer Icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${layer.color}20`,
                    }}
                  >
                    <layer.icon className="w-5 h-5" style={{ color: layer.color }} />
                  </div>

                  {/* Layer Info */}
                  <div className="flex-1">
                    <h3
                      className="font-semibold text-lg"
                      style={{ color: layer.color }}
                    >
                      Fed {layer.id}: {layer.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {layer.desc}
                    </p>
                  </div>

                  {/* Pulse Indicator */}
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: layer.color }}
                  />
                </div>

                {/* Connection Line */}
                {index < federatedLayers.length - 1 && (
                  <div
                    className="absolute left-9 top-full w-0.5 h-3"
                    style={{
                      background: `linear-gradient(to bottom, ${layer.color}40, transparent)`,
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 max-w-2xl mx-auto"
        >
          <p className="text-lg md:text-xl text-muted-foreground italic">
            "Donde la memoria limita al poder, y la dignidad dicta lo que la tecnología puede hacer."
          </p>
          <cite className="text-sm text-primary mt-4 block not-italic">
            — Lema Canónico TAMV
          </cite>
        </motion.blockquote>
      </div>
    </section>
  );
};