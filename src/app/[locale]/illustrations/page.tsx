import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/shared/lib/metadata";
import { IllustrationsGallery } from "@/screens/illustrations/components/illustrations-gallery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata(locale, "Illustrations Gallery", "Dev preview of all illustration components.", {
    noindex: true,
  });
}

export default async function IllustrationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <IllustrationsGallery />;
}
