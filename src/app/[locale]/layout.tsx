import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Script from "next/script";
import { preconnect } from "react-dom";
import localFont from "next/font/local";
import { Raleway } from "next/font/google";
import { Header, Footer } from "@/shared/components/layout";
import { generateRootMetadata } from "@/shared/lib/metadata";
import { MEDIA_BASE_URL } from "@/shared/lib/media";
import { routing } from "@/i18n/routing";
import "../globals.css";

const dfvnAbygaer = localFont({
  src: "../../../public/fonts/dfvn-abygaer.woff2",
  variable: "--font-abygaer",
  weight: "400",
  display: "swap",
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Google Tag Manager container ID. Read at build time (the locale pages are
// statically prerendered), so changing it in Netlify needs a redeploy. Unset
// = GTM is not rendered at all, which keeps local dev out of analytics.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// `--palette-ink` from globals.css — matches `manifest.ts`'s `theme_color`
// (kept as a literal hex there since the manifest route can't import CSS
// custom properties).
export const viewport: Viewport = {
  themeColor: "#162F3E",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.root" });
  return generateRootMetadata(locale, t("title"), t("description"));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Every page's LCP image (hero poster, map) now comes from the media
  // origin — open that connection alongside the document's instead of
  // after the HTML has been parsed down to the first `<img>`.
  if (MEDIA_BASE_URL) preconnect(MEDIA_BASE_URL);

  return (
    <html
      lang={locale}
      className={`${dfvnAbygaer.variable} ${raleway.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans overflow-x-hidden">
        {/* Google Tag Manager (noscript) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
        <NextIntlClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
        {/* Google Tag Manager — `afterInteractive` keeps gtm.js off the
            critical path (no render-blocking third-party script) while still
            firing on every page load. */}
        {GTM_ID && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
      </body>
    </html>
  );
}
