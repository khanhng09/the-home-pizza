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
