import React from 'react';
import { Home, Grid, MapPin, ShoppingBag, ArrowUp } from 'lucide-react';
import { analytics } from '../../services/analytics';

interface MobileBottomNavProps {
  cartCount: number;
  onNavigateHome: () => void;
  onOpenCategories: () => void;
  onOpenBranches: () => void;
  onOpenCart: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  onNavigateHome,
  onOpenCategories,
  onOpenBranches,
  onOpenCart
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    analytics.logClick('filter_use', 'Bấm nút Lên Đầu Trang trên Mobile');
  };

  return (
    <nav className="mobile-bottom-nav">
      <button 
        onClick={() => {
          analytics.logClick('cta_hero', 'Bấm Trang Chủ Mobile Nav');
          onNavigateHome();
        }}
        className="mobile-nav-item active"
      >
        <Home size={20} />
        <span>Trang Chủ</span>
      </button>

      <button 
        onClick={() => {
          analytics.logClick('filter_use', 'Bấm Danh Mục Mobile Nav');
          onOpenCategories();
        }}
        className="mobile-nav-item"
      >
        <Grid size={20} />
        <span>Danh Mục</span>
      </button>

      <button 
        onClick={() => {
          analytics.logClick('banner', 'Bấm Showroom Mobile Nav');
          onOpenBranches();
        }}
        className="mobile-nav-item"
      >
        <MapPin size={20} />
        <span>Showroom</span>
      </button>

      <button 
        onClick={() => {
          analytics.logClick('add_to_cart', 'Bấm Giỏ Hàng Mobile Nav');
          onOpenCart();
        }}
        className="mobile-nav-item"
      >
        <div style={{ position: 'relative' }}>
          <ShoppingBag size={20} />
          {cartCount > 0 && <span className="cart-counter" style={{ top: '-6px', right: '-8px' }}>{cartCount}</span>}
        </div>
        <span>Giỏ Hàng</span>
      </button>

      <button onClick={scrollToTop} className="mobile-nav-item">
        <ArrowUp size={20} />
        <span>Lên Đầu</span>
      </button>
    </nav>
  );
};
