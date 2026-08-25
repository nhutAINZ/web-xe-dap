import React from 'react';
import { ShieldCheck, Wrench, Truck, RefreshCw, Award, Sparkles } from 'lucide-react';
import { analytics } from '../../services/analytics';

interface BrandShowcaseProps {
  onSelectBrand: (brand: string) => void;
}

export const BrandShowcase: React.FC<BrandShowcaseProps> = ({ onSelectBrand }) => {
  const brands = [
    { name: 'Giant', desc: 'Thương hiệu số 1 thế giới', origin: 'Đài Loan' },
    { name: 'Trek', desc: 'Đẳng cấp xe đua nước Mỹ', origin: 'Hoa Kỳ' },
    { name: 'Twitter', desc: 'Đỉnh cao khung Carbon Đức', origin: 'Đức' },
    { name: 'Trinx', desc: 'Dòng xe thể thao quốc dân', origin: 'Ý / Đài Loan' },
    { name: 'Asama', desc: 'Bền bỉ, thân thuộc', origin: 'Việt Nam' },
    { name: 'Himo', desc: 'Trợ lực điện thông minh', origin: 'Himo Eco' },
  ];

  return (
    <section style={{ padding: '4rem 0', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        {/* Brand Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem auto' }}>
          <div style={{ color: '#f97316', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            ĐỐI TÁC CHÍNH HÃNG
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Nhập Khẩu & Phân Phối Trực Tiếp
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Cam kết 100% sản phẩm có hóa đơn VAT, chứng nhận xuất xứ CO/CQ và bảo hành chính hãng toàn cầu.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="brands-grid">
          {brands.map((b) => (
            <button
              key={b.name}
              onClick={() => {
                analytics.logClick('filter_use', `Bấm xem thương hiệu: ${b.name}`);
                onSelectBrand(b.name);
                const el = document.getElementById('products-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 0.75rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#f97316';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-display)', marginBottom: '0.2rem' }}>
                {b.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#f97316', fontWeight: 600, marginBottom: '0.15rem' }}>
                {b.origin}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                {b.desc}
              </div>
            </button>
          ))}
        </div>

        {/* 4 Core Guarantees */}
        <div className="guarantees-grid">
          {[
            {
              icon: <ShieldCheck size={28} color="#f97316" />,
              title: 'Bảo Hành 5 Năm',
              desc: 'Khung sườn bảo hành 5 năm, phụ tùng chính hãng 12-24 tháng.'
            },
            {
              icon: <Wrench size={28} color="#0284c7" />,
              title: 'Bảo Dưỡng Trọn Đời',
              desc: 'Cân vành, tra dầu mỡ, chỉnh củ đề hoàn toàn miễn phí tại tất cả showroom.'
            },
            {
              icon: <Truck size={28} color="#10b981" />,
              title: 'Giao Hàng Miễn Phí',
              desc: 'Freeship hỏa tốc toàn quốc, kiểm tra xe trước khi thanh toán.'
            },
            {
              icon: <RefreshCw size={28} color="#ec4899" />,
              title: 'Đổi Mới 7 Ngày',
              desc: 'Hỗ trợ đổi xe hoặc đổi size sườn miễn phí trong 7 ngày nếu không vừa ý.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
                padding: '1.25rem',
                background: '#f8fafc',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #e2e8f0'
              }}
            >
              <div style={{ flexShrink: 0 }}>{item.icon}</div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
