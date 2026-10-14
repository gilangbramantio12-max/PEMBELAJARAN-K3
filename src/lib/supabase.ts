import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 20 &&
  !supabaseUrl.includes('placeholder')
);

// Fallback dummy client if credentials aren't set yet during development/demo
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder-k3learn.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key'
);

if (!isSupabaseConfigured) {
  console.info(
    'ℹ️ [K3Learn] Supabase belum dikonfigurasi secara lengkap. Aplikasi berjalan menggunakan Demo Mode mandiri (localStorage & in-memory repository) yang aman dan interaktif.'
  );
}
