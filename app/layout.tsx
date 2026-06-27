import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "../styles/globals.css";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/shared/PageTransition";

// Display font — luxury signal. Per PRD §2.1 / §13: must load before first paint.
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

// Body font — clean, modern, readable.
const body = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

// Site-wide default metadata. Page-specific `generateMetadata()` exports
// override these on each route.
export const metadata: Metadata = {
  title: {
    default: "Lumen Aesthetics | Medical Aesthetics New York",
    template: "%s · Lumen Aesthetics",
  },
  description:
    "New York's most discreet medical aesthetics studio. Results that speak for themselves.",
  openGraph: {
    title: "Lumen Aesthetics | Medical Aesthetics New York",
    description:
      "New York's most discreet medical aesthetics studio. Results that speak for themselves.",
    type: "website",
    locale: "en_US",
    siteName: "Lumen Aesthetics",
    images: [
      {
        url: "/images/hero-portrait.png",
        width: 300,
        height: 400,
        alt: "Lumen Aesthetics — medical aesthetics, New York",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumen Aesthetics | Medical Aesthetics New York",
    description:
      "New York's most discreet medical aesthetics studio. Results that speak for themselves.",
    images: ["/images/hero-portrait.png"],
  },
  metadataBase: new URL("https://lumen-aesthetics-demo.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-lumen-black">
        <Header />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}
