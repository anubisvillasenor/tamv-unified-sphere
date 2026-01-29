import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Post {
  id: string;
  user_id: string;
  content: string | null;
  content_type: string;
  media_urls: string[] | null;
  thumbnail_url: string | null;
  hashtags: string[] | null;
  is_reel: boolean;
  is_stream: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  created_at: string;
  profiles?: {
    username: string;
    display_name: string;
    avatar_url: string | null;
    verification_status: string;
  } | null;
}

export const usePosts = (page = 1, limit = 20) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pageNum = 1) => {
    setLoading(true);
    try {
      const from = (pageNum - 1) * limit;
      const to = from + limit - 1;

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      // Fetch profiles separately for each post
      const postsWithProfiles: Post[] = [];
      
      for (const post of (data || [])) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, display_name, avatar_url, verification_status')
          .eq('user_id', post.user_id)
          .maybeSingle();
        
        postsWithProfiles.push({
          ...post,
          profiles: profileData
        });
      }
      
      if (pageNum === 1) {
        setPosts(postsWithProfiles);
      } else {
        setPosts(prev => [...prev, ...postsWithProfiles]);
      }
      
      setHasMore((data?.length || 0) === limit);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const createPost = async (content: string, mediaUrls?: string[], contentType: string = 'text', isReel = false) => {
    if (!user) return { error: new Error('Not authenticated') };

    const hashtags = content.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content,
          content_type: contentType as 'text' | 'image' | 'video' | 'audio' | 'music' | 'reel' | 'stream' | 'artwork' | 'document',
          media_urls: mediaUrls,
          hashtags,
          is_reel: isReel
        })
        .select('*')
        .single();

      if (error) throw error;
      
      // Fetch the profile for the new post
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, display_name, avatar_url, verification_status')
        .eq('user_id', user.id)
        .maybeSingle();
      
      const postWithProfile: Post = {
        ...data,
        profiles: profileData
      };
      
      setPosts(prev => [postWithProfile, ...prev]);
      return { error: null, data: postWithProfile };
    } catch (error) {
      return { error: error as Error, data: null };
    }
  };

  const likePost = async (postId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('likes')
        .insert({ user_id: user.id, post_id: postId });

      if (error && error.code !== '23505') throw error;
      
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, like_count: p.like_count + 1 } : p
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const unlikePost = async (postId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', postId);
      
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, like_count: Math.max(0, p.like_count - 1) } : p
      ));
    } catch (error) {
      console.error('Error unliking post:', error);
    }
  };

  return { posts, loading, hasMore, createPost, likePost, unlikePost, refetch: () => fetchPosts(1) };
};
