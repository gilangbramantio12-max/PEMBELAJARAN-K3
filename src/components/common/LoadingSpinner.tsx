import React from 'react';
import { Shield } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Memuat data keselamatan K3...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3 text-center">
      <div className="relative flex items-center justify-center">
        <div
          className={`${sizeClasses[size]} border-4 border-blue-100 border-t-brand-600 rounded-full animate-spin`}
        />
        <Shield className="w-4 h-4 text-brand-600 absolute animate-pulse" />
      </div>
      {message && <p className="text-sm font-medium text-slate-500 animate-pulse">{message}</p>}
    </div>
  );
};
