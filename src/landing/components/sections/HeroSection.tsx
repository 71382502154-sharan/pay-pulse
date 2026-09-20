'use client';

import React, { useState } from 'react';
import Link from '@/components/common/Link';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  Database,
  Calculator,
  AlertTriangle,
  Play,
  Activity,
  Zap,
} from 'lucide-react';
import { PayrollEcosystemCanvas } from '@/components/3d/PayrollEcosystemCanvas';
import { NodeData, PAYPULSE_NODES } from '@/components/3d/payrollNodes';
import { useDesign } from '@/context/DesignContext';
import GlowCursor from '@/components/common/GlowCursor';

export const HeroSection: React.FC = () => {
  const { config } = useDesign();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  return (
    <GlowCursor
      color={config.colors.primary || '#67E8F9'}
      secondaryColor={config.colors.secondary || '#A78BFA'}
      trailLength={40}
      trailWidth={8}
      trailTaper={0.8}
      followSpeed={0.16}
      glowIntensity={1.9}
      glowSpread={1.2}
      hotspot={0.65}
      brightness={1.25}
      opacity={1}
      pulseSpeed={1.1}
      noiseStrength={0.035}
      idleFade
      idleTimeout={700}
      fadeDuration={900}
      blendMode="screen"
      className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[520px] rounded-full blur-[140px] pointer-events-none opacity-35 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${config.colors.primary} 0%, ${config.colors.secondary} 40%, transparent 70%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Typography & CTAs (5 Cols) */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Top Project Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-primary/40 text-xs text-content-primary font-medium shadow-glow">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
              <span className="font-mono text-primary font-bold">PAYPULSE</span>
              <span className="text-content-dim font-mono">• SMART • CONSISTENT • RELIABLE</span>
            </div>

            {/* Main Cinematic Heading */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.06] text-content-primary uppercase">
                PAYPULSE.
                <br />
                <span className="gradient-text">VERIFIED BEFORE</span>
                <br />
                <span className="text-primary">IT&apos;S FINAL.</span>
              </h1>
            </div>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-content-secondary max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              <strong>Employee Payroll Naming Conventions Improvement:</strong> Calculate, validate,
              analyze, approve, and monitor enterprise compensation through one unified 3D-driven
              intelligent platform.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#engine"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-extrabold text-sm shadow-glow hover:scale-105 active:scale-95 transition-all"
              >
                <span>Explore the 3D Engine</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl glass-card border border-border hover:border-primary/50 text-content-primary hover:text-primary font-bold text-sm hover:bg-surface-elevated transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch PayPulse Control Hub</span>
              </Link>
            </div>

            {/* Node Quick-Focus Filter Pills */}
            <div className="pt-2">
              <span className="text-[10px] font-mono uppercase text-content-dim block mb-2">
                Click a module to focus 3D scene:
              </span>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5">
                {PAYPULSE_NODES.slice(0, 5).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setSelectedNodeId(selectedNodeId === n.id ? null : n.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                      selectedNodeId === n.id
                        ? 'bg-primary text-white font-bold shadow-sm'
                        : 'bg-surface-elevated/70 hover:bg-surface-elevated text-content-secondary border border-border'
                    }`}
                  >
                    {n.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Micro Live Telemetry Badges */}
            <div className="pt-6 border-t border-border grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-black font-mono text-content-primary">
                  100%
                </div>
                <div className="text-[11px] text-content-muted uppercase tracking-wider font-semibold">
                  Standardized Schema
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black font-mono text-primary">
                  0.00%
                </div>
                <div className="text-[11px] text-content-muted uppercase tracking-wider font-semibold">
                  Calculation Drift
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black font-mono text-secondary">
                  4-Stage
                </div>
                <div className="text-[11px] text-content-muted uppercase tracking-wider font-semibold">
                  Approval Pipeline
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero 3D Interactive Canvas Scene (7 Cols) */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Interactive 3D Canvas */}
            <div className="w-full h-[520px] sm:h-[580px] lg:h-[650px] relative rounded-3xl glass-panel border border-primary/40 overflow-hidden shadow-2xl">
              <PayrollEcosystemCanvas
                selectedNodeId={selectedNodeId}
                onNodeSelect={(node) => setSelectedNodeId(node.id)}
              />

              {/* Floating Live Telemetry Cards at Corners */}
              <div className="absolute top-16 right-4 z-20 pointer-events-none hidden sm:block">
                <div className="glass-card p-3 border border-border/80 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-content-muted text-[10px] font-mono">
                    <Calculator className="w-3 h-3 text-primary" />
                    <span>PAYPULSE CORE FORMULA</span>
                  </div>
                  <div className="font-mono font-bold text-content-primary">
                    NET = (BASIC + ALW) - DED
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:block">
                <div className="glass-card p-3 border border-border/80 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-success text-[10px] font-mono font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    <span>SCHEMA COMPLIANCE</span>
                  </div>
                  <div className="font-mono text-content-secondary text-[11px]">
                    142 Normalized Variables
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </GlowCursor>
  );
};
