import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustClam({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);
  return (
    <svg viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg" width={sizeValue} height={sizeValue} className={className} {...props}>
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Shell 1 - back left */}
        <path d="M30 60 Q30 30 55 22 Q80 30 80 60 Q55 72 30 60 Z" />
        <path d="M55 22 L55 60 M45 25 L48 60 M65 25 L62 60 M38 35 L40 60 M72 35 L70 60" strokeWidth="0.8" opacity="0.8" />

        {/* Shell 2 - back right */}
        <path d="M75 55 Q75 25 100 17 Q125 25 125 55 Q100 67 75 55 Z" />
        <path d="M100 17 L100 55 M90 20 L93 55 M110 20 L107 55 M83 30 L85 55 M117 30 L115 55" strokeWidth="0.8" opacity="0.8" />

        {/* Shell 3 - front center, largest */}
        <path d="M45 95 Q45 58 78 48 Q111 58 111 95 Q78 112 45 95 Z" />
        <path d="M78 48 L78 95 M64 52 L68 95 M92 52 L88 95 M52 66 L56 95 M104 66 L100 95 M78 48 Q60 50 52 66 M78 48 Q96 50 104 66" strokeWidth="0.9" opacity="0.85" />
      </g>
    </svg>
  );
}
