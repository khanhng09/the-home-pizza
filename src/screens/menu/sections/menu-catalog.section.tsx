import { getTranslations } from 'next-intl/server';
import { MenuCategoryAccordion } from '../components/menu-category-accordion';

export async function MenuCatalogSection() {
  const t = await getTranslations('menuPage');

  return (
    // Deliberately *not* `.section-screen`. The one-screen unit on this
    // page is a single open category, not the whole catalog: each
    // accordion item is sized so that its trigger plus its artwork fill
    // exactly one screenful under the header (see `--menu-panel-height`),
    // and the section is simply as tall as its six triggers plus whichever
    // panel is open. Capping the section instead would divide one screen
    // between six triggers and the artwork, which left the menu pages
    // ~200px wide on a laptop.
    <section aria-labelledby="menu-catalog-heading" className="section-anchor bg-cream">
      <h2 id="menu-catalog-heading" className="sr-only">
        {t('catalogHeading')}
      </h2>
      <MenuCategoryAccordion />
    </section>
  );
}
