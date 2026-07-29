import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/shared/lib/metadata";
import { MenuHeroSection, MenuCatalogSection } from "@/screens/menu";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.menu" });
  return generatePageMetadata(locale, t("title"), t("description"), { canonical: "/menu" });
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <MenuHeroSection />
      <MenuCatalogSection />
    </>
  );
}
