import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { sounds } from '@/lib/sounds';
import { MEMBERSHIP_TIERS, COURSES } from '@/lib/stripe';
import {
  GraduationCap, Play, Clock, Users, Star, BookOpen,
  Lightbulb, Loader2, Crown, Zap, Shield, Sparkles
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  category: string;
  level: string;
  duration_hours: number;
  price_msr: number;
  is_free: boolean;
  enrollment_count: number;
  rating: number;
}

const categories = [
  'Todos', 'Blockchain', 'IA Ética', 'Metaverso', 'Economía MSR', 'DevHub', 'Seguridad', 'Marketing'
];

const demoCourses: Course[] = [
  {
    id: '1', title: 'Fundamentos del Protocolo IMMORTAL CORE',
    description: 'Aprende los principios fundamentales del protocolo de seguridad y ética de TAMV.',
    thumbnail_url: null, category: 'Seguridad', level: 'beginner',
    duration_hours: 8, price_msr: 0, is_free: true, enrollment_count: 1247, rating: 4.9
  },
  {
    id: '2', title: 'Marketing Digital de Élite - Master 360',
    description: 'Programa intensivo: mentalidad, SEO, Geo, IA y estrategia de alto rendimiento.',
    thumbnail_url: null, category: 'Marketing', level: 'intermediate',
    duration_hours: 21, price_msr: 9700, is_free: false, enrollment_count: 583, rating: 4.8
  },
  {
    id: '3', title: 'Economía Digital con MSR Token',
    description: 'Comprende el sistema económico soberano basado en el token MSR.',
    thumbnail_url: null, category: 'Economía MSR', level: 'beginner',
    duration_hours: 12, price_msr: 0, is_free: true, enrollment_count: 892, rating: 4.7
  },
  {
    id: '4', title: 'IA Ética y Consciencia Digital',
    description: 'Explora los fundamentos de la inteligencia artificial ética con Isabella.',
    thumbnail_url: null, category: 'IA Ética', level: 'advanced',
    duration_hours: 32, price_msr: 200, is_free: false, enrollment_count: 421, rating: 4.9
  },
];

const COURSE_GRADIENTS = [
  'from-blue-600/30 to-cyan-500/30',
  'from-amber-500/30 to-orange-600/30',
  'from-emerald-500/30 to-teal-600/30',
  'from-violet-500/30 to-purple-600/30',
];

const TIER_ICONS = { creador: Zap, vip: Crown, elite: Sparkles, celestial: Shield };

const University = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('courses').select('*').eq('is_published', true)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setCourses(data || []);
      } catch { /* use demo */ } finally { setLoading(false); }
    };
    fetchCourses();
  }, []);

  const filteredCourses = selectedCategory === 'Todos'
    ? (courses.length > 0 ? courses : demoCourses)
    : (courses.length > 0 ? courses : demoCourses).filter(c => c.category === selectedCategory);

  const handleCheckout = async (priceId: string, mode: 'payment' | 'subscription') => {
    if (!user) { navigate('/auth'); return; }
    setCheckingOut(priceId);
    sounds.click();
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId, mode },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, '_blank');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setCheckingOut(null);
    }
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
        <section className="py-10 relative overflow-hidden">
          <div className="absolute inset-0">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[100px]"
              style={{ background: 'hsl(210, 80%, 58%)' }}
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
              <GraduationCap className="h-12 w-12 text-primary mx-auto mb-3" />
              <h1 className="text-4xl font-bold mb-3">
                <span className="text-metallic">Universidad </span>
                <span className="text-primary">TAMV</span>
              </h1>
              <p className="text-muted-foreground">
                Conocimiento soberano para la civilización digital.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Memberships */}
        <section className="container mx-auto px-4 mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4 text-center">Membresías Premium</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {Object.entries(MEMBERSHIP_TIERS).map(([key, tier], i) => {
              const Icon = TIER_ICONS[key as keyof typeof TIER_ICONS];
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass rounded-xl p-5 border border-border hover:border-primary/40 transition-all text-center"
                >
                  <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-bold text-foreground text-sm mb-1">{tier.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-2">${tier.price}<span className="text-xs text-muted-foreground">/mes</span></p>
                  <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                    {tier.features.map(f => <li key={f}>✓ {f}</li>)}
                  </ul>
                  <Button
                    variant="tamv" size="sm" className="w-full"
                    disabled={checkingOut === tier.price_id}
                    onClick={() => handleCheckout(tier.price_id, 'subscription')}
                  >
                    {checkingOut === tier.price_id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Suscribirse'}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-4 mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'tamv' : 'outline'}
                size="sm"
                onClick={() => { setSelectedCategory(cat); sounds.click(); }}
              >
                {cat}
              </Button>
            ))}
          </div>
        </section>

        {/* Courses */}
        <section className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl border border-border overflow-hidden group hover:border-primary/50 transition-all"
                >
                  <div className={`aspect-video bg-gradient-to-br ${COURSE_GRADIENTS[i % COURSE_GRADIENTS.length]} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-10 w-10 text-foreground/20" />
                    </div>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="h-10 w-10 text-white" />
                    </div>
                    {course.is_free && <Badge className="absolute top-2 left-2 bg-primary text-xs">Gratis</Badge>}
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-1.5 text-[10px]">{course.category}</Badge>
                    <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{course.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-3">
                      <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{course.duration_hours}h</span>
                      <span className="flex items-center gap-0.5"><Users className="h-3 w-3" />{course.enrollment_count}</span>
                      <span className="flex items-center gap-0.5"><Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />{course.rating}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground text-sm">
                        {course.is_free ? 'Gratis' : `$${(course.price_msr / 100).toFixed(0)} USD`}
                      </span>
                      <Button
                        variant="tamv" size="sm"
                        onClick={() => {
                          if (course.is_free) {
                            sounds.success();
                            toast({ title: '¡Inscrito!', description: 'Acceso concedido al curso.' });
                          } else {
                            handleCheckout(COURSES.master360.price_id, 'payment');
                          }
                        }}
                      >
                        {course.is_free ? 'Acceder' : 'Comprar'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Knowledge Bridges */}
        <section className="container mx-auto px-4 mt-14">
          <div className="text-center mb-6">
            <Lightbulb className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <h2 className="text-xl font-bold text-foreground">Puentes de Conocimiento</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-3 max-w-3xl mx-auto">
            {[
              { from: 'Blockchain', to: 'Democracia Digital', type: 'Gobernanza' },
              { from: 'IA Ética', to: 'Bienestar Social', type: 'Impacto' },
              { from: 'MSR Token', to: 'Economía Circular', type: 'Sostenibilidad' }
            ].map((bridge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="glass rounded-xl p-3 border border-border"
              >
                <Badge variant="secondary" className="mb-1.5 text-[10px]">{bridge.type}</Badge>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-primary font-medium">{bridge.from}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-accent font-medium">{bridge.to}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default University;
