import { 
  Product, HeroBanner, StoryChapter, StoreBranch, Article, Voucher, Customer, Order, ClickEvent, OrderStatus, PaymentMethod 
} from '../types';
import { 
  INITIAL_PRODUCTS, INITIAL_BANNERS, STORY_CHAPTERS, INITIAL_BRANCHES, 
  INITIAL_ARTICLES, INITIAL_VOUCHERS, INITIAL_CUSTOMERS, INITIAL_ORDERS 
} from './seedData';

const STORAGE_KEYS = {
  PRODUCTS: 'dxd_products_v2',
  BANNERS: 'dxd_banners_v2',
  CHAPTERS: 'dxd_chapters_v2',
  BRANCHES: 'dxd_branches_v2',
  ARTICLES: 'dxd_articles_v2',
  VOUCHERS: 'dxd_vouchers_v2',
  CUSTOMERS: 'dxd_customers_v2',
  ORDERS: 'dxd_orders_v2',
  CLICKS: 'dxd_clicks_v2',
  AUDIT_LOGS: 'dxd_audit_logs_v2'
};

function getStored<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export interface AuditLogEntry {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export const db = {
  // PRODUCTS
  getProducts(): Product[] {
    return getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  },

  getProductBySlug(slug: string): Product | undefined {
    return this.getProducts().find(p => p.slug === slug);
  },

  saveProduct(product: Product, user = 'Admin'): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
      this.logAudit(user, 'Chỉnh sửa sản phẩm', product.name);
    } else {
      products.unshift(product);
      this.logAudit(user, 'Thêm mới sản phẩm', product.name);
    }
    setStored(STORAGE_KEYS.PRODUCTS, products);
  },

  deleteProduct(id: string, user = 'Admin'): boolean {
    const products = this.getProducts();
    const p = products.find(i => i.id === id);
    const filtered = products.filter(i => i.id !== id);
    if (filtered.length !== products.length) {
      setStored(STORAGE_KEYS.PRODUCTS, filtered);
      this.logAudit(user, 'Xóa sản phẩm', p ? p.name : id);
      return true;
    }
    return false;
  },

  // BANNERS
  getBanners(): HeroBanner[] {
    return getStored<HeroBanner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
  },

  saveBanner(banner: HeroBanner, user = 'Admin'): void {
    const banners = this.getBanners();
    const index = banners.findIndex(b => b.id === banner.id);
    if (index >= 0) {
      banners[index] = banner;
      this.logAudit(user, 'Chỉnh sửa Banner Hero', banner.title);
    } else {
      banners.push(banner);
      this.logAudit(user, 'Thêm mới Banner Hero', banner.title);
    }
    setStored(STORAGE_KEYS.BANNERS, banners);
  },

  // STORY CHAPTERS
  getStoryChapters(): StoryChapter[] {
    return getStored<StoryChapter[]>(STORAGE_KEYS.CHAPTERS, STORY_CHAPTERS);
  },

  saveStoryChapter(chapter: StoryChapter, user = 'Admin'): void {
    const chapters = this.getStoryChapters();
    const idx = chapters.findIndex(c => c.id === chapter.id);
    if (idx >= 0) {
      chapters[idx] = chapter;
      setStored(STORAGE_KEYS.CHAPTERS, chapters);
      this.logAudit(user, 'Chỉnh sửa Story Chapter', chapter.title);
    }
  },

  // ORDERS
  getOrders(): Order[] {
    return getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderCode' | 'createdAt' | 'updatedAt'>, createdBy = 'customer'): Order {
    const orders = this.getOrders();
    const now = new Date();
    const code = `DXD-${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1).toString().padStart(2, '0')}-${(orders.length + 1001).toString()}`;
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      orderCode: code,
      createdAt: now.toLocaleString('vi-VN'),
      updatedAt: now.toLocaleString('vi-VN'),
      createdBy
    };

    orders.unshift(newOrder);
    setStored(STORAGE_KEYS.ORDERS, orders);

    // Update customer stats or create customer
    this.recordCustomerOrder(newOrder);

    // Deduct stock for ordered items
    this.updateProductStockForOrder(newOrder);

    this.logAudit(createdBy, 'Tạo đơn hàng mới', `${newOrder.orderCode} (${newOrder.total.toLocaleString()}đ)`);
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: OrderStatus, user = 'Admin'): void {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toLocaleString('vi-VN');
      if (status === 'completed') {
        order.paymentStatus = 'paid';
      }
      setStored(STORAGE_KEYS.ORDERS, orders);
      this.logAudit(user, 'Cập nhật trạng thái đơn hàng', `${order.orderCode} -> ${status}`);
    }
  },

  updateProductStockForOrder(order: Order): void {
    const products = this.getProducts();
    let changed = false;
    order.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        prod.soldCount = (prod.soldCount || 0) + item.quantity;
        changed = true;
      }
    });
    if (changed) {
      setStored(STORAGE_KEYS.PRODUCTS, products);
    }
  },

  recordCustomerOrder(order: Order): void {
    const customers = this.getCustomers();
    let cust = customers.find(c => c.phone === order.customerPhone);
    const now = new Date().toISOString().split('T')[0];
    if (cust) {
      cust.totalSpent += order.total;
      cust.orderCount += 1;
      if (cust.totalSpent >= 30000000) cust.tier = 'Kim Cương';
      else if (cust.totalSpent >= 10000000) cust.tier = 'Vàng';
    } else {
      let tier: Customer['tier'] = 'Bạc';
      if (order.total >= 30000000) tier = 'Kim Cương';
      else if (order.total >= 10000000) tier = 'Vàng';

      cust = {
        id: 'cust-' + Date.now(),
        name: order.customerName,
        phone: order.customerPhone,
        email: order.customerEmail || '',
        address: order.shippingAddress,
        city: order.city,
        district: order.district,
        totalSpent: order.total,
        orderCount: 1,
        tier,
        createdAt: now
      };
      customers.unshift(cust);
    }
    setStored(STORAGE_KEYS.CUSTOMERS, customers);
  },

  // CUSTOMERS
  getCustomers(): Customer[] {
    return getStored<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  },

  saveCustomer(customer: Customer, user = 'Admin'): void {
    const customers = this.getCustomers();
    const idx = customers.findIndex(c => c.id === customer.id);
    if (idx >= 0) {
      customers[idx] = customer;
      this.logAudit(user, 'Cập nhật thông tin khách hàng', customer.name);
    } else {
      customers.unshift(customer);
      this.logAudit(user, 'Thêm mới khách hàng', customer.name);
    }
    setStored(STORAGE_KEYS.CUSTOMERS, customers);
  },

  // VOUCHERS
  getVouchers(): Voucher[] {
    return getStored<Voucher[]>(STORAGE_KEYS.VOUCHERS, INITIAL_VOUCHERS);
  },

  getVoucherByCode(code: string): Voucher | undefined {
    const clean = code.trim().toUpperCase();
    return this.getVouchers().find(v => v.code.toUpperCase() === clean && v.isActive);
  },

  saveVoucher(voucher: Voucher, user = 'Admin'): void {
    const vouchers = this.getVouchers();
    const idx = vouchers.findIndex(v => v.code === voucher.code);
    if (idx >= 0) vouchers[idx] = voucher;
    else vouchers.unshift(voucher);
    setStored(STORAGE_KEYS.VOUCHERS, vouchers);
    this.logAudit(user, 'Cập nhật Voucher', voucher.code);
  },

  // BRANCHES
  getBranches(): StoreBranch[] {
    return getStored<StoreBranch[]>(STORAGE_KEYS.BRANCHES, INITIAL_BRANCHES);
  },

  saveBranch(branch: StoreBranch, user = 'Admin'): void {
    const branches = this.getBranches();
    const idx = branches.findIndex(b => b.id === branch.id);
    if (idx >= 0) branches[idx] = branch;
    else branches.unshift(branch);
    setStored(STORAGE_KEYS.BRANCHES, branches);
    this.logAudit(user, 'Lưu chi nhánh Showroom', branch.name);
  },

  deleteBranch(branchId: string, user = 'Admin'): void {
    let branches = this.getBranches();
    const b = branches.find(item => item.id === branchId);
    branches = branches.filter(item => item.id !== branchId);
    setStored(STORAGE_KEYS.BRANCHES, branches);
    if (b) this.logAudit(user, 'Xóa chi nhánh Showroom', b.name);
  },

  deleteVoucher(code: string, user = 'Admin'): void {
    let vouchers = this.getVouchers();
    vouchers = vouchers.filter(v => v.code !== code);
    setStored(STORAGE_KEYS.VOUCHERS, vouchers);
    this.logAudit(user, 'Xóa voucher', code);
  },

  deleteArticle(id: string, user = 'Admin'): void {
    let articles = this.getArticles();
    const a = articles.find(item => item.id === id);
    articles = articles.filter(item => item.id !== id);
    setStored(STORAGE_KEYS.ARTICLES, articles);
    if (a) this.logAudit(user, 'Xóa bài viết', a.title);
  },

  // DATA EXPORT FOR GIT & BACKUP
  exportFullDatabaseJSON(): string {
    const data = {
      products: this.getProducts(),
      banners: this.getBanners(),
      storyChapters: this.getStoryChapters(),
      branches: this.getBranches(),
      articles: this.getArticles(),
      vouchers: this.getVouchers(),
      customers: this.getCustomers(),
      orders: this.getOrders(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  },

  // ARTICLES
  getArticles(): Article[] {
    return getStored<Article[]>(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
  },

  getArticleBySlug(slug: string): Article | undefined {
    return this.getArticles().find(a => a.slug === slug);
  },

  saveArticle(article: Article, user = 'Admin'): void {
    const articles = this.getArticles();
    const idx = articles.findIndex(a => a.id === article.id);
    if (idx >= 0) articles[idx] = article;
    else articles.unshift(article);
    setStored(STORAGE_KEYS.ARTICLES, articles);
    this.logAudit(user, 'Lưu bài viết Blog', article.title);
  },

  // AUDIT LOG
  logAudit(user: string, action: string, target: string): void {
    const logs = getStored<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    const entry: AuditLogEntry = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      user,
      action,
      target,
      timestamp: new Date().toLocaleString('vi-VN')
    };
    logs.unshift(entry);
    // Keep max 200 logs
    setStored(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 200));
  },

  getAuditLogs(): AuditLogEntry[] {
    return getStored<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, []);
  },

  // RESET TO DEFAULT
  resetDatabase(): void {
    localStorage.clear();
    window.location.reload();
  }
};
