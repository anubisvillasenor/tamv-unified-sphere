import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface IsabellaMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export const useIsabella = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<IsabellaMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const startConversation = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('isabella_conversations')
        .insert({ user_id: user.id, title: 'Nueva conversación' })
        .select()
        .single();

      if (error) throw error;
      setConversationId(data.id);
      setMessages([]);
      return data.id;
    } catch (error) {
      console.error('Error starting conversation:', error);
      return null;
    }
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!user) return;
    
    setLoading(true);
    
    // Add user message immediately
    const userMessage: IsabellaMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Call Isabella AI edge function
      const response = await supabase.functions.invoke('isabella-chat', {
        body: { 
          message: content,
          conversationId,
          history: messages.slice(-10).map(m => ({ role: m.role, content: m.content }))
        }
      });

      if (response.error) throw response.error;

      const assistantMessage: IsabellaMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.data.message,
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: IsabellaMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.',
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [user, conversationId, messages]);

  const clearConversation = () => {
    setMessages([]);
    setConversationId(null);
  };

  return { 
    messages, 
    loading, 
    sendMessage, 
    startConversation, 
    clearConversation,
    conversationId 
  };
};
