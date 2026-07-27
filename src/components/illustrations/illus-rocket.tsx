import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustRocket({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);
  return (
    <svg viewBox="0 0 80 140" xmlns="http://www.w3.org/2000/svg" width={sizeValue} height={sizeValue} className={className} {...props}>
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 30 Q30 35 28 50 Q30 75 40 105 Q50 75 52 50 Q50 35 40 30 Z" />
        <path d="M35 55 Q38 65 40 80" strokeWidth="0.8" opacity="0.6" />
        <path d="M45 55 Q42 65 40 80" strokeWidth="0.8" opacity="0.6" />
        <path d="M20 70 L28 85 L32 75 Z" />
        <path d="M60 70 L72 85 L68 75 Z" />
        <path d="M38 28 L35 15 L40 24 L45 15 L42 28" />
      </g>
    </svg>
  );
}
