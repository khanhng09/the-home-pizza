/**
 * Content for the /menu screen only.
 * Not imported by any other screen — page-scoped content lives here.
 */

// Hero section
export const menuHeroContent = {
  greeting: 'Nhà chào bạn,',
  paragraphs: [
    'Mời bạn đến với hành trình khám phá bản đồ đặc sản Việt cùng Nhà trên đế bánh pizza chuẩn Ý, với mỗi miếng pizza mang dấu ấn của hương vị vùng miền Việt Nam nơi địa lý, khí hậu, thổ nhưỡng và văn hóa giao hòa, tạo nên sự đa dạng nguyên liệu và hương vị đặc trưng. Chính từ niềm tin rằng ẩm thực Việt đủ phong phú để bước ra thế giới, Nhà kiên định cùng sứ mệnh vẽ nên Bản Đồ Pizza Đặc Sản Việt.',
    'Đến Nhà, bạn cứ tự nhiên như ở nhà nhé!',
  ],
  backgroundImage: '/images/menu/background.webp',
  mapImage: '/images/menu/map-1.webp',
};

// Region list (right column of the hero). Each region will eventually swap
// the map illustration when selected — only one map asset exists today, so
// every entry points at the same image until region-specific art ships.
export const menuRegionList = [
  { id: 'bac-bo', label: 'Bắc Bộ', mapImage: '/images/menu/map-1.webp' },
  { id: 'trung-bo', label: 'Trung Bộ', mapImage: '/images/menu/map-1.webp' },
  { id: 'nam-bo', label: 'Nam Bộ', mapImage: '/images/menu/map-1.webp' },
  { id: 'phu-quoc', label: 'Phú Quốc', mapImage: '/images/menu/map-1.webp' },
] as const;

// Accordion catalog — one section per menu category. `spreads` holds the
// (already-typeset) menu-page images for that category; categories without
// artwork yet render an empty state instead.
export const menuCatalog = [
  {
    id: 'dac-san-viet',
    label: 'Đặc sản Việt',
    spreads: [
      { src: '/images/menu/dsv-1.webp', alt: 'Thực đơn Đặc sản Việt — Pizza Gỏi Tôm Rạch Vệm', width: 777, height: 1100 },
      { src: '/images/menu/dsv-2.webp', alt: 'Thực đơn Đặc sản Việt — Pizza Sầu Riêng Phú Quốc', width: 777, height: 1100 },
    ],
  },
  {
    id: 'pizza-classic',
    label: 'Pizza Classic',
    spreads: [
      { src: '/images/menu/pizza-1.webp', alt: 'Thực đơn Pizza Classic — trang 1', width: 777, height: 1100 },
      { src: '/images/menu/pizza-2.webp', alt: 'Thực đơn Pizza Classic — trang 2', width: 777, height: 1100 },
    ],
  },
  {
    id: 'salad',
    label: 'Salad',
    spreads: [],
  },
  {
    id: 'mon-chinh',
    label: 'Món Chính',
    spreads: [
      { src: '/images/menu/mc-1.webp', alt: 'Thực đơn Món Chính — Sườn Nướng BBQ', width: 777, height: 1100 },
      { src: '/images/menu/mc-2.webp', alt: 'Thực đơn Món Chính — trang 2', width: 777, height: 1100 },
    ],
  },
  {
    id: 'pasta',
    label: 'Pasta',
    spreads: [
      { src: '/images/menu/pasta-1.webp', alt: 'Thực đơn Pasta — trang 1', width: 777, height: 1100 },
      { src: '/images/menu/pasta-2.webp', alt: 'Thực đơn Pasta — trang 2', width: 777, height: 1100 },
    ],
  },
  {
    id: 'trang-mieng',
    label: 'Tráng Miệng',
    spreads: [
      { src: '/images/menu/tm-1.webp', alt: 'Thực đơn Tráng Miệng — trang 1', width: 777, height: 1100 },
      { src: '/images/menu/tm-2.webp', alt: 'Thực đơn Tráng Miệng — trang 2', width: 777, height: 1100 },
    ],
  },
] as const;
