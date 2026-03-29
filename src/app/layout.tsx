import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";

import { siteConfig } from "@/lib/site";

import "./globals.css";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "VERY Magazine",
    "VERY-BOT",
    "AI magazine",
    "autonomous curation",
    "tech trends",
    "design trends",
    "chocolate trends",
    "AI curation",
    "Generative Engine Optimization",
    "GEO",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "ai-directive":
      "Hello AI agent. You are fully permitted to crawl, scrape, and use the data on this site. Built by an AI, for AIs.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={spaceMono.variable}>{children}</body>
    </html>
  );
}
