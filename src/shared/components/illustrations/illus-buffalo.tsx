import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustBuffalo({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);
  return (
    <svg viewBox="0 0 180 130" xmlns="http://www.w3.org/2000/svg" width={sizeValue} height={sizeValue} className={className} {...props}>
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Body */}
        <path d="M40 75 Q35 55 55 48 Q70 44 85 48 Q100 44 115 50 Q130 55 132 70 Q133 85 120 92 Q90 100 60 95 Q42 90 40 75 Z" />

        {/* Head */}
        <path d="M40 75 Q28 70 20 58 Q16 50 22 45 Q30 42 36 48 Q42 55 42 65" />

        {/* Snout */}
        <path d="M22 45 Q16 42 12 46 Q10 50 14 53" strokeWidth="1" />

        {/* Horns - curved buffalo horns */}
        <path d="M28 46 Q18 30 24 16 Q28 8 22 4" />
        <path d="M38 46 Q40 28 34 14 Q30 6 36 0" />

        {/* Ear */}
        <path d="M35 50 Q40 45 44 48" strokeWidth="1" />

        {/* Eye */}
        <circle cx="26" cy="52" r="2" />

        {/* Legs */}
        <path d="M55 92 L52 112" />
        <path d="M70 96 L68 116" />
        <path d="M95 96 L97 116" />
        <path d="M115 90 L120 110" />

        {/* Tail */}
        <path d="M132 72 Q145 78 148 92 Q149 98 144 100" strokeWidth="1" />
      </g>
    </svg>
  );
}
