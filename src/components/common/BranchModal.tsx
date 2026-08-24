import React, { useState } from 'react';
import { StoreBranch } from '../../types';
import { X, MapPin, PhoneCall, Clock, Navigation, CheckCircle2 } from 'lucide-react';
import { analytics } from '../../services/analytics';

interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches: StoreBranch[];
}

export const BranchModal: React.FC<BranchModalProps> = ({
  isOpen,
  onClose,
  branches
}) => {
  if (!isOpen) return null;

  const [selectedBranch, setSelectedBranch] = useState<StoreBranch>(branches[0]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        style={{ maxWidth: '860px', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ color: '#f97316', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            HỆ THỐNG PHÂN PHỐI CHÍNH THỨC
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
            Danh Sách 4 Showroom Trải Nghiệm Thực Tế
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Ghé thăm để trải nghiệm lái thử hơn 50+ mẫu xe và nhận tư vấn cân chỉnh size xe miễn phí từ chuyên gia.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
          {/* Branch List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
            {branches.map((b) => (
              <div
                key={b.id}
                onClick={() => {
                  setSelectedBranch(b);
                  analytics.logClick('banner', `Chọn xem showroom: ${b.name}`);
                }}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: selectedBranch.id === b.id ? '2px solid #f97316' : '1px solid #e2e8f0',
                  background: selectedBranch.id === b.id ? '#fff7ed' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{b.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#f97316', fontWeight: 700, background: 'rgba(249,115,22,0.1)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                    {b.city}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'flex-start', gap: '0.35rem', marginBottom: '0.35rem' }}>
                  <MapPin size={15} color="#f97316" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{b.address}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', gap: '1rem' }}>
                  <span>📞 {b.phone}</span>
                  <span>🕒 {b.hours.split('(')[0]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Branch Detail & Map Showcase */}
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '180px', marginBottom: '1.25rem' }}>
              <img
                src={selectedBranch.image}
                alt={selectedBranch.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem' }}>
              {selectedBranch.name}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#475569', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <MapPin size={16} color="#f97316" style={{ flexShrink: 0 }} />
                <span><strong>Địa chỉ:</strong> {selectedBranch.address}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Clock size={16} color="#0284c7" style={{ flexShrink: 0 }} />
                <span><strong>Thời gian:</strong> {selectedBranch.hours}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <PhoneCall size={16} color="#10b981" style={{ flexShrink: 0 }} />
                <span><strong>Hotline cửa hàng:</strong> {selectedBranch.phone}</span>
              </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
              <a
                href={selectedBranch.mapEmbedUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.logClick('banner', `Chỉ đường Google Map: ${selectedBranch.name}`)}
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
              >
                <Navigation size={16} />
                <span>Xem Trên Google Maps</span>
              </a>
              <a
                href={`tel:${selectedBranch.phone.replace(/\s+/g, '')}`}
                className="btn btn-secondary btn-sm"
              >
                <PhoneCall size={16} />
                <span>Gọi Cửa Hàng</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
