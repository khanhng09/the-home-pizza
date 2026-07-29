import type { Metadata } from "next";
import { generatePageMetadata } from "@/shared/lib/metadata";
import {
  HumansHeroSection,
  HumansIntroSection,
  HumansChefStorySection,
  HumansPeopleStorySection,
  HumansValuesSection,
  HumansCtaSection,
} from "@/screens/humans";

export const metadata: Metadata = generatePageMetadata(
  "Người nhà",
  "Câu chuyện của những con người đứng sau The Home Pizza — từ Chef Owner đến từng Người Nhà đồng hành cùng hành trình Pizza Đặc Sản Việt.",
  { canonical: "/humans" }
);

export default function HumansPage() {
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
