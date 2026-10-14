import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: 'blue' | 'green' | 'orange';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  showLabel = false,
  color = 'blue',
}) => {
  const safeProgress = Math.max(0, Math.min(100, Math.round(progress)));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorClasses = {
    blue: 'bg-brand-600',
    green: 'bg-green-600',
    orange: 'bg-safety-orange',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
          <span>Progres Belajar</span>
          <span>{safeProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`${heightClasses[size]} ${colorClasses[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
};
