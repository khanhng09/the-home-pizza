import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustAnchovies({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width={sizeValue} height={sizeValue} className={className} {...props}>
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 35 Q40 25 75 30 Q80 30 82 35 Q80 40 75 42 Q40 50 15 45 Q10 45 8 40 Q10 35 15 35 Z" />
        <path d="M75 35 L85 32" strokeWidth="1" />
        <path d="M70 37 Q65 38 60 38" strokeWidth="0.8" opacity="0.6" />
        <path d="M45 38 Q35 39 25 40" strokeWidth="0.8" opacity="0.6" />
        <circle cx="20" cy="40" r="1.5" opacity="0.7" />
        <path d="M20 40 M18 40 Q18 42 20 42 Q22 42 22 40" strokeWidth="0.8" />
      </g>
    </svg>
  );
}
