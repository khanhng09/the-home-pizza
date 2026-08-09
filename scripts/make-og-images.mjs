/**
 * Renders the 1200x630 link-preview crops referenced by `openGraph.images`
 * and `twitter.images`.
 *
 * Run with `yarn images:og`. Like `optimize-images.mjs`, the output is
 * committed and this is not a build hook — re-run it when a source photo
 * changes or a page/article wants a different one.
 *
 * Why a separate pass rather than reusing the responsive variants: an OG
 * card is a fixed 1.91:1 frame, so it needs its own crop, not a scaled copy
 * of a portrait photo letterboxed by whatever renders it. And it has to be
 * JPEG — WebP support across link unfurlers is still uneven enough that a
 * WebP card silently renders as no card at all on some of them, which is
 * the one failure mode this file exists to prevent.
 *
 * Cropping uses sharp's `attention` strategy rather than a centre crop.
 * Several of these sources are portraits (the chef, the tall dining room),
 * where a 1.91:1 centre band lands on a torso or a table edge; `attention`
 * picks the region with the most detail, which on these photos is the face
 * or the lit part of the room.
 */
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const PUBLIC_DIR = new URL('../public/', import.meta.url).pathname;
const OUT_DIR = join(PUBLIC_DIR, 'images/og');
const MANIFEST_PATH = new URL(
  '../src/shared/constants/og-images.generated.json',
  import.meta.url
).pathname;

/** The card size every major unfurler crops from. Anything smaller gets
 * upscaled by them; anything larger is wasted bytes. */
const WIDTH = 1200;
const HEIGHT = 630;

/**
 * Higher than the 80 the responsive variants use: an OG card is re-encoded
 * by most platforms after upload, so it wants headroom that a browser-facing
 * asset does not.
 */
const QUALITY = 85;

/**
 * `source` is the content image the card is cut from — and the key the app
 * looks the card up by, via `ogImage()` in `shared/lib/metadata.ts`. `name`
 * is only the output filename. `position` overrides the crop strategy for
 * sources where "most detail" is the wrong answer.
 *
 * A page or article that asks for a source absent from this list falls back
 * to the default card rather than 404ing, so adding a screen without
 * touching this file degrades instead of breaking. The reverse is worth
 * knowing too: nothing here is verified against what the app requests, so a
 * renamed source silently demotes that page to the default card.
 */
const CARDS = [
  // Site default — used by the root layout, so it is what `/` and any page
  // that doesn't name its own image share. Deliberately not the home hero
  // poster: that frame carries the video's own burnt-in title, and any
  // 1.91:1 crop of it slices the lettering in half.
  { name: 'default', source: 'images/home/location/nha-trang/DSC03188.webp' },
  // The menu "photos" on this site are all scans of the printed menu, so
  // this card is a crop of one. Anchored to the top rather than by
  // attention: the spread is a grid of dish rows, and attention lands
  // mid-row, cutting the bottom one in half. The top edge is a clean row.
  { name: 'menu', source: 'images/menu/pizza-1.webp', position: 'top' },
  { name: 'humans', source: 'images/humans/chef.webp' },
  { name: 'space', source: 'images/space/hero.png' },
  // No entry for the /story landing: it previews on the restaurant
  // exterior, which is already one of the six article covers below, and the
  // manifest is keyed by source — a second card cut from the same photo
  // would just shadow that one. /story asks for the photo and gets
  // `story-2.jpg`.
];

/**
 * The six /story photos double as article covers (see `PHOTO` in
 * `shared/constants/story-content.constant.ts`), and which one a given
 * article uses is editorial. Cards are generated for all of them so adding
 * an article never needs a new entry here.
 */
for (const index of [1, 2, 3, 4, 5, 6]) {
  CARDS.push({ name: `story-${index}`, source: `images/story/story-${index}.webp` });
}

// The manifest is keyed by source, so two cards cut from the same photo
// would collapse into one entry and whichever came last would win —
// silently pointing a page at a card it didn't ask for, and leaving the
// other file on disk unreachable. Cheaper to refuse than to debug.
const duplicates = CARDS.map((card) => card.source).filter(
  (source, index, all) => all.indexOf(source) !== index
);
if (duplicates.length) {
  throw new Error(
    `Two cards share a source: ${[...new Set(duplicates)].join(', ')}.\n` +
      'Give one of them a different photo, or drop it and let both pages ask ' +
      'for the same source — `ogImage()` will hand them the same card.'
  );
}

await mkdir(OUT_DIR, { recursive: true });

const manifest = {};
let sourceBytes = 0;
let outputBytes = 0;

for (const { name, source, position } of CARDS) {
  const absolute = join(PUBLIC_DIR, source);
  sourceBytes += (await stat(absolute)).size;

  const target = join(OUT_DIR, `${name}.jpg`);
  const info = await sharp(absolute)
    .resize({
      width: WIDTH,
      height: HEIGHT,
      fit: 'cover',
      position: position ?? sharp.strategy.attention,
    })
    // Strip any source ICC profile down to sRGB — a wide-gamut card renders
    // washed out or oversaturated in the unfurlers that ignore profiles.
    .toColorspace('srgb')
    .jpeg({ quality: QUALITY, mozjpeg: true, chromaSubsampling: '4:2:0' })
    .toFile(target);

  outputBytes += info.size;
  manifest[`/${source}`] = `/images/og/${name}.jpg`;
  console.log(`${name.padEnd(12)} ${String(Math.round(info.size / 1024) + ' KB').padStart(7)}  ← ${source}`);
}

// Anything in the output folder that no longer has an entry is stale — the
// app can't reach it, but it still ships in the deploy.
const orphans = (await readdir(OUT_DIR)).filter(
  (file) => file.endsWith('.jpg') && !CARDS.some((card) => `${card.name}.jpg` === file)
);
if (orphans.length) {
  console.warn(`\nStale cards in images/og (no longer generated): ${orphans.join(', ')}`);
}

const ordered = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(MANIFEST_PATH, `${JSON.stringify(ordered, null, 2)}\n`);

const kb = (n) => `${Math.round(n / 1024)} KB`;
console.log(
  `\n${CARDS.length} cards at ${WIDTH}x${HEIGHT}. Sources ${kb(sourceBytes)} → cards ${kb(outputBytes)}.`
);
