import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner message="Memeriksa hak akses keselamatan..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-red-200 rounded-2xl shadow-sm text-center">
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Akses Terbatas: Hanya Administrator</h2>
        <p className="text-sm text-slate-600 mb-6">
          Halaman ini khusus untuk pengelola kurikulum dan instruktur K3. Akun Anda saat ini terdaftar sebagai <strong>{user.role}</strong>.
        </p>
        <Navigate to="/dashboard" replace />
      </div>
    );
  }

  return <>{children}</>;
};
