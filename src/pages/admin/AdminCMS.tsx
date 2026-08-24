import React, { useState, useRef } from 'react';
import { HeroBanner, StoryChapter, Article, Voucher, StoreBranch } from '../../types';
import { db } from '../../services/db';
import { Layers, Image as ImageIcon, Film, BookOpen, Tag, Plus, Edit2, Trash2, Check, X, MapPin, Navigation, Upload } from 'lucide-react';

interface AdminCMSProps {
  banners: HeroBanner[];
  chapters: StoryChapter[];
  articles: Article[];
  vouchers: Voucher[];
  branches: StoreBranch[];
  onRefresh: () => void;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({
  banners,
  chapters,
  articles,
  vouchers,
  branches,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'banners' | 'branches' | 'chapters' | 'articles' | 'vouchers'>('branches');

  // Edit Banner
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);

  // Edit / Add Branch
  const [editingBranch, setEditingBranch] = useState<StoreBranch | null>(null);
  const [isNewBranch, setIsNewBranch] = useState(false);
  const branchFileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;
    db.saveBanner(editingBanner);
    setEditingBanner(null);
    onRefresh();
  };

  const handleCreateBranch = () => {
    const newB: StoreBranch = {
      id: 'br-' + Date.now(),
      name: '',
      city: 'Hồ Chí Minh',
      address: '',
      phone: '0908 888 999',
      hours: '08:00 - 21:30',
      hotline: '1900 8888',
      mapEmbedUrl: '',
      image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=800&q=80',
      lat: 10.7725,
      lng: 106.6908
    };
    setIsNewBranch(true);
    setEditingBranch(newB);
  };

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch || !editingBranch.name || !editingBranch.address) return;

    // Auto-generate Google Maps Embed if empty
    let embedUrl = editingBranch.mapEmbedUrl;
    if (!embedUrl) {
      embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(editingBranch.address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
    }

    db.saveBranch({ ...editingBranch, mapEmbedUrl: embedUrl });
    setEditingBranch(null);
    onRefresh();
  };

  const handleDeleteBranch = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa showroom "${name}" khỏi hệ thống?`)) {
      db.deleteBranch(id);
      onRefresh();
    }
  };

  const handleBranchImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingBranch) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setEditingBranch({
        ...editingBranch,
        image: event.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { key: 'branches', label: '📍 Địa Điểm & Google Maps', count: branches.length },
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

      {/* 1. Showroom & Google Maps Location Manager */}
      {activeTab === 'branches' && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="admin-card-title">Hệ Thống Showroom Trực Thuộc & Bản Đồ Google Maps</div>
            <button onClick={handleCreateBranch} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Thêm Showroom Mới</span>
            </button>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Ảnh Showroom</th>
                <th>Tên Showroom</th>
                <th>Thành Phố</th>
                <th>Địa Chỉ & Hotline</th>
                <th>Bản Đồ Google Maps</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {branches.map(b => (
                <tr key={b.id}>
                  <td>
                    <img src={b.image} alt={b.name} style={{ width: '56px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                  </td>
                  <td>
                    <strong style={{ color: '#ffffff' }}>{b.name}</strong>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Giờ mở: {b.hours}</div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{b.city}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', maxWidth: '260px' }}>{b.address}</div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>SĐT: {b.phone}</div>
                  </td>
                  <td>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(b.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.78rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                    >
                      <Navigation size={13} /> Xem trên Google Maps
                    </a>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => { setIsNewBranch(false); setEditingBranch({ ...b }); }}
                        style={{ color: '#38bdf8', padding: '0.35rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '4px' }}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteBranch(b.id, b.name)}
                        style={{ color: '#ef4444', padding: '0.35rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. Banners Manager */}
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

      {/* 3. Story Chapters Manager */}
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

      {/* 4. Articles Manager */}
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

      {/* 5. Vouchers Manager */}
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

      {/* Edit / Add Showroom Modal */}
      {editingBranch && (
        <div className="modal-overlay" onClick={() => setEditingBranch(null)}>
          <div 
            className="modal-content"
            style={{ maxWidth: '680px', background: '#0f172a', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={() => setEditingBranch(null)}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} color="#f97316" />
              <span>{isNewBranch ? 'Thêm Showroom Mới' : `Chỉnh Sửa: ${editingBranch.name}`}</span>
            </h3>

            <form onSubmit={handleSaveBranch}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Tên Showroom *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Showroom Demo Xe Đạp Quận 1 (Flagship)"
                    value={editingBranch.name}
                    onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tỉnh / Thành phố *</label>
                  <input
                    type="text"
                    required
                    placeholder="Hồ Chí Minh, Hà Nội, Đà Nẵng..."
                    value={editingBranch.city}
                    onChange={(e) => setEditingBranch({ ...editingBranch, city: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Địa chỉ chi tiết (Dùng cho Google Maps) *</label>
                <input
                  type="text"
                  required
                  placeholder="Số nhà, Tên đường, Phường, Quận..."
                  value={editingBranch.address}
                  onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Số điện thoại liên hệ</label>
                  <input
                    type="text"
                    value={editingBranch.phone}
                    onChange={(e) => setEditingBranch({ ...editingBranch, phone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Giờ mở cửa</label>
                  <input
                    type="text"
                    value={editingBranch.hours}
                    onChange={(e) => setEditingBranch({ ...editingBranch, hours: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Showroom Image Local Upload */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Hình ảnh mặt tiền Showroom (Tải từ máy)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img src={editingBranch.image} alt="Preview" style={{ width: '80px', height: '56px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <input
                    type="file"
                    ref={branchFileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleBranchImageFile}
                  />
                  <button
                    type="button"
                    onClick={() => branchFileInputRef.current?.click()}
                    className="btn btn-secondary btn-sm"
                  >
                    <Upload size={14} /> Chọn ảnh từ máy tính
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditingBranch(null)} className="btn btn-secondary">
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Lưu Showroom</span>
                </button>
              </div>
            </form>
          </div>
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
