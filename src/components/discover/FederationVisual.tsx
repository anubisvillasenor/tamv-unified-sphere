import { motion } from "framer-motion";
import {
  Server, Database, Shield, Layout, Rocket, Scale, Zap
} from "lucide-react";

const FEDERATIONS = [
  { id: 1, name: "Infraestructura", desc: "Hardware, nodos, fog/edge", icon: Server, color: "hsl(220, 40%, 45%)" },
  { id: 2, name: "Datos & Lógica", desc: "Algoritmos, BBDD, procesamiento", icon: Database, color: "hsl(190, 95%, 55%)" },
  { id: 3, name: "Seguridad", desc: "Anubis, cifrado, auditoría", icon: Shield, color: "hsl(0, 72%, 55%)" },
  { id: 4, name: "Interfaz", desc: "UX, capas visuales, XR", icon: Layout, color: "hsl(270, 80%, 60%)" },
  { id: 5, name: "Expansión", desc: "Escalabilidad, módulos nuevos", icon: Rocket, color: "hsl(210, 100%, 60%)" },
  { id: 6, name: "Ética & Regulación", desc: "Compliance, marco legal", icon: Scale, color: "hsl(42, 95%, 55%)" },
  { id: 7, name: "Energía & Recursos", desc: "Sostenibilidad, carga, DM-X4", icon: Zap, color: "hsl(150, 60%, 45%)" },
];

export const FederationVisual = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">7 Federaciones</h2>
        <span className="text-[10px] text-muted-foreground">Arquitectura Heptagonal</span>
      </div>
      
      {/* Visual ring */}
      <div className="relative aspect-square max-w-[280px] mx-auto mb-4">
        {/* Center */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center z-10"
        >
          <span className="text-xs font-bold text-primary-foreground">TAMV</span>
        </motion.div>
        
        {/* Orbiting nodes */}
        {FEDERATIONS.map((fed, i) => {
          const angle = (i * 360) / 7 - 90;
          const rad = (angle * Math.PI) / 180;
          const radius = 42;
          const x = 50 + radius * Math.cos(rad);
          const y = 50 + radius * Math.sin(rad);
          
          return (
            <motion.div
              key={fed.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              className="absolute flex flex-col items-center gap-0.5 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 cursor-pointer"
                style={{ backgroundColor: `${fed.color}20`, borderColor: `${fed.color}60` }}
              >
                <fed.icon className="w-4 h-4" style={{ color: fed.color }} />
              </motion.div>
              <span className="text-[8px] font-medium text-muted-foreground whitespace-nowrap">
                {fed.name}
              </span>
            </motion.div>
          );
        })}
        
        {/* Connection lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          {FEDERATIONS.map((_, i) => {
            const angle1 = (i * 360) / 7 - 90;
            const angle2 = (((i + 1) % 7) * 360) / 7 - 90;
            const r = 42;
            return (
              <line
                key={i}
                x1={50 + r * Math.cos((angle1 * Math.PI) / 180)}
                y1={50 + r * Math.sin((angle1 * Math.PI) / 180)}
                x2={50 + r * Math.cos((angle2 * Math.PI) / 180)}
                y2={50 + r * Math.sin((angle2 * Math.PI) / 180)}
                stroke="hsl(var(--border))"
                strokeWidth="0.3"
                strokeDasharray="1,1"
              />
            );
          })}
        </svg>
      </div>
      
      {/* Compact list */}
      <div className="grid grid-cols-2 gap-1.5">
        {FEDERATIONS.map((fed, i) => (
          <motion.div
            key={fed.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="flex items-center gap-2 p-1.5 rounded-lg"
            style={{ background: `${fed.color}08` }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: fed.color }}
            />
            <span className="text-[10px] text-muted-foreground truncate">{fed.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};