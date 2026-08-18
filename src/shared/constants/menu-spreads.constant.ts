/**
 * The typeset menu pages, one set per category.
 *
 * Shared because both screens turn the same pages: the home page's menu
 * showcase pages through a category beside its copy, and /menu opens the
 * same set inside that category's accordion panel. Keeping one source is
 * what makes "the artwork on /menu matches the one on the home page" a
 * property of the data rather than something to keep in sync by hand.
 *
 * Keys name the *artwork set*, not a screen's category id — the home page
 * calls its salad category `salad-appertiza` while /menu calls it `salad`,
 * and both point here.
 *
 * `dac-san-viet` is ordered north → south, following the regional
 * narrative the section is about; the others follow their file numbering.
 */

export interface MenuSpread {
  src: string;
  width: number;
  height: number;
}

export const menuSpreads = {
  "dac-san-viet": [
    { src: "/images/home/menu/dsv/bac.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/dsv/bac-1.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/dsv/TRUNG.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/dsv/TRUNG1.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/dsv/TRUNG2.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/dsv/TRUNG3.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/dsv/nam.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/dsv/nam-1.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/dsv/nam-2.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/dsv/nam-3.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/dsv/PQ.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/dsv/PQ1.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/dsv/PQ2.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/dsv/PQ4.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/dsv/menu-moi-03.webp", width: 582, height: 842 },
    { src: "/images/home/menu/dsv/menu-moi-05.webp", width: 582, height: 842 },
  ],
  "pizza-classic": [
    { src: "/images/home/menu/pizza/pizza-32.webp", width: 595, height: 842 },
    { src: "/images/home/menu/pizza/pizza-33.webp", width: 595, height: 842 },
    { src: "/images/home/menu/pizza/pizza-34.webp", width: 595, height: 842 },
    { src: "/images/home/menu/pizza/pizza-35.webp", width: 595, height: 842 },
    { src: "/images/home/menu/pizza/pizza-36.webp", width: 595, height: 842 },
    { src: "/images/home/menu/pizza/pizza-37.webp", width: 595, height: 842 },
  ],
  salad: [
    { src: "/images/home/menu/salad/salad-02.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/salad/salad-03.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/salad/salad-04.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/salad/salad-06.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/salad/salad-07.webp", width: 1241, height: 1754 },
  ],
  pasta: [
    { src: "/images/home/menu/pasta/pasta-bac.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/pasta/pasta-bac-2.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/pasta/pasta-PQ.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/pasta/salad-11.webp", width: 1241, height: 1754 },
    { src: "/images/home/menu/pasta/salad-14.webp", width: 1241, height: 1754 },
  ],

  // These two are only on /menu, and no home-style folder has been shot for
  // them yet — they still use the two-page artwork /menu shipped with. Drop
  // a `mon-chinh` / `trang-mieng` folder under public/images/home/menu/ and
  // list it here, and both screens pick it up.
  "mon-chinh": [
    { src: "/images/menu/mc-1.webp", width: 777, height: 1100 },
    { src: "/images/menu/mc-2.webp", width: 777, height: 1100 },
  ],
  "trang-mieng": [
    { src: "/images/menu/tm-1.webp", width: 777, height: 1100 },
    { src: "/images/menu/tm-2.webp", width: 777, height: 1100 },
  ],
} as const satisfies Record<string, readonly MenuSpread[]>;
