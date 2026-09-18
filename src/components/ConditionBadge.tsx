import React from 'react';
import { GameCondition } from '../types';

interface ConditionBadgeProps {
  condition: GameCondition;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ConditionBadge: React.FC<ConditionBadgeProps> = ({
  condition,
  className = '',
  size = 'md',
}) => {
  const getBadgeStyle = () => {
    switch (condition) {
      case 'חדש באריזה':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'חדש':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'משומש':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'דרוש תיקון':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-700/30 text-slate-300 border-slate-600/30';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs sm:text-sm px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-medium',
  }[size];

  return (
    <span
      className={`inline-flex items-center justify-center font-medium rounded-full border whitespace-nowrap ${getBadgeStyle()} ${sizeClasses} ${className}`}
    >
      {condition}
    </span>
  );
};
