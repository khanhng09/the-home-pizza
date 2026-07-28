import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustMozzarellaFresh({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width={sizeValue} height={sizeValue} className={className} {...props}>
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="35" cy="35" rx="18" ry="22" />
        <ellipse cx="65" cy="45" rx="16" ry="20" />
        <ellipse cx="50" cy="70" rx="15" ry="18" />
        <path d="M35 30 Q40 28 45 32" strokeWidth="0.8" opacity="0.6" />
        <path d="M65 35 Q68 33 72 38" strokeWidth="0.8" opacity="0.6" />
        <path d="M50 58 Q45 55 52 65" strokeWidth="0.8" opacity="0.6" />
      </g>
    </svg>
  );
}
