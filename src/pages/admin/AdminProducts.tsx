import React, { useState, useRef } from 'react';
import { Product, BikeCategory, ProductVariant } from '../../types';
import { db } from '../../services/db';
import { Plus, Edit2, Trash2, Search, Filter, Check, X, Package, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';

interface AdminProductsProps {
  products: Product[];
  onRefresh: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ products, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [imageUploadMode, setImageUploadMode] = useState<'local' | 'url'>('local');

  const thumbnailFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
  };

  const filtered = products.filter(p => {
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase()) && !p.brand.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedCat !== 'all' && p.category !== selectedCat) return false;
    return true;
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa mẫu xe "${name}" khỏi hệ thống?`)) {
      db.deleteProduct(id);
      onRefresh();
    }
  };

  const handleCreateNew = () => {
    const newProd: Product = {
      id: 'bike-' + Date.now(),
      name: '',
      slug: 'xe-dap-moi-' + Date.now(),
      category: 'mtb',
      categoryName: 'Xe đạp Địa hình',
      brand: 'Giant',
      originalPrice: 10000000,
      salePrice: 8900000,
      discountPercent: 11,
      rating: 5.0,
      reviewCount: 0,
      thumbnail: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=800&q=80',
      gallery: [],
      shortDesc: '',
      description: '',
      variants: [
        { id: 'v1', colorName: 'Đen Cam', colorHex: '#ea580c', sizes: ['S', 'M', 'L'], image: '', stock: 10 }
      ],
      specs: {
        frameMaterial: 'Hợp kim nhôm siêu nhẹ Aluxx',
        fork: 'Phuộc dầu có khóa hành trình',
        groupset: 'Shimano 24 tốc độ',
        brakes: 'Phanh đĩa dầu thủy lực Tektro',
        wheels: 'Vành 27.5 inch',
        tires: 'Kenda 27.5x1.95',
        weight: '12.8 kg',
        origin: 'Chính hãng',
        warranty: 'Khung 5 năm, Phụ tùng 1 năm'
      },
      stock: 10,
      soldCount: 0,
      suitableHeightMin: 155,
      suitableHeightMax: 185,
      suitableAge: 'Người lớn & Thanh thiếu niên',
      targetGender: 'all',
      reviews: []
    };
    setIsNew(true);
    setEditingProduct(newProd);
  };

  // Convert uploaded local image file to base64 Data URL
  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setEditingProduct({
        ...editingProduct,
        thumbnail: base64,
        gallery: editingProduct.gallery.length === 0 ? [base64] : editingProduct.gallery
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle multiple local files for Gallery
  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProduct) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setEditingProduct(prev => prev ? {
          ...prev,
          gallery: [...prev.gallery, base64]
        } : null);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      gallery: editingProduct.gallery.filter((_, idx) => idx !== indexToRemove)
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    db.saveProduct(editingProduct);
    setEditingProduct(null);
    onRefresh();
  };

  return (
    <div>
      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, maxWidth: '500px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              placeholder="Tìm theo tên xe hoặc thương hiệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="form-select"
            style={{ width: '180px' }}
          >
            <option value="all">Tất cả phân loại</option>
            <option value="mtb">Địa hình (MTB)</option>
            <option value="road">Đua (Road)</option>
            <option value="touring">Touring</option>
            <option value="ebike">Trợ lực điện</option>
            <option value="kids">Trẻ em</option>
            <option value="folding">Xe gấp</option>
            <option value="accessories">Phụ kiện</option>
          </select>
        </div>

        <button onClick={handleCreateNew} className="btn btn-primary">
          <Plus size={18} />
          <span>Thêm Xe Đạp Mới</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên Sản Phẩm</th>
              <th>Phân Loại</th>
              <th>Thương Hiệu</th>
              <th>Giá Bán</th>
              <th>Tồn Kho</th>
              <th>Đã Bán</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <img src={p.thumbnail} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }} />
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {p.variants?.length || 1} màu | {p.specs?.groupset || 'Shimano'}
                  </div>
                </td>
                <td>{p.categoryName}</td>
                <td><span className="badge badge-primary">{p.brand}</span></td>
                <td>
                  <div style={{ fontWeight: 700, color: '#ef4444' }}>{formatPrice(p.salePrice)}</div>
                  {p.originalPrice > p.salePrice && (
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textDecoration: 'line-through' }}>{formatPrice(p.originalPrice)}</div>
                  )}
                </td>
                <td>
                  <span style={{ color: p.stock > 5 ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                    {p.stock} chiếc
                  </span>
                </td>
                <td>{p.soldCount || 0}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => { setIsNew(false); setEditingProduct({ ...p }); }}
                      style={{ color: '#38bdf8', padding: '0.35rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '4px' }}
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      style={{ color: '#ef4444', padding: '0.35rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / Create Product Modal */}
      {editingProduct && (
        <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
          <div 
            className="modal-content"
            style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', background: '#0f172a', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={() => setEditingProduct(null)}>
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={22} color="#f97316" />
              <span>{isNew ? 'Thêm Sản Phẩm Mới (Upload Ảnh Từ Máy)' : `Chỉnh Sửa: ${editingProduct.name}`}</span>
            </h2>

            <form onSubmit={handleSaveProduct}>
              {/* Product Basic Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Tên xe đạp *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Xe Đạp Địa Hình Giant ATX 830 D"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Thương hiệu *</label>
                  <input
                    type="text"
                    required
                    placeholder="Giant, Trek, Twitter, Asama, Trinx..."
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Category, Prices & Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Phân loại danh mục</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => {
                      const cat = e.target.value as BikeCategory;
                      const catMap: Record<string, string> = {
                        mtb: 'Xe đạp Địa hình',
                        road: 'Xe đạp Đua (Road)',
                        touring: 'Xe đạp Touring',
                        ebike: 'Xe đạp Trợ lực điện',
                        kids: 'Xe đạp Trẻ em',
                        folding: 'Xe đạp Gấp',
                        accessories: 'Phụ kiện & Phụ tùng'
                      };
                      setEditingProduct({ ...editingProduct, category: cat, categoryName: catMap[cat] || cat });
                    }}
                    className="form-select"
                  >
                    <option value="mtb">Xe đạp Địa hình (MTB)</option>
                    <option value="road">Xe đạp Đua (Road)</option>
                    <option value="touring">Xe đạp Touring</option>
                    <option value="ebike">Xe đạp Trợ lực điện</option>
                    <option value="kids">Xe đạp Trẻ em</option>
                    <option value="folding">Xe đạp Gấp</option>
                    <option value="accessories">Phụ kiện & Phụ tùng</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Giá gốc (VND)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: parseInt(e.target.value) || 0 })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Giá bán ưu đãi (VND) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.salePrice}
                    onChange={(e) => {
                      const sp = parseInt(e.target.value) || 0;
                      const disc = editingProduct.originalPrice > sp 
                        ? Math.round(((editingProduct.originalPrice - sp) / editingProduct.originalPrice) * 100) 
                        : 0;
                      setEditingProduct({ ...editingProduct, salePrice: sp, discountPercent: disc });
                    }}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tồn kho (Chiếc) *</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Local Image Upload Section */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                    <ImageIcon size={18} color="#f97316" />
                    <span>Hình Ảnh Sản Phẩm (Tải Trực Tiếp Từ Máy Tính)</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', background: '#090d16', padding: '3px', borderRadius: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('local')}
                      style={{
                        padding: '0.25rem 0.65rem',
                        fontSize: '0.75rem',
                        borderRadius: '4px',
                        background: imageUploadMode === 'local' ? '#f97316' : 'transparent',
                        color: '#ffffff',
                        fontWeight: 600
                      }}
                    >
                      📁 Chọn File từ máy
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('url')}
                      style={{
                        padding: '0.25rem 0.65rem',
                        fontSize: '0.75rem',
                        borderRadius: '4px',
                        background: imageUploadMode === 'url' ? '#f97316' : 'transparent',
                        color: '#ffffff',
                        fontWeight: 600
                      }}
                    >
                      🔗 Nhập URL
                    </button>
                  </div>
                </div>

                {imageUploadMode === 'local' ? (
                  <div>
                    {/* Thumbnail Uploader */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ width: '90px', height: '90px', borderRadius: '8px', overflow: 'hidden', background: '#090d16', border: '1.5px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {editingProduct.thumbnail ? (
                          <img src={editingProduct.thumbnail} alt="Thumbnail preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: '#64748b', textAlign: 'center' }}>Chưa có ảnh</span>
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                          Ảnh đại diện chính (Thumbnail)
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                          Hỗ trợ định dạng JPG, PNG, WEBP, SVG từ ổ đĩa máy tính.
                        </p>
                        
                        <input
                          type="file"
                          ref={thumbnailFileInputRef}
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleThumbnailFileChange}
                        />

                        <button
                          type="button"
                          onClick={() => thumbnailFileInputRef.current?.click()}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.78rem' }}
                        >
                          <Upload size={14} /> Tải ảnh từ máy tính
                        </button>
                      </div>
                    </div>

                    {/* Gallery Multiple Uploader */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>
                          Bộ sưu tập nhiều góc ảnh chi tiết (Gallery):
                        </span>
                        
                        <input
                          type="file"
                          ref={galleryFileInputRef}
                          accept="image/*"
                          multiple
                          style={{ display: 'none' }}
                          onChange={handleGalleryFilesChange}
                        />

                        <button
                          type="button"
                          onClick={() => galleryFileInputRef.current?.click()}
                          style={{ color: '#38bdf8', fontSize: '0.78rem', background: 'transparent', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                        >
                          <Plus size={14} /> Thêm ảnh từ máy
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {editingProduct.gallery?.map((imgUrl, gIdx) => (
                          <div key={gIdx} style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <img src={imgUrl} alt={`Gallery ${gIdx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(gIdx)}
                              style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.7)', color: '#ef4444', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="form-group">
                      <label className="form-label">Dán link ảnh đại diện (Thumbnail URL)</label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={editingProduct.thumbnail}
                        onChange={(e) => setEditingProduct({ ...editingProduct, thumbnail: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Specs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Khung sườn (Frame)</label>
                  <input
                    type="text"
                    value={editingProduct.specs?.frameMaterial || ''}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      specs: { ...editingProduct.specs, frameMaterial: e.target.value }
                    })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Bộ truyền động (Groupset)</label>
                  <input
                    type="text"
                    value={editingProduct.specs?.groupset || ''}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      specs: { ...editingProduct.specs, groupset: e.target.value }
                    })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hệ thống phanh (Brakes)</label>
                  <input
                    type="text"
                    value={editingProduct.specs?.brakes || ''}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      specs: { ...editingProduct.specs, brakes: e.target.value }
                    })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Short & Detailed Description */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Mô tả tóm tắt nổi bật</label>
                <textarea
                  rows={2}
                  placeholder="Khung Aluxx siêu nhẹ, phuộc dầu êm ái, bộ truyền động Shimano 27 tốc độ..."
                  value={editingProduct.shortDesc}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDesc: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-secondary">
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Lưu Sản Phẩm</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
