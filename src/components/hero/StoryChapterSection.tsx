import React from 'react';
import { StoryChapter } from '../../types';
import { Sparkles, ShieldCheck, Cpu, Zap, Wrench, Award, CheckCircle2, Truck, ArrowDown } from 'lucide-react';
import { analytics } from '../../services/analytics';

interface StoryChapterSectionProps {
  chapters: StoryChapter[];
  onScrollToShop: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles size={18} color="#f97316" />,
  ShieldCheck: <ShieldCheck size={18} color="#f97316" />,
  Cpu: <Cpu size={18} color="#38bdf8" />,
  Zap: <Zap size={18} color="#38bdf8" />,
  Wrench: <Wrench size={18} color="#10b981" />,
  Award: <Award size={18} color="#10b981" />,
  CheckCircle2: <CheckCircle2 size={18} color="#ec4899" />,
  Truck: <Truck size={18} color="#ec4899" />
};

export const StoryChapterSection: React.FC<StoryChapterSectionProps> = ({
  chapters,
  onScrollToShop
}) => {
  return (
    <section id="story-section" className="story-section">
      <div className="container">
        {/* Story Section Header */}
        <div className="story-header">
          <div className="story-header-subtitle">HÀNH TRÌNH TẠO NÊN TUYỆT TÁC</div>
          <h2 className="story-header-title">
            Mỗi Vòng Quay Bánh Xe Là Một Câu Chuyện Đam Mê
          </h2>
        </div>

        {/* Chapters Cards */}
        <div className="story-chapters-list">
          {chapters.map((chapter, index) => {
            const isReverse = index % 2 !== 0;
            return (
              <div 
                key={chapter.id} 
                className={`story-chapter-card ${isReverse ? 'reverse' : ''}`}
              >
                <div className="chapter-content">
                  <div className="chapter-number">{chapter.chapterNumber}</div>
                  <div className="chapter-meta">{chapter.subtitle}</div>
                  <h3 className="chapter-title">{chapter.title}</h3>
                  <div className="chapter-tagline">{chapter.tagline}</div>

                  {chapter.description.map((desc, i) => (
                    <p key={i} className="chapter-desc">{desc}</p>
                  ))}

                  <div className="chapter-points">
                    {chapter.keyPoints.map((pt, i) => (
                      <div key={i} className="chapter-point-item">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          {ICON_MAP[pt.icon] || <Sparkles size={16} />}
                          <span className="chapter-point-title">{pt.title}</span>
                        </div>
                        <p className="chapter-point-desc">{pt.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="chapter-visual">
                  <img
                    src={chapter.bgImage}
                    alt={chapter.title}
                    loading="lazy"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Smooth Transition Bridge to E-Commerce Section */}
        <div className="shop-transition-bridge">
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 500 }}>
              Sẵn sàng chọn cho mình người bạn đồng hành hoàn hảo trên mọi cung đường?
            </p>
            <button 
              onClick={() => {
                analytics.logClick('cta_hero', 'Xem danh mục xe từ phần Storytelling');
                onScrollToShop();
              }}
              className="btn btn-primary btn-lg"
              style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}
            >
              <span>Xem Ngay Bộ Sưu Tập Xe Đạp 2026</span>
              <ArrowDown size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
