import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/shared/lib/metadata";
import {
  HumansHeroSection,
  HumansIntroSection,
  HumansChefStorySection,
  HumansPeopleStorySection,
  HumansValuesSection,
  HumansCtaSection,
} from "@/screens/humans";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.humans" });
  return generatePageMetadata(locale, t("title"), t("description"), { canonical: "/humans" });
}

export default async function HumansPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HumansHeroSection />
      <HumansIntroSection />
      <HumansChefStorySection />
      <HumansPeopleStorySection />
      <HumansValuesSection />
      <HumansCtaSection />
    </>
  );
}
