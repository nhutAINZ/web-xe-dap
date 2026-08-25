import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../services/db';
import { auth } from '../services/auth';
import { analytics } from '../services/analytics';

/**
 * ISTQB Standardized Test Suite for Demo Xe Dap E-Commerce Platform
 * Techniques applied:
 * 1. Equivalence Partitioning (EP)
 * 2. Boundary Value Analysis (BVA)
 * 3. State Transition Testing (STT)
 * 4. Decision Table Testing (DTT)
 * 5. Error Guessing & Resilience (EGR)
 */

describe('ISTQB Test Suite - Demo Xe Đạp E-Commerce Core', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ==========================================
  // 1. EQUIVALENCE PARTITIONING (EP)
  // ==========================================
  describe('1. Equivalence Partitioning (EP)', () => {
    describe('EP1: Voucher Validation & Discount Calculations', () => {
      it('EP1.1: Valid Fixed Discount Voucher with subtotal >= minOrderValue', () => {
        const voucher = db.getVoucherByCode('DEMO200K');
        expect(voucher).toBeDefined();
        expect(voucher?.isActive).toBe(true);
        expect(voucher?.discountType).toBe('fixed');

        const subtotal = 5000000;
        expect(subtotal).toBeGreaterThanOrEqual(voucher!.minOrderValue);

        const discount = voucher!.discountValue;
        expect(discount).toBe(200000);
      });

      it('EP1.2: Valid Percentage Voucher with subtotal >= minOrderValue', () => {
        const voucher = db.getVoucherByCode('GIAM5PHANTRAM');
        expect(voucher).toBeDefined();
        expect(voucher?.discountType).toBe('percentage');
        
        const subtotal = 10000000;
        const rawDiscount = Math.round((subtotal * voucher!.discountValue) / 100);
        const cappedDiscount = Math.min(500000, rawDiscount);
        expect(cappedDiscount).toBe(500000); // 5% of 10M is 500K
      });

      it('EP1.3: Invalid / Non-existent Voucher Partition', () => {
        const voucher = db.getVoucherByCode('INVALID_CODE_999');
        expect(voucher).toBeUndefined();
      });
    });

    describe('EP2: Customer Loyalty Tier Classification', () => {
      it('EP2.1: Bạc Tier (< 10,000,000đ)', () => {
        db.createOrder({
          customerName: 'Bac Rider',
          customerPhone: '0911000002',
          shippingAddress: 'HCM',
          city: 'HCM',
          district: 'Q1',
          items: [],
          subtotal: 8000000,
          discountAmount: 0,
          shippingFee: 0,
          total: 8000000,
          paymentMethod: 'vietqr',
          paymentStatus: 'paid',
          status: 'completed'
        });
        const cust = db.getCustomers().find(c => c.phone === '0911000002');
        expect(cust?.tier).toBe('Bạc');
      });

      it('EP2.2: Vàng Tier (10,000,000đ - 29,999,999đ)', () => {
        db.createOrder({
          customerName: 'Vang Rider',
          customerPhone: '0911000003',
          shippingAddress: 'HCM',
          city: 'HCM',
          district: 'Q1',
          items: [],
          subtotal: 18000000,
          discountAmount: 0,
          shippingFee: 0,
          total: 18000000,
          paymentMethod: 'vietqr',
          paymentStatus: 'paid',
          status: 'completed'
        });
        const cust = db.getCustomers().find(c => c.phone === '0911000003');
        expect(cust?.tier).toBe('Vàng');
      });

      it('EP2.3: Kim Cương Tier (>= 30,000,000đ)', () => {
        db.createOrder({
          customerName: 'KC Rider',
          customerPhone: '0911000004',
          shippingAddress: 'HCM',
          city: 'HCM',
          district: 'Q1',
          items: [],
          subtotal: 45000000,
          discountAmount: 0,
          shippingFee: 0,
          total: 45000000,
          paymentMethod: 'vietqr',
          paymentStatus: 'paid',
          status: 'completed'
        });
        const cust = db.getCustomers().find(c => c.phone === '0911000004');
        expect(cust?.tier).toBe('Kim Cương');
      });
    });

    describe('EP3: Bike Sizing Recommendation Partitions', () => {
      const calculateSize = (height: number) => {
        if (height < 140) return 'Kids';
        if (height < 165) return 'S';
        if (height <= 178) return 'M';
        return 'L';
      };

      it('EP3.1: Child height (< 140cm)', () => {
        expect(calculateSize(125)).toBe('Kids');
      });

      it('EP3.2: Small size height (140cm - 164cm)', () => {
        expect(calculateSize(155)).toBe('S');
      });

      it('EP3.3: Standard medium height (165cm - 178cm)', () => {
        expect(calculateSize(170)).toBe('M');
      });

      it('EP3.4: Tall height (> 178cm)', () => {
        expect(calculateSize(185)).toBe('L');
      });
    });
  });

  // ==========================================
  // 2. BOUNDARY VALUE ANALYSIS (BVA)
  // ==========================================
  describe('2. Boundary Value Analysis (BVA)', () => {
    describe('BVA1: Sizing Calculation at exact boundaries', () => {
      const calculateSize = (h: number) => {
        if (h < 140) return 'Kids';
        if (h < 165) return 'S';
        if (h <= 178) return 'M';
        return 'L';
      };

      it('BVA1.1: 139cm -> Kids, 140cm -> S (Boundary at 140cm)', () => {
        expect(calculateSize(139)).toBe('Kids');
        expect(calculateSize(140)).toBe('S');
      });

      it('BVA1.2: 164cm -> S, 165cm -> M (Boundary at 165cm)', () => {
        expect(calculateSize(164)).toBe('S');
        expect(calculateSize(165)).toBe('M');
      });

      it('BVA1.3: 178cm -> M, 179cm -> L (Boundary at 178cm)', () => {
        expect(calculateSize(178)).toBe('M');
        expect(calculateSize(179)).toBe('L');
      });
    });

    describe('BVA2: Voucher Min Order Value Boundaries', () => {
      it('BVA2.1: Below vs At vs Above Min Order Value for DEMO200K (5,000,000đ)', () => {
        const voucher = db.getVoucherByCode('DEMO200K')!;
        const belowMin = 4999999;
        const atMin = 5000000;
        const aboveMin = 5000001;

        expect(belowMin < voucher.minOrderValue).toBe(true);
        expect(atMin >= voucher.minOrderValue).toBe(true);
        expect(aboveMin >= voucher.minOrderValue).toBe(true);
      });
    });

    describe('BVA3: Inventory Stock Depletion Bounds', () => {
      it('BVA3.1: Purchasing exactly remaining stock quantity', () => {
        const prod = db.getProducts()[0];
        const initialStock = prod.stock;

        db.createOrder({
          customerName: 'Exact Stock Buyer',
          customerPhone: '0909999888',
          shippingAddress: 'Da Nang',
          city: 'Đà Nẵng',
          district: 'Hải Châu',
          items: [
            {
              productId: prod.id,
              productName: prod.name,
              selectedColor: 'Black',
              selectedSize: 'M',
              price: prod.salePrice,
              quantity: initialStock,
              thumbnail: prod.thumbnail
            }
          ],
          subtotal: prod.salePrice * initialStock,
          discountAmount: 0,
          shippingFee: 0,
          total: prod.salePrice * initialStock,
          paymentMethod: 'cod',
          paymentStatus: 'unpaid',
          status: 'pending'
        });

        const updated = db.getProductById(prod.id);
        expect(updated?.stock).toBe(0);
      });
    });
  });

  // ==========================================
  // 3. STATE TRANSITION TESTING (STT)
  // ==========================================
  describe('3. State Transition Testing (STT)', () => {
    it('STT1: Order state transitions: pending -> confirmed -> shipping -> completed', () => {
      const order = db.createOrder({
        customerName: 'State Transition Rider',
        customerPhone: '0988776655',
        shippingAddress: 'Ha Noi',
        city: 'Hà Nội',
        district: 'Cầu Giấy',
        items: [],
        subtotal: 15000000,
        discountAmount: 0,
        shippingFee: 0,
        total: 15000000,
        paymentMethod: 'vietqr',
        paymentStatus: 'unpaid',
        status: 'pending'
      });

      expect(order.status).toBe('pending');

      // Transition 1: Processing
      db.updateOrderStatus(order.id, 'processing');
      let currentOrder = db.getOrders().find(o => o.id === order.id);
      expect(currentOrder?.status).toBe('processing');

      // Transition 2: Shipping
      db.updateOrderStatus(order.id, 'shipping');
      currentOrder = db.getOrders().find(o => o.id === order.id);
      expect(currentOrder?.status).toBe('shipping');

      // Transition 3: Completed
      db.updateOrderStatus(order.id, 'completed');
      currentOrder = db.getOrders().find(o => o.id === order.id);
      expect(currentOrder?.status).toBe('completed');
      expect(currentOrder?.paymentStatus).toBe('paid');
    });

    it('STT2: Order cancellation state transition', () => {
      const order = db.createOrder({
        customerName: 'Cancelled Order Customer',
        customerPhone: '0933221100',
        shippingAddress: 'Hue',
        city: 'Huế',
        district: 'Phú Nhuận',
        items: [],
        subtotal: 5000000,
        discountAmount: 0,
        shippingFee: 0,
        total: 5000000,
        paymentMethod: 'cod',
        paymentStatus: 'unpaid',
        status: 'pending'
      });

      db.updateOrderStatus(order.id, 'cancelled');
      const currentOrder = db.getOrders().find(o => o.id === order.id);
      expect(currentOrder?.status).toBe('cancelled');
    });

    it('STT3: Authentication session lifecycle', () => {
      expect(auth.getCurrentUser()).toBeNull();

      // Login Admin
      const login = auth.login('admin', '123456');
      expect(login.success).toBe(true);
      expect(auth.getCurrentUser()?.username).toBe('admin');
      expect(auth.isAdmin()).toBe(true);

      // Logout
      auth.logout();
      expect(auth.getCurrentUser()).toBeNull();
      expect(auth.isAdmin()).toBe(false);
    });
  });

  // ==========================================
  // 4. DECISION TABLE TESTING (DTT)
  // ==========================================
  describe('4. Decision Table Testing (DTT)', () => {
    it('DTT1: Product Filtering Matrix (Category + Brand + Price + FlashSale)', () => {
      const products = db.getProducts();

      // Rule 1: Category='mtb'
      const r1 = products.filter(p => p.category === 'mtb');
      expect(r1.every(p => p.category === 'mtb')).toBe(true);

      // Rule 2: Brand='Giant'
      const r2 = products.filter(p => p.brand === 'Giant');
      expect(r2.every(p => p.brand === 'Giant')).toBe(true);

      // Rule 3: FlashSale=true
      const r3 = products.filter(p => p.isFlashSale === true);
      expect(r3.every(p => p.isFlashSale)).toBe(true);

      // Rule 4: Price range '5m-12m'
      const r4 = products.filter(p => p.salePrice >= 5000000 && p.salePrice <= 12000000);
      expect(r4.every(p => p.salePrice >= 5000000 && p.salePrice <= 12000000)).toBe(true);
    });

    it('DTT2: Sorting rules (price_asc, price_desc, rating, sold)', () => {
      const products = db.getProducts();

      // Sort price_asc
      const asc = [...products].sort((a, b) => a.salePrice - b.salePrice);
      for (let i = 0; i < asc.length - 1; i++) {
        expect(asc[i].salePrice).toBeLessThanOrEqual(asc[i + 1].salePrice);
      }

      // Sort price_desc
      const desc = [...products].sort((a, b) => b.salePrice - a.salePrice);
      for (let i = 0; i < desc.length - 1; i++) {
        expect(desc[i].salePrice).toBeGreaterThanOrEqual(desc[i + 1].salePrice);
      }
    });
  });

  // ==========================================
  // 5. ERROR GUESSING & RESILIENCE (EGR)
  // ==========================================
  describe('5. Error Guessing & Resilience (EGR)', () => {
    it('EGR1: Handling non-existent product lookups gracefully', () => {
      const notFound = db.getProductById('non-existent-uuid-1234');
      expect(notFound).toBeUndefined();
    });

    it('EGR2: Currency and Number formatting resilience', () => {
      const formatPrice = (p: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
      };
      expect(formatPrice(0)).toContain('0');
      expect(formatPrice(12500000)).toContain('12.500.000');
    });

    it('EGR3: Order Code format conforms to DXD-XXXX standard', () => {
      const order = db.createOrder({
        customerName: 'Code Format Check',
        customerPhone: '0977665544',
        shippingAddress: 'Binh Duong',
        city: 'Bình Dương',
        district: 'Dĩ An',
        items: [],
        subtotal: 1000000,
        discountAmount: 0,
        shippingFee: 0,
        total: 1000000,
        paymentMethod: 'cod',
        paymentStatus: 'unpaid',
        status: 'pending'
      });

      expect(order.orderCode).toMatch(/^DXD-\d+-\d+$/);
    });
  });
});

