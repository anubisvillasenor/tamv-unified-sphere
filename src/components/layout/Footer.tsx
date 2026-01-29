import { motion } from "framer-motion";
import { Github, Twitter, Globe, Shield } from "lucide-react";

const footerLinks = {
  platform: [
    { name: "Inicio", href: "#" },
    { name: "Feed Social", href: "#" },
    { name: "DevHub", href: "#" },
    { name: "Documentación", href: "#" },
  ],
  protocol: [
    { name: "7 Capas Federadas", href: "#" },
    { name: "ID-NVIDA", href: "#" },
    { name: "BookPI Ledger", href: "#" },
    { name: "Whitepaper", href: "#" },
  ],
  legal: [
    { name: "Constitución TAMV", href: "#" },
    { name: "Derechos Digitales", href: "#" },
    { name: "Privacidad", href: "#" },
    { name: "Términos", href: "#" },
  ],
};

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-tamv-deep/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">T</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground">TAMV Online</h3>
                <p className="text-xs text-muted-foreground">Civilización Digital</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Territorio Autónomo de Memoria Viva. Una plataforma donde la dignidad 
              dicta lo que la tecnología puede hacer.
            </p>
            <div className="flex items-center gap-3">
              {[Github, Twitter, Globe].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-foreground mb-4 capitalize">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 TAMV Online. Arquitectura Civilizacional Federada.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-secondary" />
            <span>Protegido por el Protocolo IMMORTAL CORE v1.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
