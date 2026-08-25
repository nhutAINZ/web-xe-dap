import React, { useState, useMemo } from 'react';
import { Product, BikeCategory } from '../../types';
import { ProductCard } from './ProductCard';
import { FlashSaleBanner } from './FlashSaleBanner';
import { Filter, SlidersHorizontal, ArrowUpDown, Bike, Sparkles, Zap } from 'lucide-react';
import { analytics } from '../../services/analytics';
import { ShopSearchEngine, SortCriteria } from '../../utils/searchEngine';

interface ProductGridProps {
  products: Product[];
  selectedCategory: BikeCategory | 'all';
  onSelectCategory: (cat: BikeCategory | 'all') => void;
  searchQuery: string;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onViewDetail: (product: Product) => void;
  onOpenSizeQuiz: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onQuickView,
  onAddToCart,
  onViewDetail,
  onOpenSizeQuiz
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortCriteria>('featured');
  const [showFlashSaleOnly, setShowFlashSaleOnly] = useState(false);

  const categories: { key: BikeCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'Tất Cả' },
    { key: 'mtb', label: 'Địa Hình (MTB)' },
    { key: 'road', label: 'Đua (Road)' },
    { key: 'touring', label: 'Touring' },
    { key: 'ebike', label: 'Trợ Lực Điện' },
    { key: 'kids', label: 'Trẻ Em' },
    { key: 'folding', label: 'Xe Gấp' },
    { key: 'accessories', label: 'Phụ Kiện' }
  ];

  // Inverted Index Engine singleton instance per product dataset
  const searchEngine = useMemo(() => {
    return new ShopSearchEngine(products);
  }, [products]);

  const brands = useMemo(() => {
    const bSet = new Set<string>();
    products.forEach(p => { if (p.brand) bSet.add(p.brand); });
    return ['all', ...Array.from(bSet)];
  }, [products]);

  // Algorithmic query execution via Inverted Index + Binary Range Pointers + QuickSort + LRU cache
  const filteredProducts = useMemo(() => {
    return searchEngine.query({
      searchQuery,
      category: selectedCategory,
      brand: selectedBrand,
      priceRange,
      showFlashSaleOnly,
      sortBy
    });
  }, [searchEngine, searchQuery, selectedCategory, selectedBrand, priceRange, sortBy, showFlashSaleOnly]);

  return (
    <section id="products-section" style={{ padding: '4rem 0', background: '#f8fafc' }}>
      <div className="container">
        {/* Flash Sale Banner */}
        <FlashSaleBanner onExploreFlashSale={() => setShowFlashSaleOnly(!showFlashSaleOnly)} />

        {/* Section Header */}
        <div className="section-head">
          <div className="section-title-wrap">
            <h2>Bộ Sưu Tập Xe Đạp Chính Hãng</h2>
            <p className="section-subtitle">
              Đầy đủ dòng xe thể thao, địa hình, xe đua và phụ kiện cao cấp nhập khẩu chính ngạch
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Sorting Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#ffffff', padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <ArrowUpDown size={16} color="#64748b" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                  analytics.logClick('filter_use', `Sắp xếp: ${e.target.value}`);
                }}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}
              >
                <option value="featured">Nổi bật nhất</option>
                <option value="sold">Bán chạy nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="filter-tabs-wrap">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                onSelectCategory(c.key);
                setShowFlashSaleOnly(false);
                analytics.logClick('filter_use', `Tab phân loại: ${c.label}`);
              }}
              className={`filter-tab-pill ${selectedCategory === c.key && !showFlashSaleOnly ? 'active' : ''}`}
            >
              {c.label}
            </button>
          ))}
          {showFlashSaleOnly && (
            <button
              onClick={() => setShowFlashSaleOnly(false)}
              className="filter-tab-pill active"
              style={{ background: '#ef4444', borderColor: '#ef4444' }}
            >
              🔥 Đang lọc: Flash Sale
            </button>
          )}
        </div>

        {/* Sub-Filters Row (Brand & Price) */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            background: '#ffffff',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            marginBottom: '2rem'
          }}
        >
          {/* Brand Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Filter size={15} color="#f97316" /> Hãng xe:
            </span>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {brands.map(b => (
                <button
                  key={b}
                  onClick={() => {
                    setSelectedBrand(b);
                    analytics.logClick('filter_use', `Hãng: ${b}`);
                  }}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: selectedBrand === b ? '#0f172a' : '#f1f5f9',
                    color: selectedBrand === b ? '#ffffff' : '#475569',
                    border: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {b === 'all' ? 'Tất cả hãng' : b}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Mức giá:</span>
            <select
              value={priceRange}
              onChange={(e) => {
                setPriceRange(e.target.value);
                analytics.logClick('filter_use', `Khoảng giá: ${e.target.value}`);
              }}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                background: '#f8fafc',
                fontSize: '0.85rem',
                fontWeight: 600,
                outline: 'none'
              }}
            >
              <option value="all">Tất cả mức giá</option>
              <option value="under5m">Dưới 5 triệu</option>
              <option value="5m-12m">5 - 12 triệu</option>
              <option value="12m-20m">12 - 20 triệu</option>
              <option value="above20m">Trên 20 triệu</option>
            </select>
          </div>
        </div>

        {/* Product Grid List */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
            <Bike size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Không tìm thấy mẫu xe phù hợp
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Hãy thử xóa bộ lọc tìm kiếm hoặc xem các danh mục xe khác
            </p>
            <button
              onClick={() => {
                onSelectCategory('all');
                setSelectedBrand('all');
                setPriceRange('all');
                setShowFlashSaleOnly(false);
              }}
              className="btn btn-outline"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                onViewDetail={onViewDetail}
              />
            ))}
          </div>
        )}

        {/* Sizing Quiz Banner Callout */}
        <div className="sizing-quiz-banner">
          <div className="sizing-banner-info">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#f97316', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <Sparkles size={16} />
              CÔNG CỤ THÔNG MINH
            </div>
            <h3>Chưa Biết Mình Hợp Với Size Sườn & Dòng Xe Nào?</h3>
            <p>
              Chỉ mất 30 giây để công cụ trắc nghiệm tính toán chiều cao và đưa ra gợi ý size xe (S/M/L) chuẩn xác nhất cho bạn!
            </p>
          </div>

          <button
            onClick={() => {
              analytics.logClick('cta_hero', 'Bấm làm bài trắc nghiệm chọn size');
              onOpenSizeQuiz();
            }}
            className="btn btn-primary btn-lg"
            style={{ flexShrink: 0 }}
          >
            <Bike size={20} />
            <span>Trắc Nghiệm Chọn Size Ngay</span>
          </button>
        </div>
      </div>
    </section>
  );
};
