import React, { useState } from 'react';
import { 
  Search, ShoppingBag, PhoneCall, MapPin, Menu, X, 
  ChevronDown, Flame, Bike, ShieldCheck, Truck, Sparkles, Command 
} from 'lucide-react';
import { BikeCategory } from '../../types';
import { analytics } from '../../services/analytics';
import { BrandLogo } from './BrandLogo';

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
    { key: 'all', label: 'Tất Cả Dòng Xe' },
    { key: 'mtb', label: 'Xe Địa Hình (MTB)', highlight: true },
    { key: 'road', label: 'Xe Đua (Road)' },
    { key: 'touring', label: 'Xe Touring Phượt' },
    { key: 'ebike', label: 'Xe Trợ Lực Điện', highlight: true },
    { key: 'kids', label: 'Xe Trẻ Em' },
    { key: 'folding', label: 'Xe Gấp Gọn' },
    { key: 'accessories', label: 'Phụ Kiện Chính Hãng' },
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
              <Truck size={13} color="#f97316" />
              <span><strong>Freeship</strong> toàn quốc đơn từ 2.000.000đ</span>
            </span>
            <span className="ticker-item" style={{ display: window.innerWidth < 768 ? 'none' : 'inline-flex' }}>
              <ShieldCheck size={13} color="#10b981" />
              <span><strong>Bảo hành 5 năm</strong> • Cân vành trọn đời</span>
            </span>
            <span className="ticker-item" style={{ display: window.innerWidth < 1024 ? 'none' : 'inline-flex' }}>
              <Sparkles size={13} color="#38bdf8" />
              <span>Tặng quà phụ kiện <strong>850.000đ</strong> khi đặt trực tuyến</span>
            </span>
          </div>

          <div className="ticker-links">
            <button 
              onClick={() => {
                analytics.logClick('cta_hero', 'Trắc nghiệm chọn size header');
                onOpenSizeQuiz();
              }}
              className="ticker-link"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#f97316', fontWeight: 700 }}
            >
              <Bike size={13} />
              Tư Vấn Size
            </button>
            <button 
              onClick={() => {
                analytics.logClick('banner', 'Xem hệ thống chi nhánh header');
                onOpenBranches();
              }}
              className="ticker-link"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
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

      {/* Main Unified Dark Glass Header */}
      <header className="main-header">
        <div className="container header-inner">
          {/* Logo Brand */}
          <button onClick={onNavigateHome} className="logo-brand-btn" title="Về trang chủ Demo Xe Đạp">
            <BrandLogo size="md" />
          </button>

          {/* Luxury Search Box */}
          <div className="header-search">
            <div className="search-input-wrap">
              <Search className="search-icon" size={17} />
              <input
                type="text"
                className="search-input"
                placeholder="Tìm xe Giant, Trek, Twitter, địa hình, phụ kiện..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => analytics.logClick('filter_use', 'Tìm kiếm trên Header')}
              />
              {searchQuery ? (
                <button 
                  onClick={() => onSearchChange('')}
                  style={{ position: 'absolute', right: '12px', color: '#94a3b8', background: 'transparent' }}
                >
                  <X size={15} />
                </button>
              ) : (
                <div className="search-hotkey-badge">
                  <Command size={11} /> K
                </div>
              )}
            </div>
          </div>

          {/* Header Action Badges */}
          <div className="header-actions">
            <a 
              href="tel:19008888" 
              className="header-action-badge hotline-badge"
              onClick={() => analytics.logClick('hotline', 'Gọi Hotline Header 1900 8888')}
              style={{ display: window.innerWidth < 768 ? 'none' : 'flex' }}
            >
              <div className="pulse-indicator-dot" />
              <PhoneCall size={16} color="#f97316" />
              <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hotline 24/7</span>
                <strong style={{ fontSize: '0.85rem', color: '#ffffff', letterSpacing: '0.02em' }}>1900 8888</strong>
              </div>
            </a>

            <button 
              onClick={() => {
                analytics.logClick('cta_hero', 'Xem showroom header');
                onOpenBranches();
              }} 
              className="header-action-badge showroom-badge"
              style={{ display: window.innerWidth < 1024 ? 'none' : 'flex' }}
            >
              <MapPin size={16} color="#38bdf8" />
              <span>4 Showroom</span>
            </button>

            {/* Cart Button with Radiant Counter */}
            <button 
              onClick={() => {
                analytics.logClick('add_to_cart', 'Mở Giỏ Hàng Header');
                onOpenCart();
              }} 
              className="header-action-badge cart-badge-btn"
            >
              <ShoppingBag size={18} color="#ffffff" />
              <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline', color: '#ffffff', fontWeight: 700 }}>Giỏ Hàng</span>
              {cartCount > 0 && <span className="cart-counter-glow">{cartCount}</span>}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="header-action-badge mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ display: window.innerWidth >= 1024 ? 'none' : 'flex' }}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} color="#ffffff" /> : <Menu size={20} color="#ffffff" />}
            </button>
          </div>
        </div>

        {/* Mega Menu / Category Ribbon Bar */}
        <nav className="mega-menu-bar">
          <div className="container">
            <ul className="mega-menu-list">
              {categories.map((c) => (
                <li key={c.key} className="mega-menu-item">
                  <button
                    onClick={() => handleCategoryClick(c.key)}
                    className={`mega-menu-link ${selectedCategory === c.key ? 'active' : ''}`}
                  >
                    {c.highlight && <Flame size={13} color="#f97316" />}
                    <span>{c.label}</span>
                    {selectedCategory === c.key && <span className="active-beam" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <BrandLogo size="sm" />
              <button onClick={() => setMobileMenuOpen(false)} style={{ color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <div className="mobile-drawer-body">
              <div className="mobile-menu-section-title">Danh Mục Dòng Xe</div>
              <div className="mobile-cat-list">
                {categories.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => handleCategoryClick(c.key)}
                    className={`mobile-cat-item ${selectedCategory === c.key ? 'active' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {c.highlight && <Flame size={15} color="#f97316" />}
                      <span>{c.label}</span>
                    </div>
                    {selectedCategory === c.key && <span style={{ color: '#f97316' }}>●</span>}
                  </button>
                ))}
              </div>

              <div className="mobile-menu-section-title" style={{ marginTop: '1.5rem' }}>Tiện Ích & Hỗ Trợ</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button 
                  onClick={() => { setMobileMenuOpen(false); onOpenSizeQuiz(); }}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.65rem 1rem' }}
                >
                  <Bike size={16} color="#f97316" />
                  <span>Trắc Nghiệm Chọn Size Xe Chuẩn</span>
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); onOpenBranches(); }}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.65rem 1rem' }}
                >
                  <MapPin size={16} color="#38bdf8" />
                  <span>Hệ Thống 4 Showroom Trải Nghiệm</span>
                </button>
                <a 
                  href="tel:19008888"
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', textDecoration: 'none', justifyContent: 'center', marginTop: '0.5rem' }}
                >
                  <PhoneCall size={16} />
                  <span>Gọi Hotline 1900 8888 (Tư Vấn)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
