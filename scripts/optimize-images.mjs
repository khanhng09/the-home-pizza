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
    // Phú Quốc is absent here on purpose: its originals were never
    // committed, so it is rebuilt from its variants — see VARIANT_ONLY_DIRS.
    name: 'location gallery',
    dirs: ['images/home/location/nha-trang'],
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
    // /story screen collage + mobile slider photos. Rendered anywhere from
    // ~240 CSS px (desktop collage column) up to ~300 CSS px in the mobile
    // filmstrip, so the useful range is narrow and the steps are close
    // together: 320 for a 1x desktop, 480 for the narrow filmstrip slots at
    // 2x, 640 for the two landscape photos at 2x — without that step a
    // DPR-2 phone jumps straight to the ~780 variant and pays ~50% more
    // bytes for pixels it can't show. 800 is the 2x ceiling (the sources
    // top out just under it, so it lands as 780/786/795).
    name: 'story screen',
    files: [
      'images/story/story-1.webp',
      'images/story/story-2.webp',
      'images/story/story-3.webp',
      'images/story/story-6.webp',
    ],
    widths: [320, 480, 640, 800],
  },
  {
    // /story screen small square detail shots — already small, one
    // variant is enough.
    name: 'story screen detail',
    files: ['images/story/story-4.webp', 'images/story/story-5.webp'],
    widths: [378],
  },
  {
    // /story screen top decorative roofline band, full-bleed behind the
    // header — same treatment as the other section background textures.
    name: 'story screen hero band',
    files: ['images/story/hero.webp'],
    widths: [768, 1400, 2160],
  },
  {
    // /space full-bleed location heroes. They fill the viewport width at
    // any size, so the ladder matches the other full-bleed banners.
    name: 'space heroes',
    files: ['images/space/hero.png', 'images/space/hero-nt.png'],
    widths: [768, 1400, 2160],
  },
  {
    // The Phú Quốc hero's own mobile crop — only ever painted below `lg`,
    // where the viewport tops out around 430 CSS px.
    name: 'space hero mobile',
    files: ['images/space/hero-mb.png'],
    widths: [480, 860],
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
  {
    // /menu hero's paper-grain overlay — a real `<img>` with `srcset`
    // (not a CSS `background-image` like the group above), full-bleed
    // behind the whole hero at any viewport width. This one had never
    // been run through this script at all — 1400×857 committed straight
    // from Figma at 400KB, downloaded at that size on every device
    // including phones that only ever paint it at ~390px wide.
    //
    // 900 (not the usual 768) is the step that actually serves a common
    // phone: 768 alone left a DPR-2 390px-wide phone needing 780px,
    // narrowly over that variant, and jumping all the way to 1400 for it
    // — the same trap the "story screen" group's own comment calls out.
    // Source tops out at 1400 native, so nothing above that gains anything
    // (the script caps to it regardless of what's listed here).
    name: 'menu hero background',
    files: ['images/menu/background.webp'],
    widths: [480, 900, 1400],
  },
];

async function collect(group) {
  if (group.files) return group.files;

  const found = [];
  for (const dir of group.dirs) {
    const entries = await readdir(join(PUBLIC_DIR, dir));
    const sources = entries.filter(
      (entry) => /\.(webp|png|jpe?g)$/i.test(entry) && !VARIANT_PATTERN.test(entry)
    );

    // A configured directory holding only variants means its originals
    // went missing. Silently emitting nothing would drop those images
    // from the manifest and 404 them in the app, so fail loudly instead.
    if (!sources.length) {
      throw new Error(
        `${dir} contains no source images — only generated variants.\n` +
          'Restore the originals, or move the directory to VARIANT_ONLY_DIRS ' +
          'if the variants are all that is ever committed for it.'
      );
    }

    for (const source of sources) found.push(join(dir, source));
  }
  return found.sort();
}

/**
 * Rebuilds manifest entries by reading already-generated variants back off
 * disk, for directories whose original images are not in the repo.
 *
 * `images/home/location/phu-quoc` is the case this exists for: only its
 * `.w<width>.webp` variants were ever committed, never the originals they
 * came from. A source scan therefore finds nothing there, and a
 * from-scratch rebuild would drop all ten entries — leaving
 * `responsiveImage()` to fall back to a bare path that 404s, because the
 * unsuffixed file does not exist either.
 *
 * `ext` is the extension the app's constants reference for these images;
 * the manifest is keyed by the path the code asks for, and the variants
 * on disk carry no record of what their original was.
 */
const VARIANT_ONLY_DIRS = [
  { name: 'phu-quoc (variants only)', dir: 'images/home/location/phu-quoc', ext: 'webp' },
];

async function collectExistingVariants({ dir, ext }, manifest) {
  const widthsBySource = new Map();

  for (const file of await readdir(join(PUBLIC_DIR, dir))) {
    const match = file.match(/^(.+)\.w(\d+)\.webp$/);
    if (!match) continue;

    const source = `/${dir}/${match[1]}.${ext}`;
    if (!widthsBySource.has(source)) widthsBySource.set(source, []);
    widthsBySource.get(source).push(Number(match[2]));
  }

  for (const [source, widths] of widthsBySource) {
    manifest[source] = widths.sort((a, b) => a - b);
  }
  return widthsBySource.size;
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

  for (const entry of VARIANT_ONLY_DIRS) {
    const count = await collectExistingVariants(entry, manifest);
    console.log(`${entry.name.padEnd(16)} ${count} source (indexed, not re-encoded)`);
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
