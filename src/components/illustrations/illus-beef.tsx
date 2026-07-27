import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustBeef({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width={sizeValue} height={sizeValue} className={className} {...props}>
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 40 Q25 30 35 28 Q50 25 65 30 Q80 35 85 50 Q82 65 70 72 Q50 80 30 75 Q15 70 15 55 Z" />
        <path d="M30 50 Q40 48 50 50 Q60 52 70 50" strokeWidth="0.8" opacity="0.6" />
        <path d="M35 60 Q45 62 55 60 Q65 58 72 62" strokeWidth="0.8" opacity="0.6" />
        <path d="M40 45 L50 65" strokeWidth="0.8" opacity="0.5" />
        <path d="M60 42 L70 68" strokeWidth="0.8" opacity="0.5" />
      </g>
    </svg>
  );
}
