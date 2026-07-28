import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustGarlic({ size = 'md', className, title, ...props }: IconProps) {
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
        {/* Main bulb outer layer */}
        <path d="M50 30 C40 35 35 45 35 55 C35 75 42 90 50 100 C58 90 65 75 65 55 C65 45 60 35 50 30 Z" />

        {/* Segmented cloves */}
        <path d="M38 50 Q42 60 40 75" strokeWidth="1" opacity="0.6" />
        <path d="M50 48 L50 85" strokeWidth="1" opacity="0.6" />
        <path d="M62 50 Q58 60 60 75" strokeWidth="1" opacity="0.6" />
        <path d="M42 55 Q48 65 45 80" strokeWidth="0.8" opacity="0.5" />
        <path d="M58 55 Q52 65 55 80" strokeWidth="0.8" opacity="0.5" />

        {/* Root lines at bottom */}
        <path d="M40 100 L38 115" strokeWidth="0.8" />
        <path d="M50 100 L50 120" strokeWidth="0.8" />
        <path d="M60 100 L62 115" strokeWidth="0.8" />

        {/* Top stem */}
        <path d="M48 28 L45 15 M50 28 L50 12 M52 28 L55 15" strokeWidth="1" />
      </g>
    </svg>
  );
}
