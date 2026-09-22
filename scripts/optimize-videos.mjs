/**
 * Re-encodes the background hero videos and extracts their poster frames.
 *
 * Run with `yarn videos:optimize`. Like the image script this is not a
 * build hook — the output is committed, and re-encoding only happens when
 * the footage changes.
 *
 * Two problems with the source files, not just size:
 *
 * 1. Both sources are HEVC (one in a `.mov` container, one in `.mp4`).
 *    Chrome/Firefox/Android generally cannot decode HEVC at all
 *    (licensing, not codec support) — so on most non-Apple devices these
 *    heroes were rendering as an empty box. Every output here ships an
 *    H.264/MP4 rendition, which plays everywhere, and an AV1/WebM
 *    rendition, which is smaller wherever it decodes.
 * 2. Both carry an AAC track that nothing can hear: the elements are
 *    `muted`. `-an` drops it.
 *
 * Both heroes are now the same kind of footage: 4K narrative shots (food
 * macro detail, dark handheld interiors) rather than a light ambient
 * loop, so both use NARRATIVE_RENDITIONS and the same encoder tuning.
 * This used to be two different profiles — the home hero's original
 * footage was a light ambient loop that tolerated a low, denoised
 * bitrate — but once home's source was replaced with narrative footage
 * too, that profile just reproduced the same mistake discovered on the
 * humans hero, in order of how much it mattered:
 *
 * 1. Resolution. See NARRATIVE_RENDITIONS — `object-cover` upscales a
 *    1080 rendition ~2.5x on a full-viewport hero, and no CRF survives
 *    that.
 * 2. Filtering and CRF, which softened food texture and any burned-in
 *    caption edges on top of the upscale.
 *
 * Judge a change here by extracting a frame and comparing it against
 * the source *at the size it is displayed at* (upscaled to the measured
 * device-pixel width), not at the encode's own resolution — a crop that
 * looks fine at 1:1 can still be mush once the browser enlarges it. If a
 * future source really is a light ambient loop again, give it back a
 * lower-bitrate profile rather than reusing this one by default —
 * nothing here detects which kind of footage a source is.
 */
import { mkdir, stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join } from 'node:path';
import sharp from 'sharp';

const run = promisify(execFile);

const PUBLIC_DIR = new URL('../public/', import.meta.url).pathname;

/** Light touch, for a rendition whose downscale ratio is small enough
 * that it is not already averaging sensor noise away on its own. */
const LIGHT_DENOISE = 'hqdn3d=2:1:2:1';
const FPS = '24';

/**
 * The ladder is driven by *display* size, not by source size.
 * `object-cover` scales this 16:9 footage to cover a full-viewport
 * portrait-ish box, so the browser upscales whatever it is handed: a
 * 1080-wide rendition measured a 2.5x upscale on a 1024x768 pane at
 * DPR 2, and ~2.8x on a 1512-wide laptop. That upscale, not the CRF,
 * was what read as "blurry" — no quantiser setting survives being
 * enlarged 2.5x. 1920 brings it to ~1.4x, which is where the detail
 * comes back.
 *
 * Denoise is per rendition here because the downscale ratio already
 * does that job: 4K → 1920 averages 2x2 pixels and needs no filter
 * (adding one measurably softened texture on the humans footage), while
 * 4K → 1080 averages 3.5x1 and can still afford a light pass to save
 * bytes on the rendition phones actually download.
 */
const NARRATIVE_RENDITIONS = [
  /** The AV1 CRF here is not a typo against the 1920 tier's lower one:
   * `tune=0` plus variance boost spend noticeably more bits at a given
   * CRF, and at 40 this rendition came out well over its H.264 sibling
   * (2.5MB vs 1.9MB) — backwards, since AV1 leads the source list on
   * the premise that it is the cheaper download. 43 brings it level. */
  { width: 1080, av1Crf: 43, h264Crf: 29, denoise: LIGHT_DENOISE },
  { width: 1920, av1Crf: 38, h264Crf: 25, denoise: null },
];

/**
 * SVT-AV1 defaults to `tune=1` (PSNR), which optimises for the metric
 * rather than for what an eye reads as sharp; `tune=0` spends the same
 * bitrate on subjective quality instead. `enable-variance-boost` gives
 * more bits to dark, low-variance blocks — both heroes spend a lot of
 * their runtime in dim interiors, which is exactly where flat banding
 * showed up. Both are free at runtime: same file size, better picture.
 */
const NARRATIVE_SVTAV1_PARAMS = 'tune=0:enable-variance-boost=1';

/** Slower presets and lanczos cost encode time only — this output is
 * committed, so a few extra minutes here buys every visitor a better
 * picture at no transfer cost. */
const NARRATIVE_ENCODER_TUNING = {
  renditions: NARRATIVE_RENDITIONS,
  av1Preset: '4',
  x264Preset: 'veryslow',
  svtav1Params: NARRATIVE_SVTAV1_PARAMS,
  scaleFlags: 'lanczos',
};

const SOURCES = [
  {
    input: 'videos/home/hero-home.mov',
    outputDir: 'videos/home',
    name: 'hero-banner',
    poster: 'images/home/hero-poster.webp',
    /** Frame 0 is the loop's opening beat (fishermen on the beach at
     * dawn), so it is what the loop starts and ends on — using it keeps
     * the handover from poster to video, and the loop's own seam,
     * seamless. */
    posterAt: '0',
    ...NARRATIVE_ENCODER_TUNING,
  },
  {
    input: 'videos/humans/hero.mp4',
    outputDir: 'videos/humans',
    name: 'hero',
    poster: 'images/humans/hero-poster.webp',
    posterAt: '0',
    ...NARRATIVE_ENCODER_TUNING,
  },
];

const filters = (width, { denoise, scaleFlags }) =>
  [
    `scale=${width}:-2${scaleFlags ? `:flags=${scaleFlags}` : ''}`,
    denoise,
  ]
    .filter(Boolean)
    .join(',');

/** Source width, so a rendition never upscales a source narrower than a
 * given rendition's target width. */
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

  for (const rendition of source.renditions.filter((r) => r.width <= native)) {
    const { width, av1Crf, h264Crf } = rendition;
    const base = join(PUBLIC_DIR, source.outputDir, `${source.name}.${width}`);
    const vf = filters(width, {
      denoise: rendition.denoise,
      scaleFlags: source.scaleFlags,
    });

    // AV1 first in the markup: smaller, and every browser that can decode
    // it also honours `<source type>` selection.
    await run('ffmpeg', [
      '-v', 'error', '-i', input,
      '-vf', vf, '-r', FPS,
      '-c:v', 'libsvtav1', '-crf', String(av1Crf),
      '-preset', source.av1Preset ?? '5',
      ...(source.svtav1Params ? ['-svtav1-params', source.svtav1Params] : []),
      '-pix_fmt', 'yuv420p', '-an', '-y', `${base}.webm`,
    ]);

    // `+faststart` moves the moov atom to the front so playback can begin
    // before the whole file has arrived.
    await run('ffmpeg', [
      '-v', 'error', '-i', input,
      '-vf', vf, '-r', FPS,
      '-c:v', 'libx264', '-crf', String(h264Crf),
      '-preset', source.x264Preset ?? 'slow',
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
