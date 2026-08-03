import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // This project deliberately uses native <img> instead of next/image
      // (see AGENTS.md Performance rules) — don't warn on every usage.
      "@next/next/no-img-element": "off",

      // The illustration barrels re-export all 27 Đông Hồ components (~2.1MB
      // of inline SVG path data). Tree-shaking does not survive `export *`
      // re-export chains, so a single named import from either barrel pulls
      // the whole set into whatever bundle references it — measured at
      // +745KB gzipped on the home page's JS before this was fixed.
      // Import illustrations by direct module path instead.
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/shared/components",
              message:
                "Root barrel re-exports all 27 illustrations (~2.1MB). Import from @/shared/components/icons, /ui, /layout, or an illustration's direct module path.",
            },
            {
              name: "@/shared/components/illustrations",
              message:
                "Barrel pulls all 27 illustrations (~2.1MB) into the bundle. Import the direct module instead, e.g. '@/shared/components/illustrations/illus-dong-ho-tom'.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
