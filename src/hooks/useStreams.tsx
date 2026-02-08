import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Database } from '@/integrations/supabase/types';

type StreamRow = Database['public']['Tables']['streams']['Row'];

export interface Stream extends StreamRow {
  profiles?: {
    display_name: string;
    avatar_url: string | null;
    username: string;
  } | null;
}

export function useStreams() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: liveStreams, isLoading } = useQuery({
    queryKey: ['streams', 'live'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('streams')
        .select('*')
        .eq('status', 'live')
        .order('viewer_count', { ascending: false });
      
      if (error) throw error;
      return data as Stream[];
    },
    refetchInterval: 30000,
  });

  const { data: myStream } = useQuery({
    queryKey: ['streams', 'my', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('streams')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as Stream | null;
    },
    enabled: !!user,
  });

  const createStream = useMutation({
    mutationFn: async (stream: { title: string; description?: string; category?: string }) => {
      if (!user) throw new Error('No autenticado');
      
      const { data, error } = await supabase
        .from('streams')
        .insert({
          user_id: user.id,
          ...stream,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Stream;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['streams'] });
      toast({ 
        title: 'Stream creado', 
        description: `Tu stream key es: ${data.stream_key}` 
      });
    },
  });

  const goLive = useMutation({
    mutationFn: async (streamId: string) => {
      const { error } = await supabase
        .from('streams')
        .update({ status: 'live', started_at: new Date().toISOString() })
        .eq('id', streamId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streams'] });
      toast({ title: '¡Estás en vivo!', description: 'Tu transmisión ha comenzado' });
    },
  });

  const endStream = useMutation({
    mutationFn: async (streamId: string) => {
      const { error } = await supabase
        .from('streams')
        .update({ status: 'ended', ended_at: new Date().toISOString() })
        .eq('id', streamId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streams'] });
      toast({ title: 'Stream finalizado' });
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('streams-realtime')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'streams',
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['streams'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    liveStreams,
    myStream,
    isLoading,
    createStream,
    goLive,
    endStream,
  };
}
