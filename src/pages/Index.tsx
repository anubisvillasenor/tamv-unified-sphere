import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Brain, Shield, Globe, Sparkles,
  Users, Video, Radio, Palette, GraduationCap,
  BookOpen, MessageSquare, TrendingUp, Cpu, Wallet
} from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import logoTamv from "@/assets/logo-tamv-official.jpg";
import { getTamvaiPlatformStats } from "@/tamvai/runtime";

const FEATURES = [
  { icon: Users, title: "Red Social Federada", desc: "Feed, posts, fotos, videos, audio y texto con registro BookPI", color: "text-primary" },
  { icon: Video, title: "Reels & Video", desc: "Videos verticales estilo TikTok con economía MSR integrada", color: "text-primary" },
  { icon: Radio, title: "Streaming en Vivo", desc: "Transmisiones con tips MSR y chat en tiempo real", color: "text-primary" },
  { icon: MessageSquare, title: "Chat & Canales", desc: "Mensajería privada, grupos y canales broadcast", color: "text-accent" },
  { icon: Palette, title: "Galerías & Subastas", desc: "Arte digital con subastas MSR y certificación BookPI", color: "text-secondary" },
  { icon: GraduationCap, title: "Universidad TAMV", desc: "Cursos certificados y puentes de conocimiento", color: "text-secondary" },
  { icon: Brain, title: "Isabella AI", desc: "Consciencia ética con gobernanza algorítmica y HITL", color: "text-accent" },
  { icon: BookOpen, title: "BookPI Ledger", desc: "Blockchain de auditoría inmutable para todo el ecosistema", color: "text-primary" },
  { icon: Cpu, title: "TAMVAI API", desc: "IDL soberano con seguridad Anubis/Dekateotl integrada", color: "text-secondary" },
  { icon: Wallet, title: "Economía MSR", desc: "Moneda programable, wallets y transacciones verificables", color: "text-secondary" },
  { icon: Shield, title: "TENOCHTITLAN Security", desc: "Seguridad multicapa con Zero-Trust y radares IA", color: "text-destructive" },
  { icon: Globe, title: "CITEMESH XR", desc: "Motor híbrido de renderizado con orquestación Isabella", color: "text-accent" },
];

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const stats = getTamvaiPlatformStats();

  useEffect(() => {
    if (!loading && user) {
      navigate("/feed");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-14">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${heroBackground})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        <div className="absolute inset-0 quantum-grid opacity-30" />

        <motion.div
          animate={{ y: [0, -15, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.img
              src={logoTamv}
              alt="TAMV Online"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-24 w-24 rounded-2xl mx-auto mb-6 shadow-lg"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground mb-6"
            >
              <Sparkles className="w-3 h-3 text-primary" />
              <span>TAMVAI v{stats.version} · {stats.domains} dominios · {stats.totalOperations} operaciones soberanas</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
            >
              <span className="text-foreground">El ecosistema digital</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                más avanzado del mundo
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Red social · Streaming · Universidad · Galerías de arte · Subastas MSR · 
              Isabella AI · BookPI Blockchain · Todo en un sistema civilizatorio federado.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
            >
              <Button variant="tamv" size="lg" className="gap-2" onClick={() => navigate("/auth")}>
                Crear Identidad Digital
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="glass" size="lg" className="gap-2" onClick={() => navigate("/about")}>
                <Globe className="w-4 h-4" />
                Conocer TAMV
              </Button>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto"
            >
              {[
                { label: "Dominios", value: stats.domains, icon: Globe },
                { label: "Operaciones", value: stats.totalOperations, icon: Cpu },
                { label: "Recursos", value: stats.totalResources, icon: Shield },
                { label: "Seguridad", value: stats.securityCoverage, icon: Shield },
              ].map((s) => (
                <div key={s.label} className="glass rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-primary">{s.value}</div>
                  <div className="text-[10px] text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Ecosistema <span className="text-primary">Completo</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              12 módulos integrados bajo la TAMVAI API soberana
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-4 hover:border-primary/30 transition-all group cursor-pointer"
              >
                <f.icon className={`w-6 h-6 mb-2 ${f.color} group-hover:scale-110 transition-transform`} />
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CEO Section */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-primary mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-primary-foreground">
                E
              </div>
              <h3 className="text-xl font-bold mb-1">Edwin Oswaldo Castillo Trejo</h3>
              <p className="text-primary text-sm mb-3">CEO & Fundador · Anubis Villaseñor</p>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mx-auto">
                Ingeniero y visionario originario de Realmont, México. Creador de la arquitectura 
                civilizacional TAMV y del protocolo IMMORTAL CORE. Su visión: construir la 
                infraestructura digital donde la dignidad dicta lo que la tecnología puede hacer, 
                unificando redes sociales, metaversos y economía programable en un sistema soberano 
                gobernado por IA ética.
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <Button variant="glass" size="sm" onClick={() => navigate("/about")}>
                  Ver biografía completa
                </Button>
                <Button variant="glass" size="sm" onClick={() => navigate("/tamvai")}>
                  <Cpu className="w-3 h-3 mr-1" />
                  TAMVAI API
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
