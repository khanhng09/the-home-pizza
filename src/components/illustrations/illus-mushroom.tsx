import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustMushroom({ size = 'md', className, title, ...props }: IconProps) {
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
        {/* Cap */}
        <path d="M30 60 Q30 30 50 25 Q70 30 70 60" />

        {/* Underside gills */}
        <path d="M38 60 L38 80" strokeWidth="0.8" />
        <path d="M45 60 L45 85" strokeWidth="0.8" />
        <path d="M50 60 L50 88" strokeWidth="0.8" />
        <path d="M55 60 L55 85" strokeWidth="0.8" />
        <path d="M62 60 L62 80" strokeWidth="0.8" />

        {/* Stem */}
        <path d="M45 88 L45 125 L55 125 L55 88" />

        {/* Detail lines on cap */}
        <path d="M35 45 Q50 40 65 45" strokeWidth="0.8" opacity="0.6" />
        <path d="M32 55 Q50 50 68 55" strokeWidth="0.8" opacity="0.6" />
      </g>
    </svg>
  );
}
