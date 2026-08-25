import React from 'react';
import { Article, StoreBranch } from '../../types';
import { ArrowLeft, ShieldCheck, Wrench, Truck, Award, CheckCircle2, Clock, User, Share2 } from 'lucide-react';

interface StaticPagesProps {
  pageKey: string;
  article?: Article | null;
  branches: StoreBranch[];
  onBack: () => void;
}

export const StaticPages: React.FC<StaticPagesProps> = ({
  pageKey,
  article,
  branches,
  onBack
}) => {
  if (pageKey === 'article' && article) {
    return (
      <div style={{ background: '#f8fafc', padding: '3rem 0 5rem 0' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <button 
            onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f97316', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem' }}
          >
            <ArrowLeft size={16} /> Quay lại danh sách bài viết
          </button>

          <article style={{ background: '#ffffff', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
            <span style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316', padding: '0.3rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
              {article.category}
            </span>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '1rem 0', lineHeight: 1.25 }}>
              {article.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.85rem', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={15} color="#f97316" /> {article.author}
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={15} /> {article.publishedAt} ({article.readTime})
              </span>
            </div>

            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2rem' }}>
              <img src={article.thumbnail} alt={article.title} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
            </div>

            <div style={{ color: '#334155', lineHeight: 1.9, fontSize: '1.05rem' }}>
              <p style={{ fontWeight: 600, fontSize: '1.15rem', color: '#0f172a', marginBottom: '1.5rem' }}>
                {article.excerpt}
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                {article.content}
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                Tại <strong>Demo Xe Đạp</strong>, chúng tôi luôn khuyến khích khách hàng trực tiếp trải nghiệm lái thử và nhận tư vấn chuyên sâu từ đội ngũ kỹ thuật viên để tìm được chiếc xe hoàn hảo nhất cho mình.
              </p>
            </div>
          </article>
        </div>
      </div>
    );
  }

  // About Brand Page
  if (pageKey === 'about') {
    return (
      <div style={{ background: '#090d16', color: '#ffffff', padding: '4rem 0 6rem 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <button 
            onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f97316', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2rem' }}
          >
            <ArrowLeft size={16} /> Quay lại trang chủ
          </button>

          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ color: '#f97316', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              CÂU CHUYỆN THƯƠNG HIỆU
            </div>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              Tinh Hoa Cơ Khí & Tình Yêu Cung Đường
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '1.15rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
              Khởi nguồn từ một xưởng xe thủ công nhỏ, Demo Xe Đạp đã vươn mình trở thành biểu tượng của sự chuẩn mực, thẩm mỹ và hiệu năng tốc độ tại Việt Nam.
            </p>
          </div>

          <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: '420px', marginBottom: '3.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <img 
              src="https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?auto=format&fit=crop&w=1200&q=80" 
              alt="Brand Story" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f97316', marginBottom: '0.65rem' }}>Tầm Nhìn Của Chúng Tôi</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '0.9rem' }}>
                Xây dựng cộng đồng đạp xe văn minh, lành mạnh và kết nối triệu người yêu thể thao khắp đất nước. Mang đến những sản phẩm đạt tiêu chuẩn thi đấu quốc tế với mức giá phù hợp nhất.
              </p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.65rem' }}>Cam Kết Chất Lượng</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '0.9rem' }}>
                100% sản phẩm có nguồn gốc xuất xứ minh bạch, kiểm tra 30 bước khắt khe trước khi xuất kho và dịch vụ chăm sóc hậu mãi trọn đời xe.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Warranty Policy Page
  return (
    <div style={{ background: '#f8fafc', padding: '3.5rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <button 
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f97316', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem' }}
        >
          <ArrowLeft size={16} /> Quay lại trang chủ
        </button>

        <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>
            Chính Sách Bảo Hành & Hậu Mãi 5 Năm
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Áp dụng cho toàn bộ khách hàng mua xe trực tiếp tại Showroom hoặc qua Website Demo Xe Đạp.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#334155', lineHeight: 1.7 }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={20} color="#f97316" /> 1. Thời hạn bảo hành
              </h3>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li><strong>Khung sườn xe:</strong> Bảo hành 05 năm đối với lỗi kỹ thuật từ nhà sản xuất (nứt, gãy mối hàn).</li>
                <li><strong>Bộ truyền động & Phụ tùng chính (Shimano, Sram):</strong> Bảo hành 12 - 24 tháng.</li>
                <li><strong>Phuộc nhún & Phanh đĩa thủy lực:</strong> Bảo hành 12 tháng.</li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Wrench size={20} color="#0284c7" /> 2. Đặc quyền bảo dưỡng trọn đời miễn phí
              </h3>
              <p>
                Khách hàng được miễn phí 100% công cân vành nan hoa, tra dầu mỡ xích líp, căn chỉnh củ đề và kiểm tra an toàn định kỳ 3 tháng/lần tại tất cả showroom.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={20} color="#10b981" /> 3. Đổi mới trong 7 ngày
              </h3>
              <p>
                Hỗ trợ đổi xe mới 1-1 hoặc đổi size sườn nếu xe gặp lỗi do nhà sản xuất trong vòng 7 ngày đầu tiên kể từ khi nhận hàng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
