import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustOregano({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);

  return (
    <svg viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg" width={sizeValue} height={sizeValue} className={className} {...props}>
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 110 L40 30" />
        <path d="M40 35 L20 25 M40 50 L15 42 M40 70 L18 65" />
        <path d="M40 35 L60 25 M40 50 L65 42 M40 70 L62 65" />
        <path d="M20 25 Q18 20 24 18 Q26 22 22 28 Z" />
        <path d="M15 42 Q12 35 20 32 Q24 38 18 46 Z" />
        <path d="M18 65 Q14 58 24 56 Q28 63 20 70 Z" />
        <path d="M60 25 Q62 20 68 18 Q70 22 66 28 Z" />
        <path d="M65 42 Q68 35 76 32 Q80 38 74 46 Z" />
        <path d="M62 65 Q66 58 76 56 Q80 63 70 70 Z" />
      </g>
    </svg>
  );
}
