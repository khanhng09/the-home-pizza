/**
 * Design tokens for The Home Pizza
 * Color palette, spacing, typography scales, and semantic tokens
 * All CSS custom properties are defined in globals.css
 */

export const colorPalette = {
  // Brand colors
  cream: "hsl(38 64% 94%)", // --palette-cream: #EFE9DE
  clay: "hsl(32 43% 70%)", // --palette-clay: #CEA980
  umber: "hsl(18 42% 35%)", // --palette-umber: #765032
  ink: "hsl(200 43% 15%)", // --palette-ink: #162F3E
  linen: "hsl(34 54% 84%)", // --palette-linen: #E1D2B9

  // Semantic aliases (used in the design)
  background: "var(--background)", // cream
  foreground: "var(--foreground)", // ink
  surface: "var(--surface)", // linen
  accent: "var(--accent)", // clay
  accentDeep: "var(--accent-deep)", // umber
};

export const semanticColors = {
  // Text colors
  text: {
    primary: "var(--foreground)", // ink
    secondary: "var(--accent)", // clay
    muted: "var(--accent)", // clay with lower opacity
  },
  // Background colors
  bg: {
    default: "var(--background)", // cream
    subtle: "var(--surface)", // linen
    accent: "var(--accent)", // clay
    accentDeep: "var(--accent-deep)", // umber
  },
  // Border colors
  border: {
    light: "var(--surface)", // linen
    default: "var(--accent)", // clay
    strong: "var(--accent-deep)", // umber
  },
};

export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "2.5rem", // 40px
  "3xl": "3rem", // 48px
  "4xl": "4rem", // 64px
  "5xl": "6rem", // 96px
};

export const fontSize = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
};

export const fontFamily = {
  display: "var(--font-display)", // dfvn-abygaer, raleway
  sans: "var(--font-sans)", // raleway
  mono: "var(--font-mono)",
};

export const fontWeight = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export const lineHeight = {
  tight: 1.2,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

export const borderRadius = {
  none: "0",
  sm: "0.25rem",
  base: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.5rem",
  full: "9999px",
};

export const shadow = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
};

export const zIndex = {
  hide: "-1",
  auto: "auto",
  base: "0",
  dropdown: "1000",
  sticky: "1020",
  fixed: "1030",
  backdrop: "1040",
  modal: "1050",
  popover: "1060",
  tooltip: "1070",
};

export const breakpoints = {
  xs: "320px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

export const transitionDuration = {
  none: "0s",
  fastest: "75ms",
  faster: "100ms",
  fast: "150ms",
  base: "200ms",
  normal: "300ms",
  slow: "500ms",
  slower: "700ms",
};

export const transitionTiming = {
  linear: "linear",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
};
