/**
 * Turns the inline `illus-*.tsx` SVG components into external alpha WebP
 * masks under `public/illustrations/`.
 *
 * Why: these illustrations are traced line art running to a quarter of a
 * megabyte of path data each, and inlining them put that geometry into
 * the HTML *twice* — once in the markup, once again in the RSC flight
 * payload. On the home page alone that was ~2.4MB of the 2.5MB document.
 *
 * They are decorative, single-colour (`fill="currentColor"`) silhouettes
 * drawn at ~128-256 CSS px, so a rasterised alpha mask at 2x carries all
 * the detail that is actually visible. Rendering them as a CSS
 * `mask-image` over `background-color: currentColor` keeps the existing
 * `text-gold` / `text-accent/60` call sites working untouched — see
 * `shared/components/illustrations/illustration.tsx`.
 *
 * Run with `yarn illustrations:extract`.
 */
import { readFile, mkdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = new URL('../src/shared/components/illustrations/', import.meta.url).pathname;
const OUT_DIR = new URL('../public/illustrations/', import.meta.url).pathname;

/** 2x the largest size any of these is drawn at (`h-46 w-64` → 256px). */
const RASTER_WIDTH = 512;

/** What the home and humans screens render. Other screens still use the
 * inline components; extend this list when they are migrated. */
const NAMES = [
  // home
  'dong-ho-tieu',
  'dong-ho-tre',
  'dong-ho-banh-da',
  'dong-ho-hung-que',
  'dong-ho-hen',
  'dong-ho-ngheu',
  'dong-ho-tom',
  'dong-ho-cua',
  'dong-ho-bo',
  'dong-ho-nhum',
  // humans
  'dong-ho-ca-trich',
  'dong-ho-ghe',
  'dong-ho-cha-gio-phan-thiet',
  'dong-ho-lap-xuong',
  'dong-ho-nom-thinh-tai-heo',
  'dong-ho-doi',
  'dong-ho-pizza-base',
  'dong-ho-sau-rieng',
  'dong-ho-pizza-dough',
];

const TITLE_EXPRESSION = '{title && <title>{title}</title>}';

/**
 * The component bodies are plain SVG markup — no JSX expressions past the
 * optional `<title>` — so the geometry can be lifted out textually rather
 * than by running React. Verified for every file in NAMES.
 */
async function toSvg(name) {
  const source = await readFile(join(SOURCE_DIR, `illus-${name}.tsx`), 'utf8');

  const viewBox = source.match(/viewBox="([^"]+)"/)?.[1];
  if (!viewBox) throw new Error(`${name}: no viewBox`);

  const start = source.indexOf(TITLE_EXPRESSION);
  if (start === -1) throw new Error(`${name}: unexpected component shape`);
  const end = source.lastIndexOf('</svg>');
  const body = source.slice(start + TITLE_EXPRESSION.length, end).trim();

  if (body.includes('{')) throw new Error(`${name}: JSX expression left in geometry`);

  // Solid black on transparent: the mask consumes the alpha channel, so
  // the fill colour itself is irrelevant as long as it is opaque.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body.replaceAll(
    'currentColor',
    '#000'
  )}</svg>`;
}

async function run() {
  await mkdir(OUT_DIR, { recursive: true });

  let inlineBytes = 0;
  let rasterBytes = 0;

  for (const name of NAMES) {
    const svg = await toSvg(name);
    inlineBytes += Buffer.byteLength(svg);

    const target = join(OUT_DIR, `${name}.webp`);
    await sharp(Buffer.from(svg), { density: 384 })
      .resize({ width: RASTER_WIDTH, withoutEnlargement: false })
      .webp({ quality: 90, alphaQuality: 100 })
      .toFile(target);

    // A mask that came out fully transparent or fully opaque means the
    // rasterisation lost the artwork — worth failing loudly on, since it
    // would render as either nothing or a solid block.
    const { channels } = await sharp(target).stats();
    const alpha = channels[channels.length - 1];
    const coverage = alpha.mean / 255;
    if (coverage < 0.005 || coverage > 0.995) {
      throw new Error(`${name}: degenerate mask, alpha coverage ${(coverage * 100).toFixed(1)}%`);
    }

    const { size } = await stat(target);
    rasterBytes += size;
    console.log(
      `${name.padEnd(20)} ${String(Math.round(Buffer.byteLength(svg) / 1024)).padStart(4)} KB inline` +
        ` → ${String(Math.round(size / 1024)).padStart(3)} KB mask` +
        `  (ink ${(coverage * 100).toFixed(1)}%)`
    );
  }

  const kb = (n) => `${Math.round(n / 1024)} KB`;
  console.log(`\n${NAMES.length} masks written. Inline ${kb(inlineBytes)} → ${kb(rasterBytes)}.`);
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
