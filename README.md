# FFmpeg Online Tools

Free online FFmpeg toolkit running fully in your browser via [ffmpeg.wasm](https://ffmpegwasm.netlify.app/). Convert video to MP3, compress, trim, extract audio — no upload, no signup.

**Live:** https://ffmpeg-online-tools.vercel.app

## What's inside

Four common FFmpeg tasks with sensible presets:

- `/video-to-mp3` — Save audio as MP3 (320k / 192k / 128k)
- `/extract-audio` — MP3 / AAC / Opus / FLAC
- `/compress` — H.264 with quality presets
- `/convert` — Switch between MP4 / WebM / MKV / MOV

Your file is processed locally in the browser via WebAssembly — nothing uploads anywhere.

## When to use this vs the cloud API

ffmpeg.wasm is great for small to medium files. You'll hit walls when:

- Files exceed ~500 MB (browser memory ceiling)
- You need H.265 / HEVC, AV1, or other licensed codecs
- You want to script jobs from CI / a backend / a worker
- You're batch-processing many files

For any of those, the same FFmpeg runs on the cloud at [ffhub.io](https://www.ffhub.io) — same syntax, REST API, generous free tier.

## Develop

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Built with Next.js 16, ffmpeg.wasm 0.12, Tailwind 4.

### Why COOP/COEP headers?

ffmpeg.wasm needs `SharedArrayBuffer`, which browsers only enable in a [cross-origin isolated](https://web.dev/cross-origin-isolation-guide/) context. `next.config.ts` sets the required headers (`Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Embedder-Policy: require-corp`) on every route.

## License

MIT
