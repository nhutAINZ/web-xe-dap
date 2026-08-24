import React, { useState } from 'react';
import { Customer, Order } from '../../types';
import { db } from '../../services/db';
import { Search, User, Phone, Mail, MapPin, Award, Edit3, Check, Plus } from 'lucide-react';

interface AdminCRMProps {
  customers: Customer[];
  orders: Order[];
  onRefresh: () => void;
}

export const AdminCRM: React.FC<AdminCRMProps> = ({ customers, orders, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingNotes, setEditingNotes] = useState('');

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
  };

  const filtered = customers.filter(c => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q);
  });

  const handleSaveNotes = (c: Customer) => {
    db.saveCustomer({ ...c, notes: editingNotes });
    setSelectedCustomer({ ...c, notes: editingNotes });
    onRefresh();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem' }}>
      {/* Left: Customer List */}
      <div>
        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input
            type="text"
            placeholder="Tìm theo tên khách hàng, số điện thoại hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>

        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Khách Hàng</th>
                <th>SĐT / Email</th>
                <th>Hạng VIP</th>
                <th>Tổng Chi Tiêu</th>
                <th>Số Đơn</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#ffffff' }}>{c.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Gia nhập: {c.createdAt}</div>
                  </td>
                  <td>
                    <div>{c.phone}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.email || 'Chưa cập nhật'}</div>
                  </td>
                  <td>
                    <span className={`badge ${c.tier === 'Kim Cương' ? 'badge-sale' : c.tier === 'Vàng' ? 'badge-primary' : 'badge-success'}`}>
                      {c.tier}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: '#ef4444' }}>{formatPrice(c.totalSpent)}</strong>
                  </td>
                  <td style={{ textAlign: 'center' }}>{c.orderCount}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedCustomer(c);
                        setEditingNotes(c.notes || '');
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      Hồ Sơ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: Customer Profile & Order History */}
      <div>
        {selectedCustomer ? (
          <div className="admin-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>{selectedCustomer.name}</h3>
                <span className="badge badge-primary">{selectedCustomer.tier} Member</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1.5rem' }}>
              <div>📞 <strong>Số điện thoại:</strong> {selectedCustomer.phone}</div>
              <div>✉️ <strong>Email:</strong> {selectedCustomer.email || 'Chưa cập nhật'}</div>
              <div>📍 <strong>Địa chỉ:</strong> {selectedCustomer.address}, {selectedCustomer.district}, {selectedCustomer.city}</div>
              <div>💰 <strong>Tổng tích lũy:</strong> <span style={{ color: '#ef4444', fontWeight: 700 }}>{formatPrice(selectedCustomer.totalSpent)}</span></div>
            </div>

            {/* Care Notes */}
            <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>Ghi chú chăm sóc (CSKH):</span>
                <button
                  onClick={() => handleSaveNotes(selectedCustomer)}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                >
                  <Check size={12} /> Lưu Ghi Chú
                </button>
              </div>
              <textarea
                rows={3}
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                placeholder="Nhập ghi chú sở thích dòng xe, lịch hẹn bảo dưỡng..."
                className="form-textarea"
                style={{ fontSize: '0.82rem' }}
              />
            </div>

            {/* Customer Purchase History */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>
                Lịch Sử Mua Hàng
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                {orders.filter(o => o.customerPhone === selectedCustomer.phone).map(o => (
                  <div key={o.id} style={{ background: '#090d16', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f97316', fontWeight: 700 }}>
                      <span>{o.orderCode}</span>
                      <span style={{ color: '#ef4444' }}>{formatPrice(o.total)}</span>
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{o.createdAt} • {o.items.length} món</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="admin-card" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#64748b' }}>
            <User size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.4 }} />
            <h4>Chọn khách hàng từ danh sách bên trái để xem hồ sơ</h4>
          </div>
        )}
      </div>
    </div>
  );
};
