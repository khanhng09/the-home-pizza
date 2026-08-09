import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/shared/lib/metadata";
import { StoryBackdrop, StoryIntroSection, StoryListSection } from "@/screens/story";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.story" });
  return generatePageMetadata(locale, t("title"), t("description"), {
    canonical: "/story",
    imageSource: "/images/story/story-2.webp",
  });
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <StoryBackdrop>
      <StoryIntroSection />
      <StoryListSection />
    </StoryBackdrop>
  );
}
