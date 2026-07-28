import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustPepper({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);

  return (
    <svg
      viewBox="0 0 80 140"
      xmlns="http://www.w3.org/2000/svg"
      width={sizeValue}
      height={sizeValue}
      className={className}
      {...props}
    >
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Main body - bell pepper shape */}
        <path d="M40 20 C30 30 25 45 25 60 C25 80 35 100 40 110 C45 100 55 80 55 60 C55 45 50 30 40 20 Z" />

        {/* Lobes */}
        <path d="M30 65 Q25 70 28 80" strokeWidth="0.8" opacity="0.6" />
        <path d="M50 65 Q55 70 52 80" strokeWidth="0.8" opacity="0.6" />

        {/* Stem */}
        <path d="M38 18 L40 10 L42 18" strokeWidth="1.5" />

        {/* Detail ridges */}
        <path d="M32 50 Q40 45 48 50" strokeWidth="0.8" opacity="0.5" />
        <path d="M30 70 Q40 75 50 70" strokeWidth="0.8" opacity="0.5" />
      </g>
    </svg>
  );
}
