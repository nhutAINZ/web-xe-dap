import React, { useState, useEffect } from 'react';
import { HeroBanner } from '../../types';
import { ArrowRight, ShieldCheck, Wrench, ChevronDown, Award, Compass } from 'lucide-react';
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
        {/* Luxury Badge */}
        <div className="hero-badge animate-fade-in">
          <span className="pulse-indicator-dot" />
          <span>{currentBanner.badge || 'BỘ SƯU TẬP PREMIER 2026'}</span>
        </div>

        {/* Display Title with Shimmer and Depth */}
        <h1 className="hero-title animate-fade-in">
          {currentBanner.title}
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle animate-fade-in">
          {currentBanner.subtitle}
        </p>

        {/* CTA Button Group */}
        <div className="hero-cta-group animate-fade-in">
          <button 
            onClick={() => handleCtaClick(currentBanner.ctaText)}
            className="btn btn-primary btn-lg hero-btn-primary"
          >
            <span>{currentBanner.ctaText || 'Khám Phá Sản Phẩm'}</span>
            <ArrowRight size={18} />
          </button>

          <button 
            onClick={handleSizeQuizClick}
            className="btn btn-secondary btn-lg hero-btn-secondary"
          >
            <Compass size={18} color="#38bdf8" />
            <span>{currentBanner.secondaryCtaText || 'Tư Vấn Chọn Size Xe'}</span>
          </button>
        </div>

        {/* Floating Glass Trust Bar */}
        <div className="hero-trust-bar animate-fade-in">
          <div className="trust-pill">
            <ShieldCheck size={16} color="#f97316" />
            <span>Khung Sườn Bảo Hành <strong>5 Năm</strong></span>
          </div>
          <div className="trust-divider" />
          <div className="trust-pill">
            <Award size={16} color="#38bdf8" />
            <span>100% Linh Kiện <strong>Shimano Chính Hãng</strong></span>
          </div>
          <div className="trust-divider" />
          <div className="trust-pill">
            <Wrench size={16} color="#10b981" />
            <span>Miễn Phí <strong>Cân Vành Trọn Đời</strong></span>
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
