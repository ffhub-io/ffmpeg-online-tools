import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

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
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
