import Link from "next/link";

const NAV = [
  { href: "/video-to-mp3", label: "Video to MP3" },
  { href: "/extract-audio", label: "Extract audio" },
  { href: "/compress", label: "Compress" },
  { href: "/convert", label: "Convert" },
];

export function SiteHeader() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          ffmpeg<span className="text-gray-400">.online</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-gray-600 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-gray-900">
              {item.label}
            </Link>
          ))}
        </nav>
        <a
          href="https://github.com/ffhub-io/ffmpeg-online-tools"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          GitHub ↗
        </a>
      </div>
    </header>
  );
}
