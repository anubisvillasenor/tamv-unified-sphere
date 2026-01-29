import { motion } from "framer-motion";

const federatedLayers = [
  { id: 0, name: "Infraestructura", color: "hsl(220, 40%, 30%)" },
  { id: 1, name: "Identidad", color: "hsl(190, 95%, 55%)" },
  { id: 2, name: "Experiencia XR", color: "hsl(200, 90%, 50%)" },
  { id: 3, name: "Sistemas", color: "hsl(210, 85%, 55%)" },
  { id: 4, name: "Inteligencia IA", color: "hsl(270, 80%, 60%)" },
  { id: 5, name: "Economía", color: "hsl(42, 95%, 55%)" },
  { id: 6, name: "Gobernanza", color: "hsl(32, 90%, 50%)" },
  { id: 7, name: "Metacivilización", color: "hsl(0, 0%, 90%)" },
];

export const FederatedLayers = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
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
            <span className="text-secondary">7 Capas</span>
            <span className="text-foreground"> Federadas</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cada capa gobierna a las inferiores. Ninguna puede violar a las superiores.
            Una arquitectura civilizacional verificable y auditable.
          </p>
        </motion.div>

        {/* Layers Visualization */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {federatedLayers.slice().reverse().map((layer, index) => (
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
                  {/* Layer Number */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
                    style={{
                      backgroundColor: `${layer.color}20`,
                      color: layer.color,
                    }}
                  >
                    {layer.id}
                  </div>

                  {/* Layer Name */}
                  <div className="flex-1">
                    <h3
                      className="font-semibold text-lg"
                      style={{ color: layer.color }}
                    >
                      Capa {layer.id}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {layer.name}
                    </p>
                  </div>

                  {/* Indicator */}
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
