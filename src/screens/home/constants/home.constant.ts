/**
 * Constants for the Home page only.
 * Not imported by any other page — page-scoped content lives here,
 * cross-page content belongs in `@/shared/constants`.
 */

// Hero section
export const heroContent = {
  eyebrow: "Mời các bạn khám phá",
  heading: "Đặc sản Việt",
  subheading: "trên Đế Bánh Pizza Ý",
  cta: "Đặt bàn",
  videoSrc: "/videos/home/hero-banner.mp4",
  mapImage: "/images/home/vn-map.png",
};

// Trust badges (Hero section)
export const trustBadges = [
  {
    id: "tripadvisor-2023",
    image: "/images/home/trip-advisor.png",
    label: "Chứng nhận Dịch vụ Xuất sắc",
    year: "Năm 2023",
  },
  {
    id: "tripadvisor-2024",
    image: "/images/home/trip-advisor.png",
    label: "Chứng nhận Dịch vụ Xuất sắc",
    year: "Năm 2024",
  },
  {
    id: "tripadvisor-2025",
    image: "/images/home/trip-advisor.png",
    label: "Chứng nhận Dịch vụ Xuất sắc",
    year: "Năm 2025",
  },
  {
    id: "restaurant-guru-2025",
    image: "/images/home/guru-recommend.png",
    label: 'Chứng nhận "Recommended"',
    year: "từ Restaurant Guru năm 2025",
  },
];

// Story section ("Chuyện Nhà kể")
export const storyContent = {
  heading: "Chuyện Nhà kể",
  paragraphs: [
    "Tại Nhà, mỗi chiếc pizza là một câu chuyện vùng miền.",
    "Từ nguyên liệu bản địa đến hương vị đặc trưng, Bản Đồ Pizza Đặc Sản Việt là hành trình đưa tinh hoa ẩm thực Việt lên đế bánh pizza chuẩn Ý.",
  ],
  backgroundImage: "/images/home/story/background.webp",
  backgroundImageMobile: "/images/home/story/background-mb.webp",
};

export const storyStates = [
  {
    id: "dsv",
    label: "Đặc sản Việt",
    image: "/images/home/story/story-dsv.webp",
  },
  {
    id: "ht",
    label: "Hành trình",
    image: "/images/home/story/story-ht.webp",
  },
  {
    id: "tt",
    label: "Tinh thần “Home”",
    image: "/images/home/story/story-tt.webp",
  },
] as const;

// Menu section
export const menuContent = {
  heading: "Menu",
  paragraph:
    "Mời bạn đến với hành trình khám phá bản đồ đặc sản Việt cùng Nhà trên đế bánh pizza chuẩn Ý...",
  cta: "Xem thực đơn",
  image: "/images/home/menu/menu.webp",
  backgroundImage: "/images/home/menu/background.webp",
  backgroundImageMobile: "/images/home/menu/background-mb.webp",
};

export const menuCategoryList = [
  { id: "dac-san-viet", label: "Đặc sản Việt", href: "#menu-dac-san-viet" },
  { id: "pizza-classic", label: "Pizza Classic", href: "#menu-pizza-classic" },
  { id: "salad-appertiza", label: "Salad & Appertiza", href: "#menu-salad-appertiza" },
  { id: "pasta", label: "Pasta", href: "#menu-pasta" },
] as const;

// Humans section ("Người Nhà")
export const humansContent = {
  heading: "Người Nhà",
  cta: "Đọc tiếp",
  backgroundImage: "/images/home/humans/background.webp",
  backgroundImageMobile: "/images/home/humans/background-mb.webp",
  images: [
    { id: "human-1", src: "/images/home/humans/human-1.webp", alt: "Nhân viên Nhà mang khay đồ ăn" },
    { id: "human-2", src: "/images/home/humans/human-2.webp", alt: "Không gian nhà hàng The Home Pizza" },
  ],
};

export const humansLinkList = [
  { id: "humans-of-the-home", label: "Humans of The Home", href: "#humans-of-the-home" },
  { id: "career-path", label: "Career Path", href: "#career-path" },
  { id: "nha-tim-nguoi", label: "Nhà Tìm Người", href: "#nha-tim-nguoi" },
] as const;

// Location section
export const locationContent = {
  heading: "Location",
  paragraph:
    "Lấy cảm hứng từ bản địa làm cốt lõi, mỗi Nhà sẽ mang một nhịp điệu riêng — để ở bất kỳ đâu, hành trình của Nhà vẫn luôn được kể bằng hương vị và tinh thần của chính vùng đất ấy.",
  backgroundImage: "/images/home/location/background.webp",
  backgroundImageMobile: "/images/home/location/background-mb.webp",
};

export const locationStates = [
  {
    id: "phu-quoc",
    label: "Phú Quốc",
    mobileLabel: ["Phú", "Quốc"],
    image: "/images/home/location/space.webp",
    alt: "Không gian nhà hàng The Home Pizza Phú Quốc",
  },
  {
    id: "nha-trang",
    label: "Nha Trang",
    mobileLabel: ["Nha", "Trang"],
    image: "/images/home/location/space.webp",
    alt: "Không gian nhà hàng The Home Pizza Nha Trang",
  },
] as const;
