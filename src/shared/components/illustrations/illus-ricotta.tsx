import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustRicotta({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width={sizeValue} height={sizeValue} className={className} {...props}>
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="50" r="35" />
        <circle cx="40" cy="40" r="4" opacity="0.5" />
        <circle cx="55" cy="35" r="3.5" opacity="0.5" />
        <circle cx="45" cy="55" r="3.8" opacity="0.5" />
        <circle cx="60" cy="50" r="3.5" opacity="0.5" />
        <circle cx="50" cy="65" r="4" opacity="0.5" />
        <circle cx="35" cy="50" r="3.8" opacity="0.5" />
        <circle cx="42" cy="70" r="3.5" opacity="0.5" />
      </g>
    </svg>
  );
}
