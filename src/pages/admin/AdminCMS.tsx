import React, { useState } from 'react';
import { HeroBanner, StoryChapter, Article, Voucher } from '../../types';
import { db } from '../../services/db';
import { Layers, Image, Film, BookOpen, Tag, Plus, Edit2, Trash2, Check, X } from 'lucide-react';

interface AdminCMSProps {
  banners: HeroBanner[];
  chapters: StoryChapter[];
  articles: Article[];
  vouchers: Voucher[];
  onRefresh: () => void;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({
  banners,
  chapters,
  articles,
  vouchers,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'banners' | 'chapters' | 'articles' | 'vouchers'>('banners');

  // Edit Banner
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;
    db.saveBanner(editingBanner);
    setEditingBanner(null);
    onRefresh();
  };

  return (
    <div>
      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { key: 'banners', label: '🎬 Hero Video & Banners', count: banners.length },
          { key: 'chapters', label: '📖 Storytelling Chapters', count: chapters.length },
          { key: 'articles', label: '📰 Bài Viết & Cẩm Nang', count: articles.length },
          { key: 'vouchers', label: '🎟️ Mã Khuyến Mãi / Voucher', count: vouchers.length },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            style={{
              padding: '0.65rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              border: activeTab === t.key ? '1.5px solid #f97316' : '1px solid rgba(255,255,255,0.1)',
              background: activeTab === t.key ? 'rgba(249,115,22,0.15)' : '#0f172a',
              color: activeTab === t.key ? '#f97316' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* 1. Banners Manager */}
      {activeTab === 'banners' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Quản Lý Hero Video & Banners Trang Bìa</div>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Loại Media</th>
                <th>Tiêu Đề TVC Hero</th>
                <th>Phụ Đề / Tagline</th>
                <th>Nút Bấm CTA</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {banners.map(b => (
                <tr key={b.id}>
                  <td>
                    <span className={`badge ${b.mediaType === 'video' ? 'badge-primary' : 'badge-hot'}`}>
                      {b.mediaType === 'video' ? '🎥 Video 4K Loop' : '🖼️ Ảnh Full-width'}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: '#ffffff' }}>{b.title}</strong>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Badge: {b.badge}</div>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#cbd5e1', maxWidth: '280px' }}>{b.subtitle}</td>
                  <td>{b.ctaText}</td>
                  <td>
                    <span style={{ color: b.isActive ? '#10b981' : '#64748b', fontWeight: 700 }}>
                      {b.isActive ? '● Đang hiển thị' : '○ Tắt'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => setEditingBanner({ ...b })}
                      className="btn btn-secondary btn-sm"
                    >
                      <Edit2 size={14} /> Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. Story Chapters Manager */}
      {activeTab === 'chapters' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">5 Chương Kể Chuyện Thương Hiệu (Storytelling Scroll)</div>
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {chapters.map(c => (
              <div key={c.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div>
                    <span style={{ color: '#f97316', fontWeight: 800, fontSize: '0.8rem' }}>CHƯƠNG {c.chapterNumber} • {c.subtitle}</span>
                    <h3 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 800 }}>{c.title}</h3>
                  </div>
                  <span className="badge badge-success">✓ Kích hoạt</span>
                </div>
                <p style={{ color: '#cbd5e1', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '0.5rem' }}>"{c.tagline}"</p>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {c.description.join(' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Articles Manager */}
      {activeTab === 'articles' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Danh Sách Bài Viết & Cẩm Nang</div>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tiêu Đề</th>
                <th>Chuyên Mục</th>
                <th>Tác Giả</th>
                <th>Ngày Đăng</th>
                <th>Lượt Đọc</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(a => (
                <tr key={a.id}>
                  <td><strong style={{ color: '#ffffff' }}>{a.title}</strong></td>
                  <td><span className="badge badge-primary">{a.category}</span></td>
                  <td>{a.author}</td>
                  <td>{a.publishedAt}</td>
                  <td>{a.views} lượt xem</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Vouchers Manager */}
      {activeTab === 'vouchers' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Mã Giảm Giá Khuyến Mãi (Vouchers)</div>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã Voucher</th>
                <th>Mô Tả Áp Dụng</th>
                <th>Giá Trị Giảm</th>
                <th>Đơn Tối Thiểu</th>
                <th>Hạn Dùng</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map(v => (
                <tr key={v.code}>
                  <td><strong style={{ color: '#f97316', fontSize: '1rem', letterSpacing: '0.05em' }}>{v.code}</strong></td>
                  <td>{v.description}</td>
                  <td>
                    <strong style={{ color: '#10b981' }}>
                      {v.discountType === 'percentage' ? `${v.discountValue}%` : `${new Intl.NumberFormat('vi-VN').format(v.discountValue)}đ`}
                    </strong>
                  </td>
                  <td>{new Intl.NumberFormat('vi-VN').format(v.minOrderValue)}đ</td>
                  <td>{v.expiresAt}</td>
                  <td>
                    <span className="badge badge-success">{v.isActive ? 'Hoạt động' : 'Tạm dừng'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Banner Modal */}
      {editingBanner && (
        <div className="modal-overlay" onClick={() => setEditingBanner(null)}>
          <div 
            className="modal-content"
            style={{ maxWidth: '600px', background: '#0f172a', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={() => setEditingBanner(null)}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem' }}>
              Chỉnh Sửa Hero Banner
            </h3>

            <form onSubmit={handleSaveBanner}>
              <div className="form-group">
                <label className="form-label">Tiêu đề lớn TVC</label>
                <input
                  type="text"
                  required
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả / Phụ đề</label>
                <textarea
                  rows={2}
                  value={editingBanner.subtitle}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Link Media Video / Image URL</label>
                <input
                  type="text"
                  value={editingBanner.mediaUrl}
                  onChange={(e) => setEditingBanner({ ...editingBanner, mediaUrl: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditingBanner(null)} className="btn btn-secondary">
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  Lưu Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
