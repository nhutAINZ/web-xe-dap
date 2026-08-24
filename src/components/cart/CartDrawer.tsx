import React, { useState } from 'react';
import { CartItem } from '../../types';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Check } from 'lucide-react';
import { db } from '../../services/db';
import { analytics } from '../../services/analytics';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (productId: string, color: string, size: string, delta: number) => void;
  onRemoveItem: (productId: string, color: string, size: string) => void;
  onProceedCheckout: (voucherCode?: string, discountAmt?: number) => void;
  appliedVoucherCode?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onProceedCheckout,
  appliedVoucherCode
}) => {
  if (!isOpen) return null;

  const [couponInput, setCouponInput] = useState(appliedVoucherCode || '');
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const voucher = db.getVoucherByCode(couponInput);
    if (!voucher) {
      setCouponMessage({ text: 'Mã giảm giá không hợp lệ hoặc đã hết hạn!', success: false });
      setAppliedVoucher(null);
      return;
    }

    if (subtotal < voucher.minOrderValue) {
      setCouponMessage({ 
        text: `Mã chỉ áp dụng cho đơn từ ${new Intl.NumberFormat('vi-VN').format(voucher.minOrderValue)}đ!`, 
        success: false 
      });
      setAppliedVoucher(null);
      return;
    }

    let discount = 0;
    if (voucher.discountType === 'percentage') {
      discount = Math.min(500000, Math.round((subtotal * voucher.discountValue) / 100));
    } else {
      discount = voucher.discountValue;
    }

    setAppliedVoucher({ code: voucher.code, discount });
    setCouponMessage({ text: `Áp dụng thành công! Giảm ${new Intl.NumberFormat('vi-VN').format(discount)}đ`, success: true });
    analytics.logClick('filter_use', `Áp dụng mã giảm giá giỏ hàng: ${voucher.code}`);
  };

  const discountAmount = appliedVoucher ? appliedVoucher.discount : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
  };

  return (
    <div className="cart-drawer-backdrop" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={22} color="#f97316" />
            <h3>Giỏ Hàng Của Bạn ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
              <ShoppingBag size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem auto' }} />
              <h4 style={{ color: '#0f172a', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Giỏ hàng đang trống</h4>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Hãy chọn cho mình mẫu xe ưng ý nhất để bắt đầu hành trình!</p>
              <button onClick={onClose} className="btn btn-primary btn-sm">
                Tiếp Tục Mua Sắm
              </button>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`} className="cart-item-card">
                  <img
                    src={item.thumbnail}
                    alt={item.productName}
                    className="cart-item-thumb"
                  />
                  <div className="cart-item-info">
                    <h4>{item.productName}</h4>
                    <div className="cart-item-meta">
                      Màu: {item.selectedColor} | Size: {item.selectedSize}
                    </div>
                    <div className="cart-item-price">{formatPrice(item.price)}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <button
                      onClick={() => onRemoveItem(item.productId, item.selectedColor, item.selectedSize)}
                      style={{ color: '#ef4444', opacity: 0.8 }}
                      title="Xóa sản phẩm"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="cart-qty-ctrl">
                      <button
                        onClick={() => onUpdateQty(item.productId, item.selectedColor, item.selectedSize, -1)}
                        className="cart-qty-btn"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="cart-qty-num">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQty(item.productId, item.selectedColor, item.selectedSize, 1)}
                        className="cart-qty-btn"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} style={{ marginTop: '0.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="text"
                    placeholder="Nhập mã ưu đãi (DEMO200K)..."
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    style={{
                      flex: 1,
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.82rem',
                      textTransform: 'uppercase',
                      fontWeight: 600
                    }}
                  />
                  <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '0.45rem 0.85rem' }}>
                    Áp Dụng
                  </button>
                </div>
                {couponMessage && (
                  <div style={{ fontSize: '0.75rem', marginTop: '0.35rem', color: couponMessage.success ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                    {couponMessage.text}
                  </div>
                )}
              </form>
            </>
          )}
        </div>

        {/* Footer Checkout */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#64748b', marginBottom: '0.35rem' }}>
              <span>Tạm tính:</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatPrice(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#10b981', marginBottom: '0.35rem', fontWeight: 600 }}>
                <span>Mã giảm giá ({appliedVoucher?.code}):</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#64748b', marginBottom: '0.75rem' }}>
              <span>Phí vận chuyển:</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>MIỄN PHÍ</span>
            </div>

            <div className="cart-total-row">
              <span>Tổng thanh toán:</span>
              <span className="cart-total-price">{formatPrice(total)}</span>
            </div>

            <button
              onClick={() => {
                analytics.logClick('add_to_cart', 'Tiến hành đặt hàng từ Drawer');
                onProceedCheckout(appliedVoucher?.code, discountAmount);
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <span>Tiến Hành Đặt Hàng</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.65rem', fontSize: '0.72rem', color: '#94a3b8' }}>
              🔒 Đảm bảo thanh toán an toàn • Hỗ trợ trả góp 0%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
