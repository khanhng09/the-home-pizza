import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  localePrefix: "as-needed",
  // Vietnamese is the site's language, not a guess to be overridden by the
  // visitor's browser. Left on (next-intl's default), the proxy reads
  // `accept-language` and 307s an English-preferring browser from `/` to
  // `/en` — so most visitors abroad, and anyone on a phone set to English,
  // would never see the Vietnamese copy the restaurant actually wrote.
  // Off, `/` is always `vi` and English is reachable only by asking for it:
  // the header's language switcher, which navigates to the `/en` prefix.
  localeDetection: false,
});
