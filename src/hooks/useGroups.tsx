import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Database } from '@/integrations/supabase/types';

type GroupRow = Database['public']['Tables']['groups']['Row'];
type GroupMemberRow = Database['public']['Tables']['group_members']['Row'];
type GroupPostRow = Database['public']['Tables']['group_posts']['Row'];

export interface Group extends GroupRow {}

export interface GroupMember extends GroupMemberRow {}

export interface GroupPost extends GroupPostRow {}

export function useGroups() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('is_public', true)
        .order('member_count', { ascending: false });
      
      if (error) throw error;
      return data as Group[];
    },
  });

  const { data: myGroups } = useQuery({
    queryKey: ['groups', 'my', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('group_members')
        .select(`group_id, role, groups (*)`)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data?.map(m => ({ ...(m.groups as Group), myRole: m.role })) || [];
    },
    enabled: !!user,
  });

  const createGroup = useMutation({
    mutationFn: async (group: {
      name: string;
      slug: string;
      description?: string;
      category?: string;
      is_public?: boolean;
    }) => {
      if (!user) throw new Error('No autenticado');
      
      const { data, error } = await supabase
        .from('groups')
        .insert({
          owner_id: user.id,
          ...group,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      await supabase.from('group_members').insert({
        group_id: data.id,
        user_id: user.id,
        role: 'owner',
      });
      
      return data as Group;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast({ title: 'Grupo creado', description: 'Tu comunidad está lista' });
    },
  });

  const joinGroup = useMutation({
    mutationFn: async (groupId: string) => {
      if (!user) throw new Error('No autenticado');
      
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member',
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast({ title: 'Te has unido al grupo' });
    },
  });

  const leaveGroup = useMutation({
    mutationFn: async (groupId: string) => {
      if (!user) throw new Error('No autenticado');
      
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast({ title: 'Has salido del grupo' });
    },
  });

  return {
    groups,
    myGroups,
    isLoading,
    createGroup,
    joinGroup,
    leaveGroup,
  };
}

export function useGroupDetail(slug: string) {
  const { user } = useAuth();

  const { data: group, isLoading } = useQuery({
    queryKey: ['groups', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data as Group;
    },
  });

  const { data: members } = useQuery({
    queryKey: ['groups', slug, 'members'],
    queryFn: async () => {
      if (!group) return [];
      const { data, error } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', group.id)
        .order('joined_at', { ascending: false });
      
      if (error) throw error;
      return data as GroupMember[];
    },
    enabled: !!group,
  });

  const { data: posts } = useQuery({
    queryKey: ['groups', slug, 'posts'],
    queryFn: async () => {
      if (!group) return [];
      const { data, error } = await supabase
        .from('group_posts')
        .select('*')
        .eq('group_id', group.id)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as GroupPost[];
    },
    enabled: !!group,
  });

  const isMember = members?.some(m => m.user_id === user?.id);
  const myRole = members?.find(m => m.user_id === user?.id)?.role;

  return {
    group,
    members,
    posts,
    isLoading,
    isMember,
    myRole,
  };
}
