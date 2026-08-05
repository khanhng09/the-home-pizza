/**
 * Generates responsive WebP variants for the site's photography.
 *
 * Run with `yarn images:optimize`. It is deliberately NOT a `prebuild`
 * hook: the output is committed, so builds stay fast and deterministic,
 * and re-encoding only happens when someone adds or replaces artwork.
 *
 * Originals are never overwritten — variants are written next to them as
 * `<name>.w<width>.webp`. That keeps a lossless master around to re-run
 * this script against with different settings.
 *
 * The `.w<digits>.` infix is what tells a variant apart from a source, so
 * it has to be a shape no artwork uses. A plain `-<width>` suffix does
 * not qualify: half these files are already named `bac-1`, `pizza-32`,
 * `salad-02`, and a directory scan would skip them as if they were
 * previous output.
 *
 * Widths are chosen from how large each image actually renders, doubled
 * for 2x screens, and capped at the source's own width (upscaling only
 * costs bytes). See each entry's note for the measurement it came from.
 */
import { readdir, stat, writeFile } from 'node:fs/promises';
import { join, dirname, basename, extname } from 'node:path';
import sharp from 'sharp';

const PUBLIC_DIR = new URL('../public/', import.meta.url).pathname;

/**
 * Where the list of what was actually produced is written. The app reads
 * it to build `srcset`, rather than re-deriving the widths — a source
 * narrower than a configured width gets fewer variants than asked for
 * (see the `Math.min` below), and a hardcoded list at the call site would
 * point `srcset` at files that were never written.
 */
const MANIFEST_PATH = new URL(
  '../src/shared/constants/image-variants.generated.json',
  import.meta.url
).pathname;

/** Photographic content tolerates 80 well; these are all photos or
 * photographed menu spreads, nothing with hard synthetic edges. */
const QUALITY = 80;

/** Matches this script's own output, so a re-run never treats a variant
 * as a source. */
const VARIANT_PATTERN = /\.w\d+\.webp$/;

const GROUPS = [
  {
    // The right-hand panel of the menu section. Half the container on
    // desktop (~720px at 1440, ~960px on a wide screen) and full-bleed on
    // mobile (~430px). Source tops out at 1241px, so that is the ceiling.
    name: 'menu spreads',
    dirs: [
      'images/home/menu/dsv',
      'images/home/menu/pizza',
      'images/home/menu/salad',
      'images/home/menu/pasta',
    ],
    widths: [860, 1241],
  },
  {
    // Story tabs banner — spans the container at up to 1402 CSS px.
    name: 'story tabs',
    files: [
      'images/home/story/default.webp',
      'images/home/story/story-dsv.webp',
      'images/home/story/story-ht.webp',
      'images/home/story/story-tt.webp',
    ],
    widths: [768, 1440, 2160],
  },
  {
    // Location panel gallery — per-city ambiance photos, same geometry as
    // the menu panel (half the container on desktop, full-bleed on mobile).
    name: 'location gallery',
    dirs: ['images/home/location/nha-trang', 'images/home/location/phu-quoc'],
    widths: [860, 1400],
  },
  {
    // Humans section photos. The portrait renders at ~488 CSS px on
    // desktop and ~164 on mobile; the landscape matches it.
    name: 'home humans',
    files: ['images/home/humans/human-1.webp', 'images/home/humans/human-2.webp'],
    widths: [420, 1000],
  },
  {
    // Decorative hero map, desktop only, drawn at roughly 800 CSS px.
    name: 'hero map',
    files: ['images/home/vn-map.png'],
    widths: [900],
  },
  {
    // Trust badges render at 172 CSS px wide.
    name: 'trust badges',
    files: ['images/home/trip-advisor.png', 'images/home/guru-recommend.png'],
    widths: [344],
  },
  {
    // Humans screen photos. The chef/homer portraits render at roughly
    // half the container on desktop and full-bleed on mobile; the CTA and
    // people-story shots are full-bleed banners.
    name: 'humans screen',
    files: [
      'images/humans/chef.webp',
      'images/humans/chef-mb.webp',
      'images/humans/homer.webp',
      'images/humans/homer-mb.webp',
      'images/humans/be-homer.webp',
      'images/humans/be-homer-mb.webp',
    ],
    widths: [640, 1400],
  },
  {
    // Section background textures. These are CSS `background-image`, which
    // has no srcset — each breakpoint already points at its own file, so
    // one variant each at the size it is actually painted.
    name: 'backgrounds',
    files: [
      'images/home/story/background.webp',
      'images/home/menu/background.webp',
      'images/home/humans/background.webp',
      'images/home/location/background.webp',
      'images/home/story/background-mb.webp',
      'images/home/menu/background-mb.webp',
      'images/home/humans/background-mb.webp',
      'images/home/location/background-mb.webp',
      'images/humans/bg-1.webp',
      'images/humans/bg-1-mb.webp',
      'images/humans/bg-2.webp',
      'images/humans/bg-2-mb.webp',
      'images/humans/bg-3.webp',
      'images/humans/bg-3-mb.webp',
    ],
    widths: [1400],
  },
];

async function collect(group) {
  if (group.files) return group.files;

  const found = [];
  for (const dir of group.dirs) {
    const entries = await readdir(join(PUBLIC_DIR, dir));
    for (const entry of entries) {
      if (/\.(webp|png|jpe?g)$/i.test(entry) && !VARIANT_PATTERN.test(entry)) {
        found.push(join(dir, entry));
      }
    }
  }
  return found.sort();
}

async function run() {
  let sourceBytes = 0;
  let outputBytes = 0;
  let written = 0;
  const manifest = {};

  for (const group of GROUPS) {
    const files = await collect(group);
    let groupSource = 0;
    let groupOutput = 0;

    for (const file of files) {
      const absolute = join(PUBLIC_DIR, file);
      const image = sharp(absolute);
      const { width: nativeWidth } = await image.metadata();
      groupSource += (await stat(absolute)).size;

      // Never upscale — a variant wider than the source is pure waste.
      const widths = [...new Set(group.widths.map((w) => Math.min(w, nativeWidth)))];

      for (const width of widths) {
        const target = join(
          dirname(absolute),
          `${basename(file, extname(file))}.w${width}.webp`
        );
        const info = await sharp(absolute)
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: QUALITY })
          .toFile(target);

        groupOutput += info.size;
        written += 1;
      }

      manifest[`/${file}`] = widths.sort((a, b) => a - b);
    }

    sourceBytes += groupSource;
    outputBytes += groupOutput;
    const kb = (n) => `${Math.round(n / 1024)} KB`;
    console.log(
      `${group.name.padEnd(16)} ${files.length} source ${kb(groupSource).padStart(9)} → ${kb(groupOutput).padStart(9)}`
    );
  }

  const ordered = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(MANIFEST_PATH, `${JSON.stringify(ordered, null, 2)}\n`);

  const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`;
  console.log(
    `\n${written} variants written for ${Object.keys(manifest).length} sources.` +
      ` Sources ${mb(sourceBytes)} → variants ${mb(outputBytes)}.`
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
