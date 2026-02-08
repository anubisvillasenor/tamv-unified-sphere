import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Database } from '@/integrations/supabase/types';

type ReelRow = Database['public']['Tables']['reels']['Row'];

export interface Reel extends ReelRow {
  profiles?: {
    display_name: string;
    avatar_url: string | null;
    username: string;
  } | null;
}

export function useReels(limit = 10) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: reels, isLoading, error } = useQuery({
    queryKey: ['reels', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reels')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as Reel[];
    },
  });

  const { data: featuredReels } = useQuery({
    queryKey: ['reels', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reels')
        .select('*')
        .eq('is_featured', true)
        .eq('is_public', true)
        .order('view_count', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data as Reel[];
    },
  });

  const createReel = useMutation({
    mutationFn: async (reel: {
      video_url: string;
      thumbnail_url?: string;
      caption?: string;
      music_title?: string;
      duration_seconds?: number;
    }) => {
      if (!user) throw new Error('No autenticado');
      
      const { data, error } = await supabase
        .from('reels')
        .insert({
          user_id: user.id,
          ...reel,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reels'] });
      toast({ title: 'Reel publicado', description: 'Tu reel ya está visible' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const likeReel = useMutation({
    mutationFn: async (reelId: string) => {
      // Incrementar like_count directamente
      const { data: reel } = await supabase
        .from('reels')
        .select('like_count')
        .eq('id', reelId)
        .single();
      
      const { error } = await supabase
        .from('reels')
        .update({ like_count: (reel?.like_count || 0) + 1 })
        .eq('id', reelId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reels'] });
    },
  });

  const incrementView = useCallback(async (reelId: string) => {
    const { data: reel } = await supabase
      .from('reels')
      .select('view_count')
      .eq('id', reelId)
      .single();
    
    await supabase
      .from('reels')
      .update({ view_count: (reel?.view_count || 0) + 1 })
      .eq('id', reelId);
  }, []);

  const nextReel = useCallback(() => {
    if (reels && currentIndex < reels.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [reels, currentIndex]);

  const prevReel = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  return {
    reels,
    featuredReels,
    isLoading,
    error,
    currentIndex,
    currentReel: reels?.[currentIndex],
    nextReel,
    prevReel,
    setCurrentIndex,
    createReel,
    likeReel,
    incrementView,
  };
}
