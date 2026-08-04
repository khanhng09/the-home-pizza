/**
 * Re-encodes the background hero videos and extracts their poster frames.
 *
 * Run with `yarn videos:optimize`. Like the image script this is not a
 * build hook — the output is committed, and re-encoding only happens when
 * the footage changes.
 *
 * Two problems with the source files, not just size:
 *
 * 1. They are AV1 (home) and VP9 (humans) inside an `.mp4` container.
 *    Safari cannot decode AV1 without hardware support, and does not
 *    support VP9-in-MP4 at all — so on a large share of Apple devices
 *    these heroes were rendering as an empty box. Every output here ships
 *    an H.264/MP4 rendition, which plays everywhere.
 * 2. Both carry an AAC track that nothing can hear: the elements are
 *    `muted`. `-an` drops it.
 *
 * The footage is ambient background behind a dark gradient and large
 * type, cropped hard by `object-cover`. That justifies settings that
 * would be too aggressive for foreground video: 24fps, light denoise
 * (which both suppresses handheld sensor noise and makes the
 * high-frequency woven textures far cheaper to encode), and a low
 * bitrate. Verified against extracted frames — the burned-in captions
 * stay legible, which is the sharpest content in the frame.
 */
import { mkdir, stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join } from 'node:path';
import sharp from 'sharp';

const run = promisify(execFile);

const PUBLIC_DIR = new URL('../public/', import.meta.url).pathname;

/** Smooths sensor noise and the woven-texture detail that dominates the
 * bitrate. Values are deliberately mild — enough to help the encoder,
 * not enough to read as a blur under the overlay. */
const DENOISE = 'hqdn3d=6:4:8:6';
const FPS = '24';

const SOURCES = [
  {
    input: 'videos/home/hero-banner.mp4',
    outputDir: 'videos/home',
    name: 'hero-banner',
    poster: 'images/home/hero-poster.webp',
    /** Frame 0 carries the title card, so it is what the loop starts on
     * — using it keeps the handover from poster to video seamless. */
    posterAt: '0',
  },
  {
    input: 'videos/humans/hero.mp4',
    outputDir: 'videos/humans',
    name: 'hero',
    poster: 'images/humans/hero-poster.webp',
    posterAt: '0',
  },
];

/**
 * Mobile renders this at roughly 460 CSS px wide after `object-cover`
 * crops it, so 720 is already generous there; desktop upscales whatever
 * it is given, so 1080 (the source width) is the ceiling worth keeping.
 * CRFs were picked per rendition by inspecting decoded frames.
 */
const RENDITIONS = [
  { width: 720, av1Crf: 52, h264Crf: 36 },
  { width: 1080, av1Crf: 50, h264Crf: 35 },
];

const filters = (width) => `scale=${width}:-2,${DENOISE}`;

/** Source width, so a rendition never upscales — `videos/humans/hero.mp4`
 * is only 720 wide, and a 1080 rendition of it is pure waste. */
async function nativeWidth(input) {
  const { stdout } = await run('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width', '-of', 'csv=p=0', input,
  ]);
  return Number.parseInt(stdout.trim(), 10);
}

async function encode(source) {
  const input = join(PUBLIC_DIR, source.input);
  const before = (await stat(input)).size;
  const native = await nativeWidth(input);
  let after = 0;
  const produced = [];

  for (const { width, av1Crf, h264Crf } of RENDITIONS.filter((r) => r.width <= native)) {
    const base = join(PUBLIC_DIR, source.outputDir, `${source.name}.${width}`);

    // AV1 first in the markup: smaller, and every browser that can decode
    // it also honours `<source type>` selection.
    await run('ffmpeg', [
      '-v', 'error', '-i', input,
      '-vf', filters(width), '-r', FPS,
      '-c:v', 'libsvtav1', '-crf', String(av1Crf), '-preset', '5',
      '-pix_fmt', 'yuv420p', '-an', '-y', `${base}.webm`,
    ]);

    // `+faststart` moves the moov atom to the front so playback can begin
    // before the whole file has arrived.
    await run('ffmpeg', [
      '-v', 'error', '-i', input,
      '-vf', filters(width), '-r', FPS,
      '-c:v', 'libx264', '-crf', String(h264Crf), '-preset', 'slow',
      '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart',
      '-an', '-y', `${base}.mp4`,
    ]);

    for (const ext of ['webm', 'mp4']) {
      const size = (await stat(`${base}.${ext}`)).size;
      after += size;
      produced.push(`${source.name}.${width}.${ext} ${Math.round(size / 1024 / 1024 * 10) / 10}MB`);
    }
  }

  // This ffmpeg build ships no WebP encoder, so the frame comes out as
  // PNG on stdout and sharp does the encoding.
  const poster = join(PUBLIC_DIR, source.poster);
  await mkdir(join(PUBLIC_DIR, source.poster, '..'), { recursive: true });
  const { stdout: frame } = await run(
    'ffmpeg',
    [
      '-v', 'error', '-ss', source.posterAt, '-i', input,
      '-vframes', '1', '-vf', 'scale=720:-2',
      '-f', 'image2pipe', '-vcodec', 'png', '-',
    ],
    { encoding: 'buffer', maxBuffer: 64 * 1024 * 1024 }
  );
  await sharp(frame).webp({ quality: 72 }).toFile(poster);
  const posterSize = (await stat(poster)).size;

  console.log(`${source.input}  ${Math.round(before / 1024 / 1024 * 10) / 10}MB source`);
  produced.forEach((line) => console.log(`   ${line}`));
  console.log(`   poster ${Math.round(posterSize / 1024)}KB`);

  return { before, after };
}

async function main() {
  let before = 0;
  let after = 0;
  for (const source of SOURCES) {
    const result = await encode(source);
    before += result.before;
    after += result.after;
  }
  const mb = (n) => `${(n / 1024 / 1024).toFixed(1)}MB`;
  console.log(`\nsources ${mb(before)} → all renditions ${mb(after)} (a visitor loads one)`);
}

main().catch((error) => {
  console.error(error.stderr || error.message);
  process.exit(1);
});
