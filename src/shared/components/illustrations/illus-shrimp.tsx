import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustShrimp({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);
  return (
    <svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" width={sizeValue} height={sizeValue} className={className} {...props}>
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Body - curled shrimp silhouette */}
        <path d="M25 45 Q20 25 40 18 Q70 8 95 22 Q115 32 118 55 Q120 75 105 85 Q95 92 85 85 Q95 78 92 65 Q75 70 60 65 Q65 78 55 82 Q42 86 38 72 Q30 68 27 58 Q24 50 25 45 Z" />

        {/* Segment lines on body/tail */}
        <path d="M50 22 Q52 35 48 48" strokeWidth="0.9" />
        <path d="M65 18 Q68 32 64 46" strokeWidth="0.9" />
        <path d="M80 20 Q84 34 80 48" strokeWidth="0.9" />
        <path d="M95 26 Q99 38 96 50" strokeWidth="0.9" />

        {/* Head/eye */}
        <circle cx="30" cy="38" r="3" />
        <path d="M28 33 Q20 28 14 30" strokeWidth="0.9" />

        {/* Antennae */}
        <path d="M27 32 Q10 20 -2 22" strokeWidth="0.9" />
        <path d="M30 30 Q18 12 8 4" strokeWidth="0.9" />

        {/* Legs */}
        <path d="M35 58 Q28 64 20 64" strokeWidth="0.9" />
        <path d="M42 63 Q36 70 28 72" strokeWidth="0.9" />
        <path d="M50 68 Q45 76 38 79" strokeWidth="0.9" />

        {/* Tail fan */}
        <path d="M105 85 L100 100 M112 88 L112 103 M119 85 L124 99" strokeWidth="0.9" />
      </g>
    </svg>
  );
}
