import React, { useState } from 'react';
import { Product, ProductVariant, Review } from '../../types';
import { 
  Star, ShoppingBag, ShieldCheck, Wrench, Truck, ArrowLeft, 
  Check, Share2, Calculator, ChevronRight, MessageSquare, ThumbsUp 
} from 'lucide-react';
import { analytics } from '../../services/analytics';
import { db } from '../../services/db';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onAddToCart: (product: Product, selectedColor: string, selectedSize: string) => void;
  onSelectProduct: (p: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onAddToCart,
  onSelectProduct
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || { id: 'v0', colorName: 'Tiêu chuẩn', colorHex: '#000', sizes: ['Tiêu chuẩn'], image: product.thumbnail, stock: product.stock }
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    selectedVariant.sizes[0] || 'Tiêu chuẩn'
  );
  const [activeImage, setActiveImage] = useState<string>(selectedVariant.image || product.thumbnail);
  const [added, setAdded] = useState(false);

  // Review form state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewsList, setReviewsList] = useState<Review[]>(product.reviews || []);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
  };

  const handleVariantChange = (v: ProductVariant) => {
    setSelectedVariant(v);
    setActiveImage(v.image);
    if (v.sizes.length > 0 && !v.sizes.includes(selectedSize)) {
      setSelectedSize(v.sizes[0]);
    }
  };

  const handleAdd = () => {
    analytics.logClick('add_to_cart', `Thêm vào giỏ từ PDP: ${product.name}`, product.id);
    onAddToCart(product, selectedVariant.colorName, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment) return;

    const newRev: Review = {
      id: 'rev-' + Date.now(),
      author: reviewAuthor,
      rating: reviewRating,
      date: new Date().toLocaleDateString('vi-VN'),
      comment: reviewComment,
      verifiedPurchase: true
    };

    const updated = [newRev, ...reviewsList];
    setReviewsList(updated);

    // Persist to db
    const updatedProd = { ...product, reviews: updated };
    db.saveProduct(updatedProd);

    setReviewAuthor('');
    setReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const relatedBikes = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div style={{ background: '#f8fafc', padding: '2rem 0 5rem 0' }}>
      <div className="container">
        {/* Breadcrumbs & Back */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
          <button 
            onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f97316', fontWeight: 600 }}
          >
            <ArrowLeft size={16} /> Quay lại danh sách
          </button>
          <span>/</span>
          <span>{product.categoryName}</span>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Top Product Section */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: '3rem',
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
            marginBottom: '3rem'
          }}
        >
          {/* Left: Gallery Showcase */}
          <div>
            <div 
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: '#f8fafc',
                border: '1px solid var(--border-light)',
                height: '460px',
                position: 'relative'
              }}
            >
              <img
                src={activeImage}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {product.discountPercent > 0 && (
                <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                  <span className="badge badge-sale" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                    GIẢM {product.discountPercent}%
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              {[product.thumbnail, ...product.gallery].slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: '75px',
                    height: '75px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: activeImage === img ? '2px solid #f97316' : '1px solid #e2e8f0',
                    cursor: 'pointer'
                  }}
                >
                  <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info & Selectors */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#f97316', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {product.brand} • {product.categoryName}
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.25, marginBottom: '0.85rem' }}>
              {product.name}
            </h1>

            {/* Rating Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', color: '#f59e0b' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'} color="#f59e0b" />
                ))}
              </div>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>{product.rating}</span>
              <span style={{ color: '#64748b' }}>({reviewsList.length} đánh giá thực tế)</span>
              <span style={{ marginLeft: 'auto', color: '#10b981', fontWeight: 700 }}>
                ● Còn {product.stock} chiếc tại kho
              </span>
            </div>

            {/* Price Banner */}
            <div 
              style={{
                background: 'linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #fee2e2',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'baseline',
                gap: '1rem'
              }}
            >
              <span style={{ fontSize: '2.1rem', fontWeight: 900, color: '#ef4444', fontFamily: 'var(--font-display)' }}>
                {formatPrice(product.salePrice)}
              </span>
              {product.originalPrice > product.salePrice && (
                <span style={{ fontSize: '1.1rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {product.shortDesc}
            </p>

            {/* Color Selector */}
            {product.variants.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  Chọn màu sắc: <span style={{ color: '#f97316' }}>{selectedVariant.colorName}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => handleVariantChange(v)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.95rem',
                        borderRadius: 'var(--radius-md)',
                        border: selectedVariant.id === v.id ? '2px solid #f97316' : '1px solid #cbd5e1',
                        background: selectedVariant.id === v.id ? '#fff7ed' : '#ffffff',
                        fontWeight: 600,
                        fontSize: '0.88rem'
                      }}
                    >
                      <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: v.colorHex, border: '1px solid rgba(0,0,0,0.15)' }} />
                      {v.colorName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {selectedVariant.sizes.length > 0 && (
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                    Chọn kích cỡ khung (Size sườn):
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#f97316', fontWeight: 600 }}>
                    Chiều cao phù hợp: {product.suitableHeightMin} - {product.suitableHeightMax}cm
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {selectedVariant.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        padding: '0.6rem 1.1rem',
                        borderRadius: 'var(--radius-md)',
                        border: selectedSize === s ? '2px solid #f97316' : '1px solid #cbd5e1',
                        background: selectedSize === s ? '#f97316' : '#f8fafc',
                        color: selectedSize === s ? '#ffffff' : '#334155',
                        fontWeight: 700,
                        fontSize: '0.88rem'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action CTAs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.75rem' }}>
              <button
                onClick={handleAdd}
                className="btn btn-primary btn-lg"
                style={{ flex: 1, background: added ? '#10b981' : undefined }}
              >
                {added ? <Check size={20} /> : <ShoppingBag size={20} />}
                <span>{added ? 'Đã Thêm Vào Giỏ Hàng!' : 'Thêm Vào Giỏ Hàng'}</span>
              </button>
            </div>

            {/* Guarantees Matrix */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.85rem',
                background: '#f8fafc',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #e2e8f0',
                fontSize: '0.82rem',
                color: '#475569'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="#f97316" /> Bảo hành khung 5 năm chính hãng
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Wrench size={16} color="#0284c7" /> Cân vành, bảo dưỡng miễn phí trọn đời
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={16} color="#10b981" /> Freeship & kiểm tra xe trước khi nhận
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calculator size={16} color="#ec4899" /> Trả góp 0% lãi suất qua thẻ
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Detailed Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2.5rem', marginBottom: '3.5rem' }}>
          {/* Detailed Description */}
          <div style={{ background: '#ffffff', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              Mô Tả Chi Tiết & Điểm Nổi Bật
            </h3>
            <p style={{ color: '#334155', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            <div style={{ background: '#fff7ed', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #f97316' }}>
              <h4 style={{ color: '#ea580c', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                Quy cách đóng gói & bàn giao:
              </h4>
              <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>
                Xe được lắp ráp và căn chỉnh hoàn thiện 95% trong thùng xốp chuyên dụng. Kèm theo bộ dụng cụ siết ốc, sổ bảo hành chính hãng và phiếu quà tặng bảo dưỡng.
              </p>
            </div>
          </div>

          {/* Specs Sheet Table */}
          <div style={{ background: '#ffffff', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              Thông Số Kỹ Thuật
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <tbody>
                {[
                  { label: 'Khung xe', val: product.specs.frameMaterial },
                  { label: 'Phuộc nhún / Càng', val: product.specs.fork },
                  { label: 'Bộ truyền động', val: product.specs.groupset },
                  { label: 'Hệ thống phanh', val: product.specs.brakes },
                  { label: 'Cỡ bánh & Vành', val: product.specs.wheels },
                  { label: 'Lốp xe', val: product.specs.tires },
                  { label: 'Trọng lượng', val: product.specs.weight },
                  { label: 'Xuất xứ', val: product.specs.origin },
                  { label: 'Chế độ bảo hành', val: product.specs.warranty },
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 0.5rem', color: '#64748b', fontWeight: 600, width: '40%' }}>
                      {row.label}
                    </td>
                    <td style={{ padding: '0.65rem 0.5rem', color: '#0f172a', fontWeight: 700 }}>
                      {row.val}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', marginBottom: '3.5rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
            Đánh Giá & Nhận Xét Của Khách Hàng ({reviewsList.length})
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2.5rem', alignItems: 'start' }}>
            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto' }}>
              {reviewsList.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Chưa có nhận xét nào. Hãy là người đầu tiên đánh giá mẫu xe này!</div>
              ) : (
                reviewsList.map((rev) => (
                  <div key={rev.id} style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{rev.author}</div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{rev.date}</span>
                    </div>
                    <div style={{ display: 'flex', color: '#f59e0b', marginBottom: '0.5rem' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} fill={i < rev.rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                      ))}
                    </div>
                    <p style={{ color: '#334155', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Submit Review Form */}
            <form onSubmit={handleReviewSubmit} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                Viết đánh giá của bạn
              </h4>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                  Họ và tên của bạn:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                  Mức độ hài lòng:
                </label>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      style={{ padding: '0.2rem' }}
                    >
                      <Star size={22} fill={star <= reviewRating ? '#f59e0b' : 'none'} color="#f59e0b" />
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                  Nội dung nhận xét:
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Chia sẻ trải nghiệm đạp xe, độ êm ái, phụ tùng..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', resize: 'none' }}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-sm">
                Gửi Đánh Giá
              </button>

              {reviewSubmitted && (
                <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.5rem' }}>
                  ✓ Cảm ơn bạn đã gửi đánh giá!
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Related Products */}
        {relatedBikes.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
              Sản Phẩm Cùng Phân Khúc Bạn Có Thể Thích
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
              {relatedBikes.map(bike => (
                <div
                  key={bike.id}
                  onClick={() => onSelectProduct(bike)}
                  style={{
                    background: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-light)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <img src={bike.thumbnail} alt={bike.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  <div style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{bike.brand}</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>{bike.name}</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ef4444' }}>{formatPrice(bike.salePrice)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
