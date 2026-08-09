import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SpaceSignatureSection } from "@/screens/space";
import { generatePageMetadata } from "@/shared/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.space" });
  return generatePageMetadata(locale, t("title"), t("description"), {
    canonical: "/space",
    // The optimized variant, not the 6.5MB master — link unfurlers fetch
    // this eagerly and several cap the payload they will accept.
    image: "/images/space/hero.w1400.webp",
  });
}

export default async function SpacePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SpaceSignatureSection />;
}
