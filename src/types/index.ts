export type BikeCategory = 
  | 'mtb'         // Địa hình
  | 'road'        // Đua
  | 'touring'     // Đường trường / Touring
  | 'sport'       // Thể thao
  | 'kids'        // Trẻ em
  | 'women'       // Nữ / Phổ thông
  | 'folding'     // Gấp
  | 'ebike'       // Trợ lực điện
  | 'accessories';// Phụ kiện & Phụ tùng

export interface ProductVariant {
  id: string;
  colorName: string;
  colorHex: string;
  sizes: string[]; // e.g. ['S (1m55-1m65)', 'M (1m65-1m75)', 'L (1m75-1m85)']
  image: string;
  stock: number;
}

export interface ProductSpecs {
  frameMaterial: string;      // Chất liệu khung (Carbon, Nhôm 6061, Thép Cr-Mo)
  fork: string;               // Phuộc / Càng
  groupset: string;           // Bộ chuyển động (Shimano Deore 1x12, Shimano 105, etc.)
  brakes: string;             // Hệ thống phanh (Phanh đĩa dầu thủy lực, V-Brake)
  wheels: string;             // Vành & Cỡ bánh (29 inch, 700c, 26 inch, 20 inch)
  tires: string;              // Lốp xe (Maxxis, Continental, Kenda)
  weight: string;             // Trọng lượng (8.2 kg, 12.5 kg...)
  origin: string;             // Xuất xứ / Thương hiệu
  warranty: string;           // Bảo hành (Khung 5 năm, Phụ tùng 1 năm)
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  userAvatar?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: BikeCategory;
  categoryName: string;
  brand: string;
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  isFlashSale?: boolean;
  isHot?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  thumbnail: string;
  gallery: string[];
  videoUrl?: string;
  shortDesc: string;
  description: string;
  variants: ProductVariant[];
  specs: ProductSpecs;
  stock: number;
  soldCount: number;
  reviews: Review[];
  suitableHeightMin: number; // cm, e.g. 155
  suitableHeightMax: number; // cm, e.g. 185
  suitableAge?: string;      // e.g. "Người lớn" | "Học sinh" | "4-7 tuổi"
  targetGender?: 'all' | 'male' | 'female' | 'kids';
}

export interface CartItem {
  productId: string;
  productName: string;
  thumbnail: string;
  price: number;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  variantId?: string;
  maxStock: number;
}

export interface Voucher {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  expiresAt: string;
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  totalSpent: number;
  orderCount: number;
  tier: 'Bạc' | 'Vàng' | 'Kim Cương';
  notes?: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  selectedColor: string;
  selectedSize: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';
export type PaymentMethod = 'cod' | 'vietqr' | 'vnpay' | 'pos_counter';

export interface Order {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  city: string;
  district: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  voucherCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'unpaid' | 'paid';
  status: OrderStatus;
  orderNotes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string; // 'customer' | 'staff_pos'
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  mediaType: 'video' | 'image';
  mediaUrl: string;
  posterUrl: string;
  order: number;
  isActive: boolean;
}

export interface StoryChapter {
  id: string;
  chapterNumber: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string[];
  keyPoints: { icon: string; title: string; desc: string }[];
  bgImage: string;
  accentColor?: string;
}

export interface StoreBranch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  hotline: string;
  mapEmbedUrl: string;
  image: string;
  lat?: number;
  lng?: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  publishedAt: string;
  author: string;
  readTime: string;
  views: number;
  isFeatured?: boolean;
}

export interface ClickEvent {
  id: string;
  type: 'banner' | 'cta_hero' | 'product_view' | 'add_to_cart' | 'hotline' | 'zalo' | 'messenger' | 'filter_use';
  targetId?: string;
  targetLabel: string;
  pageUrl: string;
  timestamp: string;
  device: 'desktop' | 'tablet' | 'mobile';
}

export interface UserSession {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'staff';
  token: string;
}
