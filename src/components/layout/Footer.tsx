import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Github, Twitter, Globe, Shield } from "lucide-react";

const footerLinks = {
  plataforma: [
    { name: "Feed Social", href: "/feed" },
    { name: "Reels", href: "/reels" },
    { name: "Streaming", href: "/streaming" },
    { name: "Mensajes", href: "/messages" },
    { name: "Grupos", href: "/groups" },
  ],
  ecosistema: [
    { name: "Galerías de Arte", href: "/gallery" },
    { name: "Universidad TAMV", href: "/university" },
    { name: "Isabella AI", href: "/isabella" },
    { name: "BookPI Ledger", href: "/bookpi" },
    { name: "TAMVAI API", href: "/tamvai" },
  ],
  institucional: [
    { name: "Sobre TAMV", href: "/about" },
    { name: "Constitución", href: "/about" },
    { name: "Derechos Digitales", href: "/about" },
    { name: "Privacidad", href: "/about" },
  ],
};

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-tamv-deep/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">T</span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">TAMV Online</h3>
                <p className="text-[10px] text-muted-foreground">Civilización Digital</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Tecnología Avanzada Mexicana Versátil. Donde la dignidad 
              dicta lo que la tecnología puede hacer.
            </p>
            <div className="flex items-center gap-2">
              {[Github, Twitter, Globe].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-xs text-foreground mb-3 capitalize">{title}</h4>
              <ul className="space-y-1.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-muted-foreground">
            © 2026 TAMV Online · Edwin Oswaldo Castillo Trejo · Orgullosamente Mexicano 🇲🇽
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Shield className="w-3 h-3 text-secondary" />
            <span>Protegido por IMMORTAL CORE v1.1 + TAMVAI API v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
