import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Palette,
  Gavel,
  Clock,
  Coins,
  Heart,
  Share2,
  Loader2,
  ImageIcon
} from 'lucide-react';

interface Artwork {
  id: string;
  title: string;
  description: string | null;
  media_url: string;
  price_msr: number | null;
  is_for_sale: boolean;
  is_auction: boolean;
}

interface Auction {
  id: string;
  current_price_msr: number;
  ends_at: string;
  bid_count: number;
  artworks?: {
    title: string;
    media_url: string;
  };
}

const Gallery = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch artworks and auctions in parallel
      const [artworksRes, auctionsRes] = await Promise.all([
        supabase.from('artworks').select('*').limit(20),
        supabase.from('auctions').select(`
          *,
          artworks (title, media_url)
        `).eq('is_active', true).order('ends_at', { ascending: true })
      ]);

      if (artworksRes.data) setArtworks(artworksRes.data);
      if (auctionsRes.data) setAuctions(auctionsRes.data);
    } catch (error) {
      console.error('Error fetching gallery data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Demo data
  const demoArtworks: Artwork[] = [
    { id: '1', title: 'Génesis Cuántico', description: 'Arte digital generativo', media_url: '', price_msr: 500, is_for_sale: true, is_auction: false },
    { id: '2', title: 'Isabella en el Metaverso', description: 'Retrato de la IA ética', media_url: '', price_msr: 1200, is_for_sale: true, is_auction: true },
    { id: '3', title: 'Las 7 Capas', description: 'Visualización abstracta', media_url: '', price_msr: 800, is_for_sale: true, is_auction: false },
    { id: '4', title: 'BookPI Ledger', description: 'Blockchain art', media_url: '', price_msr: 650, is_for_sale: true, is_auction: false },
    { id: '5', title: 'Soberanía Digital', description: 'Concepto visual', media_url: '', price_msr: 950, is_for_sale: true, is_auction: true },
    { id: '6', title: 'MSR Token Flow', description: 'Economía visualizada', media_url: '', price_msr: 720, is_for_sale: true, is_auction: false },
  ];

  const demoAuctions: Auction[] = [
    { id: '1', current_price_msr: 450, ends_at: new Date(Date.now() + 3600000 * 5).toISOString(), bid_count: 12, artworks: { title: 'Consciencia TAMV', media_url: '' } },
    { id: '2', current_price_msr: 890, ends_at: new Date(Date.now() + 3600000 * 12).toISOString(), bid_count: 23, artworks: { title: 'Protocolo Immortal', media_url: '' } },
    { id: '3', current_price_msr: 1250, ends_at: new Date(Date.now() + 3600000 * 24).toISOString(), bid_count: 8, artworks: { title: 'Edwin Vision', media_url: '' } },
  ];

  const displayArtworks = artworks.length > 0 ? artworks : demoArtworks;
  const displayAuctions = auctions.length > 0 ? auctions : demoAuctions;

  const formatTimeLeft = (endDate: string) => {
    const diff = new Date(endDate).getTime() - Date.now();
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${mins}m`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        {/* Hero */}
        <section className="py-12 relative overflow-hidden">
          <div className="absolute inset-0">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-rose-500/30 blur-[100px]"
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Palette className="h-12 w-12 text-rose-500" />
              </div>
              <h1 className="text-4xl font-bold mb-4">
                <span className="text-foreground">Galería </span>
                <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                  de Arte Digital
                </span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Colecciona y subasta obras digitales únicas registradas en el BookPI Ledger.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tabs */}
        <section className="container mx-auto px-4">
          <Tabs defaultValue="gallery" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="gallery" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Galería
              </TabsTrigger>
              <TabsTrigger value="auctions" className="gap-2">
                <Gavel className="h-4 w-4" />
                Subastas
              </TabsTrigger>
            </TabsList>

            {/* Gallery Tab */}
            <TabsContent value="gallery">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayArtworks.map((artwork, i) => (
                    <motion.div
                      key={artwork.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card rounded-xl border border-border overflow-hidden group"
                    >
                      <div className="aspect-square bg-gradient-to-br from-rose-500/20 to-pink-500/20 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Palette className="h-16 w-16 text-rose-500/30" />
                        </div>
                        {artwork.is_auction && (
                          <Badge className="absolute top-2 right-2 bg-amber-500">
                            <Gavel className="h-3 w-3 mr-1" />
                            Subasta
                          </Badge>
                        )}
                        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="secondary" size="icon" className="h-8 w-8">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="icon" className="h-8 w-8">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground">{artwork.title}</h3>
                        <p className="text-sm text-muted-foreground">{artwork.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 text-amber-500">
                            <Coins className="h-4 w-4" />
                            <span className="font-semibold">{artwork.price_msr} MSR</span>
                          </div>
                          <Button variant="tamv" size="sm">
                            {artwork.is_auction ? 'Pujar' : 'Comprar'}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Auctions Tab */}
            <TabsContent value="auctions">
              <div className="space-y-4 max-w-4xl mx-auto">
                {displayAuctions.map((auction, i) => (
                  <motion.div
                    key={auction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card rounded-xl border border-border p-4 flex gap-4"
                  >
                    <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                      <Palette className="h-8 w-8 text-rose-500/50" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {auction.artworks?.title || 'Obra sin título'}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Coins className="h-4 w-4" />
                          <span className="font-semibold">{auction.current_price_msr} MSR</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{formatTimeLeft(auction.ends_at)} restantes</span>
                        </div>
                        <div className="text-muted-foreground">
                          {auction.bid_count} pujas
                        </div>
                      </div>
                    </div>
                    <Button variant="tamvGold" className="self-center">
                      <Gavel className="h-4 w-4 mr-2" />
                      Pujar
                    </Button>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
};

export default Gallery;
