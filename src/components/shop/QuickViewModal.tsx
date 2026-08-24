import React, { useState } from 'react';
import { Product, ProductVariant } from '../../types';
import { X, ShoppingBag, Star, ShieldCheck, Check, Truck, ArrowRight } from 'lucide-react';
import { analytics } from '../../services/analytics';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedColor: string, selectedSize: string) => void;
  onViewFullDetail: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onViewFullDetail
}) => {
  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || { id: 'v0', colorName: 'Tiêu chuẩn', colorHex: '#000', sizes: ['Tiêu chuẩn'], image: product.thumbnail, stock: product.stock }
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    selectedVariant.sizes[0] || 'Tiêu chuẩn'
  );
  const [added, setAdded] = useState(false);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
  };

  const handleColorChange = (v: ProductVariant) => {
    setSelectedVariant(v);
    if (v.sizes.length > 0 && !v.sizes.includes(selectedSize)) {
      setSelectedSize(v.sizes[0]);
    }
  };

  const handleAdd = () => {
    analytics.logClick('add_to_cart', `Thêm từ QuickView: ${product.name}`, product.id);
    onAddToCart(product, selectedVariant.colorName, selectedSize);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '820px', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Visual Image */}
          <div>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: '#f8fafc', border: '1px solid var(--border-light)' }}>
              <img
                src={selectedVariant.image || product.thumbnail}
                alt={product.name}
                style={{ width: '100%', height: '340px', objectFit: 'cover' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              {product.gallery.slice(0, 3).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="thumbnail"
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer', border: '1px solid #e2e8f0' }}
                />
              ))}
            </div>
          </div>

          {/* Details & Selectors */}
          <div>
            <div style={{ fontSize: '0.8rem', color: '#f97316', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              {product.brand} • {product.categoryName}
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem', lineHeight: 1.3 }}>
              {product.name}
            </h2>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', color: '#f59e0b' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'} color="#f59e0b" />
                ))}
              </div>
              <span style={{ fontWeight: 600 }}>{product.rating}</span>
              <span style={{ color: '#64748b' }}>({product.reviewCount} đánh giá)</span>
              <span style={{ marginLeft: 'auto', color: '#10b981', fontWeight: 600, fontSize: '0.8rem' }}>
                Còn {product.stock} xe
              </span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem', background: '#fef2f2', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ef4444', fontFamily: 'var(--font-display)' }}>
                {formatPrice(product.salePrice)}
              </span>
              {product.originalPrice > product.salePrice && (
                <span style={{ fontSize: '0.95rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discountPercent > 0 && (
                <span className="badge badge-sale" style={{ marginLeft: 'auto' }}>
                  Tiết kiệm {product.discountPercent}%
                </span>
              )}
            </div>

            {/* Color Variant Selector */}
            {product.variants.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Màu sắc: <span style={{ color: '#f97316' }}>{selectedVariant.colorName}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => handleColorChange(v)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.4rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: selectedVariant.id === v.id ? '2px solid #f97316' : '1px solid #e2e8f0',
                        background: selectedVariant.id === v.id ? '#fff7ed' : '#ffffff',
                        fontSize: '0.82rem',
                        fontWeight: 600
                      }}
                    >
                      <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: v.colorHex, border: '1px solid rgba(0,0,0,0.1)' }} />
                      {v.colorName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {selectedVariant.sizes.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Kích cỡ khung (Size):
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {selectedVariant.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: selectedSize === s ? '2px solid #f97316' : '1px solid #e2e8f0',
                        background: selectedSize === s ? '#f97316' : '#f8fafc',
                        color: selectedSize === s ? '#ffffff' : '#334155',
                        fontSize: '0.82rem',
                        fontWeight: 600
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                onClick={handleAdd}
                className="btn btn-primary"
                style={{ flex: 1, background: added ? '#10b981' : undefined }}
              >
                {added ? <Check size={18} /> : <ShoppingBag size={18} />}
                <span>{added ? 'Đã Thêm Vào Giỏ' : 'Thêm Vào Giỏ Hàng'}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onViewFullDetail(product);
                }}
                className="btn btn-secondary"
                title="Xem trang chi tiết đầy đủ"
              >
                <span>Chi Tiết</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Guarantees */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', fontSize: '0.78rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Truck size={14} color="#f97316" /> Freeship toàn quốc
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} color="#10b981" /> Đổi trả trong 7 ngày
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
