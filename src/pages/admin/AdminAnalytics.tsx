import React, { useState } from 'react';
import { analytics } from '../../services/analytics';
import { MousePointerClick, Download, Smartphone, Monitor, Tablet, Filter, Sparkles, TrendingUp } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const [daysFilter, setDaysFilter] = useState<number>(7);

  const stats = analytics.getStats(daysFilter);
  const rawEvents = analytics.getClicksByFilter(daysFilter);

  const handleExport = () => {
    analytics.exportToCSV(daysFilter);
  };

  return (
    <div>
      {/* Top Filter & Export Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>Khoảng thời gian:</span>
          {[
            { label: 'Hôm nay', days: 1 },
            { label: '7 ngày qua', days: 7 },
            { label: '30 ngày qua', days: 30 }
          ].map(btn => (
            <button
              key={btn.days}
              onClick={() => setDaysFilter(btn.days)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                border: daysFilter === btn.days ? '1.5px solid #f97316' : '1px solid rgba(255,255,255,0.15)',
                background: daysFilter === btn.days ? '#f97316' : '#0f172a',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <button onClick={handleExport} className="btn btn-primary btn-sm">
          <Download size={16} />
          <span>Xuất Báo Cáo CSV (Excel)</span>
        </button>
      </div>

      {/* KPI Breakdown Cards */}
      <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">Tổng Lượt Click Tương Tác</span>
            <div className="kpi-icon"><MousePointerClick size={20} /></div>
          </div>
          <div className="kpi-value">{stats.total}</div>
          <div className="kpi-change positive">Ghi nhận thời gian thực</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">Click Banner & CTA Hero</span>
            <div className="kpi-icon" style={{ color: '#38bdf8' }}><Sparkles size={20} /></div>
          </div>
          <div className="kpi-value">{(stats.byType.banner || 0) + (stats.byType.cta_hero || 0)}</div>
          <div className="kpi-change positive">Từ trang bìa cinematic</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">Xem Sản Phẩm & Thêm Giỏ</span>
            <div className="kpi-icon" style={{ color: '#10b981' }}><TrendingUp size={20} /></div>
          </div>
          <div className="kpi-value">{(stats.byType.product_view || 0) + (stats.byType.add_to_cart || 0)}</div>
          <div className="kpi-change positive">Tỉ lệ quan tâm sản phẩm cao</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">Hotline, Zalo & Messenger</span>
            <div className="kpi-icon" style={{ color: '#ec4899' }}><Smartphone size={20} /></div>
          </div>
          <div className="kpi-value">{(stats.byType.hotline || 0) + (stats.byType.zalo || 0) + (stats.byType.messenger || 0)}</div>
          <div className="kpi-change positive">Khách cần tư vấn trực tiếp</div>
        </div>
      </div>

      {/* Breakdown Grid (Top Targets & Device) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Top Clicked Targets */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Top Các Vị Trí / Sản Phẩm Được Click Nhiều Nhất</div>
          </div>
          <div style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {stats.topTargets.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Chưa có đủ dữ liệu tương tác trong khoảng thời gian này.</div>
              ) : (
                stats.topTargets.map((item, idx) => {
                  const pct = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;
                  return (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                        <span style={{ color: '#ffffff', fontWeight: 600 }}>{item.label}</span>
                        <span style={{ color: '#f97316', fontWeight: 700 }}>{item.count} clicks ({pct}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #f97316, #ea580c)', borderRadius: '3px' }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Cơ Cấu Thiết Bị Truy Cập</div>
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8' }}>
                <Monitor size={20} />
                <span style={{ fontWeight: 700, color: '#ffffff' }}>Desktop</span>
              </div>
              <span style={{ fontWeight: 800, color: '#38bdf8' }}>{stats.byDevice.desktop || 0} clicks</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
                <Tablet size={20} />
                <span style={{ fontWeight: 700, color: '#ffffff' }}>Tablet</span>
              </div>
              <span style={{ fontWeight: 800, color: '#10b981' }}>{stats.byDevice.tablet || 0} clicks</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f97316' }}>
                <Smartphone size={20} />
                <span style={{ fontWeight: 700, color: '#ffffff' }}>Mobile</span>
              </div>
              <span style={{ fontWeight: 800, color: '#f97316' }}>{stats.byDevice.mobile || 0} clicks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Event Stream Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">Nhật Ký Sự Kiện Tương Tác Chi Tiết (Gần Nhất)</div>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Thời Gian</th>
              <th>Loại Tương Tác</th>
              <th>Nội Dung Mục Tiêu</th>
              <th>Thiết Bị</th>
              <th>Trang</th>
            </tr>
          </thead>
          <tbody>
            {rawEvents.slice(0, 10).map(ev => (
              <tr key={ev.id}>
                <td style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  {new Date(ev.timestamp).toLocaleTimeString('vi-VN')} ({new Date(ev.timestamp).toLocaleDateString('vi-VN')})
                </td>
                <td>
                  <span className="badge badge-primary">{ev.type}</span>
                </td>
                <td style={{ fontWeight: 600, color: '#ffffff' }}>{ev.targetLabel}</td>
                <td>
                  <span style={{ textTransform: 'capitalize', color: '#cbd5e1' }}>{ev.device}</span>
                </td>
                <td style={{ fontSize: '0.75rem', color: '#64748b' }}>{ev.pageUrl || '/'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
