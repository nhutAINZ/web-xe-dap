import React from 'react';
import { PhoneCall, MessageCircle, Send } from 'lucide-react';
import { analytics } from '../../services/analytics';

export const FloatingContact: React.FC = () => {
  const handleHotline = () => {
    analytics.logClick('hotline', 'Gọi Hotline Nổi: 1900 8888');
    window.location.href = 'tel:19008888';
  };

  const handleZalo = () => {
    analytics.logClick('zalo', 'Mở Chat Zalo Tư Vấn');
    window.open('https://zalo.me', '_blank');
  };

  const handleMessenger = () => {
    analytics.logClick('messenger', 'Mở Chat Facebook Messenger');
    window.open('https://m.me', '_blank');
  };

  return (
    <div className="floating-contact-group">
      {/* Hotline Button */}
      <button 
        onClick={handleHotline} 
        className="floating-btn floating-hotline"
        title="Gọi hotline tư vấn miễn phí"
      >
        <PhoneCall size={22} />
        <span className="floating-badge">Hotline: 1900 8888</span>
      </button>

      {/* Zalo Button */}
      <button 
        onClick={handleZalo} 
        className="floating-btn floating-zalo"
        title="Chat tư vấn qua Zalo"
      >
        <span style={{ fontWeight: 900, fontSize: '0.82rem', letterSpacing: '-0.03em' }}>Zalo</span>
        <span className="floating-badge">Chat Zalo Miễn Phí</span>
      </button>

      {/* Messenger Button */}
      <button 
        onClick={handleMessenger} 
        className="floating-btn floating-messenger"
        title="Chat qua Messenger Facebook"
      >
        <MessageCircle size={22} />
        <span className="floating-badge">Facebook Messenger</span>
      </button>
    </div>
  );
};
