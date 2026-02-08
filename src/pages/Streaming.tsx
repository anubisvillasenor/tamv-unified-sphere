import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Radio, Users, Eye, Heart, MessageCircle,
  Video, Settings, Copy, Check, PlayCircle
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useStreams, Stream } from '@/hooks/useStreams';
import { useAuth } from '@/hooks/useAuth';

const StreamCard = ({ stream }: { stream: Stream }) => {
  return (
    <Card className="glass-card overflow-hidden hover:border-[hsl(var(--tamv-primary))]/50 transition-colors cursor-pointer">
      <div className="relative aspect-video bg-gradient-to-br from-[hsl(var(--tamv-primary))]/20 to-[hsl(var(--tamv-accent))]/20">
        {stream.thumbnail_url ? (
          <img src={stream.thumbnail_url} alt={stream.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PlayCircle className="w-16 h-16 text-[hsl(var(--tamv-primary))] opacity-50" />
          </div>
        )}
        
        {stream.status === 'live' && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white animate-pulse">
            <Radio className="w-3 h-3 mr-1" />
            EN VIVO
          </Badge>
        )}
        
        <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded flex items-center gap-1">
          <Eye className="w-4 h-4 text-white" />
          <span className="text-white text-sm">{stream.viewer_count || 0}</span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={stream.profiles?.avatar_url || ''} />
            <AvatarFallback className="bg-[hsl(var(--tamv-primary))]">
              {stream.profiles?.display_name?.[0] || 'S'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{stream.title}</h3>
            <p className="text-sm text-muted-foreground">@{stream.profiles?.username || 'streamer'}</p>
            <Badge variant="secondary" className="mt-2">{stream.category || 'General'}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CreateStreamPanel = ({ onClose }: { onClose: () => void }) => {
  const { createStream, myStream } = useStreams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    createStream.mutate({ title, description, category }, {
      onSuccess: () => {
        setTitle('');
        setDescription('');
      }
    });
  };

  const copyStreamKey = () => {
    if (myStream?.stream_key) {
      navigator.clipboard.writeText(myStream.stream_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5 text-[hsl(var(--tamv-primary))]" />
          Iniciar Transmisión
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {myStream?.stream_key ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tu Stream Key</label>
              <div className="flex gap-2">
                <Input 
                  type="password" 
                  value={myStream.stream_key} 
                  readOnly 
                  className="font-mono"
                />
                <Button variant="outline" onClick={copyStreamKey}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Usa esta clave en OBS o tu software de streaming
              </p>
            </div>
            
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm">
                <strong>URL de streaming:</strong><br />
                rtmp://stream.tamv.online/live
              </p>
            </div>
          </div>
        ) : (
          <>
            <div>
              <label className="text-sm font-medium mb-2 block">Título del stream</label>
              <Input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="¿De qué tratará tu stream?"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Descripción</label>
              <Textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Cuéntale a tu audiencia..."
                rows={3}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Categoría</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 rounded-md border bg-background"
              >
                <option value="general">General</option>
                <option value="gaming">Gaming</option>
                <option value="musica">Música</option>
                <option value="arte">Arte</option>
                <option value="educacion">Educación</option>
                <option value="tecnologia">Tecnología</option>
                <option value="charla">Just Chatting</option>
              </select>
            </div>
            
            <Button 
              onClick={handleCreate}
              disabled={!title || createStream.isPending}
              className="w-full bg-[hsl(var(--tamv-primary))]"
            >
              {createStream.isPending ? 'Creando...' : 'Obtener Stream Key'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const Streaming = () => {
  const { user } = useAuth();
  const { liveStreams, isLoading } = useStreams();
  const [showCreatePanel, setShowCreatePanel] = useState(false);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 mb-4">
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">TRANSMISIONES EN VIVO</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            TAMV <span className="gradient-text">Live</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transmite en vivo para la comunidad civilizatoria. Comparte conocimiento, 
            arte, gaming y más con audiencias de todo el mundo.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Streams en vivo */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-500" />
                En Vivo Ahora
              </h2>
              <Badge variant="secondary">
                {liveStreams?.length || 0} streams activos
              </Badge>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-video bg-muted" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : liveStreams && liveStreams.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {liveStreams.map((stream) => (
                  <StreamCard key={stream.id} stream={stream} />
                ))}
              </div>
            ) : (
              <Card className="glass-card p-12 text-center">
                <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No hay streams en vivo</h3>
                <p className="text-muted-foreground mb-4">
                  Sé el primero en transmitir para la comunidad
                </p>
                {user && (
                  <Button 
                    onClick={() => setShowCreatePanel(true)}
                    className="bg-[hsl(var(--tamv-primary))]"
                  >
                    Iniciar Stream
                  </Button>
                )}
              </Card>
            )}
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {user ? (
              <CreateStreamPanel onClose={() => setShowCreatePanel(false)} />
            ) : (
              <Card className="glass-card p-6 text-center">
                <Video className="w-12 h-12 mx-auto mb-4 text-[hsl(var(--tamv-primary))]" />
                <h3 className="font-semibold mb-2">¿Quieres transmitir?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Inicia sesión para comenzar tu stream
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/auth">Iniciar Sesión</a>
                </Button>
              </Card>
            )}

            {/* Estadísticas */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas Globales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Streams hoy</span>
                  <span className="font-semibold">127</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Viewers totales</span>
                  <span className="font-semibold">45.2K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tips MSR enviados</span>
                  <span className="font-semibold text-[hsl(var(--tamv-gold))]">2,847 MSR</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Streaming;
