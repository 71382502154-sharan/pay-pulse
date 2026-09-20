'use client';

import React, { useState } from 'react';
import {
  Sliders,
  X,
  Sun,
  Moon,
  Sparkles,
  Zap,
  Box,
  RotateCcw,
  Copy,
  Check,
  Palette,
  ShieldCheck,
} from 'lucide-react';
import { useDesign } from '@/context/DesignContext';
import {
  ThemeMode,
  ColorMode,
  AnimationIntensity,
  ThreeDIntensity,
  GlowIntensity,
  MotionSpeed,
  BorderRadiusSize,
} from '@/config/design';

export const PersonalizationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const {
    config,
    setTheme,
    setColorMode,
    setAnimationIntensity,
    setThreeDIntensity,
    setGlowIntensity,
    setMotionSpeed,
    setBorderRadius,
    resetConfig,
    exportConfigJSON,
  } = useDesign();

  const handleCopyJSON = () => {
    const json = exportConfigJSON();
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Toggle Button (Always accessible) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full glass-card border border-primary/40 bg-surface/90 text-content-primary shadow-glow hover:scale-105 active:scale-95 transition-all group"
        aria-label="Toggle Design Personalization Engine"
        title="Customize Theme, Colors, 3D & Animation"
      >
        <div className="relative flex items-center justify-center">
          <Palette className="w-5 h-5 text-primary transition-transform group-hover:rotate-45" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">
          Design Studio
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-mono font-bold">
          {config.colorMode.toUpperCase()}
        </span>
      </button>

      {/* Slide-in Personalization Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
          <div
            className="relative w-full max-w-md h-full bg-surface border-l border-border shadow-2xl flex flex-col overflow-hidden animate-slide-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-surface-elevated/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-content-primary tracking-wide">
                    DESIGN PERSONALIZATION ENGINE
                  </h3>
                  <p className="text-xs text-content-muted">
                    Runtime Central Design Token Controller
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-surface-elevated text-content-muted hover:text-content-primary transition-colors"
                aria-label="Close Design Panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Configuration Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* 1. Theme Mode */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono uppercase tracking-wider text-content-dim flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-primary" /> THEME MODE
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['dark', 'light'] as ThemeMode[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        config.theme === t
                          ? 'border-primary bg-primary/15 text-primary shadow-sm'
                          : 'border-border bg-surface-elevated/40 text-content-secondary hover:border-border-strong'
                      }`}
                    >
                      {t === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                      <span className="capitalize">{t} Theme</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Color Mode Palette */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono uppercase tracking-wider text-content-dim flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-secondary" /> COLOR PALETTE
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'fintech', name: 'Fintech Emerald', desc: 'Modern precision', color: '#10b981' },
                    { id: 'professional', name: 'Sapphire Cobalt', desc: 'Enterprise trust', color: '#2563eb' },
                    { id: 'corporate', name: 'Indigo Violet', desc: 'Command center', color: '#6366f1' },
                    { id: 'monochrome', name: 'Platinum Onyx', desc: 'Minimal architectural', color: '#ffffff' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setColorMode(mode.id as ColorMode)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        config.colorMode === mode.id
                          ? 'border-primary bg-primary/15 shadow-sm'
                          : 'border-border bg-surface-elevated/40 hover:border-border-strong'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: mode.color }}
                        />
                        <span className="text-xs font-bold text-content-primary">{mode.name}</span>
                      </div>
                      <span className="text-[10px] text-content-muted block">{mode.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. 3D Intensity */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono uppercase tracking-wider text-content-dim flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-accent" /> 3D SCENE INTENSITY
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['none', 'subtle', 'medium', 'heavy'] as ThreeDIntensity[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setThreeDIntensity(level)}
                      className={`py-2 px-1 text-center rounded border text-xs capitalize font-medium transition-all ${
                        config.threeDIntensity === level
                          ? 'border-primary bg-primary/20 text-primary font-bold'
                          : 'border-border bg-surface-elevated/30 text-content-muted hover:text-content-secondary'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Glow Intensity */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono uppercase tracking-wider text-content-dim flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-warning" /> GLOW & ILLUMINATION
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['off', 'subtle', 'strong'] as GlowIntensity[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGlowIntensity(g)}
                      className={`py-2 px-2 text-center rounded border text-xs capitalize font-medium transition-all ${
                        config.glowIntensity === g
                          ? 'border-primary bg-primary/20 text-primary font-bold'
                          : 'border-border bg-surface-elevated/30 text-content-muted hover:text-content-secondary'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Animation Intensity & Motion */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono uppercase tracking-wider text-content-dim flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-success" /> ANIMATION INTENSITY
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['minimal', 'balanced', 'cinematic', 'extreme'] as AnimationIntensity[]).map((a) => (
                    <button
                      key={a}
                      onClick={() => setAnimationIntensity(a)}
                      className={`py-2 px-1 text-center rounded border text-[11px] capitalize font-medium transition-all ${
                        config.animationIntensity === a
                          ? 'border-primary bg-primary/20 text-primary font-bold'
                          : 'border-border bg-surface-elevated/30 text-content-muted hover:text-content-secondary'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Motion Speed Profile */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono uppercase tracking-wider text-content-dim flex items-center gap-1.5">
                  MOTION CADENCE
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['calm', 'smooth', 'dynamic'] as MotionSpeed[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMotionSpeed(m)}
                      className={`py-2 px-2 text-center rounded border text-xs capitalize font-medium transition-all ${
                        config.motionSpeed === m
                          ? 'border-primary bg-primary/20 text-primary font-bold'
                          : 'border-border bg-surface-elevated/30 text-content-muted hover:text-content-secondary'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* 7. Border Radius */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono uppercase tracking-wider text-content-dim">
                  BORDER RADIUS SCALE
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['sm', 'md', 'lg', 'full'] as BorderRadiusSize[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setBorderRadius(r)}
                      className={`py-2 px-1 text-center rounded border text-xs uppercase font-mono font-medium transition-all ${
                        config.borderRadius === r
                          ? 'border-primary bg-primary/20 text-primary font-bold'
                          : 'border-border bg-surface-elevated/30 text-content-muted hover:text-content-secondary'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Central Token Integrity Note */}
              <div className="p-3.5 rounded-lg bg-surface-elevated/70 border border-border flex items-start gap-2.5 text-xs text-content-muted">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p>
                  Zero colors are hardcoded. All components listen directly to CSS Custom Properties
                  managed in <code className="text-primary font-mono text-[11px]">design.ts</code>.
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-border bg-surface-elevated/50 flex items-center gap-3">
              <button
                onClick={resetConfig}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-border text-content-secondary hover:text-content-primary hover:bg-surface-elevated text-xs font-semibold transition-all"
                title="Reset to default fintech dark profile"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleCopyJSON}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-glow transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Config JSON Copied!' : 'Export Config JSON'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
