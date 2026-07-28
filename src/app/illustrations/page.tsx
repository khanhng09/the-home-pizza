import type { Metadata } from "next";
import { generatePageMetadata } from "@/shared/lib/metadata";
import { IllustrationsGallery } from "@/screens/illustrations/components/illustrations-gallery";

export const metadata: Metadata = generatePageMetadata(
  "Illustrations Gallery",
  "Dev preview of all illustration components.",
  { noindex: true }
);

export default function IllustrationsPage() {
  return <IllustrationsGallery />;
}
