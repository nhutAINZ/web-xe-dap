import React, { useState, useEffect } from 'react';
import { X, Sparkles, Copy, Check, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { analytics } from '../../services/analytics';

interface PromoPopupProps {
  onApplyVoucher?: (code: string) => void;
}

export const PromoPopup: React.FC<PromoPopupProps> = ({ onApplyVoucher }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Show popup after 4 seconds of initial visit if not dismissed before
    const hasDismissed = sessionStorage.getItem('dxd_promo_dismissed');
    if (!hasDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('dxd_promo_dismissed', 'true');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('DEMO200K');
    setCopied(true);
    analytics.logClick('banner', 'Copy mã voucher popup: DEMO200K');
    if (onApplyVoucher) onApplyVoucher('DEMO200K');
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div 
        className="modal-content"
        style={{
          maxWidth: '480px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)',
          border: '2px solid #f97316'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={handleClose}>
          <X size={20} />
        </button>

        <div 
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, #f97316, #ef4444)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            boxShadow: '0 8px 20px rgba(249, 115, 22, 0.4)'
          }}
        >
          <Gift size={32} />
        </div>

        <div style={{ color: '#f97316', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
          QUÀ TẶNG THÀNH VIÊN MỚI
        </div>

        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', lineHeight: 1.3 }}>
          Tặng Ngay 200.000đ Cho Đơn Hàng Đầu Tiên
        </h3>

        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Nhập mã ưu đãi khi thanh toán để được giảm trực tiếp 200K và miễn phí bảo dưỡng xe trọn đời!
        </p>

        {/* Voucher Code Box */}
        <div 
          style={{
            background: '#ffffff',
            border: '2px dashed #f97316',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'left' }}>Mã giảm giá:</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f97316', letterSpacing: '0.1em', fontFamily: 'var(--font-display)' }}>
              DEMO200K
            </div>
          </div>

          <button 
            onClick={handleCopyCode}
            className="btn btn-primary btn-sm"
            style={{ background: copied ? '#10b981' : undefined }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Đã Sao Chép' : 'Sao Chép'}</span>
          </button>
        </div>

        <button
          onClick={handleClose}
          className="btn btn-secondary"
          style={{ width: '100%' }}
        >
          Mua Sắm Ngay
        </button>
      </div>
    </div>
  );
};
