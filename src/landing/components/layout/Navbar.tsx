'use client';

import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import {
  Activity,
  Menu,
  X,
  ArrowRight,
  Sun,
  Moon,
  Cpu,
  Layers,
  CheckCircle2,
  Sliders,
  Code2,
  FileCheck2,
} from 'lucide-react';
import { useDesign } from '@/context/DesignContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { config, setTheme } = useDesign();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Overview', href: '#capabilities' },
    { name: 'Workflow', href: '#workflow' },
    { name: 'Control Center', href: '#dashboard' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-surface/85 backdrop-blur-xl border-b border-border shadow-card'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: PAYPULSE Wordmark & Wave Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary group-hover:scale-105 group-hover:shadow-glow transition-all relative overflow-hidden">
            <Activity className="w-5 h-5 transition-transform group-hover:scale-110 animate-pulse" />
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-scan-line opacity-40 pointer-events-none" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg sm:text-xl tracking-tighter text-content-primary">
                PAY<span className="text-primary">PULSE</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-bold">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[10px] text-content-muted hidden sm:block font-mono">
              EMPLOYEE PAYROLL INTELLIGENCE
            </p>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 px-3 py-1.5 rounded-full glass-card border border-border/60">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3 py-1.5 text-xs font-medium text-content-secondary hover:text-primary rounded-full hover:bg-surface-elevated/60 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right: Theme Toggle, Login, and Primary CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Quick theme toggle */}
          <button
            onClick={() => setTheme(config.theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg border border-border bg-surface-elevated/40 text-content-secondary hover:text-content-primary hover:border-border-strong transition-all"
            aria-label="Toggle light/dark theme"
            title={`Switch to ${config.theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {config.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-warning" />
            ) : (
              <Moon className="w-4 h-4 text-primary" />
            )}
          </button>

          <Link
            href="/login"
            className="px-4 py-2 text-xs font-semibold text-content-secondary hover:text-content-primary transition-colors"
          >
            Login
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-glow hover:scale-105 active:scale-95 transition-all"
          >
            <span>Launch PayPulse</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setTheme(config.theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg border border-border bg-surface-elevated/40 text-content-secondary"
            aria-label="Toggle theme"
          >
            {config.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-warning" />
            ) : (
              <Moon className="w-4 h-4 text-primary" />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-border text-content-primary hover:bg-surface-elevated"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-surface/95 backdrop-blur-2xl px-6 py-5 space-y-4 animate-fade-in">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-content-secondary hover:text-primary hover:bg-surface-elevated rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-border flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-xs font-semibold rounded-lg border border-border text-content-primary bg-surface-elevated/50"
            >
              Login to PayPulse Portal
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-xs font-bold rounded-lg bg-primary text-white shadow-glow"
            >
              Open PayPulse Control Hub
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
