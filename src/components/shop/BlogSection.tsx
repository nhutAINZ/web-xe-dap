import React from 'react';
import { Article } from '../../types';
import { BookOpen, Clock, Eye, ArrowRight, User } from 'lucide-react';
import { analytics } from '../../services/analytics';

interface BlogSectionProps {
  articles: Article[];
  onReadArticle: (article: Article) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ articles, onReadArticle }) => {
  return (
    <section style={{ padding: '4.5rem 0', background: '#f8fafc' }}>
      <div className="container">
        {/* Header */}
        <div className="section-head">
          <div className="section-title-wrap">
            <div style={{ color: '#f97316', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              CẨM NANG & VĂN HÓA ĐẠP XE
            </div>
            <h2>Góc Chia Sẻ Kinh Nghiệm</h2>
            <p className="section-subtitle">
              Kiến thức bảo dưỡng, kỹ thuật đạp xe đường trường và những cung đường phượt truyền cảm hứng
            </p>
          </div>
        </div>

        {/* Articles Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.75rem' }}>
          {articles.map((art) => (
            <article
              key={art.id}
              onClick={() => {
                analytics.logClick('filter_use', `Đọc bài viết: ${art.title}`, art.id);
                onReadArticle(art);
              }}
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img
                  src={art.thumbnail}
                  alt={art.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
                <span 
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: '#ffffff',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  {art.category}
                </span>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.65rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={13} /> {art.publishedAt}
                  </span>
                  <span>•</span>
                  <span>{art.readTime}</span>
                </div>

                <h3 
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    lineHeight: 1.4,
                    marginBottom: '0.65rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {art.title}
                </h3>

                <p 
                  style={{
                    fontSize: '0.85rem',
                    color: '#64748b',
                    lineHeight: 1.5,
                    marginBottom: '1.25rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {art.excerpt}
                </p>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
                  <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={13} color="#f97316" /> {art.author}
                  </span>
                  <span style={{ color: '#f97316', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Đọc tiếp <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
