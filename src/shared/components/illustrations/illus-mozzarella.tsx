import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustMozzarella({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);

  return (
    <svg
      viewBox="0 0 100 120"
      xmlns="http://www.w3.org/2000/svg"
      width={sizeValue}
      height={sizeValue}
      className={className}
      {...props}
    >
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Main cheese ball */}
        <circle cx="50" cy="50" r="35" />

        {/* Texture lines */}
        <path d="M35 35 Q50 30 65 35" strokeWidth="0.8" opacity="0.6" />
        <path d="M30 50 Q50 45 70 50" strokeWidth="0.8" opacity="0.6" />
        <path d="M35 65 Q50 70 65 65" strokeWidth="0.8" opacity="0.6" />

        {/* Slight wrinkle lines */}
        <path d="M50 20 Q48 35 52 50" strokeWidth="0.8" opacity="0.4" />
        <path d="M70 40 Q60 45 50 50" strokeWidth="0.8" opacity="0.4" />
        <path d="M30 60 Q45 70 50 80" strokeWidth="0.8" opacity="0.4" />

        {/* Highlight */}
        <path d="M35 40 Q40 35 45 38" strokeWidth="0.8" opacity="0.5" />
      </g>
    </svg>
  );
}
