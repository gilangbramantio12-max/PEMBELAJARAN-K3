import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, Mail, Lock, User, Building, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

export const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState<UserRole>('participant');
  const [submitting, setSubmitting] = useState(false);

  const { signUp } = useAuth();
  const { error: toastError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toastError('Mohon lengkapi seluruh kolom yang diwajibkan');
      return;
    }

    if (password.length < 6) {
      toastError('Kata sandi minimal 6 karakter');
      return;
    }

    setSubmitting(true);
    const success = await signUp(email, password, fullName, role, company);
    setSubmitting(false);

    if (success) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-lg">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md">
            <ShieldCheck className="w-7 h-7 text-emerald-300" />
          </div>
          <h2 className="text-2xl font-black text-navy-900 tracking-tight">Daftar Akun K3Learn</h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Bergabunglah bersama ribuan tenaga kerja dalam budaya keselamatan kerja
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Budi Santoso, S.T."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="budi@perusahaan.com"
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Perusahaan / Instansi</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="PT Manufaktur Nusantara / Universitas"
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Peran Akun</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('participant')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all ${
                  role === 'participant'
                    ? 'border-brand-600 bg-blue-50 text-brand-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Peserta Kursus
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all ${
                  role === 'admin'
                    ? 'border-orange-500 bg-orange-50 text-orange-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Admin / Pengelola K3
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi (Minimal 6 karakter)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Sudah memiliki akun?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:text-brand-800">
            Masuk Akun
          </Link>
        </div>
      </div>
    </div>
  );
};
