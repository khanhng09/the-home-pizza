import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustProsiutto({ size = 'md', className, title, ...props }: IconProps) {
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
        {/* Slice with wavy edges */}
        <path d="M20 30 Q15 50 20 70 Q30 85 50 90 Q70 85 80 70 Q85 50 80 30 Q70 20 50 20 Q30 20 20 30 Z" />

        {/* Marbling/texture */}
        <path d="M35 40 Q50 45 65 40" strokeWidth="0.8" opacity="0.6" />
        <path d="M30 55 Q50 58 70 55" strokeWidth="0.8" opacity="0.6" />
        <path d="M35 70 Q50 72 65 70" strokeWidth="0.8" opacity="0.6" />

        {/* Fat lines */}
        <path d="M45 35 L55 75" strokeWidth="0.8" opacity="0.5" />
        <path d="M55 32 L45 78" strokeWidth="0.8" opacity="0.5" />
      </g>
    </svg>
  );
}
