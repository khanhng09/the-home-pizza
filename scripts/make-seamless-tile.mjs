/**
 * Turns a photographed texture into a tile that repeats without a seam.
 *
 * Run with `yarn images:tile`. Like `optimize-images.mjs`, the output is
 * committed and this is not a build hook — re-run it only when a source
 * texture changes.
 *
 * Why this exists: a photographed paper texture's left edge does not
 * continue into its right edge (or top into bottom), so repeating it
 * directly with `background-repeat` draws a faint grid of seam lines across
 * the page. The fix is the standard offset-and-cross-fade: the output is
 * the source cropped by one blend band, with that band cross-faded against
 * the pixels that sit just past the crop, so the result's first column
 * continues naturally out of its last column, in both axes.
 *
 * Mirroring a quadrant (the other common trick) also removes the seam, but
 * it makes both axes symmetric — on a fibrous paper grain that reads as a
 * damask motif rather than as paper, which is why it isn't used here.
 *
 * Each job's crop is also deliberately much smaller than its source. A
 * background tiled at its full pixel dimensions barely repeats at all — on
 * a 375px phone viewport, a source that size shows less than a third of one
 * tile at once, so instead of reading as a fine repeating grain it reads as
 * one large image stretched behind the page. Cropping a smaller square
 * keeps the fibres at their true source resolution (no resampling, so no
 * softening) while letting the tile actually repeat several times across a
 * phone width, more on desktop.
 */
import sharp from 'sharp';

const path = (p) => new URL(`../public/images/${p}`, import.meta.url).pathname;

/** Smoothstep. A linear ramp leaves a visible crease where the blend
 * weight starts and stops changing; easing both ends hides it. */
const ease = (t) => t * t * (3 - 2 * t);

/** The grain is fine and low-contrast, so it needs a higher quality than
 * the photographs in `optimize-images.mjs` — WebP spends its bit budget on
 * edges, and at 80 it starts flattening the fibres into patches. */
const QUALITY = 86;

const JOBS = [
  {
    // The dark dó paper behind the /story/[slug] article, the home menu and
    // location panels, and the /humans chef-story band — see
    // `DARK_PAPER_TILE` / `DARK_PAPER_TILE_SIZE`.
    source: path('pattern-bg.webp'),
    output: path('pattern-bg-tile.webp'),
    // Tile lands on exactly 300px, twice the 150px CSS width it's painted
    // at (`DARK_PAPER_TILE_SIZE`) — see the crop comment on the next job for
    // why the doubling matters.
    crop: 350,
    // Was 120 (a third of a then-360px tile). At that width the band
    // cross-fades two large, unrelated patches of fibre strands together,
    // and on a photo this fibrous the blend of two different strand curves
    // reads as one new curve that neither source patch had — a "ghost"
    // swirl that then repeats every tile, drawing more attention than the
    // seam it was hiding. Scaled down with the tile size since then (it was
    // 60 at 400px), but blend width alone stopped being the fix once the
    // tile shrank to 300px: every blend from 30-110 tried at the *centred*
    // crop still showed a ghost, because at this small a tile the centre of
    // the source contains one strand curl bold enough to dominate a 300px
    // window on its own — no amount of edge-blending hides a shape that's
    // already the loudest thing inside the tile. The fix was moving the
    // crop, not the blend: `offset` below points at a part of the source
    // with finer, more even grain instead.
    blend: 50,
    // Off-centre crop — see the `blend` comment above. Found by rendering
    // several 350px crops tiled 3x3 and comparing; this one's wrap-around
    // discontinuity (1.8-2.7, depending on axis) is at or below the
    // interior noise baseline (1.9), which is better than the centred
    // crop managed at any blend width.
    offset: [950, 950],
  },
  {
    // The cream paper texture shared by the /story-detail related band,
    // the /space signature backdrop, and the /story landing page — see
    // `CREAM_PAPER_TILE` in `shared/constants/texture.constant.ts`.
    //
    // Tile lands on exactly 400px, twice the 200px CSS width it's painted
    // at (`CREAM_PAPER_TILE_SIZE.desktop`). The doubling is the whole point
    // — see the `makeTile` doc comment below for why.
    source: path('home/story/background.webp'),
    output: path('home/story/background-tile.webp'),
    crop: 460,
    blend: 60,
  },
  {
    // Mobile crop of the same cream texture. The source is only 430px
    // wide, so it can't take the same 460px crop as the desktop job above —
    // this is sized down to fit, which lands the tile (and its CSS paint
    // size, `CREAM_PAPER_TILE_SIZE.mobile`) smaller too.
    source: path('home/story/background-mb.webp'),
    output: path('home/story/background-mb-tile.webp'),
    crop: 420,
    blend: 60,
  },
];

/**
 * Side length, in source pixels, of the square cropped from the centre of
 * the source before blending. Chosen so the *output* tile (crop minus
 * blend) lands on exactly double the CSS width the tile is painted at.
 *
 * The doubling is the whole point: a background painted at its intrinsic
 * size on a `devicePixelRatio: 2` screen gets stretched 2x to reach the
 * physical pixel grid, which on a fine paper grain reads as a blurry, muddy
 * smear rather than as fibres. At 2x source pixels shown across half that
 * many CSS px, the mapping is exactly 1:1 on a 2x display, and a clean 2:1
 * downscale on a 1x one — and downscaling never looks broken, only
 * upscaling does.
 */
async function makeTile({ source, output, crop, blend, offset }) {
  const meta = await sharp(source).metadata();
  const [cropLeft, cropTop] = offset ?? [
    Math.floor((meta.width - crop) / 2),
    Math.floor((meta.height - crop) / 2),
  ];

  const { data, info } = await sharp(source)
    .removeAlpha()
    .extract({ left: cropLeft, top: cropTop, width: crop, height: crop })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const tileWidth = width - blend;
  const tileHeight = height - blend;
  const at = (x, y, channel) => data[(y * width + x) * channels + channel];

  const tile = Buffer.alloc(tileWidth * tileHeight * 3);

  for (let y = 0; y < tileHeight; y += 1) {
    for (let x = 0; x < tileWidth; x += 1) {
      for (let channel = 0; channel < 3; channel += 1) {
        // Horizontal wrap: inside the left band, fade from the content
        // that sits one tile-width to the right (i.e. what the previous
        // tile's right edge runs into) toward this pixel's own value.
        let value = at(x, y, channel);
        if (x < blend) {
          const t = ease(x / blend);
          value = (1 - t) * at(x + tileWidth, y, channel) + t * value;
        }

        // Vertical wrap, applied to the already-horizontally-wrapped row
        // so the top-left corner stays continuous with all three of its
        // neighbours rather than only the one above it.
        if (y < blend) {
          let above = at(x, y + tileHeight, channel);
          if (x < blend) {
            const tx = ease(x / blend);
            above = (1 - tx) * at(x + tileWidth, y + tileHeight, channel) + tx * above;
          }
          const t = ease(y / blend);
          value = (1 - t) * above + t * value;
        }

        tile[(y * tileWidth + x) * 3 + channel] = Math.round(value);
      }
    }
  }

  await sharp(tile, { raw: { width: tileWidth, height: tileHeight, channels: 3 } })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(output);

  console.log(`${output.split('/').pop()}  ${tileWidth}x${tileHeight}`);
}

for (const job of JOBS) {
  await makeTile(job);
}
