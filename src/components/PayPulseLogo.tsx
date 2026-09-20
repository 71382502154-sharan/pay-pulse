/**
 * ============================================================================
 * PAYPULSE ENTERPRISE — BRAND ICON & BADGE
 * ============================================================================
 * Scalable SVG vector identity component with institutional gradients,
 * high-precision heartbeat/pulse waveforms, and multiple sizing variants.
 * ============================================================================
 */

import React from 'react';

/* ========================================================================== */
/* 1. TYPES & PROPS                                                           */
/* ========================================================================== */

export interface PayPulseLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'badge' | 'mark';
  className?: string;
}

/* ========================================================================== */
/* 2. COMPONENT IMPLEMENTATION                                                */
/* ========================================================================== */

export const PayPulseLogo: React.FC<PayPulseLogoProps> = ({
  size = 'md',
  variant = 'badge',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 select-none ${currentSize} ${className}`}
      aria-label="PayPulse Logo"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm transition-transform duration-300 hover:scale-105"
      >
        <defs>
          {/* Container Background Gradient */}
          <linearGradient id="ppBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#001815" />
            <stop offset="45%" stopColor="#000f3f" />
            <stop offset="100%" stopColor="#003e39" />
          </linearGradient>

          {/* Border Glow Gradient */}
          <linearGradient id="ppBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#71f8e4" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00a896" stopOpacity="0.4" />
          </linearGradient>

          {/* Monogram Pillar Gradient */}
          <linearGradient id="ppStemGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00504a" />
            <stop offset="40%" stopColor="#008177" />
            <stop offset="100%" stopColor="#4fdbc8" />
          </linearGradient>

          {/* Monogram Loop Arch Gradient */}
          <linearGradient id="ppLoopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#71f8e4" />
            <stop offset="45%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>

          {/* Electric Pulse Waveform Gradient */}
          <linearGradient id="ppPulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#71f8e4" />
            <stop offset="70%" stopColor="#4fdbc8" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* Pulse Glow Filter */}
          <filter id="ppGlowPulse" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Badge Background Squircle (when variant is 'badge') */}
        {variant === 'badge' && (
          <>
            <rect
              x="1.5"
              y="1.5"
              width="45"
              height="45"
              rx="12"
              fill="url(#ppBgGrad)"
              stroke="url(#ppBorderGrad)"
              strokeWidth="1.5"
            />
            {/* Subtle inner corner highlight sheen */}
            <path
              d="M 3 14 C 3 7.9 7.9 3 14 3 L 26 3 C 18 5 8 13 4 25 Z"
              fill="rgba(255, 255, 255, 0.08)"
            />
          </>
        )}

        {/* --- Monogram Base 'P' Structure --- */}
        {/* Left Vertical Foundation Pillar */}
        <rect
          x="11"
          y="10.5"
          width="5"
          height="27"
          rx="2.5"
          fill="url(#ppStemGrad)"
        />

        {/* Upper Sweeping Arch of 'P' */}
        <path
          d="M 15 12.5 L 25.5 12.5 C 31 12.5 35.5 16 35.5 20.8 C 35.5 25.5 31 29 25.5 29 L 15 29"
          stroke="url(#ppLoopGrad)"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        />

        {/* --- Financial Pulse Frequency Waveform --- */}
        {/* Ambient pulse glow underlay */}
        <path
          d="M 9 21 L 15 21 L 18 21 L 20.5 24.5 L 24 13.5 L 28 27 L 31.5 18.5 L 34 21 L 39 21"
          stroke="#71f8e4"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
          filter="url(#ppGlowPulse)"
        />

        {/* Core Electric Pulse Line */}
        <path
          d="M 9 21 L 15 21 L 18 21 L 20.5 24.5 L 24 13.5 L 28 27 L 31.5 18.5 L 34 21 L 39 21"
          stroke="url(#ppPulseGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Radiant Apex Energy Nodes */}
        {/* Primary Peak Node at (24, 13.5) */}
        <circle cx="24" cy="13.5" r="3.5" fill="#71f8e4" opacity="0.35" />
        <circle cx="24" cy="13.5" r="1.8" fill="#ffffff" />

        {/* Secondary Harmonic Node at (31.5, 18.5) */}
        <circle cx="31.5" cy="18.5" r="2.2" fill="#71f8e4" opacity="0.4" />
        <circle cx="31.5" cy="18.5" r="1.2" fill="#ffffff" />
      </svg>
    </div>
  );
};
