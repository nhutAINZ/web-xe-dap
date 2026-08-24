import React, { useState } from 'react';
import { Product, BikeCategory, ProductVariant } from '../../types';
import { db } from '../../services/db';
import { Plus, Edit2, Trash2, Search, Filter, Check, X, Package } from 'lucide-react';

interface AdminProductsProps {
  products: Product[];
  onRefresh: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ products, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);

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
        { id: 'v1', colorName: 'Đen Cam', colorHex: '#ea580c', sizes: ['S', 'M', 'L'], image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=800&q=80', stock: 10 }
      ],
      specs: {
        frameMaterial: 'Hợp kim nhôm siêu nhẹ',
        fork: 'Phuộc dầu có khóa hành trình',
        groupset: 'Shimano 24 tốc độ',
        brakes: 'Phanh đĩa dầu thủy lực',
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
      suitableAge: 'Người lớn',
      targetGender: 'all',
      reviews: []
    };
    setIsNew(true);
    setEditingProduct(newProd);
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
                  <img src={p.thumbnail} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {p.variants.length} màu | {p.specs.groupset}
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
                      style={{ color: '#38bdf8', padding: '0.35rem' }}
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      style={{ color: '#ef4444', padding: '0.35rem' }}
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
            style={{ maxWidth: '800px', background: '#0f172a', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={() => setEditingProduct(null)}>
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              {isNew ? 'Thêm Sản Phẩm Mới' : `Chỉnh Sửa: ${editingProduct.name}`}
            </h2>

            <form onSubmit={handleSaveProduct}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Tên xe đạp *</label>
                  <input
                    type="text"
                    required
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
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
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
                    <option value="accessories">Phụ kiện</option>
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
                  <label className="form-label">Giá khuyến mãi (VND) *</label>
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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Link ảnh đại diện (Thumbnail URL)</label>
                  <input
                    type="text"
                    value={editingProduct.thumbnail}
                    onChange={(e) => setEditingProduct({ ...editingProduct, thumbnail: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tồn kho (Số lượng)</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả ngắn</label>
                <textarea
                  rows={2}
                  value={editingProduct.shortDesc}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDesc: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-secondary">
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
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
