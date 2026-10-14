import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { signIn, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    const success = await signIn(email, password);
    setSubmitting(false);

    if (success) {
      navigate(from, { replace: true });
    }
  };

  const handleDemoLogin = (role: 'participant' | 'admin') => {
    loginAsDemo(role);
    navigate(role === 'admin' ? '/admin' : '/dashboard', { replace: true });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-lg">
        {/* Header Branding */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md">
            <ShieldCheck className="w-7 h-7 text-emerald-300" />
          </div>
          <h2 className="text-2xl font-black text-navy-900 tracking-tight">Masuk ke K3Learn</h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Akses materi kursus, evaluasi kuis, dan sertifikat kompetensi Anda
          </p>
        </div>

        {/* Quick Demo Switcher Buttons */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-center space-y-2.5">
          <span className="text-[11px] font-bold text-brand-900 block uppercase tracking-wider">
            ⚡ Akses Cepat Mode Demo:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('participant')}
              className="py-2 px-3 text-xs font-bold text-brand-700 bg-white hover:bg-brand-50 border border-blue-300 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-4 h-4 text-brand-600" />
              Peserta Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="py-2 px-3 text-xs font-bold text-orange-800 bg-white hover:bg-orange-50 border border-orange-300 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4 text-safety-orange" />
              Admin Demo
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-600"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">Kata Sandi</label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Memeriksa Kredensial...' : 'Masuk Sekarang'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Belum memiliki akun K3Learn?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:text-brand-800">
            Daftar Akun Baru
          </Link>
        </div>
      </div>
    </div>
  );
};
