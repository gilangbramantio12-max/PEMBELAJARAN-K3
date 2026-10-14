import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password?: string) => Promise<boolean>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: UserRole,
    company?: string
  ) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
  loginAsDemo: (role: UserRole) => void;
}

const LOCAL_USER_KEY = 'k3learn_active_user';

// Mock profiles for instant testing
const DEMO_PARTICIPANT: Profile = {
  id: 'usr-participant-101',
  full_name: 'Budi Santoso, S.T.',
  email: 'budi.peserta@k3learn.id',
  role: 'participant',
  company_or_institution: 'PT Manufaktur Baja Nusantara',
  avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  created_at: '2026-01-10T10:00:00Z',
};

const DEMO_ADMIN: Profile = {
  id: 'usr-admin-999',
  full_name: 'Ir. Hendra Wijaya, M.KKK',
  email: 'admin.hse@k3learn.id',
  role: 'admin',
  company_or_institution: 'Lembaga Pelatihan K3 Terakreditasi',
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  created_at: '2026-01-01T08:00:00Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { success, error: toastError, info } = useToast();

  // Inisialisasi Auth State
  useEffect(() => {
    async function initAuth() {
      try {
        if (isSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profile) {
              setUser(profile);
              setLoading(false);
              return;
            }
          }

          // Listener state change
          supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              if (profile) setUser(profile);
            } else {
              // Jika tidak ada user Supabase, cek local storage
              const stored = localStorage.getItem(LOCAL_USER_KEY);
              if (stored) {
                setUser(JSON.parse(stored));
              } else {
                setUser(null);
              }
            }
          });
        }

        // Cek Local Storage jika Supabase tidak aktif atau session kosong
        const stored = localStorage.getItem(LOCAL_USER_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          // Default awal login sebagai demo participant agar pengguna langsung merasakan app tanpa hambatan
          setUser(DEMO_PARTICIPANT);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(DEMO_PARTICIPANT));
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const signIn = async (email: string, password?: string): Promise<boolean> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          toastError(error.message);
          setLoading(false);
          return false;
        }
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            setUser(profile);
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
            success(`Selamat datang kembali, ${profile.full_name}!`);
            setLoading(false);
            return true;
          }
        }
      }

      // Demo/Fallback login
      const isDemAdmin = email.toLowerCase().includes('admin');
      const targetUser = isDemAdmin ? DEMO_ADMIN : { ...DEMO_PARTICIPANT, email };
      setUser(targetUser);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(targetUser));
      success(`Berhasil masuk sebagai ${targetUser.full_name} (${targetUser.role})`);
      setLoading(false);
      return true;
    } catch (err: any) {
      toastError(err.message || 'Gagal masuk akun');
      setLoading(false);
      return false;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole = 'participant',
    company?: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role,
              company_or_institution: company || '',
            },
          },
        });
        if (error) {
          toastError(error.message);
          setLoading(false);
          return false;
        }
        if (data.user) {
          const newProfile: Profile = {
            id: data.user.id,
            email,
            full_name: fullName,
            role,
            company_or_institution: company,
            created_at: new Date().toISOString(),
          };
          setUser(newProfile);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newProfile));
          success('Pendaftaran akun berhasil!');
          setLoading(false);
          return true;
        }
      }

      // Fallback local registration
      const newProfile: Profile = {
        id: `usr-${Date.now()}`,
        email,
        full_name: fullName,
        role,
        company_or_institution: company || 'Perusahaan / Instansi Mandiri',
        created_at: new Date().toISOString(),
      };
      setUser(newProfile);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newProfile));
      success('Akun baru berhasil didaftarkan dan Anda langsung masuk!');
      setLoading(false);
      return true;
    } catch (err: any) {
      toastError(err.message || 'Gagal mendaftar akun');
      setLoading(false);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
    info('Anda telah keluar dari akun');
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!user) return false;
    const updated = { ...user, ...updates };

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
      if (error) {
        toastError('Gagal memperbarui profil di server');
        return false;
      }
    }

    setUser(updated);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
    success('Profil berhasil diperbarui!');
    return true;
  };

  const loginAsDemo = (role: UserRole) => {
    const target = role === 'admin' ? DEMO_ADMIN : DEMO_PARTICIPANT;
    setUser(target);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(target));
    success(`Beralih ke mode: ${role.toUpperCase()} (${target.full_name})`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === 'admin',
        signIn,
        signUp,
        signOut,
        updateProfile,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
