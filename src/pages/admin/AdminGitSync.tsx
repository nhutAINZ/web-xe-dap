import React, { useState } from 'react';
import { db } from '../../services/db';
import { GitBranch, Download, Copy, Check, RefreshCw, Database, Cloud, AlertCircle, ArrowUpRight } from 'lucide-react';

interface AdminGitSyncProps {
  onRefresh: () => void;
}

export const AdminGitSync: React.FC<AdminGitSyncProps> = ({ onRefresh }) => {
  const [copied, setCopied] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const products = db.getProducts();
  const branches = db.getBranches();
  const articles = db.getArticles();
  const vouchers = db.getVouchers();
  const orders = db.getOrders();
  const customers = db.getCustomers();

  // Export JSON file download
  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(db.exportFullDatabaseJSON());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `demo_xedap_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Copy Seed data TS
  const handleCopyJSON = () => {
    navigator.clipboard.writeText(db.exportFullDatabaseJSON());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('CẢNH BÁO: Thao tác này sẽ xóa toàn bộ dữ liệu tạm trên trình duyệt và đưa về dữ liệu gốc mặc định ban đầu. Bạn có chắc chắn không?')) {
      db.resetDatabase();
    }
  };

  return (
    <div>
      {/* Overview Cards */}
      <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">Sản Phẩm & Xe Đạp</span>
            <div className="kpi-icon" style={{ color: '#f97316' }}><Database size={18} /></div>
          </div>
          <div className="kpi-value">{products.length} mẫu xe</div>
          <div className="kpi-change positive">Đã lưu trữ trong hệ thống</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">Showroom & Google Maps</span>
            <div className="kpi-icon" style={{ color: '#38bdf8' }}><Cloud size={18} /></div>
          </div>
          <div className="kpi-value">{branches.length} địa điểm</div>
          <div className="kpi-change positive">Định vị GPS & Chỉ đường</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">Đơn Hàng & POS</span>
            <div className="kpi-icon" style={{ color: '#10b981' }}><GitBranch size={18} /></div>
          </div>
          <div className="kpi-value">{orders.length} đơn hàng</div>
          <div className="kpi-change positive">{customers.length} khách hàng</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Left: Git & Netlify Auto Sync */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GitBranch size={18} color="#f97316" />
              <span>Đồng Bộ Dữ Liệu Thay Đổi Vào Git & Netlify</span>
            </div>
          </div>

          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.6' }}>
              Mọi thay đổi khi bạn thêm sản phẩm, tải ảnh từ máy, sửa giá hoặc cập nhật địa chỉ showroom đều được lưu trữ <strong>tức thì trên trình duyệt</strong>.
            </p>

            <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.5rem' }}>
                🔗 Repository GitHub đã kết nối:
              </div>
              <a
                href="https://github.com/nhutAINZ/web-xe-dap"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#ffffff', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', wordBreak: 'break-all' }}
              >
                https://github.com/nhutAINZ/web-xe-dap <ArrowUpRight size={14} color="#f97316" />
              </a>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                Branch chính: <span style={{ color: '#10b981', fontWeight: 700 }}>main</span> • Netlify tự động triển khai sau mỗi lượt push.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleDownloadJSON}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <Download size={16} />
                <span>Xuất Tệp Dữ Liệu JSON (Full Backup)</span>
              </button>

              <button
                onClick={handleCopyJSON}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
              >
                {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                <span>{copied ? 'Đã Copy JSON' : 'Sao Chép Dữ Liệu'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Quick Deploy Instructions */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Quy Trình Triển Khai Lên Netlify</div>
          </div>

          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f97316', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0 }}>1</span>
              <div>
                <strong style={{ color: '#ffffff' }}>Thực hiện chỉnh sửa:</strong> Thêm xe đạp mới (upload ảnh trực tiếp từ máy tính) hoặc sửa chi nhánh.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f97316', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0 }}>2</span>
              <div>
                <strong style={{ color: '#ffffff' }}>Lưu trữ thời gian thực:</strong> Web bán hàng và Admin cập nhật lập tức mà không cần reload trang.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f97316', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0 }}>3</span>
              <div>
                <strong style={{ color: '#ffffff' }}>Đồng bộ Git:</strong> Chạy lệnh commit push lên GitHub để Netlify tự động xuất bản website phiên bản mới nhất.
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', marginTop: 'auto' }}>
              <button
                onClick={handleReset}
                style={{ color: '#ef4444', fontSize: '0.78rem', background: 'transparent', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <RefreshCw size={14} /> Khôi phục dữ liệu gốc ban đầu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
