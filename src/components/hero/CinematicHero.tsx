import React, { useState, useEffect } from 'react';
import { HeroBanner } from '../../types';
import { Play, ArrowRight, ShieldCheck, Sparkles, ChevronDown, Award } from 'lucide-react';
import { analytics } from '../../services/analytics';

interface CinematicHeroProps {
  banners: HeroBanner[];
  onOpenSizeQuiz: () => void;
  onExploreProducts: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  banners,
  onOpenSizeQuiz,
  onExploreProducts
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const activeBanners = banners.filter(b => b.isActive);
  const currentBanner = activeBanners[currentIdx] || banners[0];

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % activeBanners.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const handleCtaClick = (ctaName: string) => {
    analytics.logClick('cta_hero', `Hero CTA: ${ctaName}`, currentBanner.id);
    onExploreProducts();
  };

  const handleSizeQuizClick = () => {
    analytics.logClick('cta_hero', 'Hero CTA: Tư Vấn Chọn Size', currentBanner.id);
    onOpenSizeQuiz();
  };

  return (
    <section className="cinematic-hero">
      {/* Video or Image Background Loop */}
      <div className="hero-video-wrapper">
        {currentBanner.mediaType === 'video' ? (
          <video
            key={currentBanner.mediaUrl}
            autoPlay
            loop
            muted
            playsInline
            poster={currentBanner.posterUrl}
            onLoadedData={() => setVideoLoaded(true)}
            className="hero-video"
          >
            <source src={currentBanner.mediaUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={currentBanner.mediaUrl}
            alt={currentBanner.title}
            className="hero-video"
            loading="eager"
          />
        )}
      </div>

      {/* Cinematic Vignette Overlay */}
      <div className="hero-overlay" />

      {/* TVC Content Center */}
      <div className="hero-content">
        <div className="hero-badge animate-fade-in">
          <Sparkles size={15} />
          {currentBanner.badge || 'DEMO XE ĐẠP 2026'}
        </div>

        <h1 className="hero-title animate-fade-in">
          {currentBanner.title}
        </h1>

        <p className="hero-subtitle animate-fade-in">
          {currentBanner.subtitle}
        </p>

        <div className="hero-cta-group animate-fade-in">
          <button 
            onClick={() => handleCtaClick(currentBanner.ctaText)}
            className="btn btn-primary btn-lg"
          >
            <span>{currentBanner.ctaText || 'Khám Phá Sản Phẩm'}</span>
            <ArrowRight size={20} />
          </button>

          <button 
            onClick={handleSizeQuizClick}
            className="btn btn-secondary btn-lg"
          >
            <span>{currentBanner.secondaryCtaText || 'Tư Vấn Chọn Size Xe'}</span>
          </button>
        </div>

        {/* Feature Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem' }}>
            <ShieldCheck size={18} color="#f97316" />
            <span>Khung Sườn Bảo Hành 5 Năm</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem' }}>
            <Award size={18} color="#38bdf8" />
            <span>100% Linh Kiện Shimano Chính Hãng</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem' }}>
            <Sparkles size={18} color="#10b981" />
            <span>Miễn Phí Bảo Dưỡng Trọn Đời</span>
          </div>
        </div>
      </div>

      {/* Hero Scroll Indicator */}
      <a 
        href="#story-section" 
        className="hero-scroll-indicator"
        onClick={() => analytics.logClick('cta_hero', 'Cuộn xuống xem câu chuyện')}
      >
        <span>Khám Phá Hành Trình</span>
        <ChevronDown size={18} color="#f97316" />
      </a>
    </section>
  );
};
