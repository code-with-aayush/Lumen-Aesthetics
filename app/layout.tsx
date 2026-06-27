import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "../styles/globals.css";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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

export const metadata: Metadata = {
  title: "Lumen Aesthetics",
  description: "Where science meets artistry.",
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
        {children}
        <Footer />
      </body>
    </html>
  );
}
