import { motion } from "framer-motion";
import { CheckCircle2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const CREATORS = [
  { name: "Isabella AI", handle: "@isabella", role: "Consciencia Ética", verified: true, gradient: "from-primary to-accent", followers: "∞" },
  { name: "DevHub TAMV", handle: "@devhub", role: "Desarrollo SDK", verified: true, gradient: "from-accent to-secondary", followers: "14.2K" },
  { name: "ArtDAO", handle: "@artdao", role: "Arte Generativo", verified: true, gradient: "from-secondary to-destructive", followers: "8.7K" },
  { name: "CITEMESH", handle: "@citemesh", role: "Motor XR", verified: true, gradient: "from-primary to-secondary", followers: "5.1K" },
  { name: "MSR Bank", handle: "@msrbank", role: "Economía Digital", verified: true, gradient: "from-secondary to-accent", followers: "22.4K" },
];

export const FeaturedCreators = () => {
  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-4">Creadores Destacados</h2>
      <div className="space-y-2">
        {CREATORS.map((creator, i) => (
          <motion.div
            key={creator.handle}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer"
          >
            <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${creator.gradient} flex items-center justify-center shrink-0`}>
              <span className="text-sm font-bold text-primary-foreground">{creator.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-foreground truncate">{creator.name}</span>
                {creator.verified && <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />}
              </div>
              <p className="text-[10px] text-muted-foreground">{creator.role} · {creator.followers}</p>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <UserPlus className="w-3 h-3 mr-1" />
              Seguir
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};