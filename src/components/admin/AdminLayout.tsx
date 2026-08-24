import React from 'react';
import { UserSession } from '../../types';
import { 
  LayoutDashboard, ShoppingCart, Package, Users, BarChart3, 
  Layers, LogOut, ExternalLink, ShieldAlert, Sparkles, Store, FileText, Bike, Clock, GitBranch 
} from 'lucide-react';
import { auth } from '../../services/auth';

export type AdminTab = 
  | 'dashboard' 
  | 'products' 
  | 'orders' 
  | 'pos' 
  | 'crm' 
  | 'analytics' 
  | 'cms' 
  | 'gitsync'
  | 'audit';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  currentUser: UserSession;
  onLogout: () => void;
  onViewStorefront: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
  onViewStorefront,
  children
}) => {
  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="admin-app">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="logo-icon-box" style={{ width: '32px', height: '32px' }}>
            <Bike size={18} />
          </div>
          <div>
            <h2>DEMO XE ĐẠP</h2>
            <span>{isAdmin ? 'ADMIN PORTAL' : 'STAFF POS/CRM'}</span>
          </div>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-group-title">Tổng quan & Kinh doanh</div>
          
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`admin-nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Bảng Điều Khiển</span>
          </button>

          <button
            onClick={() => onSelectTab('pos')}
            className={`admin-nav-item ${currentTab === 'pos' ? 'active' : ''}`}
            style={{ color: currentTab === 'pos' ? undefined : '#38bdf8' }}
          >
            <Store size={18} />
            <span>Bán Tại Quầy (POS)</span>
          </button>

          <button
            onClick={() => onSelectTab('orders')}
            className={`admin-nav-item ${currentTab === 'orders' ? 'active' : ''}`}
          >
            <ShoppingCart size={18} />
            <span>Quản Lý Đơn Hàng</span>
          </button>

          <button
            onClick={() => onSelectTab('crm')}
            className={`admin-nav-item ${currentTab === 'crm' ? 'active' : ''}`}
          >
            <Users size={18} />
            <span>Khách Hàng (CRM)</span>
          </button>

          <div className="admin-nav-group-title" style={{ marginTop: '0.75rem' }}>Quản trị hệ thống</div>

          <button
            onClick={() => onSelectTab('products')}
            className={`admin-nav-item ${currentTab === 'products' ? 'active' : ''}`}
            disabled={!isAdmin}
            style={{ opacity: !isAdmin ? 0.4 : 1, cursor: !isAdmin ? 'not-allowed' : 'pointer' }}
            title={!isAdmin ? 'Chỉ dành cho Admin' : ''}
          >
            <Package size={18} />
            <span>Kho Sản Phẩm {!isAdmin && '🔒'}</span>
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`admin-nav-item ${currentTab === 'analytics' ? 'active' : ''}`}
          >
            <BarChart3 size={18} />
            <span>Thống Kê Lượt Click</span>
          </button>

          <button
            onClick={() => onSelectTab('cms')}
            className={`admin-nav-item ${currentTab === 'cms' ? 'active' : ''}`}
            disabled={!isAdmin}
            style={{ opacity: !isAdmin ? 0.4 : 1, cursor: !isAdmin ? 'not-allowed' : 'pointer' }}
            title={!isAdmin ? 'Chỉ dành cho Admin' : ''}
          >
            <Layers size={18} />
            <span>CMS Banner & Nội Dung {!isAdmin && '🔒'}</span>
          </button>

          <button
            onClick={() => onSelectTab('gitsync')}
            className={`admin-nav-item ${currentTab === 'gitsync' ? 'active' : ''}`}
          >
            <GitBranch size={18} />
            <span>Đồng Bộ & Git Sync</span>
          </button>

          <button
            onClick={() => onSelectTab('audit')}
            className={`admin-nav-item ${currentTab === 'audit' ? 'active' : ''}`}
            disabled={!isAdmin}
            style={{ opacity: !isAdmin ? 0.4 : 1, cursor: !isAdmin ? 'not-allowed' : 'pointer' }}
          >
            <Clock size={18} />
            <span>Nhật Ký Thao Tác {!isAdmin && '🔒'}</span>
          </button>
        </nav>

        {/* User Session Footer */}
        <div className="admin-user-footer">
          <div className="admin-user-info">
            <h4>{currentUser.fullName}</h4>
            <p>Quyền: <strong style={{ color: isAdmin ? '#f97316' : '#38bdf8' }}>{currentUser.role.toUpperCase()}</strong></p>
          </div>
          <button
            onClick={onLogout}
            style={{ color: '#ef4444', padding: '0.4rem' }}
            title="Đăng xuất"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <h1>
              {currentTab === 'dashboard' && 'Dashboard Tổng Quan Kinh Doanh'}
              {currentTab === 'pos' && 'Màn Hình Bán Hàng Tại Quầy (POS)'}
              {currentTab === 'orders' && 'Quản Lý Danh Sách Đơn Hàng'}
              {currentTab === 'crm' && 'Quản Lý Hồ Sơ Khách Hàng (CRM)'}
              {currentTab === 'products' && 'Quản Lý Danh Mục & Kho Sản Phẩm'}
              {currentTab === 'analytics' && 'Báo Cáo Hành Vi & Thống Kê Lượt Click'}
              {currentTab === 'cms' && 'Quản Trị Nội Dung (CMS) & Banners'}
              {currentTab === 'audit' && 'Nhật Ký Hoạt Động (Audit Log)'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={onViewStorefront}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Xem Web Bán Hàng</span>
              <ExternalLink size={14} />
            </button>
          </div>
        </header>

        {/* Content View */}
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};
