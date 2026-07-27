import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustSpinach({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);
  return (
    <svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" width={sizeValue} height={sizeValue} className={className} {...props}>
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 120 L50 40" />
        <path d="M50 45 L30 30 M50 60 L20 45 M50 85 L25 75" />
        <path d="M50 45 L70 30 M50 60 L80 45 M50 85 L75 75" />
        <path d="M30 30 Q28 25 35 22 Q38 28 33 35 Z" />
        <path d="M20 45 Q18 38 28 35 Q32 42 26 50 Z" />
        <path d="M25 75 Q22 68 32 65 Q36 72 30 80 Z" />
        <path d="M70 30 Q72 25 79 22 Q82 28 77 35 Z" />
        <path d="M80 45 Q82 38 92 35 Q96 42 90 50 Z" />
        <path d="M75 75 Q78 68 88 65 Q92 72 86 80 Z" />
      </g>
    </svg>
  );
}
