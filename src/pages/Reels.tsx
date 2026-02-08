import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageCircle, Share2, Music2, 
  ChevronUp, ChevronDown, Play, Pause,
  Volume2, VolumeX, Plus
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useReels, Reel } from '@/hooks/useReels';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const ReelCard = ({ 
  reel, 
  isActive, 
  onLike, 
  onView 
}: { 
  reel: Reel; 
  isActive: boolean; 
  onLike: () => void;
  onView: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      onView();
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, onView]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      onLike();
    }
  };

  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center">
      {reel.video_url ? (
        <video
          ref={videoRef}
          src={reel.video_url}
          className="h-full w-full object-cover"
          loop
          muted={isMuted}
          playsInline
          onClick={togglePlay}
          poster={reel.thumbnail_url || undefined}
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-[hsl(var(--tamv-primary))] to-[hsl(var(--tamv-accent))] flex items-center justify-center">
          <p className="text-white text-lg">Vista previa no disponible</p>
        </div>
      )}

      {/* Play/Pause overlay */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
            onClick={togglePlay}
          >
            <div className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center">
              <Play className="w-10 h-10 text-white ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar de acciones */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6">
        <button 
          onClick={handleLike}
          className="flex flex-col items-center gap-1"
        >
          <div className={`p-3 rounded-full ${liked ? 'bg-red-500' : 'bg-white/20'}`}>
            <Heart className={`w-7 h-7 ${liked ? 'text-white fill-white' : 'text-white'}`} />
          </div>
          <span className="text-white text-sm font-semibold">
            {(reel.like_count || 0) + (liked ? 1 : 0)}
          </span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="p-3 rounded-full bg-white/20">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <span className="text-white text-sm font-semibold">{reel.comment_count || 0}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="p-3 rounded-full bg-white/20">
            <Share2 className="w-7 h-7 text-white" />
          </div>
          <span className="text-white text-sm font-semibold">{reel.share_count || 0}</span>
        </button>

        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="p-3 rounded-full bg-white/20"
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-white" />
          ) : (
            <Volume2 className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Info del creador */}
      <div className="absolute left-4 bottom-32 right-20 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-12 h-12 border-2 border-white">
            <AvatarImage src={reel.profiles?.avatar_url || ''} />
            <AvatarFallback className="bg-[hsl(var(--tamv-primary))]">
              {reel.profiles?.display_name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold">@{reel.profiles?.username || 'usuario'}</p>
            <p className="text-sm opacity-80">
              {formatDistanceToNow(new Date(reel.created_at || ''), { addSuffix: true, locale: es })}
            </p>
          </div>
          <Button size="sm" variant="outline" className="ml-2 border-white text-white hover:bg-white/20">
            Seguir
          </Button>
        </div>

        <p className="text-sm mb-2 line-clamp-2">{reel.caption}</p>

        {reel.music_title && (
          <div className="flex items-center gap-2">
            <Music2 className="w-4 h-4" />
            <span className="text-sm">{reel.music_title}</span>
          </div>
        )}
      </div>

      {/* Views */}
      <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full">
        <span className="text-white text-sm">{reel.view_count || 0} vistas</span>
      </div>
    </div>
  );
};

const Reels = () => {
  const { user } = useAuth();
  const { reels, isLoading, currentIndex, setCurrentIndex, likeReel, incrementView } = useReels(20);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'up' | 'down') => {
    if (!reels) return;
    
    if (direction === 'down' && currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'up' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      handleScroll('down');
    } else {
      handleScroll('up');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[hsl(var(--tamv-primary))]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main 
        ref={containerRef}
        className="h-[calc(100vh-80px)] relative overflow-hidden"
        onWheel={handleWheel}
      >
        {/* Navegación vertical */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-4">
          <button 
            onClick={() => handleScroll('up')}
            disabled={currentIndex === 0}
            className="p-2 rounded-full bg-white/20 disabled:opacity-30"
          >
            <ChevronUp className="w-6 h-6 text-white" />
          </button>
          <button 
            onClick={() => handleScroll('down')}
            disabled={!reels || currentIndex >= reels.length - 1}
            className="p-2 rounded-full bg-white/20 disabled:opacity-30"
          >
            <ChevronDown className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Reels */}
        <AnimatePresence mode="wait">
          {reels && reels[currentIndex] && (
            <motion.div
              key={reels[currentIndex].id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="h-full"
            >
              <ReelCard 
                reel={reels[currentIndex]} 
                isActive={true}
                onLike={() => likeReel.mutate(reels[currentIndex].id)}
                onView={() => incrementView(reels[currentIndex].id)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Indicador de posición */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
          {reels?.slice(0, 10).map((_, idx) => (
            <div 
              key={idx}
              className={`w-1 h-6 rounded-full transition-colors ${
                idx === currentIndex ? 'bg-[hsl(var(--tamv-primary))]' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Botón crear */}
        {user && (
          <Button
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[hsl(var(--tamv-primary))] hover:bg-[hsl(var(--tamv-primary))]/80"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear Reel
          </Button>
        )}

        {(!reels || reels.length === 0) && (
          <div className="h-full flex items-center justify-center text-white">
            <div className="text-center">
              <p className="text-xl mb-4">No hay reels disponibles</p>
              <p className="text-sm opacity-60">Sé el primero en publicar</p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Reels;
