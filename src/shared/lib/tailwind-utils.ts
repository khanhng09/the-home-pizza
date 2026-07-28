/**
 * Reusable Tailwind CSS class collections
 * Group related utilities together for consistency and easy reuse
 */

export const tailwindUtils = {
  // Container & Layout
  container: {
    base: "w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8",
    narrow: "w-full max-w-4xl mx-auto px-4 md:px-6",
    wide: "w-full max-w-full",
  },

  // Flex Utilities
  flex: {
    center: "flex items-center justify-center",
    between: "flex items-center justify-between",
    start: "flex items-start",
    end: "flex items-end",
    col: "flex flex-col",
    colCenter: "flex flex-col items-center justify-center",
    gap: "gap-4",
    gapSm: "gap-2",
    gapLg: "gap-6",
  },

  // Grid Utilities
  grid: {
    cols2: "grid grid-cols-2 gap-4",
    cols3: "grid grid-cols-3 gap-4",
    cols4: "grid grid-cols-4 gap-4",
    auto: "grid grid-cols-auto-fit gap-4",
  },

  // Typography
  text: {
    h1: "text-5xl md:text-6xl font-display font-normal tracking-tight",
    h2: "text-4xl md:text-5xl font-display font-normal",
    h3: "text-3xl md:text-4xl font-display font-normal",
    h4: "text-2xl md:text-3xl font-display font-normal",
    h5: "text-xl md:text-2xl font-sans font-semibold",
    h6: "text-lg md:text-xl font-sans font-semibold",
    body: "text-base md:text-lg font-sans font-normal leading-relaxed",
    bodySmall: "text-sm md:text-base font-sans font-normal leading-normal",
    caption: "text-xs md:text-sm font-sans font-normal uppercase tracking-widest",
    label: "text-sm font-sans font-medium uppercase tracking-wide",
  },

  // Text Colors
  textColor: {
    default: "text-foreground",
    muted: "text-accent",
    light: "text-linen",
    accent: "text-accent",
    accentDeep: "text-umber",
    white: "text-white",
    onAccent: "text-white",
    onAccentDeep: "text-white",
  },

  // Background
  bg: {
    default: "bg-background",
    subtle: "bg-linen",
    accent: "bg-clay",
    accentDeep: "bg-umber",
    white: "bg-white",
  },

  // Buttons
  button: {
    base: "inline-flex items-center justify-center rounded-lg font-sans font-medium transition-colors duration-200 px-6 py-3",
    primary: "bg-accent text-white hover:bg-clay-dark active:bg-umber",
    secondary: "bg-transparent border-2 border-accent text-accent hover:bg-cream active:bg-linen",
    ghost: "bg-transparent text-accent hover:bg-cream active:bg-linen",
    text: "bg-transparent text-accent underline hover:no-underline",
    size: {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    },
  },

  // Cards
  card: {
    base: "bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow",
    elevated: "bg-white rounded-lg shadow-lg p-8",
    bordered: "bg-white rounded-lg border-2 border-linen p-6",
  },

  // Spacing
  section: "py-12 md:py-20 lg:py-28",
  sectionSmall: "py-8 md:py-12 lg:py-16",
  sectionLarge: "py-16 md:py-24 lg:py-32",

  // Images
  image: {
    aspect1: "aspect-square object-cover",
    aspect4x3: "aspect-video object-cover",
    aspect16x9: "aspect-video object-cover",
    rounded: "rounded-lg overflow-hidden",
    roundedFull: "rounded-full overflow-hidden",
  },

  // Video
  video: {
    hero: "w-full h-full object-cover",
    responsive: "w-full h-auto",
  },

  // Links
  link: {
    default: "text-accent hover:text-umber underline transition-colors",
    navigation: "text-foreground hover:text-accent transition-colors",
  },

  // Input
  input: {
    base: "w-full px-4 py-3 rounded-lg border-2 border-linen focus:border-accent focus:outline-none focus:ring-2 focus:ring-clay focus:ring-offset-2",
    label: "block text-sm font-semibold text-foreground mb-2",
    error: "border-red-500 focus:border-red-500 focus:ring-red-200",
  },

  // Overlays & Modals
  overlay: {
    dark: "fixed inset-0 bg-black/50 backdrop-blur-sm",
    light: "fixed inset-0 bg-white/80 backdrop-blur-sm",
  },

  // Animations
  animation: {
    fadeIn: "animate-fade-in",
    slideUp: "animate-slide-up",
    slideDown: "animate-slide-down",
    slideLeft: "animate-slide-left",
    slideRight: "animate-slide-right",
    pulse: "animate-pulse",
    spin: "animate-spin",
  },

  // Responsive Display
  responsive: {
    hideOnMobile: "hidden md:block",
    showOnMobile: "block md:hidden",
    hideOnTablet: "hidden lg:block",
    showOnTablet: "hidden md:block lg:hidden",
  },

  // Borders
  border: {
    base: "border-2 border-linen",
    accent: "border-2 border-accent",
    strong: "border-2 border-umber",
  },

  // Shadows
  shadow: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  },

  // Opacity & Transitions
  transition: {
    base: "transition-all duration-200",
    slow: "transition-all duration-500",
    fast: "transition-all duration-100",
    colors: "transition-colors duration-200",
    transform: "transition-transform duration-200",
  },

  // Positioning
  position: {
    center: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    centerX: "absolute left-1/2 -translate-x-1/2",
    centerY: "absolute top-1/2 -translate-y-1/2",
  },

  // Accessibility
  a11y: {
    srOnly: "sr-only",
    focusRing: "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
  },
};

/**
 * Utility function to combine class strings
 * Removes duplicates and falsy values
 */
export const cn = (...classes: (string | undefined | boolean | null)[]): string => {
  return classes
    .filter((c): c is string => typeof c === "string" && c.length > 0)
    .join(" ");
};

/**
 * Merge multiple utility objects
 */
export const mergeUtils = (...utils: Record<string, unknown>[]): Record<string, unknown> => {
  return utils.reduce((acc, curr) => ({ ...acc, ...curr }), {});
};
