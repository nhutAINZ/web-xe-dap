import React, { useState, useEffect } from 'react';
import { Flame, Clock, Zap, ArrowRight } from 'lucide-react';
import { analytics } from '../../services/analytics';

interface FlashSaleBannerProps {
  onExploreFlashSale: () => void;
}

export const FlashSaleBanner: React.FC<FlashSaleBannerProps> = ({ onExploreFlashSale }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, #ea580c 0%, #b91c1c 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem 2.25rem',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        marginBottom: '2.5rem',
        boxShadow: '0 12px 28px -6px rgba(234, 88, 12, 0.35)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        <div 
          style={{
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Flame size={32} color="#ffffff" />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ background: '#ffffff', color: '#ea580c', fontWeight: 800, fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
              HOT DEAL HÔM NAY
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
              GIỜ VÀNG SĂN XE ĐẠP GIÁ SỐC
            </h3>
          </div>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>
            Giảm tới 25% cho các dòng xe Giant, Twitter & Phụ kiện chính hãng. Tặng kèm mũ bảo hiểm!
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Countdown Box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock size={18} style={{ opacity: 0.8 }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, marginRight: '0.3rem' }}>Kết thúc sau:</span>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <span style={{ background: '#0f172a', padding: '0.35rem 0.55rem', borderRadius: '6px', fontWeight: 800, fontSize: '1.1rem' }}>
              {timeLeft.hours.toString().padStart(2, '0')}
            </span>
            <span style={{ fontWeight: 800, alignSelf: 'center' }}>:</span>
            <span style={{ background: '#0f172a', padding: '0.35rem 0.55rem', borderRadius: '6px', fontWeight: 800, fontSize: '1.1rem' }}>
              {timeLeft.minutes.toString().padStart(2, '0')}
            </span>
            <span style={{ fontWeight: 800, alignSelf: 'center' }}>:</span>
            <span style={{ background: '#0f172a', padding: '0.35rem 0.55rem', borderRadius: '6px', fontWeight: 800, fontSize: '1.1rem' }}>
              {timeLeft.seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            analytics.logClick('banner', 'Xem sản phẩm Flash Sale');
            onExploreFlashSale();
          }}
          className="btn"
          style={{ background: '#ffffff', color: '#ea580c', fontWeight: 700, padding: '0.65rem 1.25rem' }}
        >
          <span>Săn Ngay</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
