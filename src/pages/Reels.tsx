import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageCircle, Share2, Music2, 
  Play, Pause, Volume2, VolumeX, Plus, Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useReels, Reel } from '@/hooks/useReels';
import { useAuth } from '@/hooks/useAuth';
import { sounds } from '@/lib/sounds';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Demo reels for when DB is empty
const DEMO_REELS: Reel[] = [
  {
    id: 'demo-1', user_id: '', video_url: '', thumbnail_url: null,
    caption: '🌌 Bienvenido a TAMV — Tu civilización digital soberana te espera. #TAMV #CivilizaciónDigital',
    music_title: 'TAMV Anthem', music_url: null, duration_seconds: 15,
    like_count: 2847, comment_count: 312, share_count: 891, view_count: 45200,
    is_public: true, is_featured: true, bookpi_hash: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    profiles: { display_name: 'TAMV Official', avatar_url: null, username: 'tamv' }
  },
  {
    id: 'demo-2', user_id: '', video_url: '', thumbnail_url: null,
    caption: '🧠 Isabella AI: consciencia ética algorítmica al servicio de la humanidad #IsabellaAI #ÉticaDigital',
    music_title: 'Digital Dreams', music_url: null, duration_seconds: 12,
    like_count: 1523, comment_count: 187, share_count: 445, view_count: 23100,
    is_public: true, is_featured: true, bookpi_hash: null,
    created_at: new Date(Date.now() - 3600000).toISOString(), updated_at: new Date().toISOString(),
    profiles: { display_name: 'Isabella V.', avatar_url: null, username: 'isabella_ai' }
  },
  {
    id: 'demo-3', user_id: '', video_url: '', thumbnail_url: null,
    caption: '🔐 Zero-Trust Security: tu identidad, tus datos, tu soberanía. #IDNvida #Seguridad',
    music_title: 'Quantum Shield', music_url: null, duration_seconds: 18,
    like_count: 987, comment_count: 123, share_count: 334, view_count: 15800,
    is_public: true, is_featured: false, bookpi_hash: null,
    created_at: new Date(Date.now() - 7200000).toISOString(), updated_at: new Date().toISOString(),
    profiles: { display_name: 'CyberGuard', avatar_url: null, username: 'guard_tamv' }
  },
  {
    id: 'demo-4', user_id: '', video_url: '', thumbnail_url: null,
    caption: '💰 NubiWallet + MSR Token = economía programable soberana #NubiWallet #MSR #EconomíaDigital',
    music_title: 'MSR Flow', music_url: null, duration_seconds: 20,
    like_count: 2100, comment_count: 256, share_count: 678, view_count: 31400,
    is_public: true, is_featured: true, bookpi_hash: null,
    created_at: new Date(Date.now() - 10800000).toISOString(), updated_at: new Date().toISOString(),
    profiles: { display_name: 'NubiFinance', avatar_url: null, username: 'nubi_wallet' }
  },
  {
    id: 'demo-5', user_id: '', video_url: '', thumbnail_url: null,
    caption: '🎓 Universidad TAMV: conocimiento soberano para la nueva era digital #UTAMV #Educación',
    music_title: 'Academic Rise', music_url: null, duration_seconds: 14,
    like_count: 1340, comment_count: 198, share_count: 512, view_count: 19700,
    is_public: true, is_featured: false, bookpi_hash: null,
    created_at: new Date(Date.now() - 14400000).toISOString(), updated_at: new Date().toISOString(),
    profiles: { display_name: 'UTAMV Oficial', avatar_url: null, username: 'utamv' }
  },
];

const GRADIENTS = [
  'from-blue-600/80 via-cyan-500/60 to-teal-400/80',
  'from-violet-600/80 via-purple-500/60 to-fuchsia-400/80',
  'from-amber-600/80 via-orange-500/60 to-rose-400/80',
  'from-emerald-600/80 via-green-500/60 to-lime-400/80',
  'from-sky-600/80 via-blue-500/60 to-indigo-400/80',
];

const ReelCard = ({ reel, isActive, index, onLike }: { 
  reel: Reel; isActive: boolean; index: number; onLike: () => void;
}) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      onLike();
      sounds.like();
    }
  };

  const handleDoubleTap = () => {
    if (!liked) handleLike();
  };

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center select-none"
      onDoubleClick={handleDoubleTap}
    >
      {/* Visual background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]}`}>
        <div className="absolute inset-0 bg-black/30" />
        {/* Animated particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -200, 0], 
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0, 0.6, 0] 
            }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
            className="absolute w-1 h-1 rounded-full bg-white/40"
            style={{ left: `${15 + i * 15}%`, bottom: '20%' }}
          />
        ))}
      </div>

      {/* Center logo/icon */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 text-center"
      >
        <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center mx-auto mb-4 border border-white/20">
          <span className="text-4xl">
            {['🌌', '🧠', '🔐', '💰', '🎓'][index % 5]}
          </span>
        </div>
      </motion.div>

      {/* Side actions */}
      <div className="absolute right-3 bottom-32 flex flex-col items-center gap-5 z-20">
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <motion.div 
            whileTap={{ scale: 1.3 }}
            className={`p-2.5 rounded-full ${liked ? 'bg-red-500' : 'bg-white/20 backdrop-blur-sm'}`}
          >
            <Heart className={`w-6 h-6 ${liked ? 'text-white fill-white' : 'text-white'}`} />
          </motion.div>
          <span className="text-white text-xs font-bold">{(reel.like_count || 0) + (liked ? 1 : 0)}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-sm">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-bold">{reel.comment_count || 0}</span>
        </button>

        <button className="flex flex-col items-center gap-1" onClick={() => { sounds.send(); }}>
          <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-sm">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-bold">{reel.share_count || 0}</span>
        </button>

        <button onClick={() => { setSaved(!saved); sounds.click(); }} className="flex flex-col items-center gap-1">
          <div className={`p-2.5 rounded-full ${saved ? 'bg-primary' : 'bg-white/20 backdrop-blur-sm'}`}>
            <Bookmark className={`w-6 h-6 ${saved ? 'text-white fill-white' : 'text-white'}`} />
          </div>
        </button>
      </div>

      {/* Creator info */}
      <div className="absolute left-3 bottom-28 right-16 text-white z-20">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="w-10 h-10 border-2 border-white/50">
            <AvatarImage src={reel.profiles?.avatar_url || ''} />
            <AvatarFallback className="bg-primary/50 text-white text-sm font-bold">
              {reel.profiles?.display_name?.[0] || 'T'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-sm">@{reel.profiles?.username || 'tamv'}</p>
            <p className="text-[10px] opacity-70">
              {formatDistanceToNow(new Date(reel.created_at || ''), { addSuffix: true, locale: es })}
            </p>
          </div>
          <Button size="sm" variant="outline" className="ml-auto border-white/50 text-white text-xs h-7 hover:bg-white/20">
            Seguir
          </Button>
        </div>
        <p className="text-sm leading-relaxed line-clamp-2">{reel.caption}</p>
        {reel.music_title && (
          <div className="flex items-center gap-1.5 mt-1.5 opacity-80">
            <Music2 className="w-3 h-3" />
            <span className="text-xs">{reel.music_title}</span>
          </div>
        )}
      </div>

      {/* View count */}
      <div className="absolute top-4 right-3 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full z-20">
        <span className="text-white text-xs font-medium">{(reel.view_count || 0).toLocaleString()} vistas</span>
      </div>
    </div>
  );
};

const Reels = () => {
  const { user } = useAuth();
  const { reels: dbReels, isLoading, currentIndex, setCurrentIndex, likeReel, incrementView } = useReels(20);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const reels = (dbReels && dbReels.length > 0) ? dbReels : DEMO_REELS;

  const goTo = useCallback((direction: 'up' | 'down') => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    if (direction === 'down' && currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
      sounds.navigate();
    } else if (direction === 'up' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      sounds.navigate();
    }
    setTimeout(() => setIsTransitioning(false), 400);
  }, [currentIndex, reels.length, isTransitioning, setCurrentIndex]);

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) > 30) {
      goTo(e.deltaY > 0 ? 'down' : 'up');
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartY(e.touches[0].clientY);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 60) goTo(diff > 0 ? 'down' : 'up');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') goTo('down');
      if (e.key === 'ArrowUp' || e.key === 'k') goTo('up');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-black overflow-hidden">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pt-3 pb-2 bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={() => window.history.back()} className="text-white text-sm font-medium">
          ← Volver
        </button>
        <h1 className="text-white font-bold text-lg">Reels</h1>
        <div className="w-12" />
      </div>

      {/* Reels container */}
      <div 
        className="h-full relative"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          {reels[currentIndex] && (
            <motion.div
              key={reels[currentIndex].id}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full relative"
            >
              <ReelCard
                reel={reels[currentIndex]}
                isActive={true}
                index={currentIndex}
                onLike={() => {
                  if (dbReels && dbReels.length > 0) {
                    likeReel.mutate(reels[currentIndex].id);
                  }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress dots */}
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 z-20">
          {reels.slice(0, Math.min(reels.length, 12)).map((_, idx) => (
            <motion.div
              key={idx}
              animate={{ scale: idx === currentIndex ? 1.3 : 1 }}
              className={`w-1 rounded-full transition-all duration-200 ${
                idx === currentIndex ? 'h-6 bg-primary' : 'h-3 bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Create button */}
        {user && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30"
          >
            <Button
              variant="tamv"
              size="lg"
              className="rounded-full shadow-xl gap-2"
              onClick={() => sounds.click()}
            >
              <Plus className="w-5 h-5" />
              Crear Reel
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Reels;
