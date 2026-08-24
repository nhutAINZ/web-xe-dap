import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../services/db';
import { INITIAL_PRODUCTS } from '../services/seedData';

describe('Shop Logic & Pricing Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should load initial products correctly from database', () => {
    const products = db.getProducts();
    expect(products.length).toBeGreaterThanOrEqual(8);
    expect(products[0]).toHaveProperty('name');
    expect(products[0]).toHaveProperty('salePrice');
    expect(products[0]).toHaveProperty('specs');
  });

  it('should validate and apply voucher discounts correctly', () => {
    const v200k = db.getVoucherByCode('DEMO200K');
    expect(v200k).toBeDefined();
    expect(v200k?.discountValue).toBe(200000);
    expect(v200k?.isActive).toBe(true);

    const nonExistent = db.getVoucherByCode('INVALID_CODE');
    expect(nonExistent).toBeUndefined();
  });

  it('should create an order and update stock correctly', () => {
    const initialProd = db.getProducts()[0];
    const initialStock = initialProd.stock;

    const newOrder = db.createOrder({
      customerName: 'Test Buyer',
      customerPhone: '0901234567',
      shippingAddress: '123 Test Street',
      city: 'Hồ Chí Minh',
      district: 'Quận 1',
      items: [
        {
          productId: initialProd.id,
          productName: initialProd.name,
          selectedColor: 'Đen',
          selectedSize: 'M',
          price: initialProd.salePrice,
          quantity: 2,
          thumbnail: initialProd.thumbnail
        }
      ],
      subtotal: initialProd.salePrice * 2,
      discountAmount: 0,
      shippingFee: 0,
      total: initialProd.salePrice * 2,
      paymentMethod: 'vietqr',
      paymentStatus: 'paid',
      status: 'pending'
    });

    expect(newOrder.id).toBeDefined();
    expect(newOrder.orderCode).toContain('DXD-');

    // Verify stock decreased
    const updatedProd = db.getProductById(initialProd.id);
    expect(updatedProd?.stock).toBe(initialStock - 2);
  });
});
