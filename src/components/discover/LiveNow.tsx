import { motion } from "framer-motion";
import { Radio, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MOCK_STREAMS = [
  { id: "1", title: "Concierto Metaverso XR", viewers: 1420, host: "TAMV Music", category: "Música", gradient: "from-destructive/40 to-primary/30" },
  { id: "2", title: "Hackathon Isabella AI", viewers: 876, host: "DevHub", category: "Tech", gradient: "from-accent/40 to-secondary/30" },
  { id: "3", title: "Subasta Arte Digital", viewers: 342, host: "ArtDAO", category: "Arte", gradient: "from-secondary/40 to-primary/30" },
  { id: "4", title: "Clase: Economía MSR", viewers: 215, host: "Universidad", category: "Edu", gradient: "from-primary/40 to-accent/30" },
];

export const LiveNow = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-destructive"
          />
          <h2 className="text-lg font-bold text-foreground">En Vivo Ahora</h2>
        </div>
        <button
          onClick={() => navigate("/streaming")}
          className="text-xs text-primary hover:underline"
        >
          Ver todos →
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MOCK_STREAMS.map((stream, i) => (
          <motion.div
            key={stream.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate("/streaming")}
            className={`relative rounded-xl overflow-hidden cursor-pointer bg-gradient-to-br ${stream.gradient} border border-border/50 group`}
          >
            <div className="aspect-video flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Live badge */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-destructive/90 backdrop-blur px-2 py-0.5 rounded-md">
                <Radio className="w-3 h-3 text-destructive-foreground" />
                <span className="text-[10px] font-bold text-destructive-foreground">EN VIVO</span>
              </div>

              {/* Viewers */}
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/30 backdrop-blur px-2 py-0.5 rounded-md">
                <Users className="w-3 h-3 text-foreground" />
                <span className="text-[10px] font-medium text-foreground">{stream.viewers.toLocaleString()}</span>
              </div>

              {/* Center icon */}
              <Zap className="w-10 h-10 text-foreground/30 group-hover:text-foreground/50 transition-colors" />

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-sm font-semibold text-foreground line-clamp-1">{stream.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-foreground/70">{stream.host}</span>
                  <span className="text-[10px] text-primary px-1.5 py-0.5 bg-primary/10 rounded">{stream.category}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};