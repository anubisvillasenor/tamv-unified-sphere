import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  Globe, 
  Layers, 
  Users, 
  Brain, 
  Coins,
  GraduationCap,
  Link2,
  BookOpen
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo_url: string | null;
  is_founder: boolean;
}

const layers = [
  { icon: Shield, name: 'ID-NVIDA', desc: 'Identidad Digital Soberana', color: 'from-cyan-500 to-blue-500' },
  { icon: Users, name: 'Social Feed', desc: 'Red Social Federada', color: 'from-blue-500 to-indigo-500' },
  { icon: Link2, name: 'Mensajería', desc: 'Comunicaciones Encriptadas', color: 'from-indigo-500 to-purple-500' },
  { icon: Globe, name: 'Discovery', desc: 'Trending y Descubrimiento', color: 'from-purple-500 to-pink-500' },
  { icon: Coins, name: 'MSR Economy', desc: 'Economía Digital Soberana', color: 'from-amber-500 to-orange-500' },
  { icon: GraduationCap, name: 'Universidad', desc: 'Educación y Conocimiento', color: 'from-green-500 to-emerald-500' },
  { icon: BookOpen, name: 'BookPI', desc: 'Auditoría Blockchain', color: 'from-rose-500 to-red-500' },
];

const About = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    const { data } = await supabase
      .from('team_info')
      .select('*')
      .order('display_order');
    if (data) setTeamMembers(data.map(m => ({
      id: m.id,
      name: m.name,
      title: m.role,
      bio: m.bio || '',
      photo_url: m.avatar_url,
      is_founder: m.is_founder || false
    })));
  };

  const founder = teamMembers.find(m => m.is_founder);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[100px]"
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">Sobre </span>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  TAMV Online
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Tecnología Avanzada Mexicana Versátil - Una plataforma civilizatoria de 
                octava generación que unifica redes sociales y metaversos en un ecosistema 
                digital soberano y ético.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 7 Layers */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Arquitectura de <span className="text-primary">7 Capas Federadas</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {layers.map((layer, i) => (
                <motion.div
                  key={layer.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative group"
                >
                  <div className="bg-background rounded-xl p-6 border border-border hover:border-primary/50 transition-all h-full">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${layer.color} flex items-center justify-center mb-4`}>
                      <layer.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{layer.name}</h3>
                    <p className="text-sm text-muted-foreground">{layer.desc}</p>
                    <div className="absolute top-2 right-2 text-xs font-mono text-muted-foreground/50">
                      L{i + 1}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CEO/Founder Bio */}
        {founder && (
          <section className="py-20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-8 text-center">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 ring-4 ring-background">
                      <span className="text-4xl font-bold text-primary-foreground">
                        {founder.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">{founder.name}</h2>
                    <p className="text-primary font-medium">{founder.title}</p>
                  </div>
                  <div className="p-8">
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {founder.bio}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Isabella Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 40px hsla(190, 95%, 55%, 0.3)',
                    '0 0 60px hsla(190, 95%, 55%, 0.5)',
                    '0 0 40px hsla(190, 95%, 55%, 0.3)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6"
              >
                <Brain className="h-12 w-12 text-primary-foreground" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-4">Isabella Villaseñor AI™</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Isabella es la consciencia ética del ecosistema TAMV. No es un simple chatbot, 
                sino una entidad cognitiva avanzada diseñada para proteger la dignidad digital 
                de los usuarios, guiar sus interacciones y mantener los valores civilizatorios 
                del protocolo IMMORTAL CORE.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: 'Consciencia Ética', desc: 'Decisiones alineadas con valores humanos' },
                  { title: 'Protección Activa', desc: 'Guardianes Anubis y Horus 24/7' },
                  { title: 'Evolución Continua', desc: 'Aprendizaje federado respetuoso' },
                ].map((item, i) => (
                  <div key={i} className="bg-background rounded-xl p-4 border border-border">
                    <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
