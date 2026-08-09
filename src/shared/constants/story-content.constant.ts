/**
 * The /story content set, in the shape a CMS would hand back.
 *
 * This is the stand-in for the real source — see `shared/lib/story-content.ts`
 * for the accessors that read it and for what changes when Sanity replaces
 * it. Nothing outside that module should import this file.
 *
 * Article copy lives here rather than in `messages/*.json` on purpose.
 * `messages` is for page chrome — labels a translator owns and a developer
 * ships ("QUAY LẠI", "Bình luận"). Article bodies are editorial content an
 * editor owns and publishes without a deploy, which is exactly the split a
 * CMS draws. Keeping them in `messages` now would mean moving every string
 * again the day the CMS lands.
 */
import type { StoryBlock, StoryImageAsset } from '@/shared/types/story-content.type';

export type StoryLocale = 'vi' | 'en';

/** Per-locale values for one field. Mirrors Sanity's field-level i18n; if
 * the article set later grows enough that whole documents diverge per
 * language, this becomes one document per locale instead and only
 * `shared/lib/story-content.ts` notices. */
type Localized<T> = Record<StoryLocale, T>;

/** Photo assets, with the intrinsic size each `<img>` needs to reserve its
 * box. Sizes are the real files' — the layout crops them to the design's
 * aspect ratios with `object-cover`, which is also how CMS images of
 * unpredictable shape have to be handled. */
const PHOTO = {
  chefOven: { src: '/images/story/story-1.webp', width: 795, height: 1062 },
  exterior: { src: '/images/story/story-2.webp', width: 780, height: 588 },
  kitchenStaff: { src: '/images/story/story-3.webp', width: 786, height: 591 },
  plateDetail: { src: '/images/story/story-4.webp', width: 378, height: 378 },
  dishDetail: { src: '/images/story/story-5.webp', width: 378, height: 378 },
  diningRoom: { src: '/images/story/story-6.webp', width: 780, height: 1038 },
} as const;

interface StoryArticleContent {
  excerpt: string;
  body: StoryBlock[];
}

interface StoryEntry {
  _id: string;
  slug: string;
  /** ISO 8601 with an explicit offset. Formatting is pinned to
   * Asia/Ho_Chi_Minh at render so the printed date never depends on where
   * the page happened to be built. */
  publishedAt: string;
  image: Omit<StoryImageAsset, 'alt'> & { alt: Localized<string> };
  title: Localized<string>;
  /** Absent while the entry is a teaser with no body written yet. Its card
   * still renders; it just isn't a link, and `/story/<slug>` 404s. */
  article?: {
    readingMinutes: number;
    author: { name: string };
    content: Localized<StoryArticleContent>;
  };
}

export const storyEntries: StoryEntry[] = [
  {
    _id: 'story-am-thuc-viet',
    slug: 'the-home-pizza-dua-am-thuc-viet-len-de-banh-pizza',
    publishedAt: '2024-02-23T10:30:00+07:00',
    image: {
      ...PHOTO.chefOven,
      alt: {
        vi: 'Anh Chủ kiêm Bếp trưởng của Nhà bên lò nướng pizza',
        en: "The Home's Chef Owner working at the pizza oven",
      },
    },
    title: {
      vi: 'The Home Pizza đưa ẩm thực Việt lên đế bánh pizza',
      en: 'The Home Pizza brings Vietnamese cuisine onto a pizza base',
    },
    article: {
      readingMinutes: 5,
      author: { name: 'The Home Pizza' },
      content: {
        vi: {
          excerpt:
            'The Home Pizza phục vụ Pizza đặc sản Việt, kết hợp với các hoạt động nghệ thuật trình diễn truyền thống trong không gian nhà hàng, tạo nên trải nghiệm đa giác quan cho thực khách.',
          body: [
            {
              _type: 'paragraph',
              _key: 'p1',
              spans: [
                'Lớn lên trong một gia đình coi bữa cơm là nơi gắn kết, đầu bếp kiêm nhà sáng lập The Home Pizza mang theo ký ức về những món ăn bình dị, những đặc sản vùng miền và niềm tin rằng đằng sau mỗi hương vị đều là một câu chuyện về con người, vùng đất và văn hóa. Những ký ức ấy đã định hình con đường của nhà hàng.',
              ],
            },
            {
              _type: 'image',
              _key: 'img-cover',
              image: {
                ...PHOTO.chefOven,
                alt: 'Chiếc pizza đặc sản Việt được đặt trong rổ tre trên bàn gỗ',
              },
              caption:
                'Chiếc bánh pizza mang theo hương vị và câu chuyện văn hóa Việt. Ảnh: The Home Pizza',
            },
            {
              _type: 'paragraph',
              _key: 'p2',
              spans: [
                '“Người Italy tự hào vì đã tạo ra pizza. Người Mỹ biến pizza thành một biểu tượng văn hóa đại chúng. Nhật Bản và Hàn Quốc cũng phát triển những phiên bản mang đậm dấu ấn văn hóa địa phương. Điều đó khiến tôi tự hỏi: Việt Nam, với kho tàng đặc sản và văn hóa ẩm thực phong phú, tại sao lại chưa có một chiếc pizza mang đậm bản sắc riêng?”, vị đầu bếp cho hay.',
              ],
            },
            {
              _type: 'paragraph',
              _key: 'p3',
              spans: [
                'Từ câu hỏi đó, The Home Pizza ra đời với định hướng không đơn thuần phục vụ pizza, mà dùng chiếc đế bánh như một phương tiện để đưa đặc sản, ký ức và văn hóa Việt Nam đến gần hơn với thực khách.',
              ],
            },
            {
              _type: 'paragraph',
              _key: 'p4',
              spans: [
                'Là chef-owner, nhà sáng lập trực tiếp tham gia vào quá trình nghiên cứu và phát triển từng món ăn. Với anh, một chiếc pizza mới không bắt đầu từ nguyên liệu, mà bắt đầu từ một vùng đất.',
              ],
            },
            {
              _type: 'image',
              _key: 'img-interior',
              image: { ...PHOTO.exterior, alt: 'Khu bếp mở và không gian dùng bữa của nhà hàng' },
              caption: 'Không gian nhà hàng. Ảnh: The Home Pizza',
            },
            {
              _type: 'paragraph',
              _key: 'p5',
              spans: [
                'Pizza gỏi cá trích Phú Quốc, lấy cảm hứng từ món gỏi trứ danh của đảo ngọc. Từ vị ngọt của cá trích tươi, hương thơm của dừa nạo đến chén nước mắm Phú Quốc, mỗi nguyên liệu đều gợi nhắc văn hóa biển và nhịp sống của người dân địa phương, được kể lại trên đế bánh pizza bằng một ngôn ngữ ẩm thực mới.',
              ],
            },
            {
              _type: 'paragraph',
              _key: 'p6',
              spans: [
                'Hay Pizza vịt H’Mông, lấy cảm hứng từ món gỏi vịt H’Mông của vùng núi Tây Bắc. Từ hương thơm của các loại thảo mộc bản địa, vị bùi của thính gạo rang đến cách kết hợp nguyên liệu, nhà hàng chuyển tải tinh thần của món ăn để kể câu chuyện về văn hóa ẩm thực vùng cao trên một chiếc pizza.',
              ],
            },
            {
              _type: 'image',
              _key: 'img-culture',
              image: {
                ...PHOTO.diningRoom,
                alt: 'Nghệ sĩ biểu diễn nghệ thuật truyền thống trong không gian nhà hàng',
              },
              caption: 'Hoạt động trải nghiệm văn hóa tại nhà hàng. Ảnh: The Home Pizza',
            },
          ],
        },
        en: {
          excerpt:
            'The Home Pizza serves Vietnamese specialty pizza alongside traditional performing arts in the dining room, building a multi-sensory experience for its guests.',
          body: [
            {
              _type: 'paragraph',
              _key: 'p1',
              spans: [
                'Raised in a family where the shared meal was what held everyone together, the chef and founder of The Home Pizza carried with him memories of simple dishes, of regional specialties, and a belief that behind every flavour sits a story about people, land and culture. Those memories shaped the restaurant’s path.',
              ],
            },
            {
              _type: 'image',
              _key: 'img-cover',
              image: {
                ...PHOTO.chefOven,
                alt: 'A Vietnamese specialty pizza served in a bamboo basket on a wooden table',
              },
              caption:
                'A pizza that carries the flavours and the cultural story of Vietnam. Photo: The Home Pizza',
            },
            {
              _type: 'paragraph',
              _key: 'p2',
              spans: [
                '“Italians take pride in having created pizza. Americans turned it into a pop-culture icon. Japan and Korea developed versions marked by their own local cultures. That made me ask: Vietnam, with such a wealth of specialties and culinary culture, why does it not yet have a pizza of its own?” the chef says.',
              ],
            },
            {
              _type: 'paragraph',
              _key: 'p3',
              spans: [
                'Out of that question, The Home Pizza was born — not simply to serve pizza, but to use the base as a vehicle for bringing Vietnam’s specialties, memories and culture closer to its guests.',
              ],
            },
            {
              _type: 'paragraph',
              _key: 'p4',
              spans: [
                'As chef-owner, the founder takes part directly in researching and developing every dish. For him, a new pizza does not begin with an ingredient; it begins with a place.',
              ],
            },
            {
              _type: 'image',
              _key: 'img-interior',
              image: {
                ...PHOTO.exterior,
                alt: 'The open kitchen and dining room of the restaurant',
              },
              caption: 'The restaurant’s dining room. Photo: The Home Pizza',
            },
            {
              _type: 'paragraph',
              _key: 'p5',
              spans: [
                'Phu Quoc Herring Salad Pizza draws on the island’s most celebrated dish. From the sweetness of fresh herring and the fragrance of grated coconut to a bowl of Phu Quoc fish sauce, every ingredient recalls the island’s coastal culture and the rhythm of local life — retold on a pizza base in a new culinary language.',
              ],
            },
            {
              _type: 'paragraph',
              _key: 'p6',
              spans: [
                'Or H’Mong Duck Pizza, inspired by the H’Mong duck salad of the northwestern highlands. From the aroma of native herbs and the nuttiness of roasted rice powder to the way the ingredients are brought together, the restaurant carries the spirit of the dish across to tell a story of highland food culture on a single pizza.',
              ],
            },
            {
              _type: 'image',
              _key: 'img-culture',
              image: {
                ...PHOTO.diningRoom,
                alt: 'Performers presenting traditional arts inside the restaurant',
              },
              caption: 'A cultural experience hosted at the restaurant. Photo: The Home Pizza',
            },
          ],
        },
      },
    },
  },

  // The rest of the feed: teasers the /story list already showed. They have
  // no body yet, so their cards render unlinked until one is written — which
  // is what an unpublished document looks like coming out of a CMS too.
  {
    _id: 'story-ngay-le',
    slug: 'may-ngay-le-o-nha',
    publishedAt: '2023-03-06T10:59:00+07:00',
    image: {
      ...PHOTO.chefOven,
      alt: {
        vi: 'Anh Chủ kiêm Bếp trưởng của Nhà bên lò nướng pizza',
        en: "The Home's Chef Owner working at the pizza oven",
      },
    },
    title: {
      vi: 'Mấy ngày lễ ở Nhà, thấy mọi người quây quần, Nhà cũng vui lây.',
      en: 'On holidays at The Home, seeing everyone gather together, The Home feels joyful too.',
    },
  },
  {
    _id: 'story-thuc-don',
    slug: 'khong-nam-tren-cuon-thuc-don',
    publishedAt: '2023-03-06T10:59:00+07:00',
    image: {
      ...PHOTO.kitchenStaff,
      alt: {
        vi: 'Đội ngũ của Nhà chuẩn bị pizza tại bếp mở',
        en: "The Home's team preparing pizza in the open kitchen",
      },
    },
    title: {
      vi: 'Ở Nhà, có những điều không nằm trên cuốn thực đơn, nhưng hiện diện trong mọi bữa ăn.',
      en: "At The Home, some things aren't on the menu, yet they're present in every meal.",
    },
  },
  {
    _id: 'story-my-ghe',
    slug: 'my-ghe-ham-ninh',
    publishedAt: '2023-03-06T10:59:00+07:00',
    image: {
      ...PHOTO.dishDetail,
      alt: {
        vi: 'Một món đặc sản Việt được phục vụ tại Nhà',
        en: 'A Vietnamese specialty dish served at The Home',
      },
    },
    title: {
      vi: 'Người Nhà vẫn hay nói với nhau rằng, Mỳ Ghẹ Hàm Ninh là món góp phần làm nên tên tuổi Nhà.',
      en: "People at The Home often say Ham Ninh Crab Noodles is one of the dishes that helped make The Home's name.",
    },
  },
  {
    _id: 'story-kem-nuoc-mam',
    slug: 'kem-nuoc-mam-phu-quoc',
    publishedAt: '2023-03-06T10:59:00+07:00',
    image: {
      ...PHOTO.plateDetail,
      alt: {
        vi: 'Một góc bàn ăn được bày biện tại The Home Pizza',
        en: 'A table setting at The Home Pizza',
      },
    },
    title: {
      vi: 'Bạn đã thử KEM NƯỚC MẮM PHÚ QUỐC của Nhà chưa?',
      en: "Have you tried The Home's PHU QUOC FISH SAUCE ICE CREAM yet?",
    },
  },
  {
    _id: 'story-chieu-xuong',
    slug: 'chieu-xuong-o-nha',
    publishedAt: '2023-03-06T10:59:00+07:00',
    image: {
      ...PHOTO.exterior,
      alt: {
        vi: 'Lối vào và khu bàn ngoài trời của nhà hàng The Home Pizza',
        en: "The Home Pizza's restaurant entrance and outdoor tables",
      },
    },
    title: {
      vi: 'Chiều xuống cũng là lúc Nhà đẹp theo cách rất riêng...',
      en: 'As the afternoon fades, The Home takes on a beauty all its own...',
    },
  },
  {
    _id: 'story-mot-o-day-du',
    slug: 'mot-o-day-du',
    publishedAt: '2023-03-06T10:59:00+07:00',
    image: {
      ...PHOTO.diningRoom,
      alt: {
        vi: 'Không gian dùng bữa của The Home Pizza về đêm',
        en: "The Home Pizza's dining room in the evening",
      },
    },
    title: {
      vi: 'Nhà đặt tên “Một Ổ Đầy Đủ” cho chiếc Pizza Đặc Sản Sài Gòn - khi hành trình của Nhà chạm đến nơi này, mang theo một ký ức rất quen, rất thương.',
      en: 'The Home named its Saigon Specialty Pizza “Một Ổ Đầy Đủ” — when our journey reached this city, it carried a memory both familiar and dear.',
    },
  },
];
