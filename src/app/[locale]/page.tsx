import { setRequestLocale } from "next-intl/server";
import {
  HomeHeroSection,
  HomeStorySection,
  HomeMenuSection,
  HomeHumansSection,
  HomeLocationSection,
} from "@/screens/home";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HomeHeroSection />
      <HomeStorySection />
      <HomeMenuSection />
      <HomeHumansSection />
      <HomeLocationSection />
    </>
  );
}
