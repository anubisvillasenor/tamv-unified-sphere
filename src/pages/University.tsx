import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  Lightbulb,
  Loader2
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
  'Todos', 'Blockchain', 'IA Ética', 'Metaverso', 'Economía MSR', 'DevHub', 'Seguridad'
];

const University = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = selectedCategory === 'Todos' 
    ? courses 
    : courses.filter(c => c.category === selectedCategory);

  // Sample courses for demo
  const demoCourses: Course[] = [
    {
      id: '1',
      title: 'Fundamentos del Protocolo IMMORTAL CORE',
      description: 'Aprende los principios fundamentales del protocolo de seguridad y ética de TAMV.',
      thumbnail_url: null,
      category: 'Seguridad',
      level: 'beginner',
      duration_hours: 8,
      price_msr: 0,
      is_free: true,
      enrollment_count: 1247,
      rating: 4.9
    },
    {
      id: '2',
      title: 'Desarrollo en DevHub TAMV',
      description: 'Domina las APIs y herramientas de desarrollo del ecosistema TAMV.',
      thumbnail_url: null,
      category: 'DevHub',
      level: 'intermediate',
      duration_hours: 24,
      price_msr: 150,
      is_free: false,
      enrollment_count: 583,
      rating: 4.8
    },
    {
      id: '3',
      title: 'Economía Digital con MSR Token',
      description: 'Comprende el sistema económico soberano basado en el token MSR.',
      thumbnail_url: null,
      category: 'Economía MSR',
      level: 'beginner',
      duration_hours: 12,
      price_msr: 0,
      is_free: true,
      enrollment_count: 892,
      rating: 4.7
    },
    {
      id: '4',
      title: 'IA Ética y Consciencia Digital',
      description: 'Explora los fundamentos de la inteligencia artificial ética con Isabella.',
      thumbnail_url: null,
      category: 'IA Ética',
      level: 'advanced',
      duration_hours: 32,
      price_msr: 200,
      is_free: false,
      enrollment_count: 421,
      rating: 4.9
    }
  ];

  const displayCourses = courses.length > 0 ? filteredCourses : demoCourses;

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
              className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-green-500/30 blur-[100px]"
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <GraduationCap className="h-12 w-12 text-green-500" />
              </div>
              <h1 className="text-4xl font-bold mb-4">
                <span className="text-foreground">Universidad </span>
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  TAMV
                </span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Puentes de conocimiento para la civilización digital. Aprende blockchain, 
                IA ética, economía MSR y más.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-4 mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'tamv' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </section>

        {/* Courses Grid */}
        <section className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl border border-border overflow-hidden group hover:border-primary/50 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-green-500/20 to-emerald-500/20 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-green-500/50" />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                    {course.is_free && (
                      <Badge className="absolute top-2 left-2 bg-green-500">Gratis</Badge>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {course.category}
                    </Badge>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {course.description}
                    </p>
                    
                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duration_hours}h
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.enrollment_count}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        {course.rating}
                      </div>
                    </div>
                    
                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">
                        {course.is_free ? 'Gratis' : `${course.price_msr} MSR`}
                      </span>
                      <Button variant="tamv" size="sm">
                        Inscribirse
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Knowledge Bridges */}
        <section className="container mx-auto px-4 mt-16">
          <div className="text-center mb-8">
            <Lightbulb className="h-10 w-10 text-amber-500 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-foreground">Puentes de Conocimiento</h2>
            <p className="text-muted-foreground">Conexiones de ideas entre disciplinas</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { from: 'Blockchain', to: 'Democracia Digital', type: 'Gobernanza' },
              { from: 'IA Ética', to: 'Bienestar Social', type: 'Impacto' },
              { from: 'MSR Token', to: 'Economía Circular', type: 'Sostenibilidad' }
            ].map((bridge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl p-4 border border-border"
              >
                <Badge variant="secondary" className="mb-2">{bridge.type}</Badge>
                <div className="flex items-center gap-2">
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
