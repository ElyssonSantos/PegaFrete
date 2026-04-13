import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRole() {
  const [role, setRole] = useState(sessionStorage.getItem('pegafrete_user_role') || null);
  const [loading, setLoading] = useState(!role);
  const [isAdmin, setIsAdmin] = useState(role === 'admin');

  useEffect(() => {
    async function fetchRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }

        // Tentar buscar do sessionStorage primeiro
        const cachedRole = sessionStorage.getItem('pegafrete_user_role');
        if (cachedRole) {
          setRole(cachedRole);
          setIsAdmin(cachedRole === 'admin');
          setLoading(false);
          return;
        }

        // Se não houver cache, buscar no banco
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setRole(data.role);
          setIsAdmin(data.role === 'admin');
          sessionStorage.setItem('pegafrete_user_role', data.role);
        }
      } catch (err) {
        console.error('Erro ao buscar cargo:', err);
        setRole(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, []);

  return { role, isAdmin, loading };
}
