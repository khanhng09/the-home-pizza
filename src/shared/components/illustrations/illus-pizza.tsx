import { IconProps, getIconSize } from '../icons/icon.type';

export function IlustPizza({ size = 'md', className, title, ...props }: IconProps) {
  const sizeValue = getIconSize(size);

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      width={sizeValue}
      height={sizeValue}
      className={className}
      {...props}
    >
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Pizza slice - triangle */}
        <path d="M100 20 L180 160 L20 160 Z" />

        {/* Cheese */}
        <circle cx="100" cy="80" r="8" fill="currentColor" opacity="0.3" />
        <circle cx="70" cy="120" r="6" fill="currentColor" opacity="0.3" />
        <circle cx="130" cy="130" r="7" fill="currentColor" opacity="0.3" />

        {/* Toppings */}
        <circle cx="90" cy="100" r="4" />
        <circle cx="120" cy="110" r="4" />
        <circle cx="85" cy="135" r="3.5" />
        <circle cx="110" cy="140" r="3.5" />

        {/* Basil leaf */}
        <path d="M95 75 Q90 70 100 65 Q110 70 105 75 Q100 78 95 75" />
      </g>
    </svg>
  );
}
