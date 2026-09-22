import { setRequestLocale } from "next-intl/server";
import {
  HomeHeroSection,
  HomeStorySection,
  HomeMenuSection,
  HomeHumansSection,
  HomeLocationSection,
} from "@/screens/home";
import { generateRestaurantSchema } from "@/shared/lib/metadata";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Restaurant schema, so the homepage is eligible for a rich result
  // (hours, price range, cuisine) rather than a plain blue link — see
  // `generateRestaurantSchema` for why it carries no `aggregateRating`.
  const jsonLd = generateRestaurantSchema();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <HomeHeroSection />
      <HomeStorySection />
      <HomeMenuSection />
      <HomeHumansSection />
      <HomeLocationSection />
    </>
  );
}
