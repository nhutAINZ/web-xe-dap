import { Product, HeroBanner, StoryChapter, StoreBranch, Article, Voucher, Customer, Order } from '../types';

export const INITIAL_BANNERS: HeroBanner[] = [
  {
    id: 'hero-1',
    title: 'ĐÁNH THỨC BẢN LĨNH CHINH PHỤC',
    subtitle: 'Tuyệt tác xe đạp thể thao & địa hình thế hệ mới — Hội tụ công nghệ khung Carbon siêu nhẹ và bộ truyền động chuẩn xác.',
    badge: 'BỘ SƯU TẬP 2026',
    ctaText: 'Khám Phá Sản Phẩm',
    ctaLink: '#products',
    secondaryCtaText: 'Tư Vấn Chọn Size',
    secondaryCtaLink: '#size-guide',
    mediaType: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cyclist-riding-along-a-mountain-road-41315-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1920&q=85',
    order: 1,
    isActive: true,
  },
  {
    id: 'hero-2',
    title: 'TỐC ĐỘ VÀ SỰ TỰ DO TUYỆT ĐỐI',
    subtitle: 'Dòng xe Road & Touring chuyên nghiệp tối ưu khí động học, đồng hành cùng bạn trên mọi cung đường xuyên Việt.',
    badge: 'ROAD PERFORMANCE',
    ctaText: 'Xem Dòng Xe Đua',
    ctaLink: '#products',
    secondaryCtaText: 'Hệ Thống Showroom',
    secondaryCtaLink: '#branches',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1920&q=85',
    posterUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1920&q=85',
    order: 2,
    isActive: true,
  }
];

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'chap-1',
    chapterNumber: '01',
    title: 'Khởi Nguồn Đam Mê',
    subtitle: 'TRIẾT LÝ THƯƠNG HIỆU',
    tagline: 'Không chỉ là phương tiện di chuyển, đó là phong cách sống phóng khoáng.',
    description: [
      'Demo Xe Đạp ra đời từ tình yêu bất tận với những vòng quay bánh xe và những cung đường rộng mở khắp Việt Nam.',
      'Chúng tôi tin rằng mỗi chiếc xe đạp là sự kết nối hoàn hảo giữa con người, thiên nhiên và khát khao vượt qua giới hạn của chính mình.'
    ],
    keyPoints: [
      { icon: 'Sparkles', title: 'Thiết Kế Tinh Xảo', desc: 'Đường nét khí động học hiện đại, kết hợp thẩm mỹ tối giản sang trọng.' },
      { icon: 'ShieldCheck', title: '100% Chính Hãng', desc: 'Nhập khẩu nguyên chiếc từ các thương hiệu hàng đầu thế giới.' }
    ],
    bgImage: 'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?auto=format&fit=crop&w=1920&q=80',
    accentColor: '#f97316'
  },
  {
    id: 'chap-2',
    chapterNumber: '02',
    title: 'Công Nghệ Chế Tác Đỉnh Cao',
    subtitle: 'VẬT LIỆU & KỸ THUẬT',
    tagline: 'Khung sợi Carbon Torayca T800 & Nhôm Hàng Không 6061 siêu nhẹ.',
    description: [
      'Mỗi khung sườn xe được xử lý qua hàng chục bước kiểm định tải trọng nghiêm ngặt, đảm bảo độ cứng vững khi bứt tốc và sự êm ái khi vượt địa hình gồ ghề.',
      'Kết hợp cùng hệ thống truyền động Shimano Nhật Bản và phanh đĩa dầu thủy lực an toàn tuyệt đối.'
    ],
    keyPoints: [
      { icon: 'Cpu', title: 'Hàn Ẩn Mối Tinh Tế', desc: 'Khung sườn liền lạc không vết hàn, sơn tĩnh điện 4 lớp chống trầy xước.' },
      { icon: 'Zap', title: 'Trọng Lượng Siêu Nhẹ', desc: 'Tối ưu trọng lượng chỉ từ 7.8kg cho dòng Road và 11.5kg cho dòng MTB.' }
    ],
    bgImage: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1920&q=80',
    accentColor: '#38bdf8'
  },
  {
    id: 'chap-3',
    chapterNumber: '03',
    title: 'Quy Trình Lắp Ráp Thủ Công',
    subtitle: 'TẬN TÂM TRONG TỪNG CHI TIẾT',
    tagline: '100% xe được cân chỉnh bởi các kỹ thuật viên trên 10 năm kinh nghiệm.',
    description: [
      'Trước khi bàn giao tới tay khách hàng, từng mắt xích, lực siết ốc cân lực (Torque), độ căng căm xe và căn chỉnh củ đề đều được hoàn thiện tỉ mỉ.',
      'Sẵn sàng lăn bánh ngay khi mở thùng với trải nghiệm mượt mà, êm ái nhất.'
    ],
    keyPoints: [
      { icon: 'Wrench', title: 'Cân Vành Chuẩn Xác', desc: 'Sai số nan hoa dưới 0.2mm, chuyển số mượt mà tức thì.' },
      { icon: 'Award', title: 'Kiểm Định 30 Bước', desc: 'Checklist kiểm tra 30 điểm an toàn trước khi xuất xưởng.' }
    ],
    bgImage: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1920&q=80',
    accentColor: '#10b981'
  },
  {
    id: 'chap-4',
    chapterNumber: '04',
    title: 'Cam Kết Đồng Hành Dài Lâu',
    subtitle: 'DỊCH VỤ HẬU MÃI ĐỈNH CAO',
    tagline: 'Bảo hành khung sườn lên tới 5 năm, miễn phí bảo dưỡng định kỳ trọn đời.',
    description: [
      'Chúng tôi không chỉ bán xe đạp, chúng tôi trao gửi sự an tâm tuyệt đối trên từng chặng hành trình của bạn.',
      'Hệ thống cứu hộ tận nơi, phụ tùng thay thế chính hãng luôn sẵn sàng phục vụ tại chuỗi showroom toàn quốc.'
    ],
    keyPoints: [
      { icon: 'CheckCircle2', title: 'Bảo Dưỡng Trọn Đời', desc: 'Miễn phí cân vành, tra dầu mỡ định kỳ 3 tháng/lần.' },
      { icon: 'Truck', title: 'Giao Hàng Hỏa Tốc', desc: 'Freeship toàn quốc, đóng gói thùng xốp chuyên dụng an toàn.' }
    ],
    bgImage: 'https://images.unsplash.com/photo-1502744688674-c619d3f3b00c?auto=format&fit=crop&w=1920&q=80',
    accentColor: '#ec4899'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. MTB - Địa hình
  {
    id: 'bike-mtb-01',
    name: 'Xe Đạp Địa Hình Giant ATX 830 D',
    slug: 'giant-atx-830-d',
    category: 'mtb',
    categoryName: 'Xe đạp Địa hình',
    brand: 'Giant',
    originalPrice: 13500000,
    salePrice: 11990000,
    discountPercent: 11,
    rating: 4.9,
    reviewCount: 38,
    isFlashSale: true,
    isHot: true,
    isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDesc: 'Khung nhôm Aluxx siêu nhẹ, phuộc dầu êm ái có khóa hành trình, bộ truyền động Shimano 27 tốc độ.',
    description: 'Giant ATX 830 D là mẫu xe địa hình huyền thoại chinh phục cả những tay lái khó tính nhất. Khung sườn Aluxx-Grade Aluminum cứng vững, dây đi âm sườn tinh tế. Phanh đĩa dầu thủy lực Tektro an toàn trên mọi điều kiện thời tiết.',
    variants: [
      { id: 'v1', colorName: 'Đen Cam Titan', colorHex: '#ea580c', sizes: ['S (1m55-1m68)', 'M (1m68-1m78)', 'L (1m78-1m88)'], image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=800&q=80', stock: 15 },
      { id: 'v2', colorName: 'Xanh Quân Đội', colorHex: '#15803d', sizes: ['S (1m55-1m68)', 'M (1m68-1m78)'], image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80', stock: 8 }
    ],
    specs: {
      frameMaterial: 'Hợp kim nhôm Aluxx Giant 6061',
      fork: 'Phuộc dầu Giant HLO có khóa hành trình',
      groupset: 'Shimano Altus 3x9 tốc độ (27 Speed)',
      brakes: 'Phanh đĩa dầu thủy lực Tektro HD-M275',
      wheels: 'Vành nhôm 2 lớp Giant 27.5 inch',
      tires: 'Giant Quickcross 27.5x1.95 chống đinh',
      weight: '13.2 kg',
      origin: 'Đài Loan (Chính Hãng Giant)',
      warranty: 'Khung 5 năm, Bộ truyền động 1 năm'
    },
    stock: 23,
    soldCount: 142,
    suitableHeightMin: 155,
    suitableHeightMax: 188,
    suitableAge: 'Người lớn & Thanh thiếu niên',
    targetGender: 'all',
    reviews: [
      { id: 'r1', author: 'Nguyễn Văn Hùng', rating: 5, date: '18/08/2026', comment: 'Xe chạy rất đầm và êm, đạp leo dốc nhẹ nhàng, đóng gói cẩn thận!', verifiedPurchase: true },
      { id: 'r2', author: 'Trần Thanh Nam', rating: 5, date: '12/08/2026', comment: 'Giao hàng hỏa tốc trong ngày tại TP.HCM, nhân viên căn chỉnh chuẩn chỉ.', verifiedPurchase: true }
    ]
  },
  {
    id: 'bike-mtb-02',
    name: 'Xe Đạp Địa Hình Twitter Leopard Pro Carbon',
    slug: 'twitter-leopard-pro-carbon',
    category: 'mtb',
    categoryName: 'Xe đạp Địa hình',
    brand: 'Twitter',
    originalPrice: 19500000,
    salePrice: 16800000,
    discountPercent: 14,
    rating: 4.8,
    reviewCount: 29,
    isFlashSale: false,
    isHot: true,
    isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDesc: 'Khung Carbon Nano T800 siêu nhẹ, phuộc hơi Twitter khóa remote, bộ group Shimano Deore M6100 1x12 tốc độ.',
    description: 'Twitter Leopard Pro sở hữu khung sợi carbon T800 đúc nguyên khối với trọng lượng chỉ 11.2kg. Bộ truyền động 12 tầng líp giúp bứt tốc vượt bậc trên các cung đường đồi núi khắc nghiệt.',
    variants: [
      { id: 'v3', colorName: 'Đỏ Đen Carbon', colorHex: '#b91c1c', sizes: ['S (1m58-1m70)', 'M (1m70-1m82)'], image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80', stock: 10 },
      { id: 'v4', colorName: 'Xám Xi Măng Đổi Màu', colorHex: '#475569', sizes: ['M (1m70-1m82)'], image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80', stock: 6 }
    ],
    specs: {
      frameMaterial: 'Carbon Nano T800 cao cấp EPS',
      fork: 'Phuộc hơi Twitter Air Lockout điều khiển trên ghi-đông',
      groupset: 'Shimano Deore M6100 1x12 tốc độ',
      brakes: 'Phanh đĩa dầu thủy lực Shimano MT200',
      wheels: 'Vành nhôm Twitter đùm bạc đạn cối nổ to',
      tires: 'Innova-Pro Cross Fit 29x2.1 inch',
      weight: '11.2 kg',
      origin: 'Đức / Trung Quốc',
      warranty: 'Khung 5 năm, Phụ tùng 1 năm'
    },
    stock: 16,
    soldCount: 94,
    suitableHeightMin: 158,
    suitableHeightMax: 185,
    suitableAge: 'Người lớn',
    targetGender: 'all',
    reviews: [
      { id: 'r3', author: 'Lê Hoàng Dũng', rating: 5, date: '10/08/2026', comment: 'Khung carbon nhẹ tênh, cối nổ đanh giòn, phuộc hơi nhún bao phê!', verifiedPurchase: true }
    ]
  },

  // 2. Road - Xe đạp Đua
  {
    id: 'bike-road-01',
    name: 'Xe Đạp Đua Trek Domane AL 3 Gen 4',
    slug: 'trek-domane-al-3-gen-4',
    category: 'road',
    categoryName: 'Xe đạp Đua (Road)',
    brand: 'Trek',
    originalPrice: 28500000,
    salePrice: 25900000,
    discountPercent: 9,
    rating: 5.0,
    reviewCount: 45,
    isFlashSale: false,
    isHot: true,
    isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502744688674-c619d3f3b00c?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDesc: 'Khung nhôm 100 Series Alpha Aluminum, càng Carbon Domane, Shimano Sora 2x9, phanh đĩa cơ kép.',
    description: 'Trek Domane AL 3 là mẫu xe đua đường trường đa năng lý tưởng cho những chặng đua tốc độ và hành trình dài ngày. Khung xe hỗ trợ gắn dè chắn bùn và baga, càng trước full Carbon triệt tiêu rung chấn hiệu quả.',
    variants: [
      { id: 'v5', colorName: 'Đỏ Viper Red', colorHex: '#dc2626', sizes: ['49 (1m60-1m68)', '52 (1m68-1m76)', '54 (1m76-1m84)'], image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80', stock: 12 },
      { id: 'v6', colorName: 'Xanh Đêm Satin Lithium Grey', colorHex: '#1e293b', sizes: ['52 (1m68-1m76)'], image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80', stock: 5 }
    ],
    specs: {
      frameMaterial: 'Nhôm Alpha 100 Series Trek USA',
      fork: 'Carbon Domane AL carbon fork, tapered steerer',
      groupset: 'Shimano Sora R3000 2x9 tốc độ (18 Speed)',
      brakes: 'Phanh đĩa cơ kép Tektro C550 dual-piston',
      wheels: 'Bontrager Paradigm Tubeless Ready 700c',
      tires: 'Bontrager R1 Hard-Case Lite 700x32c',
      weight: '9.8 kg',
      origin: 'Mỹ (Nhập khẩu chính hãng Trek)',
      warranty: 'Khung Trọn đời (Lifetime), Phụ tùng 2 năm'
    },
    stock: 17,
    soldCount: 78,
    suitableHeightMin: 160,
    suitableHeightMax: 185,
    suitableAge: 'Người lớn',
    targetGender: 'all',
    reviews: [
      { id: 'r4', author: 'Phạm Minh Tuấn', rating: 5, date: '15/08/2026', comment: 'Đẳng cấp thương hiệu Trek, đạp lướt gió cực êm, tư thế ngồi thoải mái.', verifiedPurchase: true }
    ]
  },
  {
    id: 'bike-road-02',
    name: 'Xe Đạp Đua Twitter Sniper Pro Carbon Shimano 105',
    slug: 'twitter-sniper-pro-carbon-105',
    category: 'road',
    categoryName: 'Xe đạp Đua (Road)',
    brand: 'Twitter',
    originalPrice: 22000000,
    salePrice: 18900000,
    discountPercent: 14,
    rating: 4.9,
    reviewCount: 31,
    isFlashSale: true,
    isHot: true,
    isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDesc: 'Full Carbon T900, ghi đông cá mập đầu tích hợp giấu dây 100%, Group Shimano 105 R7000 22 tốc độ.',
    description: 'Twitter Sniper Pro là cỗ máy tốc độ thực thụ với thiết kế khí động học (Aero) xé gió. Khung sườn, càng trước, cọc yên và tay lái đều bằng Carbon cao cấp, mang lại trọng lượng siêu nhẹ chỉ 8.5kg.',
    variants: [
      { id: 'v7', colorName: 'Đen Vàng Kim', colorHex: '#eab308', sizes: ['46 (1m58-1m68)', '48 (1m68-1m78)'], image: 'https://images.unsplash.com/photo-1502744688674-c619d3f3b00c?auto=format&fit=crop&w=800&q=80', stock: 7 },
      { id: 'v8', colorName: 'Trắng Ngọc Trai', colorHex: '#f8fafc', sizes: ['48 (1m68-1m78)'], image: 'https://images.unsplash.com/photo-1502744688674-c619d3f3b00c?auto=format&fit=crop&w=800&q=80', stock: 4 }
    ],
    specs: {
      frameMaterial: 'Carbon Nano T900 Aero EPS',
      fork: 'Full Carbon T900 đúc nguyên khối',
      groupset: 'Shimano 105 R7000 2x11 tốc độ (22 Speed)',
      brakes: 'Phanh đĩa dầu kéo cơ Retrospec CNC',
      wheels: 'Vành Carbon Retrospec bản cao 50mm chém gió',
      tires: 'Maxxis Sierra 700x25c',
      weight: '8.5 kg',
      origin: 'Đức / Trung Quốc',
      warranty: 'Khung 5 năm, Phụ tùng 1 năm'
    },
    stock: 11,
    soldCount: 65,
    suitableHeightMin: 158,
    suitableHeightMax: 180,
    suitableAge: 'Người lớn',
    targetGender: 'all',
    reviews: [
      { id: 'r5', author: 'Đặng Tuấn Anh', rating: 5, date: '05/08/2026', comment: 'Bánh carbon hú gió cực đã, giấu dây toàn phần nhìn xe gọn và hiện đại!', verifiedPurchase: true }
    ]
  },

  // 3. Touring - Đường phố / Phượt
  {
    id: 'bike-touring-01',
    name: 'Xe Đạp Touring Giant Escape 2 Disc',
    slug: 'giant-escape-2-disc',
    category: 'touring',
    categoryName: 'Xe đạp Touring',
    brand: 'Giant',
    originalPrice: 12500000,
    salePrice: 10890000,
    discountPercent: 13,
    rating: 4.9,
    reviewCount: 52,
    isFlashSale: true,
    isHot: true,
    isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDesc: 'Mẫu xe touring quốc dân, cọc yên D-Fuse giảm xóc độc quyền, phanh đĩa dầu Tektro an toàn.',
    description: 'Giant Escape 2 Disc là dòng xe đạp đường phố & touring bán chạy số 1. Tư thế ngồi thẳng lưng thoải mái, hỗ trợ gắn đầy đủ baga trước sau, dè chắn bùn để du lịch dài ngày.',
    variants: [
      { id: 'v9', colorName: 'Xanh Ghi Bạc', colorHex: '#0284c7', sizes: ['S (1m55-1m68)', 'M (1m68-1m78)', 'L (1m78-1m88)'], image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80', stock: 18 },
      { id: 'v10', colorName: 'Đen Nhám Cổ Điển', colorHex: '#0f172a', sizes: ['S (1m55-1m68)', 'M (1m68-1m78)'], image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80', stock: 14 }
    ],
    specs: {
      frameMaterial: 'Hợp kim nhôm Aluxx-Grade Aluminum',
      fork: 'Hợp kim nhôm Aluxx giảm chấn',
      groupset: 'Shimano Altus / Tourney 2x8 tốc độ (16 Speed)',
      brakes: 'Phanh đĩa dầu thủy lực Tektro HD-R280',
      wheels: 'Giant kép 700c 2 lớp chống va đập',
      tires: 'Giant S-X3 Puncture Protect 700x38c',
      weight: '11.8 kg',
      origin: 'Đài Loan (Chính Hãng Giant)',
      warranty: 'Khung 5 năm, Phụ tùng 1 năm'
    },
    stock: 32,
    soldCount: 210,
    suitableHeightMin: 155,
    suitableHeightMax: 188,
    suitableAge: 'Mọi lứa tuổi',
    targetGender: 'all',
    reviews: [
      { id: 'r6', author: 'Võ Minh Trí', rating: 5, date: '19/08/2026', comment: 'Đi làm hàng ngày và cuối tuần dạo phố cực kỳ tiện lợi và nhẹ nhàng.', verifiedPurchase: true }
    ]
  },

  // 4. Trẻ em (Kids)
  {
    id: 'bike-kids-01',
    name: 'Xe Đạp Trẻ Em Asama AMT 01 (Bánh 20 inch)',
    slug: 'asama-amt-01-20-inch',
    category: 'kids',
    categoryName: 'Xe đạp Trẻ em',
    brand: 'Asama',
    originalPrice: 3200000,
    salePrice: 2690000,
    discountPercent: 16,
    rating: 4.8,
    reviewCount: 64,
    isFlashSale: false,
    isHot: true,
    isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDesc: 'Khung thép chịu lực bền bỉ, có bánh phụ tháo lắp dễ dàng, phanh tay an toàn nhẹ ngón tay bé.',
    description: 'Xe đạp trẻ em Asama thiết kế công thái học bảo vệ cột sống của bé. Sơn tĩnh điện không chì an toàn tuyệt đối cho sức khỏe trẻ nhỏ, phù hợp cho bé từ 6 - 10 tuổi tập đi và phát triển thể chất.',
    variants: [
      { id: 'v11', colorName: 'Đỏ Năng Động', colorHex: '#ef4444', sizes: ['Bánh 20 inch (1m15 - 1m35)'], image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=800&q=80', stock: 20 },
      { id: 'v12', colorName: 'Xanh Dương Thể Thao', colorHex: '#3b82f6', sizes: ['Bánh 20 inch (1m15 - 1m35)'], image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=800&q=80', stock: 15 }
    ],
    specs: {
      frameMaterial: 'Thép cường lực Asama Hi-ten Steel',
      fork: 'Thép cứng vững Asama',
      groupset: '1 tốc độ đơn giản dễ điều khiển',
      brakes: 'Phanh chữ V trước & Phanh đùm sau',
      wheels: 'Vành nhôm Asama 20 inch',
      tires: 'Kenda 20x1.95 inch bám đường',
      weight: '9.5 kg',
      origin: 'Việt Nam (Asama)',
      warranty: 'Khung 3 năm, Phụ tùng 1 năm'
    },
    stock: 35,
    soldCount: 180,
    suitableHeightMin: 115,
    suitableHeightMax: 138,
    suitableAge: '6 - 10 tuổi',
    targetGender: 'kids',
    reviews: [
      { id: 'r7', author: 'Chị Mai Lan', rating: 5, date: '21/08/2026', comment: 'Bé nhà mình thích mê, xe chắc chắn, màu sơn đẹp và phanh rất nhẹ tay!', verifiedPurchase: true }
    ]
  },

  // 5. Xe Điện Trợ Lực (E-Bike)
  {
    id: 'bike-ebike-01',
    name: 'Xe Đạp Trợ Lực Điện Himo C26 Thông Minh',
    slug: 'himo-c26-smart-ebike',
    category: 'ebike',
    categoryName: 'Xe đạp Trợ lực điện',
    brand: 'Himo',
    originalPrice: 18500000,
    salePrice: 15990000,
    discountPercent: 14,
    rating: 4.9,
    reviewCount: 22,
    isFlashSale: true,
    isHot: true,
    isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDesc: 'Quãng đường trợ lực lên tới 100km, pin Lithium Samsung ẩn trong sườn, màn hình LCD chống nước IPX7.',
    description: 'Himo C26 là siêu phẩm xe đạp trợ lực điện hiện đại. Tích hợp 3 chế độ: Đạp thường, Trợ lực điện thông minh và Thuần điện. Động cơ 250W mạnh mẽ êm ái leo dốc hầm chung cư dễ dàng.',
    variants: [
      { id: 'v13', colorName: 'Xám Không Gian', colorHex: '#64748b', sizes: ['Free Size (1m55 - 1m85)'], image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80', stock: 9 },
      { id: 'v14', colorName: 'Trắng Tinh Tế', colorHex: '#f1f5f9', sizes: ['Free Size (1m55 - 1m85)'], image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80', stock: 5 }
    ],
    specs: {
      frameMaterial: 'Hợp kim nhôm siêu nhẹ đúc liền',
      fork: 'Phuộc nhún dầu có điều chỉnh khóa',
      groupset: 'Shimano 7 tốc độ + Động cơ điện 250W không chổi than',
      brakes: 'Phanh đĩa cơ trước sau ngắt điện an toàn',
      wheels: '26 inch lốp Kenda',
      tires: 'Kenda 26x2.125',
      weight: '25 kg (Đã gồm pin)',
      origin: 'Chính hãng Himo Eco',
      warranty: 'Khung 3 năm, Pin & Động cơ 1 năm'
    },
    stock: 14,
    soldCount: 43,
    suitableHeightMin: 155,
    suitableHeightMax: 185,
    suitableAge: 'Người lớn & Người cao tuổi',
    targetGender: 'all',
    reviews: [
      { id: 'r8', author: 'Bác Trần Trọng', rating: 5, date: '14/08/2026', comment: 'Trợ lực rất nhạy, đạp dốc cầu Phú Mỹ nhẹ tênh như lướt!', verifiedPurchase: true }
    ]
  },

  // 6. Xe Gấp (Folding)
  {
    id: 'bike-folding-01',
    name: 'Xe Đạp Gấp Trinx Life 2.0 Bánh 20 inch',
    slug: 'trinx-life-2-folding',
    category: 'folding',
    categoryName: 'Xe đạp Gấp',
    brand: 'Trinx',
    originalPrice: 6200000,
    salePrice: 5390000,
    discountPercent: 13,
    rating: 4.7,
    reviewCount: 19,
    isFlashSale: false,
    isHot: false,
    isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDesc: 'Gấp gọn chỉ trong 10 giây, bỏ vừa cốp ô tô 4 chỗ, bộ chuyển động Shimano 7 tốc độ.',
    description: 'Trinx Life 2.0 sở hữu bản lề gấp công nghệ khóa chốt kép siêu chắc chắn. Tiện lợi cho gia đình đi du lịch cắm trại, đi tàu điện Cát Linh / Metro Bến Thành.',
    variants: [
      { id: 'v15', colorName: 'Vàng Chanh', colorHex: '#eab308', sizes: ['Free size gấp gọn (1m30 - 1m80)'], image: 'https://images.unsplash.com/photo-1528629297340-d1d461b55f8e?auto=format&fit=crop&w=800&q=80', stock: 12 },
      { id: 'v16', colorName: 'Đen Nhám', colorHex: '#1e293b', sizes: ['Free size gấp gọn (1m30 - 1m80)'], image: 'https://images.unsplash.com/photo-1528629297340-d1d461b55f8e?auto=format&fit=crop&w=800&q=80', stock: 8 }
    ],
    specs: {
      frameMaterial: 'Hợp kim nhôm Trinx Alloy 6061',
      fork: 'Thép cường lực Hi-ten',
      groupset: 'Shimano Tourney 7 tốc độ',
      brakes: 'Phanh đĩa cơ Trinx',
      wheels: 'Vành nhôm 20 inch',
      tires: 'Kenda 20x1.50 inch',
      weight: '11.5 kg',
      origin: 'Chính hãng Trinx',
      warranty: 'Khung 3 năm, Phụ tùng 1 năm'
    },
    stock: 20,
    soldCount: 88,
    suitableHeightMin: 130,
    suitableHeightMax: 180,
    suitableAge: 'Học sinh & Người lớn',
    targetGender: 'all',
    reviews: []
  },

  // 7. Phụ Kiện (Accessories)
  {
    id: 'bike-acc-01',
    name: 'Nón Bảo Hiểm Xe Đạp Cairbull Aero Siêu Nhẹ',
    slug: 'cairbull-aero-helmet',
    category: 'accessories',
    categoryName: 'Phụ kiện & Phụ tùng',
    brand: 'Cairbull',
    originalPrice: 850000,
    salePrice: 650000,
    discountPercent: 24,
    rating: 5.0,
    reviewCount: 112,
    isFlashSale: true,
    isHot: true,
    isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1559348349-86f1f65817fe?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDesc: 'Xốp EPS đúc liền khối Polycarbonate, 22 lỗ thoáng khí, có đèn LED hậu cảnh báo ban đêm.',
    description: 'Mũ bảo hiểm đạt chuẩn an toàn CE EN1078 Châu Âu. Trọng lượng chỉ 230g cho cảm giác đội nhẹ như không, khóa núm xoay điều chỉnh vòng đầu linh hoạt.',
    variants: [
      { id: 'v17', colorName: 'Đen Nhám Carbon', colorHex: '#000000', sizes: ['M/L (55-61cm)'], image: 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?auto=format&fit=crop&w=800&q=80', stock: 45 },
      { id: 'v18', colorName: 'Trắng Đỏ', colorHex: '#ef4444', sizes: ['M/L (55-61cm)'], image: 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?auto=format&fit=crop&w=800&q=80', stock: 30 }
    ],
    specs: {
      frameMaterial: 'Xốp EPS + Vỏ PC Polycarbonate cao cấp',
      fork: 'N/A',
      groupset: 'N/A',
      brakes: 'N/A',
      wheels: 'N/A',
      tires: 'N/A',
      weight: '230 gram',
      origin: 'Chính hãng Cairbull',
      warranty: 'Đổi mới 12 tháng'
    },
    stock: 75,
    soldCount: 340,
    suitableHeightMin: 120,
    suitableHeightMax: 200,
    suitableAge: 'Mọi lứa tuổi',
    targetGender: 'all',
    reviews: []
  },
  {
    id: 'bike-acc-02',
    name: 'Đèn Pha Xe Đạp Gaciron 800 Lumens Chống Nước IPX6',
    slug: 'den-pha-gaciron-800lm',
    category: 'accessories',
    categoryName: 'Phụ kiện & Phụ tùng',
    brand: 'Gaciron',
    originalPrice: 790000,
    salePrice: 590000,
    discountPercent: 25,
    rating: 4.9,
    reviewCount: 78,
    isFlashSale: false,
    isHot: true,
    isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDesc: 'Độ sáng 800 Lumens chiếu xa 200m, pin sạc Type-C 2500mAh kiêm sạc dự phòng điện thoại.',
    description: 'Vỏ nhôm CNC tản nhiệt nhanh, góc chiếu rộng 85 độ không gây chói mắt người đối diện. 5 chế độ sáng tiện dụng đi đêm, phượt đèo sương mù.',
    variants: [
      { id: 'v19', colorName: 'Đen Anodized', colorHex: '#18181b', sizes: ['Tiêu chuẩn'], image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80', stock: 50 }
    ],
    specs: {
      frameMaterial: 'Hợp kim nhôm 6063 hàng không CNC',
      fork: 'N/A',
      groupset: 'N/A',
      brakes: 'N/A',
      wheels: 'N/A',
      tires: 'N/A',
      weight: '125 gram',
      origin: 'Chính hãng Gaciron',
      warranty: 'Bảo hành 12 tháng'
    },
    stock: 50,
    soldCount: 215,
    suitableHeightMin: 100,
    suitableHeightMax: 200,
    suitableAge: 'Mọi lứa tuổi',
    targetGender: 'all',
    reviews: []
  }
];

export const INITIAL_VOUCHERS: Voucher[] = [
  { code: 'DEMO200K', description: 'Giảm 200.000đ cho đơn hàng từ 5.000.000đ', discountType: 'fixed', discountValue: 200000, minOrderValue: 5000000, expiresAt: '2026-12-31', isActive: true },
  { code: 'FREESHIP', description: 'Miễn phí vận chuyển toàn quốc cho xe đạp nguyên chiếc', discountType: 'fixed', discountValue: 150000, minOrderValue: 2000000, expiresAt: '2026-12-31', isActive: true },
  { code: 'GIAM5PHANTRAM', description: 'Giảm ngay 5% tối đa 500.000đ cho khách hàng mới', discountType: 'percentage', discountValue: 5, minOrderValue: 3000000, expiresAt: '2026-12-31', isActive: true }
];

export const INITIAL_BRANCHES: StoreBranch[] = [
  {
    id: 'br-hcm-1',
    name: 'Showroom Demo Xe Đạp Quận 1 (Flagship)',
    city: 'Hồ Chí Minh',
    address: '188 Đường Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    phone: '0908 123 456',
    hotline: '1900 8888',
    hours: '08:00 - 21:30 (Mở cửa tất cả các ngày trong tuần)',
    mapEmbedUrl: 'https://maps.google.com/maps?q=188+Nguyen+Thi+Minh+Khai+Ben+Thanh+District+1+Ho+Chi+Minh&t=&z=16&ie=UTF8&iwloc=&output=embed',
    image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=800&q=80',
    lat: 10.7725,
    lng: 106.6908
  },
  {
    id: 'br-hcm-2',
    name: 'Showroom Demo Xe Đạp Bình Thạnh',
    city: 'Hồ Chí Minh',
    address: '425 Đường Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh',
    phone: '0908 234 567',
    hotline: '1900 8888',
    hours: '08:00 - 21:00',
    mapEmbedUrl: 'https://maps.google.com/maps?q=425+Dien+Bien+Phu+Ward+25+Binh+Thanh+Ho+Chi+Minh&t=&z=16&ie=UTF8&iwloc=&output=embed',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80',
    lat: 10.8012,
    lng: 106.7145
  },
  {
    id: 'br-hn-1',
    name: 'Showroom Demo Xe Đạp Hà Nội',
    city: 'Hà Nội',
    address: '89 Đường Hoàng Cầu, Phường Ô Chợ Dừa, Quận Đống Đa, Hà Nội',
    phone: '0909 345 678',
    hotline: '1900 8888',
    hours: '08:30 - 21:00',
    mapEmbedUrl: 'https://maps.google.com/maps?q=89+Hoang+Cau+O+Cho+Dua+Dong+Da+Ha+Noi&t=&z=16&ie=UTF8&iwloc=&output=embed',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    lat: 21.0185,
    lng: 105.8234
  },
  {
    id: 'br-dn-1',
    name: 'Showroom Demo Xe Đạp Đà Nẵng',
    city: 'Đà Nẵng',
    address: '254 Đường Nguyễn Văn Linh, Phường Thạc Gián, Quận Thanh Khê, Đà Nẵng',
    phone: '0909 456 789',
    hotline: '1900 8888',
    hours: '08:00 - 20:30',
    mapEmbedUrl: 'https://maps.google.com/maps?q=254+Nguyen+Van+Linh+Thac+Gian+Thanh+Khe+Da+Nang&t=&z=16&ie=UTF8&iwloc=&output=embed',
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=800&q=80',
    lat: 16.0612,
    lng: 108.2140
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Cẩm Nang Hướng Dẫn Chọn Size Xe Đạp Chuẩn Chiều Cao Cho Người Mới',
    slug: 'huong-dan-chon-size-xe-dap-chuan-chieu-cao',
    category: 'Tư Vấn Chọn Xe',
    excerpt: 'Cách đo chiều cao sải chân (Inseam) và lựa chọn khung sườn xe Road, MTB, Touring phù hợp nhất để tránh mỏi lưng và chấn thương gối.',
    content: 'Việc chọn đúng kích thước khung xe đóng vai trò quyết định đến 90% cảm giác thoải mái khi đạp xe lâu dài...',
    thumbnail: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80',
    publishedAt: '20/08/2026',
    author: 'Kỹ Sư Đặng Quốc Bảo',
    readTime: '6 phút đọc',
    views: 1420,
    isFeatured: true
  },
  {
    id: 'art-2',
    title: 'Top 5 Cung Đường Phượt Xe Đạp Đẹp Nhất Việt Nam Không Thể Bỏ Lỡ',
    slug: 'top-5-cung-duong-phuot-xe-dap-dep-nhat-viet-nam',
    category: 'Văn Hóa Đạp Xe',
    excerpt: 'Hành trình vượt đèo Hải Vân mây phủ, cung đường ven biển Phan Thiết - Kê Gà và khám phá thung lũng Mai Châu thơ mộng.',
    content: 'Đạp xe không chỉ rèn luyện sức bền mà còn mang lại cảm giác ngắm nhìn từng khoảnh khắc thiên nhiên tuyệt đẹp...',
    thumbnail: 'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?auto=format&fit=crop&w=800&q=80',
    publishedAt: '16/08/2026',
    author: 'Minh Hằng - Phượt Thủ',
    readTime: '8 phút đọc',
    views: 980,
    isFeatured: true
  },
  {
    id: 'art-3',
    title: 'Quy Trình 5 Bước Vệ Sinh & Tra Dầu Xích Líp Xe Đạp Chuẩn Chuyên Nghiệp',
    slug: 'quy-trinh-5-buoc-ve-sinh-tra-dau-xich-lip',
    category: 'Kỹ Thuật & Bảo Dưỡng',
    excerpt: 'Bí quyết giữ cho bộ truyền động Shimano luôn sáng bóng, chuyển số êm ái và kéo dài tuổi thọ xích líp gấp 3 lần.',
    content: 'Bụi bẩn và cát bám vào xích là nguyên nhân hàng đầu khiến líp bị mòn và phát ra tiếng kêu cọt kẹt khó chịu...',
    thumbnail: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=800&q=80',
    publishedAt: '10/08/2026',
    author: 'Thợ Máy Trưởng Demo Xe Đạp',
    readTime: '5 phút đọc',
    views: 860
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Nguyễn Văn Hùng',
    phone: '0912345678',
    email: 'hung.nguyen@gmail.com',
    address: 'Số 45 Lê Duẩn, P. Bến Nghé',
    city: 'Hồ Chí Minh',
    district: 'Quận 1',
    totalSpent: 11990000,
    orderCount: 1,
    tier: 'Vàng',
    notes: 'Khách hàng VIP, thích xe dòng Giant địa hình',
    createdAt: '2026-08-18'
  },
  {
    id: 'cust-2',
    name: 'Phạm Minh Tuấn',
    phone: '0987654321',
    email: 'tuan.pm@techcorp.vn',
    address: 'Tòa nhà Landmark 81, P. 22',
    city: 'Hồ Chí Minh',
    district: 'Quận Bình Thạnh',
    totalSpent: 25900000,
    orderCount: 1,
    tier: 'Kim Cương',
    notes: 'Đã mua Trek Domane AL3, hẹn bảo dưỡng định kỳ tháng 11/2026',
    createdAt: '2026-08-15'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderCode: 'DXD-2608-1001',
    customerName: 'Nguyễn Văn Hùng',
    customerPhone: '0912345678',
    customerEmail: 'hung.nguyen@gmail.com',
    shippingAddress: 'Số 45 Lê Duẩn, P. Bến Nghé, Quận 1',
    city: 'Hồ Chí Minh',
    district: 'Quận 1',
    items: [
      {
        productId: 'bike-mtb-01',
        productName: 'Xe Đạp Địa Hình Giant ATX 830 D',
        selectedColor: 'Đen Cam Titan',
        selectedSize: 'M (1m68-1m78)',
        price: 11990000,
        quantity: 1,
        thumbnail: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 11990000,
    discountAmount: 200000,
    voucherCode: 'DEMO200K',
    shippingFee: 0,
    total: 11790000,
    paymentMethod: 'vietqr',
    paymentStatus: 'paid',
    status: 'completed',
    orderNotes: 'Giao giờ hành chính, gọi trước khi giao 30 phút.',
    createdAt: '2026-08-18 09:30:00',
    updatedAt: '2026-08-18 16:45:00',
    createdBy: 'customer'
  },
  {
    id: 'ord-1002',
    orderCode: 'DXD-2608-1002',
    customerName: 'Phạm Minh Tuấn',
    customerPhone: '0987654321',
    customerEmail: 'tuan.pm@techcorp.vn',
    shippingAddress: 'Tòa nhà Landmark 81, P. 22, Bình Thạnh',
    city: 'Hồ Chí Minh',
    district: 'Quận Bình Thạnh',
    items: [
      {
        productId: 'bike-road-01',
        productName: 'Xe Đạp Đua Trek Domane AL 3 Gen 4',
        selectedColor: 'Đỏ Viper Red',
        selectedSize: '52 (1m68-1m76)',
        price: 25900000,
        quantity: 1,
        thumbnail: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 25900000,
    discountAmount: 0,
    shippingFee: 0,
    total: 25900000,
    paymentMethod: 'vietqr',
    paymentStatus: 'paid',
    status: 'shipping',
    orderNotes: 'Lắp ráp sẵn 100%, đem theo phiếu bảo hành chính hãng.',
    createdAt: '2026-08-22 14:15:00',
    updatedAt: '2026-08-24 10:20:00',
    createdBy: 'customer'
  }
];
