import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustChili({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);
  return (
    <svg viewBox="0 0 80 140" xmlns="http://www.w3.org/2000/svg" width={sizeValue} height={sizeValue} className={className} {...props}>
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 30 Q35 40 35 55 Q35 75 40 100 Q45 75 45 55 Q45 40 40 30 Z" />
        <path d="M30 50 Q28 60 32 75" strokeWidth="0.8" opacity="0.6" />
        <path d="M50 50 Q52 60 48 75" strokeWidth="0.8" opacity="0.6" />
        <path d="M40 28 L38 15 M42 28 L45 12" strokeWidth="1.5" />
        <circle cx="40" cy="65" r="3" opacity="0.6" />
      </g>
    </svg>
  );
}
