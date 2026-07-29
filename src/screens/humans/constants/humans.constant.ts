/**
 * Content for the /humans screen only.
 * Not imported by any other screen — page-scoped content lives here.
 */

import { businessInfo } from '@/shared/constants/site.constant';

// Hero section
export const humansHeroContent = {
  heading: "Người nhà",
  videoSrc: "/videos/humans/hero.mp4",
};

// Hero link list — anchors within this page except the first, which is the
// page itself. "Career Path" has no dedicated section yet, so it stays a
// placeholder anchor until that content ships.
export const humansHeroLinkList = [
  { id: "humans-of-the-home", label: "Humans of the Home", href: "#humans-of-the-home" },
  { id: "career-path", label: "Career Path", href: "#career-path" },
  { id: "nha-tim-nguoi", label: "Nhà Tìm Người", href: "#nha-tim-nguoi" },
] as const;

// Intro section — quote over a monstera texture panel
export const humansIntroContent = {
  backgroundImage: "/images/humans/bg-1.webp",
  backgroundImageMobile: "/images/humans/bg-1-mb.webp",
  paragraph:
    "Mỗi chiếc pizza mang hương vị và dấu ấn của đội ngũ người Nhà nhiệt huyết, như chiếc cầu nối đưa bạn đến gần hơn với hành trình pizza đặc sản Việt. Nhà rất vui khi có bạn ghé qua, cùng thưởng thức pizza, chia sẻ câu chuyện của mình, biết đâu câu chuyện của bạn sẽ truyền cảm hứng để các đầu bếp Nhà sáng tạo nên những hương vị mới, ghi dấu thêm cột mốc trên Bản Đồ Pizza Đặc Sản Việt.",
  quoteLines: [
    "Nếu bạn yêu mến các giá trị của Nhà,",
    `hãy cùng nhau làm "người một Nhà" nhé!`,
  ],
};

// Chef Nhà story — dark navy / gold split background
export const humansChefStoryContent = {
  heading: "Câu chuyện Chef Nhà",
  backgroundImage: "/images/humans/bg-2.webp",
  backgroundImageMobile: "/images/humans/bg-2-mb.webp",
  image: {
    src: "/images/humans/chef.webp",
    mobileSrc: "/images/humans/chef-mb.webp",
    alt: "Chef Owner của Nhà nhào bột bánh pizza",
  },
  paragraphs: [
    "Với nhiều năm gắn bó trong thế giới ẩm thực Ý và Âu, Chef Owner của Nhà đã dành nhiều năm trải nghiệm hàng trăm hương vị pizza trên khắp thế giới. Mỗi quốc gia mang đến một cách kể riêng cho chiếc bánh quen thuộc ấy. Nhưng giữa hành trình đó, anh luôn trăn trở: Vì sao Việt Nam dù sở hữu kho tàng ẩm thực phong phú từ Bắc vào Nam, nhưng lại chưa có một chiếc pizza mang đậm hồn Việt.",
    "Từ câu hỏi ấy, giấc mơ về Pizza Đặc Sản Việt bắt đầu. Một chiếc pizza kết hợp tinh hoa phương Tây với nguyên liệu quê hương: từ thịt vịt H'mông đậm đà, tôm Rạch Vẹm ngọt thanh, đến những loại rau thơm đặc trưng của mảnh đất hình chữ S. Giấc mơ ấy được nuôi dưỡng trong căn bếp của Nhà, nơi Chef Owner và những người đầu bếp đồng hành cùng nhau, chia sẻ tình yêu với hương vị Việt và sự trân trọng dành cho từng nguyên liệu.",
    "Tại Nhà, mỗi chiếc pizza ra lò không chỉ là một món ăn, mà là cách Nhà kể câu chuyện hương vị Việt theo một ngôn ngữ mới.",
  ],
};

// Người Nhà story — mirrored linen / gold split background
export const humansPeopleStoryContent = {
  heading: "Câu chuyện Người Nhà",
  image: {
    src: "/images/humans/homer.webp",
    mobileSrc: "/images/humans/homer-mb.webp",
    alt: "Người Nhà phục vụ khách tại nhà hàng",
  },
  paragraphs: [
    "Nhà tin rằng sự kết nối chân thành bắt đầu từ những điều nhỏ bé: từ một lời chào, một sự để ý tinh tế, hay cảm giác được chăm sóc tận tâm. Người Nhà mang theo sự tử tế vào từng khoảnh khắc nhỏ, để mỗi lần ghé Nhà, bạn không chỉ tìm một bữa ăn, mà là trở về một chốn thân thuộc.",
    "Tinh thần sáng tạo của Nhà không chỉ nằm trong căn bếp, mà còn hiện diện trong cách phục vụ. Từ cảm hứng ẩm thực Việt trải dài khắp Bắc - Trung - Nam - Phú Quốc, Người Nhà luôn sẵn sàng kể cho bạn nghe câu chuyện đằng sau từng món ăn, từng nguyên liệu để bạn cảm thấy gần gũi hơn với hương vị Việt trên đế bánh pizza Ý truyền thống.",
    "Ở Nhà, mọi thứ được chăm chút vừa đủ để bạn có thể thoải mái ngồi xuống, thưởng thức bữa ăn, và trò chuyện tự nhiên như ở nhà.",
  ],
};

// Values section — monstera texture panel, distinct from the intro's
export const humansValuesContent = {
  backgroundImage: "/images/humans/bg-3.webp",
  backgroundImageMobile: "/images/humans/bg-3-mb.webp",
};

// Values section — column order/pairing follows the Figma source exactly
export const humansValuesList = [
  {
    id: "ket-noi",
    label: "Kết nối",
    paragraph:
      "Dựa trên giá trị tinh hoa ẩm thực Việt trải dài từ Bắc vào Nam và cảm hứng từ nghệ thuật làm pizza Ý truyền thống, Nhà không ngừng tìm tòi và đổi mới trong từng công thức để mỗi chiếc pizza là sự hòa quyện tinh tế giữa đặc sản Việt Nam và nền tảng pizza cổ điển, mang đến một trải nghiệm vị giác độc đáo, đậm đà bản sắc và đầy tự hào.",
  },
  {
    id: "sang-tao",
    label: "Sáng tạo",
    paragraph:
      "Nhà mong muốn xây dựng sự kết nối chân thành giữa The Home Pizza và khách hàng, dựa trên giá trị tử tế của chính những người Nhà - những cộng sự đồng hành. Từ đó lan toả tinh thần/giá trị Home đến từng nhân sự, để mỗi khách hàng đều có thể cảm nhận được.",
  },
  {
    id: "tan-tam",
    label: "Tận tâm",
    paragraph:
      "Đặt khách hàng ở vị trí trung tâm, chúng tôi không ngừng nỗ lực mang đến những trải nghiệm “Nhà” trọn vẹn nhất - từ món ăn đến dịch vụ.",
  },
] as const;

// CTA section — full-bleed photo, closes the page with the recruiting pitch.
// The button applies via email since no dedicated careers page exists yet.
export const humansCtaContent = {
  image: {
    src: "/images/humans/be-homer.webp",
    mobileSrc: "/images/humans/be-homer-mb.webp",
    alt: "Không gian và đội ngũ The Home Pizza",
  },
  heading: `Cùng trở thành "người một Nhà" nhé!`,
  cta: "Nhà tìm người Nhà",
  ctaHref: `mailto:${businessInfo.email}`,
};
