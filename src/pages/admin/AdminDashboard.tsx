import React from 'react';
import { Product, Order, Customer } from '../../types';
import { 
  DollarSign, ShoppingCart, Users, MousePointerClick, 
  TrendingUp, TrendingDown, ArrowRight, CheckCircle2, Clock, Truck, Bike 
} from 'lucide-react';
import { analytics } from '../../services/analytics';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  onNavigateTab: (tab: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  customers,
  onNavigateTab
}) => {
  const clickStats = analytics.getStats(30);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' || o.status === 'completed' ? o.total : 0), 0);
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
  };

  // Top selling bikes
  const topBikes = [...products].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 5);

  return (
    <div>
      {/* 4 Core KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">Tổng Doanh Thu</span>
            <div className="kpi-icon"><DollarSign size={20} /></div>
          </div>
          <div className="kpi-value">{formatPrice(totalRevenue)}</div>
          <div className="kpi-change positive">
            <TrendingUp size={14} /> +18.4% so với tháng trước
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">Đơn Hàng Mới</span>
            <div className="kpi-icon" style={{ color: '#0284c7' }}><ShoppingCart size={20} /></div>
          </div>
          <div className="kpi-value">{orders.length} đơn</div>
          <div className="kpi-change positive">
            <Clock size={14} /> {pendingOrders} đơn đang chờ xử lý
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">Khách Hàng (CRM)</span>
            <div className="kpi-icon" style={{ color: '#10b981' }}><Users size={20} /></div>
          </div>
          <div className="kpi-value">{customers.length} khách</div>
          <div className="kpi-change positive">
            <TrendingUp size={14} /> Tỉ lệ mua lại 34%
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">Lượt Tương Tác Click</span>
            <div className="kpi-icon" style={{ color: '#ec4899' }}><MousePointerClick size={20} /></div>
          </div>
          <div className="kpi-value">{clickStats.total} clicks</div>
          <div className="kpi-change positive">
            <TrendingUp size={14} /> Banners & Nút mua nhanh
          </div>
        </div>
      </div>

      {/* Revenue & Top Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Revenue Trend Visual Chart */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Biểu Đồ Doanh Thu & Đơn Hàng (7 Ngày Gần Nhất)</div>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', paddingTop: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              {[
                { day: 'T2', amount: 15900000, heightPct: '45%' },
                { day: 'T3', amount: 22400000, heightPct: '65%' },
                { day: 'T4', amount: 12000000, heightPct: '35%' },
                { day: 'T5', amount: 28900000, heightPct: '80%' },
                { day: 'T6', amount: 34500000, heightPct: '95%' },
                { day: 'T7', amount: 37800000, heightPct: '100%' },
                { day: 'CN', amount: 25900000, heightPct: '72%' },
              ].map((bar, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{(bar.amount / 1000000).toFixed(1)}Tr</div>
                  <div 
                    style={{
                      width: '32px',
                      height: bar.heightPct,
                      background: 'linear-gradient(180deg, #f97316 0%, rgba(249,115,22,0.3) 100%)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1' }}>{bar.day}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
              <span>Doanh thu trung bình: <strong>25.3 Triệu / ngày</strong></span>
              <span style={{ color: '#10b981' }}>Doanh số cuối tuần tăng 42%</span>
            </div>
          </div>
        </div>

        {/* Top Selling Bikes */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Top Xe Bán Chạy Nhất</div>
            <button onClick={() => onNavigateTab('products')} style={{ color: '#f97316', fontSize: '0.82rem', fontWeight: 600 }}>
              Xem tất cả
            </button>
          </div>
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {topBikes.map((bike, idx) => (
                <div key={bike.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: idx === 0 ? '#f97316' : 'rgba(255,255,255,0.1)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                    {idx + 1}
                  </span>
                  <img src={bike.thumbnail} alt={bike.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>{bike.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{bike.brand} • Đã bán {bike.soldCount || 0} chiếc</div>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ef4444' }}>
                    {formatPrice(bike.salePrice)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">Đơn Hàng Gần Đây</div>
          <button onClick={() => onNavigateTab('orders')} className="btn btn-outline btn-sm">
            <span>Quản Lý Đơn Hàng</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã Đơn</th>
              <th>Khách Hàng</th>
              <th>Sản Phẩm</th>
              <th>Tổng Tiền</th>
              <th>Thanh Toán</th>
              <th>Trạng Thái</th>
              <th>Thời Gian</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map(o => (
              <tr key={o.id}>
                <td><strong style={{ color: '#f97316' }}>{o.orderCode}</strong></td>
                <td>
                  <div>{o.customerName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{o.customerPhone}</div>
                </td>
                <td>{o.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}</td>
                <td><strong style={{ color: '#ef4444' }}>{formatPrice(o.total)}</strong></td>
                <td>
                  <span style={{ fontSize: '0.78rem', color: o.paymentStatus === 'paid' ? '#10b981' : '#f59e0b' }}>
                    {o.paymentMethod === 'vietqr' ? 'VietQR (Đã TT)' : 'COD (Khi nhận)'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${o.status === 'completed' ? 'badge-success' : o.status === 'shipping' ? 'badge-primary' : 'badge-hot'}`}>
                    {o.status === 'completed' ? 'Hoàn tất' : o.status === 'shipping' ? 'Đang giao' : 'Chờ xử lý'}
                  </span>
                </td>
                <td style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{o.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
