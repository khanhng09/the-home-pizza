import type { Metadata } from "next";
import { generatePageMetadata } from "@/shared/lib/metadata";
import { MenuHeroSection, MenuCatalogSection } from "@/screens/menu";

export const metadata: Metadata = generatePageMetadata(
  "Thực đơn",
  "Bản đồ đặc sản Việt trên đế bánh pizza chuẩn Ý — khám phá thực đơn The Home Pizza theo từng vùng miền.",
  { canonical: "/menu" }
);

export default function MenuPage() {
  return (
    <>
      <MenuHeroSection />
      <MenuCatalogSection />
    </>
  );
}
