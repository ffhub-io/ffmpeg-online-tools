import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const BASE_URL = "https://ffmpeg-online-tools.vercel.app";

// Site-wide structured data. Tells Google this is a free web app and lets
// LLM crawlers (ChatGPT, Perplexity, etc.) reliably identify what the site does.
const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "FFmpeg Online Tools",
      description:
        "Free FFmpeg toolkit running in your browser via ffmpeg.wasm. Convert video to MP3, compress, trim, extract audio.",
      inLanguage: "en",
    },
    {
      "@type": "WebApplication",
      "@id": `${BASE_URL}/#webapp`,
      name: "FFmpeg Online Tools",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web (any modern browser)",
      browserRequirements: "Requires JavaScript + SharedArrayBuffer (Chrome, Firefox, Safari 16+, Edge)",
      url: BASE_URL,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "Run common FFmpeg tasks (MP3 export, audio extraction, video compression, format conversion) entirely in the browser. Files stay on your device.",
    },
  ],
};

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FFmpeg Online — Free Video & Audio Tools in Your Browser",
    template: "%s — FFmpeg Online",
  },
  description:
    "Free online FFmpeg toolkit running fully in your browser via ffmpeg.wasm. Convert video to MP3, compress, trim, extract audio — no upload, no signup.",
  metadataBase: new URL("https://ffmpeg-online-tools.vercel.app"),
  openGraph: {
    type: "website",
    siteName: "FFmpeg Online",
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-gray-50 text-gray-900">
        <JsonLd data={siteSchema} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
