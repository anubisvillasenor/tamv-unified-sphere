import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Database } from '@/integrations/supabase/types';

type WalletRow = Database['public']['Tables']['wallets']['Row'];
type TransactionRow = Database['public']['Tables']['transactions']['Row'];

export interface Wallet extends WalletRow {}
export interface Transaction extends TransactionRow {}

export function useWallet() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wallet, isLoading } = useQuery({
    queryKey: ['wallet', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      // Si no existe, crear wallet
      if (!data) {
        const { data: newWallet, error: createError } = await supabase
          .from('wallets')
          .insert({ user_id: user.id })
          .select()
          .single();
        
        if (createError) throw createError;
        return newWallet as Wallet;
      }
      
      return data as Wallet;
    },
    enabled: !!user,
  });

  const { data: transactions } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user,
  });

  const sendMSR = useMutation({
    mutationFn: async ({ toUserId, amount, description }: {
      toUserId: string;
      amount: number;
      description?: string;
    }) => {
      if (!wallet || !user) throw new Error('Wallet no disponible');
      if (wallet.balance_msr < amount) throw new Error('Saldo insuficiente');
      
      // Generar hash para BookPI
      const bookpiHash = crypto.randomUUID();
      
      // Crear transacción usando la tabla tips para transferencias
      const { error: txError } = await supabase
        .from('tips')
        .insert({
          from_user_id: user.id,
          to_user_id: toUserId,
          amount_msr: amount,
          entity_type: 'post',
          entity_id: crypto.randomUUID(),
          message: description,
        });
      
      if (txError) throw txError;
      
      // Actualizar balances
      await supabase
        .from('wallets')
        .update({ balance_msr: wallet.balance_msr - amount })
        .eq('user_id', user.id);
      
      const { data: targetWallet } = await supabase
        .from('wallets')
        .select('balance_msr')
        .eq('user_id', toUserId)
        .single();
      
      if (targetWallet) {
        await supabase
          .from('wallets')
          .update({ balance_msr: (targetWallet.balance_msr || 0) + amount })
          .eq('user_id', toUserId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({ title: 'Transferencia exitosa', description: 'MSR enviados correctamente' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  return {
    wallet,
    transactions,
    isLoading,
    sendMSR,
  };
}
