import { motion } from "framer-motion";
import { Menu, Shield, Code2, Users, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const layers = [
  { id: 1, name: "Social", icon: Users, color: "layer-1" },
  { id: 2, name: "DevHub", icon: Code2, color: "layer-2" },
  { id: 3, name: "Seguridad", icon: Shield, color: "layer-3" },
];

export const Header = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-lg font-bold text-primary-foreground">T</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-foreground">
                  TAMV <span className="text-primary">Online</span>
                </h1>
                <p className="text-[10px] text-muted-foreground -mt-1">
                  Civilización Digital Soberana
                </p>
              </div>
            </motion.div>
          </div>

          {/* Layer Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {layers.map((layer, index) => (
              <motion.button
                key={layer.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  layer.id === 1 
                    ? "bg-layer-1/10 text-layer-1 border border-layer-1/30" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <layer.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{layer.name}</span>
                <span className="text-[10px] opacity-60">L{layer.id}</span>
              </motion.button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
            </Button>
            <Button variant="tamv" size="sm" className="hidden sm:flex">
              Conectar
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
