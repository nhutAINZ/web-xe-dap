import React, { useState } from 'react';
import { Product } from '../../types';
import { X, Bike, CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { analytics } from '../../services/analytics';

interface BikeSizingModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const BikeSizingModal: React.FC<BikeSizingModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  if (!isOpen) return null;

  const [height, setHeight] = useState<number>(168);
  const [ridingStyle, setRidingStyle] = useState<'all' | 'mtb' | 'road' | 'touring' | 'kids' | 'ebike'>('mtb');

  // Compute recommendation
  const getRecommendation = () => {
    if (height < 140) {
      return {
        frameSize: 'Size Trẻ em / Bánh 16" - 20"',
        seatHeight: '55 - 65 cm',
        advice: 'Dành cho các bạn nhỏ, học sinh tiểu học hoặc người có vóc dáng nhỏ gọn. Nên chọn xe có bánh phụ hoặc khung gấp linh hoạt.',
        category: 'kids' as const
      };
    } else if (height < 165) {
      return {
        frameSize: 'Size S (15" - 16" hoặc 48 - 50cm)',
        seatHeight: '68 - 75 cm',
        advice: 'Khung sườn cỡ nhỏ giúp bạn chống chân an toàn, tầm với ghi-đông thoải mái không gây mỏi lưng.',
        category: ridingStyle === 'all' ? 'mtb' : ridingStyle
      };
    } else if (height <= 178) {
      return {
        frameSize: 'Size M (17" - 18" hoặc 52 - 54cm)',
        seatHeight: '75 - 83 cm',
        advice: 'Kích thước tiêu chuẩn phổ biến nhất tại Việt Nam. Tư thế khí động học chuẩn xác, phát huy tối đa lực đạp.',
        category: ridingStyle === 'all' ? 'road' : ridingStyle
      };
    } else {
      return {
        frameSize: 'Size L / XL (19"+ hoặc 56cm+)',
        seatHeight: '84 - 92 cm',
        advice: 'Khung sườn cỡ lớn với khoảng cách trục bánh dài, tạo sự ổn định tối đa cho người có vóc dáng cao lớn.',
        category: ridingStyle === 'all' ? 'mtb' : ridingStyle
      };
    }
  };

  const rec = getRecommendation();

  // Find matched bikes
  const matchedBikes = products.filter(p => {
    return height >= p.suitableHeightMin && height <= p.suitableHeightMax;
  }).slice(0, 3);

  const handleProductPick = (bike: Product) => {
    analytics.logClick('product_view', `Chọn xe từ gợi ý size: ${bike.name}`, bike.id);
    onClose();
    onSelectProduct(bike);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        style={{ maxWidth: '720px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#f97316', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            <Sparkles size={16} />
            TRẮC NGHIỆM CHỌN SIZE XE CHUẨN XÁC
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
            Tìm Chiếc Xe Hoàn Hảo Cho Thể Trạng Của Bạn
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Đạp xe đúng size giúp bảo vệ cột sống, không đau khớp gối và tối ưu 100% lực đạp.
          </p>
        </div>

        {/* Height Slider Input */}
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Chiều cao của bạn:</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f97316', fontFamily: 'var(--font-display)' }}>
              {height} cm <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>({(height / 100).toFixed(2)}m)</span>
            </span>
          </div>

          <input
            type="range"
            min={110}
            max={195}
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
            style={{
              width: '100%',
              accentColor: '#f97316',
              height: '8px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>
            <span>110cm (Bé 5 tuổi)</span>
            <span>155cm (Phổ thông)</span>
            <span>170cm (Chuẩn)</span>
            <span>195cm (Cao lớn)</span>
          </div>
        </div>

        {/* Riding Style Selector */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            Mục đích & Phong cách đạp xe:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {[
              { key: 'all', label: 'Tất Cả Thể Loại' },
              { key: 'mtb', label: 'Địa Hình / Phượt Đồi Núi' },
              { key: 'road', label: 'Tốc Độ / Đường Trường' },
              { key: 'touring', label: 'Dạo Phố / Đi Làm' },
              { key: 'ebike', label: 'Trợ Lực Điện Thông Minh' },
              { key: 'kids', label: 'Dành Cho Bé Tập Đi' },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setRidingStyle(item.key as any)}
                style={{
                  padding: '0.6rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: ridingStyle === item.key ? '2px solid #f97316' : '1px solid #e2e8f0',
                  background: ridingStyle === item.key ? '#fff7ed' : '#ffffff',
                  color: ridingStyle === item.key ? '#f97316' : '#475569',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  textAlign: 'center'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result Card */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '1.75rem',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <CheckCircle2 size={18} /> KẾT QUẢ KHUYẾN NGHỊ DÀNH CHO BẠN
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '0.75rem 0' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Size khung sườn phù hợp:</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f97316' }}>{rec.frameSize}</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Độ cao yên xe gợi ý:</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>{rec.seatHeight}</div>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            {rec.advice}
          </p>
        </div>

        {/* Suggested Bikes List */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
            Gợi ý các mẫu xe phù hợp nhất với chiều cao {height}cm:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {matchedBikes.map(bike => (
              <div
                key={bike.id}
                onClick={() => handleProductPick(bike)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.65rem 0.85rem',
                  background: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <img
                  src={bike.thumbnail}
                  alt={bike.name}
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{bike.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Phù hợp: {bike.suitableHeightMin} - {bike.suitableHeightMax} cm</div>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ef4444' }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bike.salePrice)}
                </div>
                <ArrowRight size={16} color="#f97316" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
