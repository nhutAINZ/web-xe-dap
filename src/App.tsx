import React, { useState, useEffect } from 'react';
import { 
  Product, BikeCategory, CartItem, UserSession, Article, StoreBranch, Order 
} from './types';
import { db } from './services/db';
import { auth } from './services/auth';
import { analytics } from './services/analytics';

// Storefront Components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { FloatingContact } from './components/common/FloatingContact';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { PromoPopup } from './components/common/PromoPopup';
import { BranchModal } from './components/common/BranchModal';
import { CinematicHero } from './components/hero/CinematicHero';
import { StoryChapterSection } from './components/hero/StoryChapterSection';
import { ProductGrid } from './components/shop/ProductGrid';
import { QuickViewModal } from './components/shop/QuickViewModal';
import { BikeSizingModal } from './components/shop/BikeSizingModal';
import { BrandShowcase } from './components/shop/BrandShowcase';
import { BlogSection } from './components/shop/BlogSection';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { ProductDetailPage } from './pages/storefront/ProductDetailPage';
import { StaticPages } from './pages/storefront/StaticPages';

// Admin Components
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminPOS } from './pages/admin/AdminPOS';
import { AdminCRM } from './pages/admin/AdminCRM';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminCMS } from './pages/admin/AdminCMS';
import { AdminAudit } from './pages/admin/AdminAudit';

export const App: React.FC = () => {
  // App Data State from Database
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState(db.getBanners());
  const [chapters, setChapters] = useState(db.getStoryChapters());
  const [branches, setBranches] = useState<StoreBranch[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [vouchers, setVouchers] = useState(db.getVouchers());
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState(db.getCustomers());

  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<'storefront' | 'product_detail' | 'static_page' | 'admin'>('storefront');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [staticPageKey, setStaticPageKey] = useState<string>('about');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Storefront Filter States
  const [selectedCategory, setSelectedCategory] = useState<BikeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart State (Persisted in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dxd_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal Dialogs
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSizeQuizOpen, setIsSizeQuizOpen] = useState(false);
  const [isBranchesOpen, setIsBranchesOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutVoucher, setCheckoutVoucher] = useState<string | undefined>();
  const [checkoutDiscount, setCheckoutDiscount] = useState<number>(0);

  // Admin States
  const [currentUser, setCurrentUser] = useState<UserSession | null>(auth.getCurrentUser());
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // Load / Refresh Data
  const refreshData = () => {
    setProducts(db.getProducts());
    setBanners(db.getBanners());
    setChapters(db.getStoryChapters());
    setBranches(db.getBranches());
    setArticles(db.getArticles());
    setVouchers(db.getVouchers());
    setOrders(db.getOrders());
    setCustomers(db.getCustomers());
  };

  useEffect(() => {
    refreshData();

    // Check URL hash for admin navigation e.g. #admin
    if (window.location.hash === '#admin' || window.location.pathname.includes('admin')) {
      setViewMode('admin');
    }
  }, []);

  // Save Cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dxd_cart_v2', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Cart Operations
  const handleAddToCart = (product: Product, selectedColor?: string, selectedSize?: string) => {
    const v = product.variants[0] || { colorName: 'Tiêu chuẩn', sizes: ['Tiêu chuẩn'] };
    const color = selectedColor || v.colorName;
    const size = selectedSize || v.sizes[0] || 'Tiêu chuẩn';

    setCartItems(prev => {
      const idx = prev.findIndex(
        item => item.productId === product.id && item.selectedColor === color && item.selectedSize === size
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            productName: product.name,
            thumbnail: product.thumbnail,
            price: product.salePrice,
            quantity: 1,
            selectedColor: color,
            selectedSize: size,
            maxStock: product.stock
          }
        ];
      }
    });

    setIsCartDrawerOpen(true);
  };

  const handleUpdateCartQty = (productId: string, color: string, size: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.productId === productId && item.selectedColor === color && item.selectedSize === size) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (productId: string, color: string, size: string) => {
    setCartItems(prev => prev.filter(
      item => !(item.productId === productId && item.selectedColor === color && item.selectedSize === size)
    ));
  };

  const handleProceedCheckout = (voucherCode?: string, discountAmt?: number) => {
    setCheckoutVoucher(voucherCode);
    setCheckoutDiscount(discountAmt || 0);
    setIsCartDrawerOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setCartItems([]);
    refreshData();
  };

  // Navigation Handlers
  const handleNavigateHome = () => {
    setViewMode('storefront');
    setSelectedProduct(null);
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProductDetail = (p: Product) => {
    setSelectedProduct(p);
    setViewMode('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadArticle = (art: Article) => {
    setSelectedArticle(art);
    setStaticPageKey('article');
    setViewMode('static_page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStaticPage = (key: string) => {
    setStaticPageKey(key);
    setSelectedArticle(null);
    setViewMode('static_page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToShop = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Total Cart Items Count
  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  // ================= ADMIN PORTAL VIEW =================
  if (viewMode === 'admin') {
    if (!currentUser) {
      return (
        <AdminLogin
          onLoginSuccess={(user) => setCurrentUser(user)}
          onBackToStore={handleNavigateHome}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={setAdminTab}
        currentUser={currentUser}
        onLogout={() => {
          auth.logout();
          setCurrentUser(null);
        }}
        onViewStorefront={handleNavigateHome}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            products={products}
            orders={orders}
            customers={customers}
            onNavigateTab={setAdminTab}
          />
        )}
        {adminTab === 'pos' && (
          <AdminPOS
            products={products}
            customers={customers}
            onOrderCreated={refreshData}
          />
        )}
        {adminTab === 'orders' && (
          <AdminOrders
            orders={orders}
            onRefresh={refreshData}
          />
        )}
        {adminTab === 'products' && (
          <AdminProducts
            products={products}
            onRefresh={refreshData}
          />
        )}
        {adminTab === 'crm' && (
          <AdminCRM
            customers={customers}
            orders={orders}
            onRefresh={refreshData}
          />
        )}
        {adminTab === 'analytics' && (
          <AdminAnalytics />
        )}
        {adminTab === 'cms' && (
          <AdminCMS
            banners={banners}
            chapters={chapters}
            articles={articles}
            vouchers={vouchers}
            onRefresh={refreshData}
          />
        )}
        {adminTab === 'audit' && (
          <AdminAudit />
        )}
      </AdminLayout>
    );
  }

  // ================= STOREFRONT VIEWS =================
  return (
    <div className="storefront-app">
      {/* Global Header */}
      <Header
        cartCount={cartCount}
        onOpenCart={() => setIsCartDrawerOpen(true)}
        onOpenBranches={() => setIsBranchesOpen(true)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigateHome={handleNavigateHome}
        onOpenSizeQuiz={() => setIsSizeQuizOpen(true)}
        onOpenAdmin={() => setViewMode('admin')}
      />

      {/* Main Content Router */}
      <main>
        {viewMode === 'product_detail' && selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            onBack={handleNavigateHome}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleViewProductDetail}
          />
        ) : viewMode === 'static_page' ? (
          <StaticPages
            pageKey={staticPageKey}
            article={selectedArticle}
            branches={branches}
            onBack={handleNavigateHome}
          />
        ) : (
          /* Storefront Homepage */
          <>
            {/* 1. Cinematic Hero TVC Intro */}
            <CinematicHero
              banners={banners}
              onOpenSizeQuiz={() => setIsSizeQuizOpen(true)}
              onExploreProducts={handleScrollToShop}
            />

            {/* 2. Storytelling Chapters Section (xedapvietnam style) */}
            <StoryChapterSection
              chapters={chapters}
              onScrollToShop={handleScrollToShop}
            />

            {/* 3. E-Commerce Product Grid Section (xedapgiakho style) */}
            <ProductGrid
              products={products}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onQuickView={(p) => setQuickViewProduct(p)}
              onAddToCart={(p) => handleAddToCart(p)}
              onViewDetail={handleViewProductDetail}
              onOpenSizeQuiz={() => setIsSizeQuizOpen(true)}
            />

            {/* 4. Brand Showcase & 4 Core Guarantees */}
            <BrandShowcase
              onSelectBrand={(b) => {
                setSearchQuery(b);
              }}
            />

            {/* 5. Cycling Lifestyle & Blog Articles */}
            <BlogSection
              articles={articles}
              onReadArticle={handleReadArticle}
            />
          </>
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onOpenBranches={() => setIsBranchesOpen(true)}
        onOpenStaticPage={handleOpenStaticPage}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleNavigateHome();
          setTimeout(handleScrollToShop, 100);
        }}
      />

      {/* Floating Contact Buttons (Zalo, Hotline, Messenger) */}
      <FloatingContact />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        cartCount={cartCount}
        onNavigateHome={handleNavigateHome}
        onOpenCategories={() => {
          handleNavigateHome();
          setTimeout(handleScrollToShop, 100);
        }}
        onOpenBranches={() => setIsBranchesOpen(true)}
        onOpenCart={() => setIsCartDrawerOpen(true)}
      />

      {/* Promo Voucher Popup */}
      <PromoPopup />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onViewFullDetail={handleViewProductDetail}
      />

      {/* Bike Sizing Guide & Recommendation Modal */}
      <BikeSizingModal
        isOpen={isSizeQuizOpen}
        onClose={() => setIsSizeQuizOpen(false)}
        products={products}
        onSelectProduct={handleViewProductDetail}
      />

      {/* Showroom Locator Modal */}
      <BranchModal
        isOpen={isBranchesOpen}
        onClose={() => setIsBranchesOpen(false)}
        branches={branches}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedCheckout={handleProceedCheckout}
      />

      {/* 1-Step Checkout Modal with VietQR */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cartItems={cartItems}
        voucherCode={checkoutVoucher}
        discountAmount={checkoutDiscount}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
};
