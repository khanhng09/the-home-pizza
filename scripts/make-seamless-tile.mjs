/**
 * Turns a photographed texture into a tile that repeats without a seam.
 *
 * Run with `yarn images:tile`. Like `optimize-images.mjs`, the output is
 * committed and this is not a build hook — re-run it only when the source
 * texture changes.
 *
 * Why this exists: `public/images/pattern-bg.webp` is a photograph of dó
 * paper, not a generated tile, so its left edge does not continue into its
 * right edge. Measured on the source, the wrap-around difference is ~10/255
 * per channel against an interior baseline of ~2.4 — four times the local
 * noise, on a base colour of rgb(11, 35, 40). Repeated with
 * `background-repeat`, that lands as a faint grid of vertical and
 * horizontal lines across the page.
 *
 * The fix is the standard offset-and-cross-fade: the output is the source
 * cropped by one blend band, with that band cross-faded against the pixels
 * that sit just past the crop. The result's first column then continues
 * naturally out of its last column, in both axes.
 *
 * Mirroring a quadrant (the other common trick) also removes the seam, but
 * it makes both axes symmetric — on a fibrous paper grain that reads as a
 * damask motif rather than as paper, which is why it isn't used here.
 *
 * The crop is also deliberately much smaller than the 1400px source. A
 * background this size tiled at its full pixel dimensions barely repeats at
 * all — on a 375px phone viewport, less than a third of one tile is ever on
 * screen at once, so instead of reading as a fine repeating paper grain it
 * reads as one large image stretched behind the page. Cropping a smaller
 * square keeps the fibres at their true source resolution (no resampling,
 * so no softening) while letting the tile actually repeat — several times
 * across a phone width, more on desktop.
 */
import sharp from 'sharp';

const SOURCE = new URL('../public/images/pattern-bg.webp', import.meta.url).pathname;
const OUTPUT = new URL('../public/images/pattern-bg-tile.webp', import.meta.url).pathname;

/** Side length, in source pixels, of the square cropped from the centre of
 * the source before blending. Chosen so the *output* tile (this minus
 * `BLEND`, see below) lands around 360px — big enough that the paper's
 * fibre strands (40-150px long in the source) still read intact, small
 * enough to repeat 2-3 times across a phone viewport and 4-5 times on
 * desktop rather than reading as a single stretched image. */
const CROP = 480;

/**
 * Width of the cross-faded band, in source pixels. Wide enough that the
 * blend spreads across many fibres (a narrow band leaves a visible soft
 * stripe instead of a hard line); the tile shrinks by exactly this much
 * on each axis, so it is also the whole cost of the technique.
 */
const BLEND = 120;

/** The grain is fine and low-contrast, so it needs a higher quality than
 * the photographs in `optimize-images.mjs` — WebP spends its bit budget on
 * edges, and at 80 it starts flattening the fibres into patches. */
const QUALITY = 86;

/** Smoothstep. A linear ramp leaves a visible crease where the blend
 * weight starts and stops changing; easing both ends hides it. */
const ease = (t) => t * t * (3 - 2 * t);

const full = sharp(SOURCE).removeAlpha();
const fullMeta = await full.metadata();
const cropLeft = Math.floor((fullMeta.width - CROP) / 2);
const cropTop = Math.floor((fullMeta.height - CROP) / 2);

const { data, info } = await sharp(SOURCE)
  .removeAlpha()
  .extract({ left: cropLeft, top: cropTop, width: CROP, height: CROP })
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

const tileWidth = width - BLEND;
const tileHeight = height - BLEND;
const at = (x, y, channel) => data[(y * width + x) * channels + channel];

const tile = Buffer.alloc(tileWidth * tileHeight * 3);

for (let y = 0; y < tileHeight; y += 1) {
  for (let x = 0; x < tileWidth; x += 1) {
    for (let channel = 0; channel < 3; channel += 1) {
      // Horizontal wrap: inside the left band, fade from the content that
      // sits one tile-width to the right (i.e. what the previous tile's
      // right edge runs into) toward this pixel's own value.
      let value = at(x, y, channel);
      if (x < BLEND) {
        const t = ease(x / BLEND);
        value = (1 - t) * at(x + tileWidth, y, channel) + t * value;
      }

      // Vertical wrap, applied to the already-horizontally-wrapped row so
      // the top-left corner stays continuous with all three of its
      // neighbours rather than only the one above it.
      if (y < BLEND) {
        let above = at(x, y + tileHeight, channel);
        if (x < BLEND) {
          const tx = ease(x / BLEND);
          above = (1 - tx) * at(x + tileWidth, y + tileHeight, channel) + tx * above;
        }
        const t = ease(y / BLEND);
        value = (1 - t) * above + t * value;
      }

      tile[(y * tileWidth + x) * 3 + channel] = Math.round(value);
    }
  }
}

await sharp(tile, { raw: { width: tileWidth, height: tileHeight, channels: 3 } })
  .webp({ quality: QUALITY, effort: 6 })
  .toFile(OUTPUT);

console.log(`pattern-bg-tile.webp  ${tileWidth}x${tileHeight}`);
