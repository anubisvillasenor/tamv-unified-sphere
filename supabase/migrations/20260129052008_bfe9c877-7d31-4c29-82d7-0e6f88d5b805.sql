-- =====================================================
-- TAMV ONLINE - CIVILIZATIONAL PLATFORM DATABASE SCHEMA
-- Arquitectura de 7 Capas Federadas + Protocolo IMMORTAL CORE
-- =====================================================

-- ENUMS
CREATE TYPE public.app_role AS ENUM ('user', 'creator', 'moderator', 'admin', 'guardian');
CREATE TYPE public.content_type AS ENUM ('text', 'image', 'video', 'audio', 'music', 'reel', 'stream', 'artwork', 'document');
CREATE TYPE public.verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE public.transaction_type AS ENUM ('msr_transfer', 'auction_bid', 'subscription', 'donation', 'reward');
CREATE TYPE public.channel_type AS ENUM ('public', 'private', 'group', 'broadcast');

-- =====================================================
-- CAPA 1: IDENTIDAD DIGITAL SOBERANA (ID-NVIDA)
-- =====================================================

-- Profiles table (public identity)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  location TEXT,
  website TEXT,
  birthdate DATE,
  nvida_hash TEXT UNIQUE, -- Huella digital ID-NVIDA
  verification_status verification_status DEFAULT 'pending',
  is_public BOOLEAN DEFAULT true,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User roles table (separated for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  assigned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- =====================================================
-- CAPA 2: SOCIAL FEED - PUBLICACIONES Y CONTENIDO
-- =====================================================

-- Posts table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  content_type content_type DEFAULT 'text',
  media_urls TEXT[],
  thumbnail_url TEXT,
  hashtags TEXT[],
  mentions UUID[],
  is_reel BOOLEAN DEFAULT false,
  is_stream BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  parent_post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  bookpi_hash TEXT, -- Hash de auditoría BookPI
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Likes table
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Follows table
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
);

-- Bookmarks table
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- =====================================================
-- CAPA 3: MENSAJERÍA Y COMUNICACIONES
-- =====================================================

-- Channels (chats, groups, broadcasts)
CREATE TABLE public.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  description TEXT,
  channel_type channel_type DEFAULT 'private',
  avatar_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  member_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Channel members
CREATE TABLE public.channel_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT now(),
  last_read_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(channel_id, user_id)
);

-- Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  media_urls TEXT[],
  reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  is_edited BOOLEAN DEFAULT false,
  read_by UUID[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- CAPA 4: TRENDING Y DESCUBRIMIENTO
-- =====================================================

-- Hashtags table
CREATE TABLE public.hashtags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag TEXT UNIQUE NOT NULL,
  post_count INTEGER DEFAULT 0,
  trend_score DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trending topics
CREATE TABLE public.trending_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hashtag_id UUID REFERENCES public.hashtags(id) ON DELETE CASCADE,
  topic TEXT,
  category TEXT,
  score DECIMAL DEFAULT 0,
  rank INTEGER,
  region TEXT DEFAULT 'global',
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT now() + interval '24 hours'
);

-- =====================================================
-- CAPA 5: ARTE, SUBASTAS Y ECONOMÍA MSR
-- =====================================================

-- Art galleries
CREATE TABLE public.galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  is_public BOOLEAN DEFAULT true,
  artwork_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Artworks
CREATE TABLE public.artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  gallery_id UUID REFERENCES public.galleries(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  price_msr DECIMAL,
  is_for_sale BOOLEAN DEFAULT false,
  is_auction BOOLEAN DEFAULT false,
  edition_total INTEGER DEFAULT 1,
  edition_number INTEGER DEFAULT 1,
  bookpi_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auctions
CREATE TABLE public.auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id UUID REFERENCES public.artworks(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  starting_price_msr DECIMAL NOT NULL,
  current_price_msr DECIMAL NOT NULL,
  reserve_price_msr DECIMAL,
  highest_bidder_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  bid_count INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ DEFAULT now(),
  ends_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Bids
CREATE TABLE public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID REFERENCES public.auctions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount_msr DECIMAL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- MSR Wallets
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance_msr DECIMAL DEFAULT 0,
  locked_msr DECIMAL DEFAULT 0,
  total_earned_msr DECIMAL DEFAULT 0,
  total_spent_msr DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- MSR Transactions (EOCT Ledger)
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  to_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount_msr DECIMAL NOT NULL,
  transaction_type transaction_type NOT NULL,
  reference_id UUID,
  description TEXT,
  bookpi_hash TEXT NOT NULL,
  blockchain_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- CAPA 6: UNIVERSIDAD TAMV Y CONOCIMIENTO
-- =====================================================

-- Courses
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  category TEXT,
  level TEXT DEFAULT 'beginner',
  duration_hours INTEGER DEFAULT 0,
  price_msr DECIMAL DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  enrollment_count INTEGER DEFAULT 0,
  rating DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Course lessons
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  content TEXT,
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL,
  is_free_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Course enrollments
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  progress INTEGER DEFAULT 0,
  completed_lessons UUID[],
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- Knowledge bridges (connection of ideas)
CREATE TABLE public.knowledge_bridges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  from_concept TEXT NOT NULL,
  to_concept TEXT NOT NULL,
  connection_type TEXT,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- CAPA 7: BOOKPI AUDIT LEDGER (BLOCKCHAIN)
-- =====================================================

-- BookPI audit entries
CREATE TABLE public.bookpi_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  data_hash TEXT NOT NULL,
  prev_hash TEXT,
  merkle_root TEXT,
  block_number BIGINT,
  timestamp TIMESTAMPTZ DEFAULT now(),
  signature TEXT
);

-- =====================================================
-- CAPA 8: ISABELLA AI CONVERSATIONS
-- =====================================================

-- Isabella conversations
CREATE TABLE public.isabella_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Isabella messages
CREATE TABLE public.isabella_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.isabella_conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- CAPA 9: NOTIFICACIONES
-- =====================================================

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  reference_id UUID,
  reference_type TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- CEO FOUNDER BIO
-- =====================================================

-- Team members / founders
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  is_founder BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert CEO/Founder Edwin Oswaldo Castillo Trejo
INSERT INTO public.team_members (name, title, bio, is_founder, order_index)
VALUES (
  'Edwin Oswaldo Castillo Trejo',
  'CEO & Fundador',
  'Visionario tecnológico y arquitecto de sistemas civilizatorios de octava generación. Creador del protocolo IMMORTAL CORE y el ecosistema TAMV Online. Pionero en la integración de inteligencia artificial ética (Isabella Villaseñor AI™), blockchain soberana y redes sociales federadas. Su visión es democratizar la tecnología avanzada mexicana para crear una plataforma que unifique las redes sociales existentes y los metaversos en un ecosistema digital respetuoso de la dignidad humana y la soberanía digital de los usuarios.',
  true,
  1
);

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trending_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_bridges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookpi_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.isabella_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.isabella_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SECURITY DEFINER FUNCTION FOR ROLE CHECK
-- =====================================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Posts policies
CREATE POLICY "Anyone can view public posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Users can create their own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Anyone can view likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can manage their likes" ON public.likes FOR ALL USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Anyone can view follows" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can manage their follows" ON public.follows FOR ALL USING (auth.uid() = follower_id);

-- Bookmarks policies
CREATE POLICY "Users can view their bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);

-- Channels policies
CREATE POLICY "Public channels viewable by all" ON public.channels FOR SELECT USING (channel_type = 'public' OR channel_type = 'broadcast');
CREATE POLICY "Members can view their channels" ON public.channels FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.channel_members WHERE channel_id = id AND user_id = auth.uid())
);
CREATE POLICY "Users can create channels" ON public.channels FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Channel members policies
CREATE POLICY "Members can view channel members" ON public.channel_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.channel_members cm WHERE cm.channel_id = channel_id AND cm.user_id = auth.uid())
);
CREATE POLICY "Users can join public channels" ON public.channel_members FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Members can view messages" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.channel_members WHERE channel_id = messages.channel_id AND user_id = auth.uid())
);
CREATE POLICY "Members can send messages" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (SELECT 1 FROM public.channel_members WHERE channel_id = messages.channel_id AND user_id = auth.uid())
);

-- Hashtags and trending policies
CREATE POLICY "Anyone can view hashtags" ON public.hashtags FOR SELECT USING (true);
CREATE POLICY "Anyone can view trends" ON public.trending_topics FOR SELECT USING (true);

-- Galleries policies
CREATE POLICY "Public galleries viewable by all" ON public.galleries FOR SELECT USING (is_public = true);
CREATE POLICY "Users can manage their galleries" ON public.galleries FOR ALL USING (auth.uid() = user_id);

-- Artworks policies
CREATE POLICY "Public artworks viewable by all" ON public.artworks FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.galleries WHERE id = gallery_id AND is_public = true)
  OR user_id = auth.uid()
);
CREATE POLICY "Users can manage their artworks" ON public.artworks FOR ALL USING (auth.uid() = user_id);

-- Auctions policies
CREATE POLICY "Active auctions viewable by all" ON public.auctions FOR SELECT USING (is_active = true);
CREATE POLICY "Sellers can manage their auctions" ON public.auctions FOR ALL USING (auth.uid() = seller_id);

-- Bids policies
CREATE POLICY "Auction bids viewable by participants" ON public.bids FOR SELECT USING (true);
CREATE POLICY "Users can place bids" ON public.bids FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wallets policies
CREATE POLICY "Users can view their wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage wallets" ON public.wallets FOR ALL USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view their transactions" ON public.transactions FOR SELECT USING (
  auth.uid() = from_user_id OR auth.uid() = to_user_id
);

-- Courses policies
CREATE POLICY "Published courses viewable by all" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Instructors can manage their courses" ON public.courses FOR ALL USING (auth.uid() = instructor_id);

-- Lessons policies
CREATE POLICY "Free preview lessons viewable by all" ON public.lessons FOR SELECT USING (
  is_free_preview = true OR 
  EXISTS (SELECT 1 FROM public.enrollments WHERE course_id = lessons.course_id AND user_id = auth.uid())
);
CREATE POLICY "Instructors can manage lessons" ON public.lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND instructor_id = auth.uid())
);

-- Enrollments policies
CREATE POLICY "Users can view their enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can enroll" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their progress" ON public.enrollments FOR UPDATE USING (auth.uid() = user_id);

-- Knowledge bridges policies
CREATE POLICY "Anyone can view knowledge bridges" ON public.knowledge_bridges FOR SELECT USING (true);
CREATE POLICY "Users can create knowledge bridges" ON public.knowledge_bridges FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- BookPI ledger policies
CREATE POLICY "Public audit trail" ON public.bookpi_ledger FOR SELECT USING (true);
CREATE POLICY "System can write to ledger" ON public.bookpi_ledger FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Isabella conversations policies
CREATE POLICY "Users can view their conversations" ON public.isabella_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create conversations" ON public.isabella_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage their conversations" ON public.isabella_conversations FOR ALL USING (auth.uid() = user_id);

-- Isabella messages policies
CREATE POLICY "Users can view their messages" ON public.isabella_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.isabella_conversations WHERE id = conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can send messages" ON public.isabella_messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.isabella_conversations WHERE id = conversation_id AND user_id = auth.uid())
);

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Team members policies
CREATE POLICY "Anyone can view team members" ON public.team_members FOR SELECT USING (true);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON public.channels
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- AUTO-CREATE PROFILE AND WALLET ON SIGNUP
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)), ' ', '_')) || '_' || substr(NEW.id::text, 1, 8),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  
  INSERT INTO public.wallets (user_id, balance_msr)
  VALUES (NEW.id, 100); -- Welcome bonus of 100 MSR
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_hashtags ON public.posts USING GIN(hashtags);
CREATE INDEX idx_likes_post_id ON public.likes(post_id);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_follows_follower ON public.follows(follower_id);
CREATE INDEX idx_follows_following ON public.follows(following_id);
CREATE INDEX idx_messages_channel ON public.messages(channel_id);
CREATE INDEX idx_messages_created ON public.messages(created_at DESC);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_transactions_from ON public.transactions(from_user_id);
CREATE INDEX idx_transactions_to ON public.transactions(to_user_id);
CREATE INDEX idx_bookpi_entity ON public.bookpi_ledger(entity_type, entity_id);
CREATE INDEX idx_isabella_conv_user ON public.isabella_conversations(user_id);
CREATE INDEX idx_isabella_msg_conv ON public.isabella_messages(conversation_id);