import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustBasil({ size = 'md', className, title, ...props }: IconProps) {
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
        {/* Main stem */}
        <path d="M50 130 L50 40" />

        {/* Left branch */}
        <path d="M50 60 L35 50" />
        <path d="M50 80 L25 70" />
        <path d="M50 110 L30 105" />

        {/* Right branch */}
        <path d="M50 50 L65 40" />
        <path d="M50 75 L75 65" />
        <path d="M50 100 L70 95" />

        {/* Leaves - left side */}
        <path d="M35 50 Q32 45 38 42 Q41 45 38 52 Z" />
        <path d="M25 70 Q20 63 28 60 Q32 65 28 75 Z" />
        <path d="M30 105 Q25 100 33 98 Q36 103 33 110 Z" />

        {/* Leaves - right side */}
        <path d="M65 40 Q68 33 75 38 Q72 43 65 48 Z" />
        <path d="M75 65 Q80 58 88 63 Q85 70 78 72 Z" />
        <path d="M70 95 Q75 88 82 93 Q79 100 72 102 Z" />
      </g>
    </svg>
  );
}
