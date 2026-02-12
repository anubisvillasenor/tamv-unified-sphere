import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const MOCK_STORIES = [
  { id: "you", name: "Tu historia", gradient: "from-primary to-accent", isAdd: true },
  { id: "1", name: "TAMV Dev", gradient: "from-secondary to-primary", initial: "TD" },
  { id: "2", name: "Isabella", gradient: "from-accent to-primary", initial: "IA" },
  { id: "3", name: "ArtDAO", gradient: "from-secondary to-destructive", initial: "AD" },
  { id: "4", name: "XR Studio", gradient: "from-primary to-secondary", initial: "XR" },
  { id: "5", name: "CITEMESH", gradient: "from-accent to-secondary", initial: "CM" },
  { id: "6", name: "BookPI", gradient: "from-primary to-accent", initial: "BP" },
  { id: "7", name: "Música", gradient: "from-destructive to-secondary", initial: "MU" },
  { id: "8", name: "Gaming", gradient: "from-accent to-primary", initial: "GG" },
  { id: "9", name: "Finanzas", gradient: "from-secondary to-accent", initial: "FN" },
  { id: "10", name: "Edu TAMV", gradient: "from-primary to-secondary", initial: "ET" },
];

export const StoriesBar = () => {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-2">
      <div className="flex gap-3 px-1 min-w-max">
        {MOCK_STORIES.map((story, i) => (
          <motion.button
            key={story.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className={`p-[2px] rounded-full bg-gradient-to-br ${story.gradient}`}>
              <div className="p-[2px] rounded-full bg-background">
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${story.gradient} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  {story.isAdd ? (
                    <Plus className="w-6 h-6 text-primary-foreground" />
                  ) : (
                    <span className="text-sm font-bold text-primary-foreground">{story.initial}</span>
                  )}
                </div>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground truncate w-16 text-center">
              {story.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};