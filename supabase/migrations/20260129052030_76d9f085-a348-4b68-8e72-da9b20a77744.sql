-- Fix RLS policy warning - make notifications INSERT require authenticated user
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
CREATE POLICY "Authenticated users can create notifications" ON public.notifications 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create storage buckets for media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('banners', 'banners', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('posts', 'posts', true, 104857600, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav']),
  ('artworks', 'artworks', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4']),
  ('courses', 'courses', true, 524288000, ARRAY['video/mp4', 'video/webm', 'application/pdf', 'image/jpeg', 'image/png']);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for banners
CREATE POLICY "Banner images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
CREATE POLICY "Users can upload their own banner" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own banner" ON storage.objects FOR UPDATE USING (bucket_id = 'banners' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own banner" ON storage.objects FOR DELETE USING (bucket_id = 'banners' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for posts media
CREATE POLICY "Post media is publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'posts');
CREATE POLICY "Users can upload post media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their post media" ON storage.objects FOR DELETE USING (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for artworks
CREATE POLICY "Artworks are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'artworks');
CREATE POLICY "Users can upload artworks" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'artworks' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their artworks" ON storage.objects FOR DELETE USING (bucket_id = 'artworks' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for courses
CREATE POLICY "Course content is publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'courses');
CREATE POLICY "Instructors can upload course content" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'courses' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Instructors can delete course content" ON storage.objects FOR DELETE USING (bucket_id = 'courses' AND auth.uid()::text = (storage.foldername(name))[1]);