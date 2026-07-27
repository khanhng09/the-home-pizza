import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  color?: string;
  className?: string;
  title?: string;
  description?: string;
  ariaLabel?: string;
}

export const iconSizeMap: Record<string, string> = {
  xs: '16px',
  sm: '20px',
  md: '24px',
  lg: '32px',
  xl: '48px',
};

export const getIconSize = (size?: IconProps['size']): string => {
  if (typeof size === 'number') return `${size}px`;
  if (size && size in iconSizeMap) return iconSizeMap[size];
  return iconSizeMap.md;
};