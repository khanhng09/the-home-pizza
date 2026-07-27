import type { Metadata } from "next";
import localFont from "next/font/local";
import { Raleway } from "next/font/google";
import "./globals.css";

const dfvnAbygaer = localFont({
  src: "public/fonts/dfvn-abygaer.woff2",
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

export const metadata: Metadata = {
  title: "The Home Pizza",
  description:
    "Handmade home-style pizza with slow-fermented dough, seasonal toppings, and warm table energy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dfvnAbygaer.variable} ${raleway.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
