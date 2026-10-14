import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  BookOpen,
  LayoutDashboard,
  ShieldAlert,
  LogOut,
  User,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAdmin, signOut, loginAsDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-900 via-brand-700 to-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-navy-900">
                  K3<span className="text-brand-600">Learn</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">
                  SMK3
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium -mt-1">
                Platform Edukasi K3 Mandiri
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                isActive('/')
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/courses"
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                location.pathname.startsWith('/courses')
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Katalog Kursus
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive('/dashboard')
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard Saya
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  location.pathname.startsWith('/admin')
                    ? 'text-safety-orange bg-orange-50'
                    : 'text-slate-600 hover:text-safety-orange hover:bg-orange-50/50'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-safety-orange" />
                Panel Admin
              </Link>
            )}
          </nav>

          {/* Right Action / Role Switcher & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Role Switcher Pill for Easy Testing */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200">
              <button
                onClick={() => loginAsDemo('participant')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  user?.role === 'participant'
                    ? 'bg-white text-brand-700 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
                title="Beralih ke tampilan peserta"
              >
                Peserta
              </button>
              <button
                onClick={() => loginAsDemo('admin')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  user?.role === 'admin'
                    ? 'bg-white text-safety-darkOrange shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
                title="Beralih ke tampilan admin instruktur"
              >
                Admin
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-2">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-100"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                      {user.full_name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left hidden lg:block">
                    <div className="text-xs font-bold text-slate-800 line-clamp-1">
                      {user.full_name}
                    </div>
                    <div className="text-[10px] text-slate-500 capitalize">
                      {user.role === 'admin' ? 'Pengelola K3' : 'Peserta'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Keluar Akun"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-all"
                >
                  Daftar Akun
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Beranda
            </Link>
            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Katalog Kursus
            </Link>
            {user && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Dashboard Saya
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold text-safety-orange hover:bg-orange-50 rounded-lg"
              >
                Panel Admin K3
              </Link>
            )}
          </nav>

          <div className="pt-3 border-t border-slate-200">
            <div className="text-xs text-slate-500 font-medium mb-2">Pilih Peran Demo:</div>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => {
                  loginAsDemo('participant');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100"
              >
                Mode Peserta
              </button>
              <button
                onClick={() => {
                  loginAsDemo('admin');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-1.5 text-xs font-bold rounded-lg border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
              >
                Mode Admin
              </button>
            </div>

            {user ? (
              <div className="flex items-center justify-between pt-2">
                <div className="text-sm font-medium text-slate-800">{user.full_name}</div>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-red-600 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Keluar
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-slate-700 border border-slate-300 rounded-lg"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-white bg-brand-600 rounded-lg"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
