-- =====================================================
-- TAMV DREAMWORLD v2.0 - MIGRACIÓN COMPLETA DE PRODUCCIÓN
-- Sistema de Reels, Streaming, Grupos y mejoras
-- =====================================================

-- 1. TABLA DE REELS (Videos cortos estilo TikTok)
CREATE TABLE IF NOT EXISTS public.reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  music_url TEXT,
  music_title TEXT,
  duration_seconds INTEGER DEFAULT 15,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  bookpi_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABLA DE STREAMING (Transmisiones en vivo)
CREATE TABLE IF NOT EXISTS public.streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  stream_key TEXT UNIQUE,
  stream_url TEXT,
  status TEXT DEFAULT 'offline' CHECK (status IN ('offline', 'live', 'ended')),
  viewer_count INTEGER DEFAULT 0,
  peak_viewers INTEGER DEFAULT 0,
  category TEXT DEFAULT 'general',
  is_monetized BOOLEAN DEFAULT false,
  tips_msr NUMERIC(20,8) DEFAULT 0,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABLA DE GRUPOS (Comunidades)
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  owner_id UUID NOT NULL,
  member_count INTEGER DEFAULT 1,
  post_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  rules TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. MIEMBROS DE GRUPOS
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- 5. POSTS DE GRUPOS
CREATE TABLE IF NOT EXISTS public.group_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  media_urls TEXT[],
  media_type TEXT DEFAULT 'none',
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. TABLA ISABELLA EVENTS (Auditoría IA)
CREATE TABLE IF NOT EXISTS public.isabella_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  layer TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT,
  ethical_state TEXT,
  risk_level TEXT,
  governance_flag TEXT,
  hitl_required BOOLEAN DEFAULT false,
  aign_score INTEGER,
  is_creator BOOLEAN DEFAULT false,
  guardian_user_id UUID,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. TABLA DE MÚSICA (Biblioteca de audio)
CREATE TABLE IF NOT EXISTS public.music_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title TEXT NOT NULL,
  artist TEXT,
  album TEXT,
  duration_seconds INTEGER,
  audio_url TEXT NOT NULL,
  cover_url TEXT,
  genre TEXT,
  is_original BOOLEAN DEFAULT false,
  use_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  license TEXT DEFAULT 'cc-by',
  bookpi_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. TABLA CEO/TEAM INFO
CREATE TABLE IF NOT EXISTS public.team_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  email TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  is_founder BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. TABLA DE TIPS/DONACIONES
CREATE TABLE IF NOT EXISTS public.tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL,
  to_user_id UUID NOT NULL,
  amount_msr NUMERIC(20,8) NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('stream', 'reel', 'post', 'artwork', 'course')),
  entity_id UUID NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. ÍNDICES PARA RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_reels_user ON public.reels(user_id);
CREATE INDEX IF NOT EXISTS idx_reels_created ON public.reels(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reels_featured ON public.reels(is_featured) WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_streams_status ON public.streams(status);
CREATE INDEX IF NOT EXISTS idx_streams_user ON public.streams(user_id);

CREATE INDEX IF NOT EXISTS idx_groups_slug ON public.groups(slug);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_group ON public.group_posts(group_id);

CREATE INDEX IF NOT EXISTS idx_isabella_events_conv ON public.isabella_events(conversation_id);
CREATE INDEX IF NOT EXISTS idx_isabella_events_session ON public.isabella_events(session_id);

CREATE INDEX IF NOT EXISTS idx_tips_to_user ON public.tips(to_user_id);

-- 11. HABILITAR RLS EN TODAS LAS TABLAS
ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.isabella_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;

-- 12. POLÍTICAS RLS - REELS
CREATE POLICY "Reels públicos visibles para todos" ON public.reels FOR SELECT USING (is_public = true);
CREATE POLICY "Usuarios ven sus propios reels privados" ON public.reels FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios crean sus reels" ON public.reels FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios editan sus reels" ON public.reels FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuarios eliminan sus reels" ON public.reels FOR DELETE USING (auth.uid() = user_id);

-- 13. POLÍTICAS RLS - STREAMS
CREATE POLICY "Streams públicos visibles" ON public.streams FOR SELECT USING (true);
CREATE POLICY "Usuarios crean sus streams" ON public.streams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios editan sus streams" ON public.streams FOR UPDATE USING (auth.uid() = user_id);

-- 14. POLÍTICAS RLS - GRUPOS
CREATE POLICY "Grupos públicos visibles" ON public.groups FOR SELECT USING (is_public = true);
CREATE POLICY "Creadores gestionan grupos" ON public.groups FOR ALL USING (auth.uid() = owner_id);

-- 15. POLÍTICAS RLS - MIEMBROS DE GRUPOS
CREATE POLICY "Miembros ven miembros del grupo" ON public.group_members FOR SELECT USING (true);
CREATE POLICY "Usuarios se unen a grupos" ON public.group_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios salen de grupos" ON public.group_members FOR DELETE USING (auth.uid() = user_id);

-- 16. POLÍTICAS RLS - POSTS DE GRUPOS
CREATE POLICY "Posts de grupos visibles para miembros" ON public.group_posts FOR SELECT USING (true);
CREATE POLICY "Miembros crean posts" ON public.group_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios editan sus posts" ON public.group_posts FOR UPDATE USING (auth.uid() = user_id);

-- 17. POLÍTICAS RLS - ISABELLA EVENTS (Solo sistema)
CREATE POLICY "Sistema lee eventos" ON public.isabella_events FOR SELECT USING (true);
CREATE POLICY "Sistema inserta eventos" ON public.isabella_events FOR INSERT WITH CHECK (true);

-- 18. POLÍTICAS RLS - MÚSICA
CREATE POLICY "Música pública visible" ON public.music_library FOR SELECT USING (is_public = true);
CREATE POLICY "Usuarios suben música" ON public.music_library FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 19. POLÍTICAS RLS - TEAM INFO (Público)
CREATE POLICY "Info del equipo pública" ON public.team_info FOR SELECT USING (true);

-- 20. POLÍTICAS RLS - TIPS
CREATE POLICY "Usuarios ven sus tips" ON public.tips FOR SELECT USING (auth.uid() = to_user_id OR auth.uid() = from_user_id);
CREATE POLICY "Usuarios envían tips" ON public.tips FOR INSERT WITH CHECK (auth.uid() = from_user_id);

-- 21. INSERTAR DATOS DEL CEO FUNDADOR
INSERT INTO public.team_info (name, role, bio, is_founder, display_order)
VALUES (
  'Edwin Oswaldo Castillo Trejo',
  'CEO & Fundador',
  'Visionario mexicano y arquitecto digital detrás de TAMV. Conocido como Anubis Villaseñor, Edwin es el creador del concepto de tecnología civilizatoria y el diseñador del protocolo IMMORTAL CORE. Originario de Real del Monte, Hidalgo, México, ha dedicado más de 15 años al desarrollo de sistemas que unifican tecnología, ética y gobernanza digital. Su visión es crear un ecosistema digital soberano que represente la vanguardia de la Tecnología Mexicana Avanzada Versátil (TAMV). Es el autor del Libro Génesis TAMV y arquitecto de la IA ética Isabella Villaseñor.',
  true,
  1
) ON CONFLICT DO NOTHING;

-- 22. HABILITAR REALTIME PARA TABLAS CLAVE
ALTER PUBLICATION supabase_realtime ADD TABLE public.reels;
ALTER PUBLICATION supabase_realtime ADD TABLE public.streams;
ALTER PUBLICATION supabase_realtime ADD TABLE public.groups;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tips;

-- 23. FUNCIÓN PARA GENERAR STREAM KEY
CREATE OR REPLACE FUNCTION public.generate_stream_key()
RETURNS TEXT AS $$
BEGIN
  RETURN 'tamv_' || encode(gen_random_bytes(16), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 24. TRIGGER PARA STREAM KEY AUTOMÁTICO
CREATE OR REPLACE FUNCTION public.set_stream_key()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stream_key IS NULL THEN
    NEW.stream_key := public.generate_stream_key();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_set_stream_key ON public.streams;
CREATE TRIGGER trigger_set_stream_key
  BEFORE INSERT ON public.streams
  FOR EACH ROW
  EXECUTE FUNCTION public.set_stream_key();

-- 25. FUNCIÓN PARA REGISTRAR EN BOOKPI
CREATE OR REPLACE FUNCTION public.register_bookpi_event(
  p_entity_type TEXT,
  p_entity_id UUID,
  p_action TEXT,
  p_actor_id UUID,
  p_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_prev_hash TEXT;
  v_block_number INTEGER;
  v_data_hash TEXT;
  v_new_id UUID;
BEGIN
  -- Obtener último hash
  SELECT data_hash, block_number INTO v_prev_hash, v_block_number
  FROM public.bookpi_ledger
  ORDER BY block_number DESC
  LIMIT 1;
  
  v_block_number := COALESCE(v_block_number, 0) + 1;
  v_data_hash := encode(sha256(convert_to(p_entity_id::TEXT || p_action || now()::TEXT, 'UTF8')), 'hex');
  
  INSERT INTO public.bookpi_ledger (
    entity_type, entity_id, action, actor_id, 
    data_hash, prev_hash, block_number
  ) VALUES (
    p_entity_type, p_entity_id::TEXT, p_action, p_actor_id,
    v_data_hash, v_prev_hash, v_block_number
  ) RETURNING id INTO v_new_id;
  
  RETURN v_new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;