import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../services/db';
import { auth } from '../services/auth';
import { analytics } from '../services/analytics';

describe('CRM, Auth & Analytics Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should authenticate Admin and Staff roles correctly', () => {
    const adminRes = auth.login('admin', '123456');
    expect(adminRes.success).toBe(true);
    expect(adminRes.user?.role).toBe('admin');

    const staffRes = auth.login('staff', '123456');
    expect(staffRes.success).toBe(true);
    expect(staffRes.user?.role).toBe('staff');

    const failRes = auth.login('wrong', 'wrong');
    expect(failRes.success).toBe(false);
  });

  it('should update customer tier when total spend increases', () => {
    const newOrder = db.createOrder({
      customerName: 'VIP Rider',
      customerPhone: '0999888777',
      shippingAddress: '456 Le Duan',
      city: 'Hồ Chí Minh',
      district: 'Quận 1',
      items: [],
      subtotal: 35000000,
      discountAmount: 0,
      shippingFee: 0,
      total: 35000000,
      paymentMethod: 'vietqr',
      paymentStatus: 'paid',
      status: 'completed'
    });

    const customers = db.getCustomers();
    const cust = customers.find(c => c.phone === '0999888777');
    expect(cust).toBeDefined();
    expect(cust?.tier).toBe('Kim Cương');
    expect(cust?.totalSpent).toBe(35000000);
  });

  it('should track clickstream events and generate metrics', () => {
    analytics.logClick('banner', 'Hero Banner Flash Sale');
    analytics.logClick('hotline', 'Gọi tư vấn trực tiếp');

    const stats = analytics.getStats(7);
    expect(stats.total).toBeGreaterThanOrEqual(2);
    expect(stats.byType.banner).toBeGreaterThanOrEqual(1);
    expect(stats.byType.hotline).toBeGreaterThanOrEqual(1);
  });
});
