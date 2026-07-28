import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustOlive({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);

  return (
    <svg
      viewBox="0 0 80 100"
      xmlns="http://www.w3.org/2000/svg"
      width={sizeValue}
      height={sizeValue}
      className={className}
      {...props}
    >
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Main olive body - oval */}
        <ellipse cx="40" cy="50" rx="22" ry="28" />

        {/* Pit/center line */}
        <path d="M40 25 L40 75" strokeWidth="1" opacity="0.6" />

        {/* Texture lines */}
        <path d="M30 40 Q40 38 50 40" strokeWidth="0.8" opacity="0.5" />
        <path d="M28 50 Q40 48 52 50" strokeWidth="0.8" opacity="0.5" />
        <path d="M30 60 Q40 62 50 60" strokeWidth="0.8" opacity="0.5" />

        {/* Leaf stem */}
        <path d="M50 22 L60 12" strokeWidth="1.5" />
        <path d="M55 18 L65 8" strokeWidth="1.5" />

        {/* Small leaf */}
        <path d="M60 12 Q65 10 70 15 Q65 18 60 16 Z" strokeWidth="0.8" />
      </g>
    </svg>
  );
}
