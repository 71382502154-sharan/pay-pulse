'use client';

import React from 'react';
import Link from '@/components/common/Link';
import { ArrowRight, Activity, Play, ShieldCheck, Sparkles } from 'lucide-react';
import { useDesign } from '@/context/DesignContext';

export const FinalCTASection: React.FC = () => {
  const { config } = useDesign();

  return (
    <section className="py-32 relative overflow-hidden text-center border-t border-border bg-transparent">
      {/* Background Ambient Aura */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[420px] rounded-full blur-[160px] pointer-events-none opacity-25"
        style={{
          background: `radial-gradient(circle, ${config.colors.primary} 0%, ${config.colors.accent} 50%, transparent 80%)`,
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Project Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-primary/40 text-xs text-content-primary font-bold shadow-glow">
          <Activity className="w-4 h-4 text-primary animate-pulse" />
          <span className="font-mono text-primary">PAYPULSE</span>
          <span className="text-content-dim font-mono">• SMART • CONSISTENT • RELIABLE</span>
        </div>

        {/* Cinematic Headline */}
        <div className="space-y-3">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-[1.05] text-content-primary">
            EVERY NUMBER MATTERS.
            <br />
            <span className="gradient-text">EVERY PAYROLL DESERVES</span>
            <br />
            <span className="text-primary">TO BE VERIFIED.</span>
          </h2>
        </div>

        <p className="text-base sm:text-lg text-content-secondary max-w-2xl mx-auto leading-relaxed">
          Standardize naming conventions, eliminate arithmetic mismatches, flag unindexed compensation
          surges, and unlock cryptographic sign-offs with PayPulse.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-sm sm:text-base shadow-glow hover:scale-105 active:scale-95 transition-all"
          >
            <span>ENTER PAYPULSE SYSTEM</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-xl glass-card border border-border hover:border-primary/50 text-content-primary hover:text-primary font-bold text-sm sm:text-base hover:bg-surface-elevated transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Role-Gated Portal Login</span>
          </Link>
        </div>

      </div>
    </section>
  );
};
