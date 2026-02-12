import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare, Video, Radio, Palette, GraduationCap,
  Brain, BookOpen, Users, Wallet, Cpu, Music, Gamepad2
} from "lucide-react";

const ACTIONS = [
  { icon: MessageSquare, label: "Feed", path: "/feed", gradient: "from-primary/20 to-primary/5", iconColor: "text-primary" },
  { icon: Video, label: "Reels", path: "/reels", gradient: "from-accent/20 to-accent/5", iconColor: "text-accent" },
  { icon: Radio, label: "Live", path: "/streaming", gradient: "from-destructive/20 to-destructive/5", iconColor: "text-destructive" },
  { icon: Users, label: "Grupos", path: "/groups", gradient: "from-primary/20 to-primary/5", iconColor: "text-primary" },
  { icon: Palette, label: "Arte", path: "/gallery", gradient: "from-secondary/20 to-secondary/5", iconColor: "text-secondary" },
  { icon: GraduationCap, label: "Univ.", path: "/university", gradient: "from-accent/20 to-accent/5", iconColor: "text-accent" },
  { icon: Brain, label: "Isabella", path: "/isabella", gradient: "from-primary/20 to-primary/5", iconColor: "text-primary" },
  { icon: BookOpen, label: "BookPI", path: "/bookpi", gradient: "from-secondary/20 to-secondary/5", iconColor: "text-secondary" },
  { icon: Wallet, label: "Wallet", path: "/feed", gradient: "from-secondary/20 to-secondary/5", iconColor: "text-secondary" },
  { icon: Music, label: "Música", path: "/feed", gradient: "from-destructive/20 to-destructive/5", iconColor: "text-destructive" },
  { icon: Gamepad2, label: "Gaming", path: "/feed", gradient: "from-accent/20 to-accent/5", iconColor: "text-accent" },
  { icon: Cpu, label: "API", path: "/tamvai", gradient: "from-primary/20 to-primary/5", iconColor: "text-primary" },
];

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
      {ACTIONS.map((action, i) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.02 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(action.path)}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gradient-to-br ${action.gradient} border border-border/30 hover:border-primary/30 transition-colors`}
        >
          <action.icon className={`w-5 h-5 ${action.iconColor}`} />
          <span className="text-[10px] font-medium text-foreground/80">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
};