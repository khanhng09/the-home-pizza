import { getTranslations } from 'next-intl/server';
import { MenuCategoryAccordion } from '../components/menu-category-accordion';

export async function MenuCatalogSection() {
  const t = await getTranslations('menuPage');

  return (
    <section aria-labelledby="menu-catalog-heading" className="bg-cream">
      <h2 id="menu-catalog-heading" className="sr-only">
        {t('catalogHeading')}
      </h2>
      <MenuCategoryAccordion />
    </section>
  );
}
