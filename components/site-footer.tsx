import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-white py-8">
      <div className="container mx-auto max-w-5xl px-4 text-sm text-gray-500">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <div>
            Open source on{" "}
            <a
              href="https://github.com/ffhub-io/ffmpeg-online-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900"
            >
              GitHub
            </a>
            . Powered by ffmpeg.wasm — your files never leave your browser.
          </div>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <a
              href="https://github.com/ffhub-io/ffmpeg-online-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
