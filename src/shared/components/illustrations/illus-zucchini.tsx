import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustZucchini({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);
  return (
    <svg viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg" width={sizeValue} height={sizeValue} className={className} {...props}>
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 50 Q25 40 35 38 Q50 35 65 40 Q75 45 75 60 Q72 75 60 80 Q40 85 22 75 Q15 65 20 50 Z" />
        <path d="M28 55 Q40 52 65 58" strokeWidth="0.8" opacity="0.6" />
        <path d="M25 65 Q45 68 68 65" strokeWidth="0.8" opacity="0.6" />
        <path d="M35 45 L50 78" strokeWidth="0.8" opacity="0.5" />
      </g>
    </svg>
  );
}
