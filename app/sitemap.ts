import type { MetadataRoute } from "next";

const BASE_URL = "https://ffmpeg-online-tools.vercel.app";

const PATHS = ["", "/video-to-mp3", "/extract-audio", "/compress", "/convert"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PATHS.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
}
