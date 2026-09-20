/**
 * ============================================================================
 * PAYPULSE ENTERPRISE — PUBLIC LANDING PAGE
 * ============================================================================
 * Interactive landing experience featuring real-time WebGL 3D payroll node
 * ecosystem, module preview slider, cryptographic audit workflow, and seamless
 * navigation to the administrative console.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { DesignProvider, useDesign } from './context/DesignContext';
import { PayrollEcosystemCanvas } from './components/3d/PayrollEcosystemCanvas';
import { NodeData, PAYPULSE_NODES } from './components/3d/payrollNodes';
import { ApprovalWorkflowSection } from './components/sections/ApprovalWorkflowSection';
import { PlatformPageSlider } from './components/sections/PlatformPageSlider';
import { PayPulseLogo } from '../components/PayPulseLogo';
import { UserProfile } from '../types';
import GlowCursor from './components/common/GlowCursor';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  Play,
  Sun,
  Moon,
  CheckCircle2,
  Lock,
  Cpu,
  Layers,
  Users,
  Database,
  Code2,
  Clock,
  Award,
  ChevronRight,
  TrendingUp,
  FileText,
  DollarSign,
  Calculator
} from 'lucide-react';

/* ========================================================================== */
/* 1. TYPES & PROPS                                                           */
/* ========================================================================== */

export interface PayPulseLandingPageProps {
  /** Opens the login gateway modal / screen */
  onOpenLogin: () => void;
  /** Direct jump to dashboard if already authenticated */
  onOpenDashboard?: () => void;
  /** Whether the user has an active authenticated session */
  isAuthenticated?: boolean;
  /** Logged in operator profile */
  currentUser?: UserProfile | null;
  /** External dark mode flag */
  isDark?: boolean;
  /** Theme toggle handler */
  onToggleTheme?: () => void;
}

/* ========================================================================== */
/* 2. LANDING PAGE CONTENT COMPONENT                                          */
/* ========================================================================== */

const ThreeDLandingContent: React.FC<PayPulseLandingPageProps> = ({
  onOpenLogin,
  onOpenDashboard,
  isAuthenticated,
  currentUser,
  isDark: propIsDark,
  onToggleTheme,
}) => {
  const { config, setTheme } = useDesign();
  const [selectedNode, setSelectedNode] = useState<NodeData>(PAYPULSE_NODES[0]);

  // Synchronize with external theme if provided
  useEffect(() => {
    if (propIsDark !== undefined) {
      const targetTheme = propIsDark ? 'dark' : 'light';
      if (config.theme !== targetTheme) {
        setTheme(targetTheme);
      }
    }
  }, [propIsDark, config.theme, setTheme]);

  // Listen for global navigation events
  useEffect(() => {
    const handleNav = (e: Event) => {
      const customEvent = e as CustomEvent<{ path: string }>;
      const path = customEvent.detail?.path;
      if (path === '/login' || path === 'login') {
        onOpenLogin();
      } else if (path === '/dashboard' || path === 'dashboard') {
        if (isAuthenticated && onOpenDashboard) {
          onOpenDashboard();
        } else {
          onOpenLogin();
        }
      }
    };

    window.addEventListener('paypulse-navigate', handleNav);
    return () => window.removeEventListener('paypulse-navigate', handleNav);
  }, [onOpenLogin, onOpenDashboard, isAuthenticated]);

  const handleLaunchApp = () => {
    if (isAuthenticated && onOpenDashboard) {
      onOpenDashboard();
    } else {
      onOpenLogin();
    }
  };

  const handleThemeToggle = () => {
    if (onToggleTheme) {
      onToggleTheme();
    } else {
      setTheme(config.theme === 'light' ? 'dark' : 'light');
    }
  };

  const isLight = config.theme === 'light';

  return (
    <GlowCursor
      color={isLight ? '#00bba7' : '#71f8e4'}
      secondaryColor={isLight ? '#00258a' : '#808dc2'}
      trailLength={34}
      trailWidth={5.5}
      trailTaper={0.82}
      followSpeed={0.92}
      glowIntensity={0.85}
      glowSpread={0.95}
      hotspot={0.75}
      brightness={isLight ? 1.5 : 1.35}
      opacity={isLight ? 0.8 : 0.75}
      pulseSpeed={0.85}
      noiseStrength={0.015}
      idleFade
      idleTimeout={900}
      fadeDuration={600}
      blendMode={isLight ? 'normal' : 'screen'}
      className="min-h-screen w-full flex flex-col bg-background text-content-primary relative overflow-x-hidden font-['Hanken_Grotesk'] transition-colors duration-300"
      contentClassName="flex-1 flex flex-col w-full"
    >
      {/* Dynamic Background Ambient Gradients matching Web App Cockpit */}
      <div
        className="absolute top-1/4 left-1/2 w-[720px] h-[520px] rounded-full blur-[140px] pointer-events-none opacity-25 transition-all duration-700"
        style={{
          background: isLight
            ? 'radial-gradient(circle, rgba(0, 106, 99, 0.12) 0%, rgba(23, 37, 84, 0.08) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0, 106, 99, 0.35) 0%, rgba(113, 248, 228, 0.15) 45%, transparent 70%)',
          transform: 'translate3d(-50%, -50%, 0)',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute top-2/3 right-1/4 w-[600px] h-[450px] rounded-full blur-[160px] pointer-events-none opacity-20 transition-all duration-700"
        style={{
          background: isLight
            ? 'radial-gradient(circle, rgba(79, 92, 142, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(23, 37, 84, 0.35) 0%, rgba(128, 141, 194, 0.12) 50%, transparent 70%)',
        }}
      />

      {/* Clean Modern Navbar strictly matching Web App Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 py-3 px-4 sm:px-8 flex items-center justify-between backdrop-blur-xl border-b transition-colors duration-300 ${
          isLight
            ? 'bg-white/95 border-[#eaedff] text-[#131b2e] shadow-[0_1px_4px_rgba(0,0,0,0.03)]'
            : 'bg-[#000f3f]/95 border-[#172554] text-white shadow-[0_1px_8px_rgba(0,0,0,0.3)]'
        }`}
      >
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <PayPulseLogo size="md" variant="badge" className="shadow-glow shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-extrabold text-lg tracking-tight ${isLight ? 'text-[#0a0f1d]' : 'text-white'}`}>
                PAY<span className="text-[#007a72] dark:text-[#71f8e4]">PULSE</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#007a72]/15 text-[#007a72] dark:text-[#71f8e4] border border-[#007a72]/30 font-bold hidden sm:inline-block">
                Enterprise Payroll Console
              </span>
            </div>
            <p className={`text-[10px] font-mono hidden md:block leading-none mt-0.5 ${isLight ? 'text-[#334155]' : 'text-[#808dc2]'}`}>
              Corporate Payroll Management & HR Analytics
            </p>
          </div>
        </div>

        {/* Center Nav Jump Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-mono font-semibold">
          <a href="#capabilities" className={`transition-colors ${isLight ? 'text-[#1e293b] hover:text-[#007a72]' : 'text-[#808dc2] hover:text-white'}`}>Overview</a>
          <a href="#platform-slider" className={`transition-colors font-bold ${isLight ? 'text-[#007a72]' : 'text-[#71f8e4]'}`}>Interactive Modules</a>
          <a href="#workflow" className={`transition-colors ${isLight ? 'text-[#1e293b] hover:text-[#007a72]' : 'text-[#808dc2] hover:text-white'}`}>4-Stage Approvals</a>
          <a href="#compliance" className={`transition-colors ${isLight ? 'text-[#1e293b] hover:text-[#007a72]' : 'text-[#808dc2] hover:text-white'}`}>Compliance & Escrow</a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Theme Switcher */}
          <button
            onClick={handleThemeToggle}
            className={`p-2 rounded-xl border transition-all cursor-pointer shadow-sm ${
              isLight
                ? 'bg-white text-[#334155] border-[#94a3b8] hover:text-[#0a0f1d]'
                : 'bg-[#000f3f] text-[#808dc2] border-[#25356e] hover:text-white'
            }`}
            aria-label="Toggle theme"
            title={`Switch to ${isLight ? 'Dark' : 'Light'} mode`}
          >
            {isLight ? (
              <Moon className="w-4 h-4 text-[#000f3f]" />
            ) : (
              <Sun className="w-4 h-4 text-[#71f8e4]" />
            )}
          </button>

          {/* Authentication / Launch Console */}
          {isAuthenticated && currentUser ? (
            <button
              onClick={handleLaunchApp}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006a63] hover:bg-[#00504a] text-white font-bold text-xs shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <span>Console ({currentUser.name?.split(' ')[0] || 'User'})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                className={`hidden sm:inline-block px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  isLight ? 'text-[#1e293b] hover:text-[#0a0f1d] hover:bg-[#eaedff]' : 'text-[#808dc2] hover:text-white hover:bg-[#172554]'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={handleLaunchApp}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#006a63] hover:bg-[#00504a] text-white font-bold text-xs shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <span>Launch Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Hero Section: Balanced Two-Column Layout */}
      <section className="pt-24 pb-14 sm:pt-28 sm:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Hero Copy & Value Props */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-primary/30 text-xs font-mono font-medium text-primary shadow-glow">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span>CORPORATE PAYROLL & COMPENSATION MANAGEMENT</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.35rem] font-black uppercase tracking-tight leading-[1.08] text-content-primary">
              Enterprise Payroll. <br />
              <span className="gradient-text">Automated Pay Runs.</span> <br />
              Complete HR Control.
            </h1>

            <p className="text-sm sm:text-base text-content-secondary leading-relaxed max-w-xl mx-auto lg:mx-0">
              Manage employee directories, configure salary structures with standard allowances and statutory deductions, process monthly pay runs, manage multi-tier approvals, and generate itemized payslips with AI-assisted reporting.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={handleLaunchApp}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-glow hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Enter PayPulse Console</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>

              <a
                href="#platform-slider"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl glass-card border border-border hover:border-primary/50 text-content-secondary hover:text-content-primary font-semibold text-xs transition-all cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>Explore Platform Modules</span>
              </a>
            </div>

            {/* 3 Real Platform Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-content-primary">100%</div>
                <div className="text-[11px] text-content-muted uppercase tracking-wider font-semibold">Automated Pay Runs</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-primary">Multi-Tier</div>
                <div className="text-[11px] text-content-muted uppercase tracking-wider font-semibold">Approval Flow</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-secondary">Instant</div>
                <div className="text-[11px] text-content-muted uppercase tracking-wider font-semibold">Itemized Payslips</div>
              </div>
            </div>
          </div>

          {/* Right Column: Framed Clean 3D Interactive Ecosystem */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className={`w-full h-[460px] sm:h-[520px] lg:h-[560px] rounded-3xl border shadow-2xl relative overflow-hidden backdrop-blur-xl transition-colors duration-300 ${
              isLight ? 'bg-white/95 border-[#eaedff]' : 'bg-[#111827]/95 border-[#1e293b]'
            }`}>
              <PayrollEcosystemCanvas
                onNodeSelect={(node) => setSelectedNode(node)}
                selectedNodeId={selectedNode?.id}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Core Platform Capabilities & Architecture (#capabilities) */}
      <section
        id="capabilities"
        className="py-20 border-t border-border bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-mono text-primary font-bold">
              <Layers className="w-3.5 h-3.5" /> PLATFORM MODULES & CAPABILITIES
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-content-primary tracking-tight">
              HOW PAYPULSE <span className="gradient-text">POWERS ENTERPRISE PAYROLL.</span>
            </h2>
            <p className="text-base text-content-secondary leading-relaxed">
              PayPulse provides an end-to-end corporate payroll management system that unifies employee records, salary structures, attendance tracking, multi-tier approvals, itemized payslip generation, and Gemini AI assistance.
            </p>
          </div>

          {/* 6 Core Platform Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl glass-card border border-border hover:border-primary/40 shadow-card transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary border border-primary/30 flex items-center justify-center font-bold">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-content-primary group-hover:text-primary transition-colors">
                  Automated Pay Run Execution
                </h3>
                <p className="text-xs font-mono text-content-dim mt-1">Monthly Payroll Processing</p>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                Execute complete monthly pay runs with automated gross-to-net calculations, statutory deductions (PF, TDS), and historical audit records.
              </p>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-content-muted">Processing:</span>
                <span className="text-primary font-bold">Automated & Fast</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-border hover:border-primary/40 shadow-card transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary border border-secondary/30 flex items-center justify-center font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-content-primary group-hover:text-primary transition-colors">
                  Salary Structure & Allowances
                </h3>
                <p className="text-xs font-mono text-content-dim mt-1">Custom Compensation Setup</p>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                Configure basic monthly pay, house rent allowance (HRA), bonuses, reimbursements, and statutory tax withholdings per employee tier.
              </p>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-content-muted">Structure:</span>
                <span className="text-primary font-bold">Configurable Tiers</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-border hover:border-primary/40 shadow-card transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent border border-accent/30 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-content-primary group-hover:text-primary transition-colors">
                  Employee Directory & Profiles
                </h3>
                <p className="text-xs font-mono text-content-dim mt-1">Centralized Personnel Hub</p>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                Maintain comprehensive personnel records, department codes, designations, bank credentials, and historical compensation adjustments.
              </p>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-content-muted">Directory:</span>
                <span className="text-accent font-bold">Batch & CSV Import</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-border hover:border-primary/40 shadow-card transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-warning/15 text-warning border border-warning/30 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-content-primary group-hover:text-primary transition-colors">
                  Multi-Tier Approvals Workflow
                </h3>
                <p className="text-xs font-mono text-content-dim mt-1">Role-Based Governance</p>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                Enforce sequential multi-level sign-offs across Department Managers, Finance Controllers, and HR Directors before finalizing payouts.
              </p>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-content-muted">Governance:</span>
                <span className="text-warning font-bold">Multi-Role Sign-Off</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-border hover:border-primary/40 shadow-card transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary border border-primary/30 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-content-primary group-hover:text-primary transition-colors">
                  Itemized Payslips & Downloads
                </h3>
                <p className="text-xs font-mono text-content-dim mt-1">Digital Payslip Generator</p>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                Generate transparent itemized payslips with breakdowns of gross earnings, PF, TDS deductions, and net pay ready for instant PDF export.
              </p>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-content-muted">Distribution:</span>
                <span className="text-primary font-bold">Instant PDF Download</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-border hover:border-primary/40 shadow-card transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-success/15 text-success border border-success/30 flex items-center justify-center font-bold">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-content-primary group-hover:text-primary transition-colors">
                  Gemini AI Assistance
                </h3>
                <p className="text-xs font-mono text-content-dim mt-1">Smart Payroll Intelligence</p>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                Integrated Gemini AI assists with inspecting discrepancies, summarizing payroll metrics, and answering natural language queries in real time.
              </p>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-content-muted">Intelligence:</span>
                <span className="text-success font-bold">Gemini AI Powered</span>
              </div>
            </div>
          </div>

          {/* System Architecture Metrics Summary Banner */}
          <div className="mt-10 p-6 rounded-2xl glass-card border border-primary/30 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0 shadow-glow">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-base text-content-primary">
                  PayPulse Unified Enterprise Platform
                </div>
                <div className="text-xs text-content-secondary font-mono mt-0.5">
                  Employee Directory • Automated Pay Runs • Multi-Tier Approvals • Payslips • Reports • Gemini AI
                </div>
              </div>
            </div>

            <button
              onClick={handleLaunchApp}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-glow hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <span>Launch Enterprise Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Platform Page Slider: Preview Next Console Views */}
      <PlatformPageSlider onLaunchModule={handleLaunchApp} />

      {/* Section 4: 4-Stage Dual-Authorization Workflow (#workflow) */}
      <ApprovalWorkflowSection />

      {/* Section 6: Statutory Compliance & Banking Settlement Strip (#compliance) */}
      <section
        id="compliance"
        className="py-16 border-t border-border bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 border border-secondary/30 text-xs font-mono text-secondary font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> STATUTORY & COMPLIANCE RULES
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-content-primary tracking-tight">
              AUTOMATED STATUTORY CALCULATIONS & <span className="gradient-text">COMPLIANCE.</span>
            </h2>
            <p className="text-sm text-content-secondary leading-relaxed">
              Automated rules calculate statutory employee withholdings, attendance adjustments, and itemized pay summaries for complete payroll transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl glass-card border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-content-primary">Provident Fund (EPF)</h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                Automated 12% statutory employee contribution calculation aligned with standard EPFO guidelines.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-content-primary">TDS Tax Withholding</h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                Computes monthly income tax withholdings dynamically based on compensation brackets and declarations.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-content-primary">Attendance & LOP Tracking</h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                Accurately factors present days, approved leaves, and automatic Loss of Pay (LOP) into the monthly cycle.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-warning/15 text-warning flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-content-primary">Payslip Generation</h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                Compiles fully verified itemized payslips detailing base pay, allowances, and deductions ready for PDF download.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call To Action Banner */}
      <section
        className="py-16 border-t border-border bg-transparent relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-mono text-primary font-bold">
            <Zap className="w-3.5 h-3.5" /> INSTANT CONSOLE ACCESS
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-content-primary tracking-tight">
            EXPERIENCE PAYPULSE ENTERPRISE <span className="gradient-text">IN ACTION.</span>
          </h2>
          <p className="text-sm sm:text-base text-content-secondary max-w-xl mx-auto leading-relaxed">
            Launch the interactive PayPulse console to execute pay runs, configure salary tiers, manage approvals, and view itemized employee payslips.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleLaunchApp}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-glow hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Enter PayPulse Console</span>
            </button>
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl glass-card border border-border text-content-secondary hover:text-content-primary font-semibold text-sm transition-all cursor-pointer"
            >
              <span>Sign In with Credentials</span>
            </button>
          </div>
        </div>
      </section>

      {/* Clean Minimal Footer matching Web App Aesthetics */}
      <footer
        className={`py-8 border-t text-xs transition-colors duration-300 ${
          isLight
            ? 'bg-white border-[#eaedff] text-[#1e293b]'
            : 'bg-[#0b0f19] border-[#1e293b] text-[#94a3b8]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={`font-bold ${isLight ? 'text-[#0a0f1d]' : 'text-white'}`}>PAYPULSE</span>
            <span>•</span>
            <span>Employee Payroll Naming Conventions Improvement System</span>
          </div>
          <div className="flex items-center gap-2 text-success font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>Enterprise Payroll Platform • 100% Zero-Drift Assertions • ISO-27001 Fiduciary Standard</span>
          </div>
        </div>
      </footer>
    </GlowCursor>
  );
};

export const PayPulseLandingPage: React.FC<PayPulseLandingPageProps> = (props) => {
  return (
    <DesignProvider forcedTheme={props.isDark !== undefined ? (props.isDark ? 'dark' : 'light') : undefined}>
      <ThreeDLandingContent {...props} />
    </DesignProvider>
  );
};

export default PayPulseLandingPage;
