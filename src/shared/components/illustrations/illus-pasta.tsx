import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustPasta({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);

  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      width={sizeValue}
      height={sizeValue}
      className={className}
      {...props}
    >
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Pasta strands - spaghetti bundle */}
        <path d="M30 20 Q35 40 30 60 Q32 75 40 85" />
        <path d="M50 15 L50 85" />
        <path d="M70 20 Q65 40 70 60 Q68 75 60 85" />
        <path d="M40 18 Q42 45 38 70" />
        <path d="M60 18 Q58 45 62 70" />
        <path d="M35 25 Q45 50 55 75" />
        <path d="M65 25 Q55 50 45 75" />

        {/* Spiral detail */}
        <circle cx="50" cy="40" r="3" opacity="0.6" />
      </g>
    </svg>
  );
}
