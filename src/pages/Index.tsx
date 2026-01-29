import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { LayersSection } from "@/components/home/LayersSection";
import { FederatedLayers } from "@/components/home/FederatedLayers";
import { SocialFeed } from "@/components/home/SocialFeed";
import { IsabellaSection } from "@/components/home/IsabellaSection";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <LayersSection />
        <SocialFeed />
        <IsabellaSection />
        <FederatedLayers />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
