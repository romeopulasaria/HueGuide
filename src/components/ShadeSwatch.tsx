import React from 'react';

interface ShadeSwatchProps {
  hex: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showHex?: boolean;
  className?: string;
}

export const ShadeSwatch: React.FC<ShadeSwatchProps> = ({
  hex,
  name,
  size = 'md',
  showHex = false,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`${sizeMap[size]} rounded-full shadow-inner border border-stone-200/80 flex-shrink-0 transition-transform hover:scale-105`}
        style={{ backgroundColor: hex }}
        title={name ? `${name} (${hex})` : hex}
      />
      {(name || showHex) && (
        <div className="leading-tight text-left">
          {name && <div className="text-xs font-medium text-stone-800 line-clamp-1">{name}</div>}
          {showHex && <div className="text-[11px] font-mono text-stone-500 uppercase">{hex}</div>}
        </div>
      )}
    </div>
  );
};
