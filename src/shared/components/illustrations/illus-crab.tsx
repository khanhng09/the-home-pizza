import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustCrab({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);
  return (
    <svg viewBox="0 0 180 130" xmlns="http://www.w3.org/2000/svg" width={sizeValue} height={sizeValue} className={className} {...props}>
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Shell/body */}
        <path d="M55 45 Q90 25 125 45 Q140 60 130 78 Q90 95 50 78 Q40 60 55 45 Z" />

        {/* Shell texture */}
        <path d="M70 42 Q90 38 110 42" strokeWidth="0.8" opacity="0.7" />
        <path d="M62 55 Q90 50 118 55" strokeWidth="0.8" opacity="0.7" />
        <path d="M60 68 Q90 72 120 68" strokeWidth="0.8" opacity="0.7" />

        {/* Eyes */}
        <path d="M75 42 L70 30 M105 42 L110 30" strokeWidth="1.2" />
        <circle cx="70" cy="28" r="3" />
        <circle cx="110" cy="28" r="3" />

        {/* Claws (chelae) - large front pincers */}
        <path d="M50 55 Q25 45 15 55 Q10 62 20 68 Q30 70 35 62 Q40 58 50 60" />
        <path d="M15 55 Q8 50 5 58 Q8 64 15 62" strokeWidth="1" />
        <path d="M130 55 Q155 45 165 55 Q170 62 160 68 Q150 70 145 62 Q140 58 130 60" />
        <path d="M165 55 Q172 50 175 58 Q172 64 165 62" strokeWidth="1" />

        {/* Legs - left side */}
        <path d="M55 70 Q35 78 22 78" strokeWidth="1" />
        <path d="M52 78 Q32 90 20 93" strokeWidth="1" />
        <path d="M52 86 Q35 100 25 106" strokeWidth="1" />

        {/* Legs - right side */}
        <path d="M125 70 Q145 78 158 78" strokeWidth="1" />
        <path d="M128 78 Q148 90 160 93" strokeWidth="1" />
        <path d="M128 86 Q145 100 155 106" strokeWidth="1" />
      </g>
    </svg>
  );
}
