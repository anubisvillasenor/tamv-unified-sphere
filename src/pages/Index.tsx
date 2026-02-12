import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";
import { StoriesBar } from "@/components/discover/StoriesBar";
import { TrendingReels } from "@/components/discover/TrendingReels";
import { LiveNow } from "@/components/discover/LiveNow";
import { FeaturedCreators } from "@/components/discover/FeaturedCreators";
import { QuickActions } from "@/components/discover/QuickActions";
import { FederationVisual } from "@/components/discover/FederationVisual";
import { ActivityPulse } from "@/components/discover/ActivityPulse";
import { IsabellaWidget } from "@/components/isabella/IsabellaWidget";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import logoTamv from "@/assets/logo-tamv-official.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/feed");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 pb-8">
        {/* Mini Hero - Compact, visual-first */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 quantum-grid opacity-20" />
          <motion.div
            animate={{ y: [0, -10, 0], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-secondary/10 blur-3xl"
          />

          <div className="container mx-auto px-4 relative z-10 py-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <img src={logoTamv} alt="TAMV" className="h-10 w-10 rounded-xl shadow-lg" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    TAMV <span className="text-primary">Online</span>
                  </h1>
                  <p className="text-[10px] text-muted-foreground">Ecosistema Civilizatorio Digital</p>
                </div>
              </div>
              <Button variant="tamv" size="sm" className="gap-1.5" onClick={() => navigate("/auth")}>
                <Sparkles className="w-3 h-3" />
                Unirse
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>

            {/* Stories Bar */}
            <StoriesBar />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="container mx-auto px-4 py-4">
          <QuickActions />
        </section>

        {/* Main Grid - 75% visual */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            {/* Left Column - Main visual content */}
            <div className="lg:col-span-8 space-y-6">
              {/* Live Streams */}
              <LiveNow />

              {/* Trending Reels */}
              <TrendingReels />
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-4 space-y-5">
              {/* Isabella Widget */}
              <IsabellaWidget />

              {/* Activity Pulse */}
              <div className="glass rounded-xl p-4">
                <ActivityPulse />
              </div>

              {/* Featured Creators */}
              <div className="glass rounded-xl p-4">
                <FeaturedCreators />
              </div>

              {/* Federation Visual */}
              <div className="glass rounded-xl p-4">
                <FederationVisual />
              </div>
            </div>
          </div>
        </div>

        {/* CTA bottom */}
        <section className="container mx-auto px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl glass p-8 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
                Entra al ecosistema
              </h2>
              <p className="text-sm text-muted-foreground mb-5 max-w-lg mx-auto">
                Donde la dignidad dicta lo que la tecnología puede hacer.
                Red social · Streaming · Universidad · Arte · Isabella AI · Economía MSR
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="tamv" size="lg" className="gap-2" onClick={() => navigate("/auth")}>
                  Crear Identidad Digital <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="glass" size="lg" onClick={() => navigate("/about")}>
                  Conocer TAMV
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default Index;