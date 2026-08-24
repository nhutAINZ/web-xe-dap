import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'glass';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'dark',
  className = ''
}) => {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const titleSize = size === 'sm' ? '1.05rem' : size === 'lg' ? '1.5rem' : '1.25rem';
  const subSize = size === 'sm' ? '0.55rem' : size === 'lg' ? '0.7rem' : '0.62rem';

  return (
    <div 
      className={`brand-logo-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '0.55rem' : '0.75rem',
        textDecoration: 'none',
        userSelect: 'none'
      }}
    >
      {/* Bespoke Aerodynamic Speed Crest Monogram */}
      <div 
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Ambient Glow */}
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff7a18" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Hexagonal / Diamond Aerodynamic Shield */}
          <path
            d="M24 3L42 13V35L24 45L6 35V13L24 3Z"
            fill="#090d16"
            stroke="url(#logoGrad)"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* Dual Aerodynamic Velocity Wings / Cycling Speed Geometry */}
          <path
            d="M13 27L24 12L35 27"
            stroke="#ffffff"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 33L24 23L31 33"
            stroke="url(#logoGrad)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glowFilter)"
          />

        </svg>
      </div>

      {/* Brand Typography */}
      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.1 }}>
        <div 
          style={{ 
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: titleSize,
            letterSpacing: '0.06em',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          DEMO<span style={{ color: '#f97316' }}>XEDAP</span>
        </div>
        <span 
          style={{ 
            fontSize: subSize, 
            fontWeight: 700, 
            letterSpacing: '0.22em', 
            color: '#94a3b8',
            textTransform: 'uppercase',
            marginTop: '2px'
          }}
        >
          PERFORMANCE CYCLES
        </span>
      </div>
    </div>
  );
};
