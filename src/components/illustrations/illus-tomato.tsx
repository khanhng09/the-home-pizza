import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustTomato({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);

  return (
    <svg
      viewBox="0 0 120 140"
      xmlns="http://www.w3.org/2000/svg"
      width={sizeValue}
      height={sizeValue}
      className={className}
      {...props}
    >
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Main body */}
        <path d="M60 30 C70 30 75 40 75 50 C75 70 60 85 60 85 C60 85 45 70 45 50 C45 40 50 30 60 30" />

        {/* Ridges */}
        <path d="M50 45 Q55 55 60 65" />
        <path d="M70 45 Q65 55 60 65" />
        <path d="M55 40 Q60 50 60 65" />
        <path d="M65 40 Q60 50 60 65" />

        {/* Stem */}
        <path d="M55 25 L60 15 M65 25 L62 15" strokeWidth="1.5" />

        {/* Leaves */}
        <path d="M58 18 Q50 15 48 22" strokeWidth="1" />
        <path d="M62 17 Q70 12 75 18" strokeWidth="1" />
      </g>
    </svg>
  );
}
