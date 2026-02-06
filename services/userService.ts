
import { supabase } from '../lib/supabase';
import { User, UserRole } from '../types';

export const userService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('system_users')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        if (error.code === '42P01') return [];
        throw error;
      }
      return (data || []).map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        cpf: row.cpf,
        role: row.role as UserRole,
        active: row.active
      }));
    } catch (err) {
      console.error("userService.getAll failed:", err);
      return [];
    }
  },

  async authenticate(email: string, password: string) {
    const { data, error } = await supabase
      .from('system_users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .eq('active', true)
      .single();
    
    if (error || !data) {
      console.error("Auth error:", error);
      throw new Error("E-mail ou senha incorretos.");
    }
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      cpf: data.cpf,
      role: data.role as UserRole,
      active: data.active
    };
  },

  async create(user: Partial<User>) {
    const { data, error } = await supabase
      .from('system_users')
      .insert([{
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        password: user.password || '123456',
        role: user.role,
        active: true
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async update(id: string, updates: Partial<User>) {
    const { error } = await supabase
      .from('system_users')
      .update({
        name: updates.name,
        email: updates.email,
        role: updates.role,
        active: updates.active
      })
      .eq('id', id);
    
    if (error) throw error;
  },

  async resetPassword(id: string, newPassword: string) {
    const { error } = await supabase
      .from('system_users')
      .update({ password: newPassword })
      .eq('id', id);
    
    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('system_users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
