import React, { useState } from 'react';
import { StoreBranch } from '../../types';
import { X, MapPin, PhoneCall, Clock, Navigation, CheckCircle2, LocateFixed, ExternalLink } from 'lucide-react';
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

  const [selectedBranch, setSelectedBranch] = useState<StoreBranch>(branches[0] || {} as StoreBranch);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestDistance, setNearestDistance] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Haversine distance formula in KM
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleFindNearestShowroom = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ định vị GPS.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });

        // Find nearest branch
        let minD = Infinity;
        let closest: StoreBranch = branches[0];

        branches.forEach(b => {
          if (b.lat && b.lng) {
            const d = calculateDistance(latitude, longitude, b.lat, b.lng);
            if (d < minD) {
              minD = d;
              closest = b;
            }
          }
        });

        setSelectedBranch(closest);
        setNearestDistance(minD < 100 ? `${minD.toFixed(1)} km` : `${Math.round(minD)} km`);
        analytics.logClick('banner', `Tìm thấy showroom gần nhất: ${closest.name}`);
      },
      (err) => {
        setIsLocating(false);
        alert('Không thể lấy vị trí hiện tại. Vui lòng cho phép quyền truy cập vị trí trên trình duyệt.');
      }
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        style={{ maxWidth: '920px', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ color: '#f97316', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              HỆ THỐNG SHOWROOM & BẢN ĐỒ GOOGLE MAPS
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
              Trải Nghiệm Lái Thử Thực Tế Tại Showroom
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
              Ghé thăm để được chuyên gia căn chỉnh size xe miễn phí bằng máy đo laser.
            </p>
          </div>

          <button
            onClick={handleFindNearestShowroom}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <LocateFixed size={16} />
            <span>{isLocating ? 'Đang định vị...' : 'Tìm Showroom Gần Tôi Nhất'}</span>
          </button>
        </div>

        {nearestDistance && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.65rem 1rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="#10b981" />
            <span>Showroom gần bạn nhất: <strong>{selectedBranch.name}</strong> (Cách khoảng ~{nearestDistance})</span>
          </div>
        )}

        <div className="branch-modal-grid">
          {/* Branch List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '340px', overflowY: 'auto' }}>
            {branches.map((b) => (
              <div
                key={b.id}
                onClick={() => {
                  setSelectedBranch(b);
                  analytics.logClick('banner', `Chọn xem showroom: ${b.name}`);
                }}
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: selectedBranch.id === b.id ? '2px solid #f97316' : '1px solid #e2e8f0',
                  background: selectedBranch.id === b.id ? '#fff7ed' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{b.name}</h4>
                  <span style={{ fontSize: '0.72rem', color: '#f97316', fontWeight: 700, background: 'rgba(249,115,22,0.1)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                    {b.city}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'flex-start', gap: '0.35rem', marginBottom: '0.35rem' }}>
                  <MapPin size={14} color="#f97316" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{b.address}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#334155', display: 'flex', gap: '1rem' }}>
                  <span>📞 {b.phone}</span>
                  <span>🕒 {b.hours?.split('(')[0] || '08:00 - 21:00'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Branch Detail & Interactive Google Maps */}
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            {/* Interactive Google Map Embed */}
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '220px', marginBottom: '1rem', border: '1px solid #cbd5e1' }}>
              <iframe
                title={selectedBranch.name}
                src={selectedBranch.mapEmbedUrl || `https://maps.google.com/maps?q=${encodeURIComponent(selectedBranch.address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              {selectedBranch.name}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#475569', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <MapPin size={16} color="#f97316" style={{ flexShrink: 0 }} />
                <span><strong>Địa chỉ:</strong> {selectedBranch.address}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Clock size={16} color="#f97316" style={{ flexShrink: 0 }} />
                <span><strong>Giờ mở cửa:</strong> {selectedBranch.hours}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedBranch.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ flex: 1, textDecoration: 'none', justifyContent: 'center' }}
                onClick={() => analytics.logClick('banner', `Chỉ đường Google Maps: ${selectedBranch.name}`)}
              >
                <Navigation size={16} />
                <span>Chỉ Đường Trên Google Maps</span>
              </a>

              <a
                href={`tel:${selectedBranch.phone.replace(/\s+/g, '')}`}
                className="btn btn-secondary"
                style={{ textDecoration: 'none' }}
                onClick={() => analytics.logClick('hotline', `Gọi hotline showroom: ${selectedBranch.name}`)}
              >
                <PhoneCall size={16} />
                <span>Gọi Ngay</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
