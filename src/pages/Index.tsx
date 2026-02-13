import { useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";
import { CinematicHero } from "@/components/home/CinematicHero";
import { StoriesBar } from "@/components/discover/StoriesBar";
import { TrendingReels } from "@/components/discover/TrendingReels";
import { LiveNow } from "@/components/discover/LiveNow";
import { FeaturedCreators } from "@/components/discover/FeaturedCreators";
import { QuickActions } from "@/components/discover/QuickActions";
import { FederationVisual } from "@/components/discover/FederationVisual";
import { ActivityPulse } from "@/components/discover/ActivityPulse";
import { IsabellaWidget } from "@/components/isabella/IsabellaWidget";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const MatrixRain = lazy(() => import("@/components/effects/MatrixRain"));

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/feed");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Matrix Rain Background */}
      <Suspense fallback={null}>
        <MatrixRain />
      </Suspense>

      <Header />

      <main className="relative z-10">
        {/* Cinematic Welcome */}
        <CinematicHero />

        {/* Discover Section */}
        <section className="relative pt-4 pb-8">
          <div className="container mx-auto px-4">
            {/* Stories */}
            <div className="mb-6">
              <StoriesBar />
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <QuickActions />
            </div>

            {/* Main Content Grid - 75% visual */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left - Visual content */}
              <div className="lg:col-span-8 space-y-6">
                <LiveNow />
                <TrendingReels />
              </div>

              {/* Right - Sidebar */}
              <div className="lg:col-span-4 space-y-4">
                <IsabellaWidget />

                <div className="glass rounded-xl p-4">
                  <ActivityPulse />
                </div>

                <div className="glass rounded-xl p-4">
                  <FeaturedCreators />
                </div>

                <div className="glass rounded-xl p-4">
                  <FederationVisual />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl glass p-10 text-center scanlines"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-metallic">
                Tu civilización digital te espera
              </h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
                Donde la dignidad dicta lo que la tecnología puede hacer.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="tamv"
                  size="lg"
                  className="gap-2"
                  onClick={() => navigate("/auth")}
                >
                  Crear Identidad ID-NVIDA
                  <ArrowRight className="w-4 h-4" />
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
