import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustParmesan({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);
  return (
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" width={sizeValue} height={sizeValue} className={className} {...props}>
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 40 L30 20 L70 25 L80 45 L75 75 L50 95 L30 90 L15 70 Z" />
        <circle cx="40" cy="50" r="2" opacity="0.6" />
        <circle cx="55" cy="45" r="1.8" opacity="0.6" />
        <circle cx="50" cy="65" r="2" opacity="0.6" />
        <circle cx="35" cy="70" r="1.8" opacity="0.6" />
        <path d="M28 35 Q40 40 55 38" strokeWidth="0.8" opacity="0.5" />
        <path d="M25 55 Q45 58 70 55" strokeWidth="0.8" opacity="0.5" />
      </g>
    </svg>
  );
}
