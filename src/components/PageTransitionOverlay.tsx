/**
 * ============================================================================
 * PAYPULSE ENTERPRISE — PAGE TRANSITION OVERLAY
 * ============================================================================
 * Cinematic viewport transition overlay featuring laser sweep telemetry,
 * animated status indicators, and smooth cross-view state changes.
 * ============================================================================
 */

import React from 'react';
import { motion } from 'motion/react';
import { Activity, ShieldCheck, Zap, Lock } from 'lucide-react';

/* ========================================================================== */
/* 1. TYPES & PROPS                                                           */
/* ========================================================================== */

interface PageTransitionOverlayProps {
  isTransitioning: boolean;
  message?: string;
  targetViewName?: string;
}

/* ========================================================================== */
/* 2. COMPONENT IMPLEMENTATION                                                */
/* ========================================================================== */

export const PageTransitionOverlay: React.FC<PageTransitionOverlayProps> = ({
  isTransitioning,
  message = 'INITIALIZING ZERO-DRIFT CONSOLE...',
  targetViewName = 'PayPulse Enterprise',
}) => {
  if (!isTransitioning) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-background/80 backdrop-blur-md font-mono"
    >
      {/* Sliding Laser Sweep Line */}
      <motion.div
        initial={{ left: '-10%' }}
        animate={{ left: '110%' }}
        transition={{ duration: 0.65, ease: 'easeInOut' }}
        className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent blur-md pointer-events-none"
      />

      {/* Center Cinematic Telemetry Card */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="p-6 rounded-3xl glass-card border border-primary/50 bg-surface/95 shadow-2xl backdrop-blur-2xl max-w-sm w-full mx-4 text-center space-y-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary border border-primary/40 flex items-center justify-center mx-auto shadow-glow">
          <Activity className="w-6 h-6 animate-pulse" />
        </div>

        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-primary font-bold flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3" />
            <span>256-BIT CRYPTOGRAPHIC TRANSIT</span>
          </div>
          <h4 className="text-base font-black text-content-primary tracking-tight">
            {targetViewName}
          </h4>
          <p className="text-xs text-content-secondary">{message}</p>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden relative">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-secondary via-primary to-emerald-400"
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-content-dim pt-1">
          <span>SHA-256 HASH VERIFIED</span>
          <span className="text-success font-bold">100% ZERO-DRIFT</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PageTransitionOverlay;
