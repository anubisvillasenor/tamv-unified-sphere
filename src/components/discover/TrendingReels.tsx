import { motion } from "framer-motion";
import { Play, Heart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MOCK_REELS = [
  { id: "1", title: "DreamSpace en vivo", views: "12.4K", likes: "3.2K", gradient: "from-primary/80 to-accent/60", emoji: "🌌" },
  { id: "2", title: "Arte generativo IA", views: "8.7K", likes: "2.1K", gradient: "from-secondary/80 to-primary/60", emoji: "🎨" },
  { id: "3", title: "Tutorial XR Engine", views: "5.3K", likes: "1.8K", gradient: "from-accent/80 to-secondary/60", emoji: "🔮" },
  { id: "4", title: "Música TAMV", views: "15.1K", likes: "4.5K", gradient: "from-destructive/60 to-secondary/80", emoji: "🎵" },
  { id: "5", title: "Gobernanza DAO", views: "3.9K", likes: "890", gradient: "from-primary/60 to-secondary/80", emoji: "⚖️" },
  { id: "6", title: "Economía MSR", views: "7.2K", likes: "1.6K", gradient: "from-secondary/60 to-accent/80", emoji: "💰" },
];

export const TrendingReels = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Reels Trending</h2>
        <button
          onClick={() => navigate("/reels")}
          className="text-xs text-primary hover:underline"
        >
          Ver todos →
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {MOCK_REELS.map((reel, i) => (
          <motion.div
            key={reel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate("/reels")}
            className={`relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer bg-gradient-to-br ${reel.gradient} group`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            {/* Emoji center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl opacity-40 group-hover:opacity-60 transition-opacity group-hover:scale-110 transform">{reel.emoji}</span>
            </div>
            
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 rounded-full bg-background/30 backdrop-blur flex items-center justify-center">
                <Play className="w-5 h-5 text-foreground fill-foreground ml-0.5" />
              </div>
            </div>
            
            {/* Info bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-2.5">
              <p className="text-xs font-semibold text-foreground line-clamp-1">{reel.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-0.5 text-[10px] text-foreground/70">
                  <Eye className="w-3 h-3" />{reel.views}
                </span>
                <span className="flex items-center gap-0.5 text-[10px] text-foreground/70">
                  <Heart className="w-3 h-3" />{reel.likes}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};