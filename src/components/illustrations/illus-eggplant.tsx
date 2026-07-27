import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustEggplant({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);
  return (
    <svg viewBox="0 0 80 140" xmlns="http://www.w3.org/2000/svg" width={sizeValue} height={sizeValue} className={className} {...props}>
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 35 Q30 45 28 60 Q27 80 35 110 Q40 115 45 110 Q53 80 52 60 Q50 45 40 35 Z" />
        <path d="M35 70 Q40 65 45 70" strokeWidth="0.8" opacity="0.6" />
        <path d="M34 85 Q40 82 46 85" strokeWidth="0.8" opacity="0.6" />
        <path d="M38 30 L35 18 M40 32 L40 12 M42 30 L45 18" strokeWidth="1.5" />
        <circle cx="40" cy="22" r="2" opacity="0.6" />
      </g>
    </svg>
  );
}
