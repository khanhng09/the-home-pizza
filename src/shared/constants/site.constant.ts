/**
 * Site-wide constants for The Home Pizza
 * Business info, navigation, social links — shared across every page
 */

export const SITE_NAME = "The Home Pizza";
export const SITE_DOMAIN = "thehomepizza.com";
export const SITE_URL = `https://${SITE_DOMAIN}`;

// Business Information. `tagline`/`description` stay Vietnamese-only — they're
// used solely by the (currently unused) JSON-LD schema helpers in
// `shared/lib/metadata.ts`, not rendered in the localized UI.
// `locations[].address` is the same: metadata.ts parses it for JSON-LD, while
// the footer renders the translated copy from `footer.locations.<id>` in
// messages/*.json. Keep the two in sync when an address changes.
export const businessInfo = {
  name: "The Home Pizza",
  tagline: "Đặc sản Việt trên đế bánh Pizza Ý",
  description:
    "Tại Nhà, mỗi chiếc pizza là một câu chuyện vùng miền. Từ nguyên liệu bản địa đến hương vị đặc trưng, Bản Đồ Pizza Đặc Sản Việt là hành trình đưa tinh hoa ẩm thực Việt lên đế bánh pizza chuẩn Ý.",
  email: "thehomepizzapq@gmail.com",
  phone: "+84 988 37 37 93",
  locations: [
    {
      id: "phu-quoc",
      name: "Phú Quốc",
      address: "129 Trần Hưng Đạo, Dương Đông, Phú Quốc",
    },
    {
      id: "nha-trang",
      name: "Nha Trang",
      address: "12 - 14 Trần Phú, Tân Thành, Nha Trang",
    },
  ],
};

// Navigation. Labels are translated (see `header.nav` / `footer.nav` in
// messages/*.json) and looked up by `id` — this only holds hrefs + ids.
export const navigation = {
  main: [
    { id: "story", href: "/story" },
    { id: "menu", href: "/menu" },
    { id: "humans", href: "/humans" },
  ],
  footer: [
    { id: "humans", href: "/humans" },
    { id: "careerPath", href: "/humans#career-path" },
    { id: "nhaTimNguoi", href: "/humans#nha-tim-nguoi" },
  ],
};

// Social Media. `ariaLabel` is translated — see `footer.social` in messages/*.json.
export const socialLinks = [
  {
    id: "facebook",
    href: "https://facebook.com/thehomepizza",
    icon: "IcFacebook",
  },
  {
    id: "instagram",
    href: "https://instagram.com/thehomepizza",
    icon: "IcInstagram",
  },
];

// Menu Categories (placeholder, until the Menu page is built)
export const menuCategories = [
  { id: "pizzas", name: "Pizzas", description: "Our signature handmade pizzas" },
  { id: "appetizers", name: "Appetizers", description: "Perfect starters" },
  { id: "salads", name: "Salads", description: "Fresh seasonal salads" },
  { id: "desserts", name: "Desserts", description: "Sweet endings" },
  { id: "beverages", name: "Beverages", description: "Drinks and wine selection" },
];

// Featured Menu Items (placeholder, until the Menu page is built)
export const featuredMenuItems = [
  {
    id: 1,
    name: "Classic Margherita",
    description: "Fresh mozzarella, basil, tomato sauce, olive oil",
    price: 14.99,
    image: "/images/menu/margherita.jpg",
    category: "pizzas",
    vegetarian: true,
  },
  {
    id: 2,
    name: "Prosciutto & Fig",
    description: "Prosciutto, fig jam, ricotta, arugula",
    price: 16.99,
    image: "/images/menu/prosciutto-fig.jpg",
    category: "pizzas",
    vegetarian: false,
  },
];

// Testimonials (placeholder, until a Testimonials section is built)
export const testimonials = [
  {
    id: 1,
    author: "Sarah Johnson",
    text: "The best pizza in town! The dough is perfection and the atmosphere is so welcoming.",
    rating: 5,
  },
  {
    id: 2,
    author: "Michael Chen",
    text: "Every visit is special. The seasonal toppings keep us coming back.",
    rating: 5,
  },
  {
    id: 3,
    author: "Emma Davis",
    text: "Worth the wait. Authentic flavors and exceptional service.",
    rating: 5,
  },
];

// SEO & Open Graph. `title`/`description` are translated per-locale — see
// `metadata.root` in messages/*.json; this only holds locale-independent values.
export const seoDefaults = {
  keywords: [
    "pizza",
    "handmade pizza",
    "artisan pizza",
    "slow fermented dough",
    "authentic pizza",
    "restaurant",
  ],
  /**
   * The link-preview card every page falls back to, written by
   * `yarn images:og` — see `scripts/make-og-images.mjs` for the source it
   * is cut from and `ogImage()` in `shared/lib/metadata.ts` for how a page
   * asks for its own.
   *
   * This pointed at `/images/og-image.jpg` for a while, which was never
   * committed: every page's `og:image` and `twitter:image` resolved to a
   * 404, so shares rendered as a bare text link everywhere.
   */
  image: "/images/og/default.jpg",
  twitterHandle: "@thehomepizza",
};

// Animations
export const animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  },
};

// Breakpoints
export const breakpoints = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

// Feature flags (for future use)
export const features = {
  reservations: true,
  delivery: false,
  takeout: true,
  loyaltyProgram: false,
  newsSubscription: true,
};
