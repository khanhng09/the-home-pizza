import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustArugula({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);
  return (
    <svg viewBox="0 0 80 140" xmlns="http://www.w3.org/2000/svg" width={sizeValue} height={sizeValue} className={className} {...props}>
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 130 L40 40" />
        <path d="M40 50 L25 35 M40 65 L20 48 M40 85 L22 72 M40 105 L28 95" />
        <path d="M40 50 L55 35 M40 65 L60 48 M40 85 L58 72 M40 105 L52 95" />
        <path d="M25 35 Q22 30 30 28 Q33 33 30 40 Z" />
        <path d="M55 35 Q58 30 66 28 Q69 33 66 40 Z" />
      </g>
    </svg>
  );
}
