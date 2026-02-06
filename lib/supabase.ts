
import { createClient } from '@supabase/supabase-js';

// Fallback robusto para evitar erros de compilação se as variáveis não estiverem no .env
const getEnv = (key: string, fallback: string) => {
  try {
    return (import.meta as any).env?.[key] || fallback;
  } catch {
    return fallback;
  }
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL', 'https://vdfgjczuibnhbyxojzzn.supabase.co');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZmdqY3p1aWJuaGJ5eG9qenpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MzY3OTAsImV4cCI6MjA4NDUxMjc5MH0.L71qElUijJA3xJzzsZo96MEwgwdVF4M80LxFy_7tgHc');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
