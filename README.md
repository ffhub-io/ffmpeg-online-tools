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

## Limitations

ffmpeg.wasm runs entirely in your browser tab, so it's bound by browser memory
and CPU. In practice:

- **Best for small / medium files** (under ~500 MB). Larger files can peg the
  CPU at 100%, freeze the tab, or crash with out-of-memory.
- **Codecs are limited** to what the default ffmpeg-core wasm build ships
  (H.264, VP9, MP3, AAC, Opus, FLAC, etc.). H.265 / HEVC and AV1 require a
  custom build.
- **Single file at a time**. There's no batch / queue mode.

For anything beyond those limits, a server-side FFmpeg setup (or a hosted
service) is the right tool.

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
