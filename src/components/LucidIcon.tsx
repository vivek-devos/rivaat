import React from 'react';
import { LucideIcon } from 'lucide-react';

export type LucidVariant = 
  | 'gold'
  | 'maroon'
  | 'emerald'
  | 'saffron'
  | 'rose'
  | 'sapphire'
  | 'charcoal';

interface LucidIconProps {
  icon: LucideIcon;
  variant?: LucidVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  badge?: boolean;
  pulse?: boolean;
  glow?: boolean;
}

const variantStyles: Record<LucidVariant, {
  iconColor: string;
  bgColor: string;
  borderColor: string;
  glowShadow: string;
}> = {
  gold: {
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-400/30',
    glowShadow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]',
  },
  maroon: {
    iconColor: 'text-rose-700',
    bgColor: 'bg-rose-700/10',
    borderColor: 'border-rose-600/30',
    glowShadow: 'shadow-[0_0_15px_rgba(190,24,93,0.25)]',
  },
  emerald: {
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-600/10',
    borderColor: 'border-emerald-500/30',
    glowShadow: 'shadow-[0_0_15px_rgba(5,150,105,0.25)]',
  },
  saffron: {
    iconColor: 'text-orange-600',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    glowShadow: 'shadow-[0_0_15px_rgba(249,115,22,0.25)]',
  },
  rose: {
    iconColor: 'text-pink-600',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    glowShadow: 'shadow-[0_0_15px_rgba(236,72,153,0.25)]',
  },
  sapphire: {
    iconColor: 'text-indigo-600',
    bgColor: 'bg-indigo-600/10',
    borderColor: 'border-indigo-500/30',
    glowShadow: 'shadow-[0_0_15px_rgba(79,70,229,0.25)]',
  },
  charcoal: {
    iconColor: 'text-stone-700',
    bgColor: 'bg-stone-500/10',
    borderColor: 'border-stone-400/25',
    glowShadow: 'shadow-[0_0_12px_rgba(120,113,108,0.18)]',
  },
};

const sizeStyles = {
  xs: { box: 'w-6 h-6 rounded-md', icon: 13 },
  sm: { box: 'w-8 h-8 rounded-lg', icon: 16 },
  md: { box: 'w-10 h-10 rounded-xl', icon: 20 },
  lg: { box: 'w-12 h-12 rounded-2xl', icon: 24 },
  xl: { box: 'w-16 h-16 rounded-2xl', icon: 32 },
};

export const LucidIcon: React.FC<LucidIconProps> = ({
  icon: IconComponent,
  variant = 'gold',
  size = 'md',
  className = '',
  badge = true,
  pulse = false,
  glow = false,
}) => {
  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  if (!badge) {
    return (
      <IconComponent
        size={currentSize.icon}
        className={`${currentVariant.iconColor} ${pulse ? 'animate-pulse' : ''} ${className}`}
      />
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center border transition-all duration-300 ${
        currentSize.box
      } ${currentVariant.bgColor} ${currentVariant.borderColor} ${
        glow ? currentVariant.glowShadow : ''
      } ${pulse ? 'animate-pulse' : ''} ${className}`}
    >
      <IconComponent
        size={currentSize.icon}
        className={`${currentVariant.iconColor} transition-transform duration-300 group-hover:scale-110`}
      />
    </div>
  );
};
