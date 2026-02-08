import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Database } from '@/integrations/supabase/types';

type MessageRow = Database['public']['Tables']['messages']['Row'];

export interface Message extends MessageRow {}

export interface Conversation {
  channel_id: string;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
}

export function useMessages(channelId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isTyping, setIsTyping] = useState(false);

  // Lista de canales/conversaciones del usuario
  const { data: conversations, isLoading: loadingConversations } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('channel_members')
        .select(`channel_id, channels (name, avatar_url, channel_type)`)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Mensajes de un canal específico
  const { data: messages, isLoading: loadingMessages } = useQuery({
    queryKey: ['messages', channelId],
    queryFn: async () => {
      if (!channelId) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!channelId,
  });

  // Enviar mensaje
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!user || !channelId) throw new Error('Parámetros inválidos');
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          channel_id: channelId,
          user_id: user.id,
          content,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', channelId] });
    },
    onError: (error) => {
      toast({ title: 'Error al enviar', description: error.message, variant: 'destructive' });
    },
  });

  // Marcar como leído
  const markAsRead = useMutation({
    mutationFn: async () => {
      if (!user || !channelId) return;
      
      await supabase
        .from('channel_members')
        .update({ last_read_at: new Date().toISOString() })
        .eq('channel_id', channelId)
        .eq('user_id', user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  // Suscripción en tiempo real
  useEffect(() => {
    if (!channelId) return;

    const channel = supabase
      .channel(`messages-${channelId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${channelId}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['messages', channelId] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId, queryClient]);

  return {
    conversations,
    messages,
    loadingConversations,
    loadingMessages,
    sendMessage,
    markAsRead,
    isTyping,
    setIsTyping,
  };
}
