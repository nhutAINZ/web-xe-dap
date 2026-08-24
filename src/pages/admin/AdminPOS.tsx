import React, { useState } from 'react';
import { Product, Customer, OrderItem, PaymentMethod } from '../../types';
import { db } from '../../services/db';
import { Search, ShoppingCart, Plus, Minus, Trash2, User, CreditCard, DollarSign, QrCode, Printer, Check, Store } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminPOSProps {
  products: Product[];
  customers: Customer[];
  onOrderCreated: () => void;
}

export const AdminPOS: React.FC<AdminPOSProps> = ({ products, customers, onOrderCreated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [posCart, setPosCart] = useState<OrderItem[]>([]);
  
  // Customer selection
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discountAmt, setDiscountAmt] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vietqr');
  const [createdOrderCode, setCreatedOrderCode] = useState<string | null>(null);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
  };

  const filteredProducts = products.filter(p => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
  });

  const handleAddToCart = (product: Product) => {
    const existing = posCart.find(i => i.productId === product.id);
    if (existing) {
      setPosCart(posCart.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      const v = product.variants[0] || { colorName: 'Tiêu chuẩn', sizes: ['Tiêu chuẩn'] };
      const newItem: OrderItem = {
        productId: product.id,
        productName: product.name,
        selectedColor: v.colorName,
        selectedSize: v.sizes[0] || 'Tiêu chuẩn',
        price: product.salePrice,
        quantity: 1,
        thumbnail: product.thumbnail
      };
      setPosCart([...posCart, newItem]);
    }
  };

  const handleUpdateQty = (idx: number, delta: number) => {
    const updated = [...posCart];
    updated[idx].quantity += delta;
    if (updated[idx].quantity <= 0) {
      updated.splice(idx, 1);
    }
    setPosCart(updated);
  };

  const subtotal = posCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = Math.max(0, subtotal - discountAmt);

  const handleCheckoutPOS = (e: React.FormEvent) => {
    e.preventDefault();
    if (posCart.length === 0) {
      alert('Vui lòng chọn sản phẩm vào đơn!');
      return;
    }
    if (!customerName || !customerPhone) {
      alert('Vui lòng nhập tên và SĐT khách mua hàng tại quầy!');
      return;
    }

    const order = db.createOrder({
      customerName,
      customerPhone,
      shippingAddress: 'Mua trực tiếp tại Showroom Flagship Q.1',
      city: 'Hồ Chí Minh',
      district: 'Quận 1',
      items: posCart,
      subtotal,
      discountAmount: discountAmt,
      shippingFee: 0,
      total,
      paymentMethod,
      paymentStatus: 'paid',
      status: 'completed',
      orderNotes: 'Đơn bán trực tiếp tại quầy POS'
    }, 'Nhân viên POS');

    confetti({ particleCount: 50, spread: 60 });
    setCreatedOrderCode(order.orderCode);
    onOrderCreated();
  };

  const handleResetPOS = () => {
    setPosCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscountAmt(0);
    setCreatedOrderCode(null);
  };

  return (
    <div className="pos-container">
      {/* Left: Product Selection Area */}
      <div className="pos-products-area">
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            placeholder="Tìm nhanh mã xe, tên xe Giant, Trek, phụ kiện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem', height: '44px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', overflowY: 'auto' }}>
          {filteredProducts.map(p => (
            <div
              key={p.id}
              onClick={() => handleAddToCart(p)}
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                gap: '0.75rem'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f97316'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
            >
              <img src={p.thumbnail} alt={p.name} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.75rem', color: '#f97316', fontWeight: 600 }}>{p.brand}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.name}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ef4444' }}>
                  {formatPrice(p.salePrice)}
                </div>
                <div style={{ fontSize: '0.72rem', color: p.stock > 0 ? '#10b981' : '#ef4444' }}>
                  Kho: {p.stock} xe
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Cart & Checkout Form */}
      <div className="pos-cart-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#ffffff', fontSize: '1.05rem' }}>
            <Store size={18} color="#f97316" />
            <span>Đơn Bán Tại Quầy</span>
          </div>
          <button onClick={handleResetPOS} style={{ fontSize: '0.75rem', color: '#ef4444' }}>
            Xóa trắng
          </button>
        </div>

        {/* Success Modal / Banner */}
        {createdOrderCode ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Check size={32} />
            </div>
            <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              Đã Xuất Đơn: {createdOrderCode}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Doanh thu và trừ tồn kho đã được cập nhật thời gian thực vào hệ thống.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => window.print()} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                <Printer size={14} /> In Phiếu Thu
              </button>
              <button onClick={handleResetPOS} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                Tạo Đơn Mới
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCheckoutPOS} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Customer Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                required
                placeholder="Tên khách hàng *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.82rem', padding: '0.5rem' }}
              />
              <input
                type="tel"
                required
                placeholder="Số điện thoại *"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.82rem', padding: '0.5rem' }}
              />
            </div>

            {/* Cart Items List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '240px', marginBottom: '1rem' }}>
              {posCart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#64748b', fontSize: '0.85rem' }}>
                  Chưa có sản phẩm nào được chọn
                </div>
              ) : (
                posCart.map((item, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <div style={{ flex: 1, minWidth: 0, paddingRight: '0.5rem' }}>
                      <div style={{ fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.productName}</div>
                      <div style={{ color: '#ef4444', fontWeight: 600 }}>{formatPrice(item.price)}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button type="button" onClick={() => handleUpdateQty(idx, -1)} style={{ color: '#cbd5e1', padding: '2px 6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>-</button>
                      <span style={{ fontWeight: 700, padding: '0 4px' }}>{item.quantity}</span>
                      <button type="button" onClick={() => handleUpdateQty(idx, 1)} style={{ color: '#cbd5e1', padding: '2px 6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Payment Math */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Tạm tính:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8' }}>Giảm giá tại quầy:</span>
                <input
                  type="number"
                  placeholder="0"
                  value={discountAmt || ''}
                  onChange={(e) => setDiscountAmt(parseInt(e.target.value) || 0)}
                  style={{ width: '100px', padding: '0.25rem 0.5rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.2)', color: '#10b981', borderRadius: '4px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 700 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, marginTop: '0.35rem' }}>
                <span>Khách phải trả:</span>
                <span style={{ color: '#ef4444' }}>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', margin: '0.75rem 0' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('vietqr')}
                style={{
                  padding: '0.4rem',
                  borderRadius: '6px',
                  border: paymentMethod === 'vietqr' ? '1.5px solid #f97316' : '1px solid rgba(255,255,255,0.1)',
                  background: paymentMethod === 'vietqr' ? 'rgba(249,115,22,0.15)' : 'transparent',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                📱 VietQR / Chuyển khoản
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                style={{
                  padding: '0.4rem',
                  borderRadius: '6px',
                  border: paymentMethod === 'cod' ? '1.5px solid #f97316' : '1px solid rgba(255,255,255,0.1)',
                  background: paymentMethod === 'cod' ? 'rgba(249,115,22,0.15)' : 'transparent',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                💵 Tiền Mặt Tại Quầy
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', marginTop: 'auto' }}
            >
              <span>Xác Nhận & Xuất Hóa Đơn ({formatPrice(total)})</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
