import React, { useState } from 'react';
import { 
  Search, ShoppingBag, PhoneCall, MapPin, Menu, X, 
  ChevronDown, Flame, Bike, ShieldCheck, Truck, Sparkles 
} from 'lucide-react';
import { BikeCategory } from '../../types';
import { analytics } from '../../services/analytics';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenBranches: () => void;
  onSelectCategory: (cat: BikeCategory | 'all') => void;
  selectedCategory: BikeCategory | 'all';
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateHome: () => void;
  onOpenSizeQuiz: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenBranches,
  onSelectCategory,
  selectedCategory,
  searchQuery,
  onSearchChange,
  onNavigateHome,
  onOpenSizeQuiz,
  onOpenAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories: { key: BikeCategory | 'all'; label: string; highlight?: boolean }[] = [
    { key: 'all', label: 'Tất Cả Sản Phẩm' },
    { key: 'mtb', label: 'Xe Đạp Địa Hình (MTB)', highlight: true },
    { key: 'road', label: 'Xe Đạp Đua (Road)' },
    { key: 'touring', label: 'Xe Đạp Touring' },
    { key: 'ebike', label: 'Xe Trợ Lực Điện', highlight: true },
    { key: 'kids', label: 'Xe Đạp Trẻ Em' },
    { key: 'folding', label: 'Xe Đạp Gấp' },
    { key: 'accessories', label: 'Phụ Kiện & Phụ Tùng' },
  ];

  const handleCategoryClick = (cat: BikeCategory | 'all') => {
    analytics.logClick('filter_use', `Menu Danh mục: ${cat}`);
    onSelectCategory(cat);
    setMobileMenuOpen(false);
    
    // Scroll smoothly to product grid
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Ticker Bar */}
      <div className="top-ticker">
        <div className="container top-ticker-inner">
          <div className="ticker-items">
            <span className="ticker-item">
              <Truck size={14} color="#f97316" />
              <strong>Freeship toàn quốc</strong> đơn từ 2.000.000đ
            </span>
            <span className="ticker-item" style={{ display: window.innerWidth < 768 ? 'none' : 'inline-flex' }}>
              <ShieldCheck size={14} color="#10b981" />
              <strong>Bảo hành chính hãng 5 năm</strong> - Cân vành trọn đời
            </span>
            <span className="ticker-item" style={{ display: window.innerWidth < 1024 ? 'none' : 'inline-flex' }}>
              <Sparkles size={14} color="#38bdf8" />
              Tặng bộ phụ kiện cao cấp trị giá <strong>850.000đ</strong>
            </span>
          </div>

          <div className="ticker-links">
            <button 
              onClick={() => {
                analytics.logClick('cta_hero', 'Trắc nghiệm chọn size header');
                onOpenSizeQuiz();
              }}
              className="ticker-link"
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f97316', fontWeight: 600 }}
            >
              <Bike size={13} />
              Tư Vấn Chọn Size
            </button>
            <button 
              onClick={() => {
                analytics.logClick('banner', 'Xem hệ thống chi nhánh header');
                onOpenBranches();
              }}
              className="ticker-link"
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <MapPin size={13} />
              4 Showroom Toàn Quốc
            </button>
            <button 
              onClick={onOpenAdmin} 
              className="ticker-link"
              style={{ color: '#94a3b8', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '0.75rem' }}
            >
              Quản Trị /admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <div className="container header-inner">
          {/* Logo Brand */}
          <button onClick={onNavigateHome} className="logo-brand" title="Về trang chủ Demo Xe Đạp">
            <div className="logo-icon-box">
              <Bike size={24} strokeWidth={2.5} />
            </div>
            <div>
              DEMO <span>XE ĐẠP</span>
            </div>
          </button>

          {/* Search Box */}
          <div className="header-search">
            <div className="search-input-wrap">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Tìm xe Giant, Trek, Twitter, địa hình, xe đua..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => analytics.logClick('filter_use', 'Tìm kiếm trên Header')}
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  style={{ position: 'absolute', right: '12px', color: '#94a3b8' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="header-actions">
            <a 
              href="tel:19008888" 
              className="header-action-btn"
              onClick={() => analytics.logClick('hotline', 'Gọi Hotline Header 1900 8888')}
              style={{ display: window.innerWidth < 768 ? 'none' : 'flex' }}
            >
              <PhoneCall size={18} color="#f97316" />
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Hotline 24/7</span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>1900 8888</span>
              </div>
            </a>

            <button 
              onClick={() => {
                analytics.logClick('cta_hero', 'Xem showroom header');
                onOpenBranches();
              }} 
              className="header-action-btn"
              style={{ display: window.innerWidth < 1024 ? 'none' : 'flex' }}
            >
              <MapPin size={18} color="#0284c7" />
              <span>Cửa Hàng</span>
            </button>

            {/* Cart Button */}
            <button 
              onClick={() => {
                analytics.logClick('add_to_cart', 'Mở Giỏ Hàng Header');
                onOpenCart();
              }} 
              className="header-action-btn"
              style={{ background: '#f1f5f9' }}
            >
              <ShoppingBag size={20} color="#0f172a" />
              <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>Giỏ Hàng</span>
              {cartCount > 0 && <span className="cart-counter">{cartCount}</span>}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="header-action-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ display: window.innerWidth >= 1024 ? 'none' : 'flex' }}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mega Menu Bar (Desktop) */}
        <div className="mega-menu-bar" style={{ display: window.innerWidth < 1024 ? 'none' : 'block' }}>
          <div className="container">
            <ul className="mega-menu-list">
              {categories.map((cat) => (
                <li key={cat.key} className="mega-menu-item">
                  <button
                    onClick={() => handleCategoryClick(cat.key)}
                    className={`mega-menu-link ${selectedCategory === cat.key ? 'active' : ''} ${cat.highlight ? 'highlight' : ''}`}
                  >
                    {cat.highlight && <Flame size={14} color="#f97316" />}
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div style={{ background: '#0f172a', color: '#ffffff', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f97316', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Danh Mục Sản Phẩm
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                  style={{
                    textAlign: 'left',
                    padding: '0.65rem',
                    background: selectedCategory === cat.key ? 'rgba(249, 115, 22, 0.2)' : 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    color: selectedCategory === cat.key ? '#f97316' : '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 600
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button 
                onClick={() => { onOpenSizeQuiz(); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', color: '#38bdf8', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Bike size={16} /> Hướng Dẫn Chọn Size Chuẩn
              </button>
              <button 
                onClick={() => { onOpenBranches(); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', color: '#f8fafc', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <MapPin size={16} /> Xem 4 Showroom Trực Tiếp
              </button>
              <button 
                onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', color: '#94a3b8', fontSize: '0.85rem' }}
              >
                Trang Quản Trị (/admin)
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
