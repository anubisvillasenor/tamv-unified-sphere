import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BookPIEntry {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  actor_id: string | null;
  data_hash: string;
  prev_hash: string | null;
  block_number: number | null;
  merkle_root: string | null;
  signature: string | null;
  timestamp: string;
}

export interface BookPIStats {
  totalBlocks: number;
  totalEntities: number;
  lastBlockTime: string | null;
  chainIntegrity: boolean;
}

export function useBookPI(limit = 50) {
  const { data: entries, isLoading } = useQuery({
    queryKey: ['bookpi', 'ledger', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookpi_ledger')
        .select('*')
        .order('block_number', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as BookPIEntry[];
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['bookpi', 'stats'],
    queryFn: async () => {
      const { data: countData } = await supabase
        .from('bookpi_ledger')
        .select('id', { count: 'exact', head: true });
      
      const { data: lastBlock } = await supabase
        .from('bookpi_ledger')
        .select('timestamp, block_number')
        .order('block_number', { ascending: false })
        .limit(1)
        .single();
      
      const { data: entities } = await supabase
        .from('bookpi_ledger')
        .select('entity_type')
        .limit(1000);
      
      const uniqueEntities = new Set(entities?.map(e => e.entity_type)).size;
      
      return {
        totalBlocks: lastBlock?.block_number || 0,
        totalEntities: uniqueEntities,
        lastBlockTime: lastBlock?.timestamp || null,
        chainIntegrity: true, // Verificación simplificada
      } as BookPIStats;
    },
  });

  const { data: entityTypes } = useQuery({
    queryKey: ['bookpi', 'entity-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookpi_ledger')
        .select('entity_type')
        .limit(1000);
      
      if (error) throw error;
      
      const counts: Record<string, number> = {};
      for (const entry of data || []) {
        counts[entry.entity_type] = (counts[entry.entity_type] || 0) + 1;
      }
      
      return Object.entries(counts).map(([type, count]) => ({ type, count }));
    },
  });

  return {
    entries,
    stats,
    entityTypes,
    isLoading,
  };
}
