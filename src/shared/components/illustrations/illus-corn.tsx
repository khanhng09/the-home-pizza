import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustCorn({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);
  return (
    <svg viewBox="0 0 80 140" xmlns="http://www.w3.org/2000/svg" width={sizeValue} height={sizeValue} className={className} {...props}>
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="40" cy="60" rx="22" ry="35" />
        <circle cx="28" cy="45" r="2.5" opacity="0.7" />
        <circle cx="35" cy="40" r="2.5" opacity="0.7" />
        <circle cx="45" cy="38" r="2.5" opacity="0.7" />
        <circle cx="52" cy="42" r="2.5" opacity="0.7" />
        <circle cx="25" cy="60" r="2.5" opacity="0.7" />
        <circle cx="32" cy="58" r="2.5" opacity="0.7" />
        <circle cx="48" cy="58" r="2.5" opacity="0.7" />
        <circle cx="55" cy="60" r="2.5" opacity="0.7" />
        <circle cx="30" cy="80" r="2.5" opacity="0.7" />
        <circle cx="40" cy="82" r="2.5" opacity="0.7" />
        <circle cx="50" cy="80" r="2.5" opacity="0.7" />
        <path d="M45 25 L48 10 M40 24 L40 8 M35 25 L32 10" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
