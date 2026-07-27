import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustCalamari({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);
  return (
    <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" width={sizeValue} height={sizeValue} className={className} {...props}>
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="50" cy="40" rx="28" ry="30" />
        <circle cx="40" cy="35" r="4" />
        <circle cx="60" cy="35" r="4" />
        <path d="M35 60 Q32 80 35 110" />
        <path d="M45 62 Q43 85 45 115" />
        <path d="M55 62 Q57 85 55 115" />
        <path d="M65 60 Q68 80 65 110" />
      </g>
    </svg>
  );
}
