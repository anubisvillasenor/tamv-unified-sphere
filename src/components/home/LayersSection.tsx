import { motion } from "framer-motion";
import { Users, MessageSquare, Heart, Share2, Code2, GitBranch, Terminal, Shield, Lock, Eye, Database, Fingerprint } from "lucide-react";

const layers = [
  {
    id: 1,
    name: "Capa Social",
    subtitle: "Primer Plano - Usuarios",
    description: "Interacción social federada entre redes y metaversos. Posts, stories, chats, eventos y comunidades.",
    color: "primary",
    colorClass: "from-primary/20 to-primary/5",
    borderColor: "border-primary/30",
    textColor: "text-primary",
    features: [
      { icon: MessageSquare, label: "Feed Unificado" },
      { icon: Heart, label: "Reacciones Éticas" },
      { icon: Users, label: "Comunidades" },
      { icon: Share2, label: "Cross-Platform" },
    ],
  },
  {
    id: 2,
    name: "DevHub",
    subtitle: "Segundo Plano - Desarrolladores",
    description: "APIs, SDKs, módulos XR y herramientas para construir sobre el protocolo TAMV.",
    color: "layer-2",
    colorClass: "from-[hsl(270,95%,60%)]/20 to-[hsl(270,95%,60%)]/5",
    borderColor: "border-[hsl(270,95%,60%)]/30",
    textColor: "text-[hsl(270,95%,60%)]",
    features: [
      { icon: Code2, label: "APIs Abiertas" },
      { icon: GitBranch, label: "Módulos XR" },
      { icon: Terminal, label: "CLI Tools" },
      { icon: Database, label: "Graph Data" },
    ],
  },
  {
    id: 3,
    name: "Seguridad & Info",
    subtitle: "Tercer Plano - Infraestructura",
    description: "Auditoría, zero-trust, criptografía post-cuántica y registro inmutable BookPI.",
    color: "secondary",
    colorClass: "from-secondary/20 to-secondary/5",
    borderColor: "border-secondary/30",
    textColor: "text-secondary",
    features: [
      { icon: Shield, label: "Zero Trust" },
      { icon: Lock, label: "Cifrado E2E" },
      { icon: Eye, label: "Auditoría" },
      { icon: Fingerprint, label: "ID-NVIDA" },
    ],
  },
];

export const LayersSection = () => {
  return (
    <section className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Arquitectura de </span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              3 Planos
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            TAMV organiza la experiencia en tres planos interconectados, 
            cada uno con su propósito y nivel de acceso específico.
          </p>
        </motion.div>

        {/* Layers Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {layers.map((layer, index) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`relative rounded-2xl overflow-hidden bg-gradient-to-b ${layer.colorClass} border ${layer.borderColor} p-6 md:p-8`}
            >
              {/* Layer Number */}
              <div className={`absolute top-4 right-4 text-6xl font-bold opacity-10 ${layer.textColor}`}>
                {layer.id}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <span className={`text-xs font-medium ${layer.textColor} uppercase tracking-wider`}>
                  {layer.subtitle}
                </span>
                <h3 className="text-2xl font-bold text-foreground mt-2 mb-3">
                  {layer.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {layer.description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-3">
                  {layer.features.map((feature) => (
                    <div
                      key={feature.label}
                      className="flex items-center gap-2 text-sm"
                    >
                      <feature.icon className={`w-4 h-4 ${layer.textColor}`} />
                      <span className="text-foreground/80">{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Glow Effect */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className={`absolute inset-0 bg-gradient-to-t ${layer.colorClass} pointer-events-none`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
