import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'orange' | 'red' | 'slate' | 'yellow';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
}) => {
  const variantClasses = {
    blue: 'bg-blue-50 text-brand-700 border-blue-200/80',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    orange: 'bg-orange-50 text-orange-700 border-orange-200/80',
    red: 'bg-rose-50 text-rose-700 border-rose-200/80',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    yellow: 'bg-amber-50 text-amber-800 border-amber-200',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </span>
  );
};
