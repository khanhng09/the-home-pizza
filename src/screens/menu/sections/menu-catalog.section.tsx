import { MenuCategoryAccordion } from '../components/menu-category-accordion';

export function MenuCatalogSection() {
  return (
    <section aria-labelledby="menu-catalog-heading" className="bg-cream">
      <h2 id="menu-catalog-heading" className="sr-only">
        Thực đơn theo danh mục
      </h2>
      <MenuCategoryAccordion />
    </section>
  );
}
