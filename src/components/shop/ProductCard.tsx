import React from 'react';
import { Product } from '../../types';
import { Star, ShoppingBag, Eye, ShieldCheck, Check } from 'lucide-react';
import { analytics } from '../../services/analytics';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onViewDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  onViewDetail
}) => {
  const [added, setAdded] = React.useState(false);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    analytics.logClick('add_to_cart', `Thêm nhanh giỏ hàng: ${product.name}`, product.id);
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    analytics.logClick('product_view', `Xem nhanh: ${product.name}`, product.id);
    onQuickView(product);
  };

  const handleCardClick = () => {
    analytics.logClick('product_view', `Xem chi tiết sản phẩm: ${product.name}`, product.id);
    onViewDetail(product);
  };

  return (
    <div className="product-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      {/* Thumbnail Wrap */}
      <div className="product-thumb-wrap">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="product-thumb"
          loading="lazy"
        />

        {/* Badges */}
        <div className="product-badges">
          {product.discountPercent > 0 && (
            <span className="badge badge-sale">-{product.discountPercent}%</span>
          )}
          {product.isFlashSale && (
            <span className="badge badge-hot">⚡ Flash Sale</span>
          )}
          {product.isNew && (
            <span className="badge badge-primary">Mẫu Mới</span>
          )}
        </div>

        {/* Brand Tag */}
        <div className="product-brand-tag">{product.brand}</div>
      </div>

      {/* Card Body */}
      <div className="product-card-body">
        <div className="product-cat-name">{product.categoryName}</div>
        
        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        {/* Rating Row */}
        <div className="product-rating-row">
          <div className="stars-wrap">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'}
                color={i < Math.floor(product.rating) ? '#f59e0b' : '#cbd5e1'}
              />
            ))}
          </div>
          <span>({product.reviewCount || 12})</span>
          <span style={{ marginLeft: 'auto', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <ShieldCheck size={13} /> 5 năm BH
          </span>
        </div>

        {/* Price Row */}
        <div className="product-price-row">
          <span className="product-sale-price">{formatPrice(product.salePrice)}</span>
          {product.originalPrice > product.salePrice && (
            <span className="product-orig-price">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="product-actions-row">
          <button 
            onClick={handleAddToCart}
            className="btn-quick-add"
            style={{ background: added ? '#10b981' : undefined }}
          >
            {added ? <Check size={16} /> : <ShoppingBag size={16} />}
            <span>{added ? 'Đã Thêm!' : 'Thêm Giỏ Hàng'}</span>
          </button>

          <button 
            onClick={handleQuickView}
            className="btn-view-detail"
            title="Xem nhanh thông số"
          >
            <Eye size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};
