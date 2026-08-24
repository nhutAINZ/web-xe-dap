import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { db } from '../../services/db';
import { Search, Filter, Printer, Eye, CheckCircle2, Clock, Truck, XCircle, X } from 'lucide-react';

interface AdminOrdersProps {
  orders: Order[];
  onRefresh: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
  };

  const filtered = orders.filter(o => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchCode = o.orderCode.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      if (!matchCode && !matchName && !matchPhone) return false;
    }
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    db.updateOrderStatus(orderId, newStatus);
    onRefresh();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Search & Status Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, maxWidth: '500px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              placeholder="Tìm theo mã đơn, tên khách hoặc SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: '180px' }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang chuẩn bị</option>
            <option value="shipping">Đang giao</option>
            <option value="completed">Đã hoàn tất</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã Đơn Hàng</th>
              <th>Khách Hàng</th>
              <th>Địa Chỉ Nhận</th>
              <th>Tổng Tiền</th>
              <th>Thanh Toán</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td>
                  <strong style={{ color: '#f97316' }}>{o.orderCode}</strong>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{o.createdAt}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 700 }}>{o.customerName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{o.customerPhone}</div>
                </td>
                <td>
                  <div style={{ fontSize: '0.82rem', maxWidth: '200px' }}>{o.shippingAddress}, {o.city}</div>
                </td>
                <td>
                  <strong style={{ color: '#ef4444' }}>{formatPrice(o.total)}</strong>
                </td>
                <td>
                  <span style={{ fontSize: '0.78rem', color: o.paymentStatus === 'paid' ? '#10b981' : '#f59e0b' }}>
                    {o.paymentMethod === 'vietqr' ? 'VietQR (Đã thanh toán)' : 'COD (Tiền mặt)'}
                  </span>
                </td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                    style={{
                      padding: '0.3rem 0.55rem',
                      borderRadius: '6px',
                      background: '#0f172a',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: o.status === 'completed' ? '#10b981' : o.status === 'shipping' ? '#38bdf8' : '#f97316',
                      fontWeight: 700,
                      fontSize: '0.78rem'
                    }}
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang chuẩn bị</option>
                    <option value="shipping">Đang giao hàng</option>
                    <option value="completed">Đã hoàn tất</option>
                    <option value="cancelled">Đã hủy đơn</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Eye size={14} /> Xem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details & Printable Invoice Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div 
            className="modal-content printable-receipt"
            style={{ maxWidth: '680px', background: '#0f172a', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f97316' }}>
                  HÓA ĐƠN BÁN HÀNG: {selectedOrder.orderCode}
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0 }}>
                  Thời gian tạo: {selectedOrder.createdAt} • Nguồn: {selectedOrder.createdBy === 'staff_pos' ? 'Bán tại quầy (POS)' : 'Khách đặt online'}
                </p>
              </div>

              <button onClick={handlePrint} className="btn btn-primary btn-sm">
                <Printer size={16} /> In Hóa Đơn
              </button>
            </div>

            {/* Customer Info Box */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', lineHeight: 1.6 }}>
              <div><strong>Khách hàng:</strong> {selectedOrder.customerName}</div>
              <div><strong>Số điện thoại:</strong> {selectedOrder.customerPhone}</div>
              <div><strong>Địa chỉ giao:</strong> {selectedOrder.shippingAddress}, {selectedOrder.district}, {selectedOrder.city}</div>
              {selectedOrder.orderNotes && <div><strong>Ghi chú:</strong> {selectedOrder.orderNotes}</div>}
            </div>

            {/* Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#94a3b8' }}>
                  <th style={{ padding: '0.5rem 0' }}>Sản phẩm</th>
                  <th style={{ padding: '0.5rem 0' }}>Quy cách</th>
                  <th style={{ padding: '0.5rem 0', textAlign: 'center' }}>SL</th>
                  <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.65rem 0', fontWeight: 600 }}>{item.productName}</td>
                    <td style={{ padding: '0.65rem 0', color: '#94a3b8', fontSize: '0.8rem' }}>
                      {item.selectedColor} | {item.selectedSize}
                    </td>
                    <td style={{ padding: '0.65rem 0', textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 700, color: '#ef4444' }}>
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Math */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.75rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Tạm tính:</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>Chiết khấu Voucher:</span>
                  <span>-{formatPrice(selectedOrder.discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, marginTop: '0.5rem' }}>
                <span>Tổng thu:</span>
                <span style={{ color: '#ef4444' }}>{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
