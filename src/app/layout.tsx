import type { Metadata } from "next";
import localFont from "next/font/local";
import { Raleway } from "next/font/google";
import { Header, Footer } from "@/shared/components/layout";
import { rootMetadata } from "@/shared/lib/metadata";
import "./globals.css";

const dfvnAbygaer = localFont({
  src: "../../public/fonts/dfvn-abygaer.woff2",
  variable: "--font-abygaer",
  weight: "400",
  display: "swap",
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${dfvnAbygaer.variable} ${raleway.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
