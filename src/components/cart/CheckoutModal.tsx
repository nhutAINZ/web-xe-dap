import React, { useState } from 'react';
import { CartItem, PaymentMethod, Order } from '../../types';
import { X, CheckCircle2, QrCode, CreditCard, Truck, ShieldCheck, ArrowRight, Check, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '../../services/db';
import { analytics } from '../../services/analytics';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  voucherCode?: string;
  discountAmount?: number;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  voucherCode,
  discountAmount = 0,
  onOrderSuccess
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Hồ Chí Minh');
  const [district, setDistrict] = useState('Quận 1');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vietqr');
  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const subtotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const total = Math.max(0, subtotal - discountAmount);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng!');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newOrder = db.createOrder({
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        shippingAddress: address,
        city,
        district,
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          price: item.price,
          quantity: item.quantity,
          thumbnail: item.thumbnail
        })),
        subtotal,
        discountAmount,
        voucherCode,
        shippingFee: 0,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === 'vietqr' ? 'paid' : 'unpaid',
        status: 'pending',
        orderNotes: notes
      });

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 }
      });

      analytics.logClick('add_to_cart', `Hoàn tất đặt hàng: ${newOrder.orderCode}`, newOrder.id);
      setCompletedOrder(newOrder);
      onOrderSuccess(newOrder);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        style={{ maxWidth: '820px', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {completedOrder ? (
          /* Order Success Screen */
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div 
              style={{
                width: '72px',
                height: '72px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}
            >
              <CheckCircle2 size={42} />
            </div>

            <div style={{ color: '#10b981', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
              ĐẶT HÀNG THÀNH CÔNG!
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Cảm Ơn Quý Khách Đã Lựa Chọn Demo Xe Đạp
            </h2>

            <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto 1.5rem auto' }}>
              Mã đơn hàng: <strong style={{ color: '#f97316' }}>{completedOrder.orderCode}</strong>. Chuyên viên kỹ thuật sẽ gọi điện xác nhận và hỗ trợ cân chỉnh xe trong vòng 15 phút.
            </p>

            {/* VietQR Bank Transfer Card if chosen */}
            {completedOrder.paymentMethod === 'vietqr' && (
              <div 
                style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  maxWidth: '520px',
                  margin: '0 auto 1.75rem auto',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <QrCode size={20} color="#f97316" /> Mã Thanh Toán VietQR Tự Động
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1rem' }}>
                  Quét mã bằng bất kỳ App Ngân hàng (MB, VCB, Techcombank, VPBank...) hoặc MoMo:
                </p>

                {/* QR Image Mock Generator */}
                <div style={{ display: 'inline-block', padding: '0.75rem', background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginBottom: '1rem' }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=DEMOXEDAP_ORDER_${completedOrder.orderCode}_TOTAL_${completedOrder.total}`}
                    alt="VietQR Payment"
                    style={{ width: '160px', height: '160px' }}
                  />
                </div>

                <div style={{ textAlign: 'left', background: '#ffffff', padding: '0.85rem', borderRadius: '8px', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  <div><strong>Ngân hàng:</strong> MB Bank (Quân Đội)</div>
                  <div><strong>Số tài khoản:</strong> 9999 8888 6868</div>
                  <div><strong>Chủ tài khoản:</strong> CTY TNHH DEMO XE DAP VN</div>
                  <div><strong>Số tiền:</strong> <span style={{ color: '#ef4444', fontWeight: 800 }}>{formatPrice(completedOrder.total)}</span></div>
                  <div><strong>Nội dung CK:</strong> <span style={{ color: '#f97316', fontWeight: 700 }}>{completedOrder.orderCode}</span></div>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="btn btn-primary"
              style={{ padding: '0.85rem 2rem' }}
            >
              Tiếp Tục Xem Sản Phẩm Khác
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ color: '#f97316', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                XÁC NHẬN ĐƠN HÀNG
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                Thông Tin Giao Hàng & Thanh Toán
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
              {/* Left Form: Customer Details */}
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ví dụ: 0908123456"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                    Email nhận hóa đơn (tùy chọn)
                  </label>
                  <input
                    type="email"
                    placeholder="email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                      Tỉnh / Thành phố *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', background: '#ffffff' }}
                    >
                      <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Bình Dương">Bình Dương</option>
                      <option value="Đồng Nai">Đồng Nai</option>
                      <option value="Hải Phòng">Hải Phòng</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                      Quận / Huyện *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Quận/Huyện"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                    Địa chỉ giao hàng chi tiết *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Số nhà, tên đường, phường/xã..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                    Ghi chú đơn hàng (giờ nhận xe, cân chỉnh thêm...)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Giao giờ hành chính, gọi trước khi đến..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', resize: 'none' }}
                  />
                </div>
              </div>

              {/* Right Side: Payment Methods & Order Summary */}
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.65rem' }}>
                  Phương thức thanh toán:
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {/* VietQR Option */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'vietqr' ? '2px solid #f97316' : '1px solid #e2e8f0',
                      background: paymentMethod === 'vietqr' ? '#fff7ed' : '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'vietqr'}
                      onChange={() => setPaymentMethod('vietqr')}
                      style={{ accentColor: '#f97316' }}
                    />
                    <QrCode size={20} color="#f97316" />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Chuyển khoản VietQR (Khuyên dùng)</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Tự động tạo mã QR, quét bằng app ngân hàng</div>
                    </div>
                  </label>

                  {/* COD Option */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'cod' ? '2px solid #f97316' : '1px solid #e2e8f0',
                      background: paymentMethod === 'cod' ? '#fff7ed' : '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      style={{ accentColor: '#f97316' }}
                    />
                    <Truck size={20} color="#0284c7" />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Thanh toán khi nhận hàng (COD)</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Kiểm tra xe, chạy thử rồi thanh toán tiền mặt</div>
                    </div>
                  </label>
                </div>

                {/* Summary Box */}
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.35rem' }}>
                    <span>Tạm tính ({cartItems.length} món):</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#10b981', fontWeight: 600, marginBottom: '0.35rem' }}>
                      <span>Giảm giá voucher:</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.65rem' }}>
                    <span>Vận chuyển:</span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>0đ (Miễn phí)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, borderTop: '1px solid #e2e8f0', paddingTop: '0.65rem' }}>
                    <span>Tổng cộng:</span>
                    <span style={{ color: '#ef4444' }}>{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.9rem' }}
                >
                  {loading ? 'Đang xử lý...' : `Xác Nhận Đặt Hàng (${formatPrice(total)})`}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
