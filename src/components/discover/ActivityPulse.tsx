import { motion } from "framer-motion";
import { Activity, Users, Wallet, Shield, MessageSquare, Heart } from "lucide-react";

const PULSE_ITEMS = [
  { icon: Users, text: "2,847 usuarios activos ahora", time: "En vivo", color: "text-primary" },
  { icon: Heart, text: "Isabella aprobó 142 acciones éticas", time: "Última hora", color: "text-accent" },
  { icon: Wallet, text: "34,521 MSR transferidos hoy", time: "Economía", color: "text-secondary" },
  { icon: Shield, text: "0 amenazas · Anubis operativo", time: "Seguridad", color: "text-primary" },
  { icon: MessageSquare, text: "1,203 mensajes en canales", time: "Social", color: "text-accent" },
];

export const ActivityPulse = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Activity className="w-4 h-4 text-primary" />
        </motion.div>
        <h2 className="text-sm font-bold text-foreground">Pulso del Ecosistema</h2>
      </div>
      <div className="space-y-1.5">
        {PULSE_ITEMS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/30 transition-colors"
          >
            <item.icon className={`w-3.5 h-3.5 ${item.color} shrink-0`} />
            <span className="text-xs text-foreground/80 flex-1">{item.text}</span>
            <span className="text-[9px] text-muted-foreground shrink-0">{item.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};