import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustOnion({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);

  return (
    <svg
      viewBox="0 0 100 140"
      xmlns="http://www.w3.org/2000/svg"
      width={sizeValue}
      height={sizeValue}
      className={className}
      {...props}
    >
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Layers */}
        <ellipse cx="50" cy="50" rx="25" ry="30" />
        <ellipse cx="50" cy="50" rx="20" ry="25" opacity="0.7" />
        <ellipse cx="50" cy="50" rx="15" ry="20" opacity="0.5" />

        {/* Layer lines */}
        <path d="M30 40 Q50 35 70 40" strokeWidth="0.8" opacity="0.6" />
        <path d="M25 55 Q50 50 75 55" strokeWidth="0.8" opacity="0.6" />
        <path d="M30 70 Q50 75 70 70" strokeWidth="0.8" opacity="0.6" />

        {/* Roots at bottom */}
        <path d="M40 85 L35 105" strokeWidth="0.8" />
        <path d="M50 87 L50 110" strokeWidth="0.8" />
        <path d="M60 85 L65 105" strokeWidth="0.8" />

        {/* Top sprouts */}
        <path d="M45 18 L42 5" strokeWidth="1.5" />
        <path d="M50 16 L50 0" strokeWidth="1.5" />
        <path d="M55 18 L58 5" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
