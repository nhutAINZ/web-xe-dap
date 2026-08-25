import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  Product, BikeCategory, CartItem, UserSession, Article, StoreBranch, Order 
} from './types';
import { db } from './services/db';
import { auth } from './services/auth';
import { analytics } from './services/analytics';

// Core Critical Above-The-Fold Storefront Components (Eager loaded)
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { FloatingContact } from './components/common/FloatingContact';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { CinematicHero } from './components/hero/CinematicHero';
import { StoryChapterSection } from './components/hero/StoryChapterSection';
import { ProductGrid } from './components/shop/ProductGrid';
import { BrandShowcase } from './components/shop/BrandShowcase';
import { BlogSection } from './components/shop/BlogSection';
import { CartDrawer } from './components/cart/CartDrawer';
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';

// Async Lazy Loaded Modals (Loaded on demand to speed up initial bundle & FCP)
const PromoPopup = lazy(() => import('./components/common/PromoPopup').then(m => ({ default: m.PromoPopup })));
const BranchModal = lazy(() => import('./components/common/BranchModal').then(m => ({ default: m.BranchModal })));
const QuickViewModal = lazy(() => import('./components/shop/QuickViewModal').then(m => ({ default: m.QuickViewModal })));
const BikeSizingModal = lazy(() => import('./components/shop/BikeSizingModal').then(m => ({ default: m.BikeSizingModal })));
const CheckoutModal = lazy(() => import('./components/cart/CheckoutModal').then(m => ({ default: m.CheckoutModal })));
const ProductDetailPage = lazy(() => import('./pages/storefront/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const StaticPages = lazy(() => import('./pages/storefront/StaticPages').then(m => ({ default: m.StaticPages })));

// Async Lazy Loaded Admin Sub-modules
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts').then(m => ({ default: m.AdminProducts })));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders').then(m => ({ default: m.AdminOrders })));
const AdminPOS = lazy(() => import('./pages/admin/AdminPOS').then(m => ({ default: m.AdminPOS })));
const AdminCRM = lazy(() => import('./pages/admin/AdminCRM').then(m => ({ default: m.AdminCRM })));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics').then(m => ({ default: m.AdminAnalytics })));
const AdminCMS = lazy(() => import('./pages/admin/AdminCMS').then(m => ({ default: m.AdminCMS })));
const AdminGitSync = lazy(() => import('./pages/admin/AdminGitSync').then(m => ({ default: m.AdminGitSync })));
const AdminAudit = lazy(() => import('./pages/admin/AdminAudit').then(m => ({ default: m.AdminAudit })));

const FallbackLoader: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', width: '100%' }}>
    <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: '#f97316', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
  </div>
);

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
        <Suspense fallback={<FallbackLoader />}>
          <AdminLogin
            onLoginSuccess={(user) => setCurrentUser(user)}
            onBackToStore={handleNavigateHome}
          />
        </Suspense>
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
        <Suspense fallback={<FallbackLoader />}>
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
              branches={branches}
              onRefresh={refreshData}
            />
          )}
          {adminTab === 'gitsync' && (
            <AdminGitSync onRefresh={refreshData} />
          )}
          {adminTab === 'audit' && (
            <AdminAudit />
          )}
        </Suspense>
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
        <Suspense fallback={<FallbackLoader />}>
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
        </Suspense>
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

      {/* Async Lazy Loaded Modals */}
      <Suspense fallback={null}>
        {/* Promo Voucher Popup */}
        <PromoPopup />

        {/* Quick View Modal */}
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            onAddToCart={handleAddToCart}
            onViewFullDetail={handleViewProductDetail}
          />
        )}

        {/* Bike Sizing Guide & Recommendation Modal */}
        {isSizeQuizOpen && (
          <BikeSizingModal
            isOpen={isSizeQuizOpen}
            onClose={() => setIsSizeQuizOpen(false)}
            products={products}
            onSelectProduct={handleViewProductDetail}
          />
        )}

        {/* Showroom Locator Modal */}
        {isBranchesOpen && (
          <BranchModal
            isOpen={isBranchesOpen}
            onClose={() => setIsBranchesOpen(false)}
            branches={branches}
          />
        )}

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
        {isCheckoutModalOpen && (
          <CheckoutModal
            isOpen={isCheckoutModalOpen}
            onClose={() => setIsCheckoutModalOpen(false)}
            cartItems={cartItems}
            voucherCode={checkoutVoucher}
            discountAmount={checkoutDiscount}
            onOrderSuccess={handleOrderSuccess}
          />
        )}
      </Suspense>
    </div>
  );
};
