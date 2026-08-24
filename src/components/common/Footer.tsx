import React, { useState } from 'react';
import { Bike, MapPin, PhoneCall, Mail, Clock, Send, ShieldCheck, Award, Heart, Check } from 'lucide-react';
import { analytics } from '../../services/analytics';

interface FooterProps {
  onOpenBranches: () => void;
  onOpenStaticPage: (page: string) => void;
  onSelectCategory: (cat: any) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBranches,
  onOpenStaticPage,
  onSelectCategory
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    analytics.logClick('cta_hero', `Đăng ký nhận bản tin: ${email}`);
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer style={{ background: '#090d16', color: '#f8fafc', paddingTop: '4.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="container">
        {/* Top Newsletter Strip */}
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(15, 23, 42, 0.9))',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            marginBottom: '4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div style={{ maxWidth: '500px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
              Đăng Ký Nhận Voucher 200.000đ
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
              Cập nhật các chương trình flash sale, ra mắt xe mới và cẩm nang phượt xe đạp độc quyền từ Demo Xe Đạp.
            </p>
          </div>

          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '420px' }}>
            <input
              type="email"
              placeholder="Nhập địa chỉ email của bạn..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.25rem', whiteSpace: 'nowrap' }}
            >
              {subscribed ? <Check size={18} /> : <Send size={18} />}
              <span>{subscribed ? 'Đã Đăng Ký!' : 'Đăng Ký'}</span>
            </button>
          </form>
        </div>

        {/* Footer 4 Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr', gap: '2.5rem', marginBottom: '3.5rem' }}>
          {/* Col 1: Brand Info */}
          <div>
            <div className="logo-brand" style={{ color: '#ffffff', marginBottom: '1rem' }}>
              <div className="logo-icon-box">
                <Bike size={24} />
              </div>
              <div>DEMO <span>XE ĐẠP</span></div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Hệ thống phân phối xe đạp thể thao, địa hình, xe đua và trợ lực điện chính hãng hàng đầu Việt Nam. Tận tâm nâng niu từng vòng quay bánh xe.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PhoneCall size={16} color="#f97316" />
                <span>Hotline: <strong>1900 8888</strong> (08:00 - 21:30)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="#38bdf8" />
                <span>Email: contact@demoxedap.vn</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Danh Mục Xe
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: '#94a3b8' }}>
              <li><button onClick={() => onSelectCategory('mtb')} style={{ color: 'inherit', textAlign: 'left' }}>Xe Đạp Địa Hình (MTB)</button></li>
              <li><button onClick={() => onSelectCategory('road')} style={{ color: 'inherit', textAlign: 'left' }}>Xe Đạp Đua (Road)</button></li>
              <li><button onClick={() => onSelectCategory('touring')} style={{ color: 'inherit', textAlign: 'left' }}>Xe Đạp Touring Đường Phố</button></li>
              <li><button onClick={() => onSelectCategory('ebike')} style={{ color: 'inherit', textAlign: 'left' }}>Xe Đạp Trợ Lực Điện</button></li>
              <li><button onClick={() => onSelectCategory('kids')} style={{ color: 'inherit', textAlign: 'left' }}>Xe Đạp Trẻ Em</button></li>
              <li><button onClick={() => onSelectCategory('accessories')} style={{ color: 'inherit', textAlign: 'left' }}>Phụ Tùng & Nón Bảo Hiểm</button></li>
            </ul>
          </div>

          {/* Col 3: Policies & Guides */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Chính Sách & Dịch Vụ
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: '#94a3b8' }}>
              <li><button onClick={() => onOpenStaticPage('about')} style={{ color: 'inherit', textAlign: 'left' }}>Câu Chuyện Thương Hiệu</button></li>
              <li><button onClick={() => onOpenStaticPage('warranty')} style={{ color: 'inherit', textAlign: 'left' }}>Chính Sách Bảo Hành 5 Năm</button></li>
              <li><button onClick={() => onOpenStaticPage('shipping')} style={{ color: 'inherit', textAlign: 'left' }}>Chính Sách Giao Hàng & Freeship</button></li>
              <li><button onClick={() => onOpenStaticPage('return')} style={{ color: 'inherit', textAlign: 'left' }}>Quy Định Đổi Trả 7 Ngày</button></li>
              <li><button onClick={() => onOpenStaticPage('careers')} style={{ color: 'inherit', textAlign: 'left' }}>Cơ Hội Nghề Nghiệp & Tuyển Dụng</button></li>
            </ul>
          </div>

          {/* Col 4: Showrooms */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Hệ Thống Showroom
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.82rem', color: '#94a3b8' }}>
              <div>
                <strong style={{ color: '#ffffff', display: 'block' }}>Showroom Quận 1 (Flagship)</strong>
                <span>188 Nguyễn Thị Minh Khai, P. Bến Thành, Q.1, TP.HCM</span>
              </div>
              <div>
                <strong style={{ color: '#ffffff', display: 'block' }}>Showroom Hà Nội</strong>
                <span>89 Hoàng Cầu, P. Ô Chợ Dừa, Q. Đống Đa, Hà Nội</span>
              </div>
              <div>
                <strong style={{ color: '#ffffff', display: 'block' }}>Showroom Đà Nẵng</strong>
                <span>254 Nguyễn Văn Linh, P. Thạc Gián, Q. Thanh Khê, ĐN</span>
              </div>
              <button 
                onClick={onOpenBranches}
                className="btn btn-outline btn-sm"
                style={{ alignSelf: 'flex-start', marginTop: '0.35rem' }}
              >
                <MapPin size={14} /> Xem Bản Đồ Showroom
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1.75rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
          <div>
            © 2026 Demo Xe Đạp (v2). Đã đăng ký bản quyền. Giấy phép ĐKKD số 0318999888 do Sở KH&ĐT TP.HCM cấp.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} color="#10b981" /> 100% Bảo Mật Thông Tin
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Award size={14} color="#f97316" /> Hàng Chính Hãng CO/CQ
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
