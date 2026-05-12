#!/usr/bin/env node
// 从 public/branding/logo.svg 生成项目里所需的所有 PNG 图标。
//
// 设计原则：sharp 不放进项目依赖（native 包，且只在本地构建图标时用一次），
// 而是优先用本地已安装的 sharp，找不到就从全局 npm 寻找。任何机器上只要
// 装过 sharp（不论是项目级、全局级，还是被某个全局工具间接装上的），
// 这个脚本都能用。

import { readFile, mkdir, copyFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ROOT = resolve(fileURLToPath(import.meta.url), "..", "..");

// 按优先级尝试加载 sharp：
//   1. 项目 node_modules（如果将来加进 deps 就直接走这条）
//   2. 全局 npm root 下的 sharp（npm i -g sharp）
//   3. 全局 npm root 下某个工具间接装的 sharp（比如 openclaw 带的）
function loadSharp() {
  const pick = (path) => {
    const mod = require(path);
    // path 既可以是包名也可以是绝对路径，统一通过 path/package.json 拿版本
    const pkg = require(`${path}/package.json`);
    return { sharp: mod, sharpVersion: pkg.version };
  };

  try {
    return pick("sharp");
  } catch {
    // 继续
  }

  const npmRoot = execSync("npm root -g", { encoding: "utf8" }).trim();
  const direct = resolve(npmRoot, "sharp");
  if (existsSync(direct)) return pick(direct);

  // 在全局包的 node_modules 里找一层 sharp。只查一层，避免无谓的深扫。
  const { readdirSync } = require("node:fs");
  for (const pkg of readdirSync(npmRoot, { withFileTypes: true })) {
    if (!pkg.isDirectory()) continue;
    // npm scope 目录，多一层展开
    if (pkg.name.startsWith("@")) {
      const scopePath = resolve(npmRoot, pkg.name);
      for (const sub of readdirSync(scopePath, { withFileTypes: true })) {
        const nested = resolve(scopePath, sub.name, "node_modules", "sharp");
        if (existsSync(nested)) return pick(nested);
      }
      continue;
    }
    const nested = resolve(npmRoot, pkg.name, "node_modules", "sharp");
    if (existsSync(nested)) return pick(nested);
  }

  throw new Error(
    "找不到 sharp。请执行 `npm i -g sharp` 后重试，或者把 sharp 加到本项目 devDependencies。",
  );
}

const { sharp, sharpVersion } = loadSharp();

const SOURCE = resolve(ROOT, "public/branding/logo.svg");
if (!existsSync(SOURCE)) {
  throw new Error(`找不到源文件：${SOURCE}`);
}

// 生成清单。Next.js 在 app/ 目录下识别 icon.png / apple-icon.png 这类
// 约定文件名，自动注入 <link rel="icon"> 与 <link rel="apple-touch-icon">。
// 192/512 给 webmanifest 用，1024 留作未来高清场景。
const TARGETS = [
  { out: "app/icon.png",                size:  32 },
  { out: "app/apple-icon.png",          size: 180 },
  { out: "public/branding/icon-192.png", size: 192 },
  { out: "public/branding/icon-512.png", size: 512 },
  { out: "public/branding/icon-1024.png", size: 1024 },
];

const svg = await readFile(SOURCE);

for (const t of TARGETS) {
  const outPath = resolve(ROOT, t.out);
  await mkdir(dirname(outPath), { recursive: true });
  // density 影响 SVG 栅格化精度。封顶 768，再高就触发 sharp 的 pixel limit。
  await sharp(svg, { density: Math.min(768, Math.max(384, t.size * 2)) })
    .resize(t.size, t.size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log(`✓ ${t.out.padEnd(36)} ${t.size}×${t.size}`);
}

// 把 SVG 源也放一份到 app/，Next.js 会自动注入 <link rel="icon" type="image/svg+xml">。
// 现代浏览器拿 SVG，老的回退到 icon.png。
await copyFile(SOURCE, resolve(ROOT, "app/icon.svg"));
console.log(`✓ ${"app/icon.svg".padEnd(36)} (SVG passthrough)`);

// 用同一份 SVG 渲出 16 / 32 / 48 三档 PNG，打成 ICO。
// 走 PNG-in-ICO（Vista+ 起所有目标浏览器都支持），免去手写 BMP 编码。
const icoSizes = [16, 32, 48];
const icoPngs = await Promise.all(
  icoSizes.map(async (size) => {
    const buf = await sharp(svg, { density: Math.max(384, size * 8) })
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toBuffer();
    return { size, buf };
  }),
);
await writeFile(resolve(ROOT, "app/favicon.ico"), buildIco(icoPngs));
console.log(`✓ ${"app/favicon.ico".padEnd(36)} (${icoSizes.join("/")})`);

console.log(`\n用 sharp ${sharpVersion} 生成完成。`);

// 把若干 PNG 打包成 ICO。格式参考：
// https://en.wikipedia.org/wiki/ICO_(file_format)
//   ICONDIR        6 字节
//   ICONDIRENTRY  16 字节 × N
//   image data... 紧跟在目录后面，直接放 PNG 字节即可
function buildIco(entries) {
  const HEADER = 6;
  const ENTRY = 16;
  const dirSize = HEADER + ENTRY * entries.length;
  const total = dirSize + entries.reduce((s, e) => s + e.buf.length, 0);
  const out = Buffer.alloc(total);

  // ICONDIR
  out.writeUInt16LE(0, 0);                // reserved
  out.writeUInt16LE(1, 2);                // type = ICO
  out.writeUInt16LE(entries.length, 4);   // image count

  let dataOffset = dirSize;
  let entryOffset = HEADER;
  for (const e of entries) {
    // 256 在 ICO 里编码成 0
    const dim = e.size >= 256 ? 0 : e.size;
    out.writeUInt8(dim, entryOffset);             // width
    out.writeUInt8(dim, entryOffset + 1);         // height
    out.writeUInt8(0, entryOffset + 2);           // color palette (truecolor=0)
    out.writeUInt8(0, entryOffset + 3);           // reserved
    out.writeUInt16LE(1, entryOffset + 4);        // color planes
    out.writeUInt16LE(32, entryOffset + 6);       // bits per pixel
    out.writeUInt32LE(e.buf.length, entryOffset + 8);   // image data size
    out.writeUInt32LE(dataOffset, entryOffset + 12);    // image data offset
    entryOffset += ENTRY;
    dataOffset += e.buf.length;
  }

  // 紧跟着把每张 PNG 原样写进去
  let writeAt = dirSize;
  for (const e of entries) {
    e.buf.copy(out, writeAt);
    writeAt += e.buf.length;
  }
  return out;
}
