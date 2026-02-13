import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu, X, Search, Bell, Home, MessageSquare, Users, Video,
  Radio, GraduationCap, Palette, Brain, BookOpen,
  LogOut, User, Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import logoTamv from "@/assets/logo-tamv-official.jpg";

const NAV_ITEMS = [
  { path: "/feed", label: "Feed", icon: Home },
  { path: "/reels", label: "Reels", icon: Video },
  { path: "/streaming", label: "Live", icon: Radio },
  { path: "/messages", label: "Chat", icon: MessageSquare },
  { path: "/groups", label: "Grupos", icon: Users },
  { path: "/gallery", label: "Arte", icon: Palette },
  { path: "/university", label: "Universidad", icon: GraduationCap },
  { path: "/isabella", label: "Isabella", icon: Brain },
  { path: "/bookpi", label: "BookPI", icon: BookOpen },
  { path: "/tamvai", label: "TAMVAI", icon: Cpu },
];

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "hsla(0, 0%, 2%, 0.85)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid hsla(210, 10%, 12%, 0.5)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img src={logoTamv} alt="TAMV" className="h-8 w-8 rounded-lg object-cover" />
              <span className="hidden sm:block text-sm font-bold">
                <span className="text-metallic">TAMV</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5 overflow-x-auto">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
              </Button>

              {user ? (
                <div className="flex items-center gap-1.5">
                  <Link to="/about">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <User className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={() => signOut()}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="tamv"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => navigate("/auth")}
                >
                  Conectar
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-14 left-0 right-0 z-40 lg:hidden"
            style={{
              background: "hsla(0, 0%, 2%, 0.95)",
              backdropFilter: "blur(24px)",
              borderBottom: "1px solid hsla(210, 10%, 12%, 0.5)",
            }}
          >
            <nav className="container mx-auto px-4 py-3 grid grid-cols-3 gap-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg text-[10px] font-medium transition-all ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
