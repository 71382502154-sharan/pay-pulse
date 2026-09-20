import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Calculator,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
  Lock,
  Clock,
  Database,
  BarChart3,
  Layers,
  Zap,
} from 'lucide-react';

interface PlatformPageSliderProps {
  onLaunchModule?: (moduleKey?: string) => void;
}

interface SlideItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  stats: { label: string; value: string; hint?: string }[];
  renderGraphic: () => React.ReactNode;
}

export const PlatformPageSlider: React.FC<PlatformPageSliderProps> = ({ onLaunchModule }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const SLIDES: SlideItem[] = [
    {
      id: 'dashboard',
      badge: 'PAGE 01 • EXECUTIVE SUITE',
      title: 'Executive Dashboard & Payroll Analytics',
      subtitle: 'Real-Time Payroll Expenditure & Cycle Tracking',
      description:
        'High-level visibility into total monthly payroll, department compensation distributions, upcoming pay cycle deadlines, and active employee headcount.',
      icon: LayoutDashboard,
      accentColor: '#71f8e4',
      stats: [
        { label: 'Monthly Payroll', value: '₹24.8 Lakhs', hint: 'Active Cycle' },
        { label: 'Active Staff', value: '12+ Employees', hint: 'All Departments' },
        { label: 'Cycle Status', value: 'Ready', hint: 'Verified Calculations' },
      ],
      renderGraphic: () => (
        <div className="w-full h-full p-5 flex flex-col justify-between space-y-4 font-mono text-xs">
          {/* Top Mock Window Bar */}
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="text-[10px] text-content-dim ml-2 font-bold tracking-wider">
                PAYPULSE // CONSOLE // DASHBOARD_VIEW
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#006a63]/20 text-[#006a63] dark:text-[#71f8e4] border border-[#006a63]/30 text-[10px] font-bold">
              ACTIVE CYCLE ⚡
            </span>
          </div>

          {/* Metric Highlights Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-surface/70 border border-primary/20 space-y-1">
              <div className="text-[10px] text-content-dim uppercase">Total Monthly Payout</div>
              <div className="text-lg font-black text-primary">₹24,80,000</div>
              <div className="text-[9px] text-[#006a63] dark:text-[#5eead4] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 100% Calculated
              </div>
            </div>
            <div className="p-3 rounded-xl bg-surface/70 border border-secondary/20 space-y-1">
              <div className="text-[10px] text-content-dim uppercase">Scheduled Pay Date</div>
              <div className="text-lg font-black text-content-primary">31 MAR 2026</div>
              <div className="text-[9px] text-content-secondary">End-of-Month Cycle</div>
            </div>
          </div>

          {/* Visual Progress Wave */}
          <div className="p-3 rounded-xl bg-surface/50 border border-border space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-content-secondary">Pay Cycle Milestone Status</span>
              <span className="text-primary font-bold">Execution Ready</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-elevated overflow-hidden flex">
              <div className="w-1/4 h-full bg-[#000f3f]" />
              <div className="w-1/4 h-full bg-[#172554]" />
              <div className="w-1/4 h-full bg-[#006a63]" />
              <div className="w-1/4 h-full bg-[#71f8e4] animate-pulse" />
            </div>
            <div className="flex justify-between text-[9px] text-content-dim">
              <span>Attendance</span>
              <span>Allowances</span>
              <span>Approvals</span>
              <span className="text-primary font-bold">Disbursal</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'payrun',
      badge: 'PAGE 02 • EXECUTION ENGINE',
      title: 'Automated Pay Run Engine',
      subtitle: 'Gross-to-Net Salary Calculation with Allowances & Deductions',
      description:
        'Accurately calculates every component of compensation: Base Monthly pay, Standard Allowances (HRA), bonuses, and statutory withholdings (PF & TDS).',
      icon: Calculator,
      accentColor: '#10b981',
      stats: [
        { label: 'Calculation', value: 'Automated', hint: 'Gross-to-Net Math' },
        { label: 'Allowances', value: 'HRA & Bonus', hint: 'Configured per Role' },
        { label: 'Deductions', value: 'PF & TDS', hint: 'Statutory Withholdings' },
      ],
      renderGraphic: () => (
        <div className="w-full h-full p-5 flex flex-col justify-between space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-border/80 pb-2">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] text-content-dim font-bold">
                GROSS-TO-NET SALARY BREAKDOWN
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
              CALCULATED
            </span>
          </div>

          <div className="space-y-2 py-1">
            <div className="flex items-center justify-between p-2 rounded-lg bg-surface/70 border border-border text-[11px]">
              <span className="text-content-secondary">Base Monthly (basicSalary)</span>
              <span className="text-content-primary font-bold">₹1,45,000.00</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-surface/70 border border-emerald-500/20 text-[11px]">
              <span className="text-emerald-400">+ Standard HRA & Allowances</span>
              <span className="text-emerald-400 font-bold">+₹50,000.00</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-surface/70 border border-amber-500/20 text-[11px]">
              <span className="text-amber-400">- Statutory Deductions (PF + TDS)</span>
              <span className="text-amber-400 font-bold">-₹18,000.00</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-surface-elevated border border-primary/30 text-[11px]">
              <span className="text-primary font-bold">Net Payable Remuneration</span>
              <span className="text-primary font-bold text-sm">₹1,77,000.00</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-[10px]">
            <span className="text-emerald-300">Status:</span>
            <span className="text-emerald-400 font-bold">All Deductions Accounted</span>
          </div>
        </div>
      ),
    },
    {
      id: 'approvals',
      badge: 'PAGE 03 • WORKFLOW GOVERNANCE',
      title: 'Multi-Role Approval Pipeline',
      subtitle: 'Structured Review Workflow for Pay Runs & Adjustments',
      description:
        'Ensures complete organizational accountability. Monthly pay runs and off-cycle adjustments undergo sequential review by Department Leads, Finance Controllers, and Directors.',
      icon: ShieldCheck,
      accentColor: '#f43f5e',
      stats: [
        { label: 'Review Stages', value: '4-Stage', hint: 'Role-Based Flow' },
        { label: 'Roles', value: 'HR & Finance', hint: 'Multi-Tier Review' },
        { label: 'Audit Trail', value: 'Logged', hint: 'Full Traceability' },
      ],
      renderGraphic: () => (
        <div className="w-full h-full p-5 flex flex-col justify-between space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-border/80 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span className="text-[10px] text-content-dim font-bold">
                ROLE-BASED APPROVAL PIPELINE
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
              ENFORCED
            </span>
          </div>

          <div className="space-y-2">
            {[
              { role: 'Stage 1: People Operations', name: 'SHARAN R', status: 'Approved', color: 'text-emerald-400' },
              { role: 'Stage 2: Finance Controller', name: 'Seashora R', status: 'Approved', color: 'text-emerald-400' },
              { role: 'Stage 3: Compliance Auditor', name: 'Sathana G', status: 'Verified', color: 'text-emerald-400' },
              { role: 'Stage 4: HR Payroll Director', name: 'Sashmitha S M', status: 'Sign-off Ready', color: 'text-amber-400 animate-pulse' },
            ].map((st, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-lg bg-surface/70 border border-border text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-surface-elevated border border-border flex items-center justify-center text-[10px] font-bold text-content-secondary">
                    0{i + 1}
                  </span>
                  <div>
                    <div className="font-bold text-content-primary leading-tight">{st.role}</div>
                    <div className="text-[9px] text-content-dim">{st.name}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold ${st.color}`}>{st.status}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'attendance',
      badge: 'PAGE 04 • WORKFORCE & TIME',
      title: 'Attendance & Leave Tracking',
      subtitle: 'Workforce Records & Loss of Pay Adjustments',
      description:
        'Log employee attendance, shift timings, and approved leaves. Automatically calculates Loss of Pay (LOP) adjustments to prevent discrepancies during pay run generation.',
      icon: TrendingUp,
      accentColor: '#71f8e4',
      stats: [
        { label: 'Workforce', value: '12+ Active', hint: 'Personnel Records' },
        { label: 'Attendance', value: 'Present/Leave', hint: 'Tracked per Cycle' },
        { label: 'Adjustments', value: 'Automated', hint: 'Accurate LOP Deduction' },
      ],
      renderGraphic: () => (
        <div className="w-full h-full p-5 flex flex-col justify-between space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-border/80 pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-[10px] text-content-dim font-bold">
                ATTENDANCE & LEAVE RECONCILIATION
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-primary/15 text-primary border border-primary/30 text-[10px] font-bold">
              ACTIVE
            </span>
          </div>

          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-content-primary font-bold">Monthly Working Days</span>
              <span className="text-primary font-bold">22 Days Scheduled</span>
            </div>
            <div className="text-[10px] text-content-secondary leading-snug">
              Workforce shift attendance recorded and verified for current pay cycle. Leave applications approved by department leads.
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between p-2 rounded bg-surface/70 border border-border text-[10px]">
              <span className="text-content-secondary">Total Present Days:</span>
              <span className="text-emerald-400 font-bold">98.5% Attendance</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-surface/70 border border-border text-[10px]">
              <span className="text-content-secondary">Loss of Pay (LOP) Days:</span>
              <span className="text-amber-400 font-bold">Factored in Deductions</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'payslips',
      badge: 'PAGE 05 • PAYSLIPS & AI',
      title: 'Itemized Payslips & Gemini AI',
      subtitle: 'Transparent Payslips with Instant PDF Export & AI Reporting',
      description:
        'Generate detailed digital payslips with itemized breakdowns of earnings, allowances, and deductions, alongside integrated Gemini AI for quick reporting and discrepancy checks.',
      icon: FileCheck2,
      accentColor: '#f59e0b',
      stats: [
        { label: 'Payslips', value: 'Itemized', hint: 'Complete Breakdown' },
        { label: 'Export', value: 'PDF Download', hint: 'Instant Distribution' },
        { label: 'AI Assistance', value: 'Gemini AI', hint: 'Queries & Summaries' },
      ],
      renderGraphic: () => (
        <div className="w-full h-full p-5 flex flex-col justify-between space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-border/80 pb-2">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] text-content-dim font-bold">
                ITEMIZED DIGITAL PAYSLIP
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
              PDF READY
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-surface/70 border border-border space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-content-secondary">Employee:</span>
              <span className="text-content-primary font-bold">Sashmitha S M (TEAM-001)</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-content-dim">Designation:</span>
              <span className="text-content-secondary">Project Lead & Manager</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-content-dim">Pay Period:</span>
              <span className="text-content-secondary">March 2026</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-elevated border border-primary/30 flex items-center justify-between text-[11px]">
            <span className="text-primary font-bold">Net Salary Disbursed:</span>
            <span className="text-primary font-bold text-sm">₹2,81,000.00</span>
          </div>

          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-[10px]">
            <span className="text-emerald-300">Gemini AI Check:</span>
            <span className="text-emerald-400 font-bold">All Deductions Verified ✓</span>
          </div>
        </div>
      ),
    },
  ];


  // Auto-play timer with pause on hover
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setDirection(1);
          setCurrentSlideIndex((curr) => (curr + 1) % SLIDES.length);
          return 0;
        }
        return prev + 2;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isPaused, SLIDES.length]);

  const handleNext = () => {
    setDirection(1);
    setProgress(0);
    setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setProgress(0);
    setCurrentSlideIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleSelectSlide = (index: number) => {
    setDirection(index > currentSlideIndex ? 1 : -1);
    setProgress(0);
    setCurrentSlideIndex(index);
  };

  const currentSlide = SLIDES[currentSlideIndex];
  const IconComponent = currentSlide.icon;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -120 : 120,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    }),
  };

  return (
    <section
      id="platform-slider"
      className="py-20 border-t border-border bg-transparent relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Ambience Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[160px] pointer-events-none opacity-20 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${currentSlide.accentColor} 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-mono text-primary font-bold">
              <Layers className="w-3.5 h-3.5" /> INTERACTIVE PLATFORM PAGE SLIDER
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-content-primary tracking-tight">
              SLIDE THROUGH THE <span className="gradient-text">PAYPULSE MODULES.</span>
            </h2>
            <p className="text-sm sm:text-base text-content-secondary leading-relaxed">
              Experience the upcoming operational views in the enterprise console. Preview real-time calculations, multi-stage fiduciary locks, and statutory banking settlement before launching.
            </p>
          </div>

          {/* Slider Navigation Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="p-3 rounded-2xl glass-card border border-border hover:border-primary/50 text-content-secondary hover:text-content-primary transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-xs font-mono font-bold text-content-primary px-2">
              <span className="text-primary">0{currentSlideIndex + 1}</span> / 0{SLIDES.length}
            </div>
            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="p-3 rounded-2xl glass-card border border-border hover:border-primary/50 text-content-secondary hover:text-content-primary transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Strip with Progress Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-8">
          {SLIDES.map((slide, idx) => {
            const isCurrent = idx === currentSlideIndex;
            return (
              <button
                key={slide.id}
                onClick={() => handleSelectSlide(idx)}
                className={`text-left p-3 rounded-2xl border transition-all duration-300 relative overflow-hidden cursor-pointer ${
                  isCurrent
                    ? 'bg-surface-elevated border-primary/50 shadow-glow text-content-primary'
                    : 'bg-surface/50 border-border/80 text-content-muted hover:text-content-secondary hover:border-border'
                }`}
              >
                {/* Progress bar line on current active slide tab */}
                {isCurrent && (
                  <div
                    className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                )}
                <div className="text-[10px] font-mono text-content-dim font-semibold">0{idx + 1}.</div>
                <div className="text-xs font-bold truncate mt-0.5">{slide.title}</div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Slide Stage Content */}
        <div className="relative min-h-[460px] sm:min-h-[500px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl p-6 sm:p-10 glass-card border border-border/90 shadow-2xl backdrop-blur-2xl"
            >
              {/* Left Column: Slide Narrative & Statistics */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold"
                    style={{
                      backgroundColor: `${currentSlide.accentColor}18`,
                      color: currentSlide.accentColor,
                      border: `1px solid ${currentSlide.accentColor}40`,
                    }}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{currentSlide.badge}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-content-primary tracking-tight">
                    {currentSlide.title}
                  </h3>
                  <p className="text-xs font-mono font-semibold text-primary">
                    {currentSlide.subtitle}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
                  {currentSlide.description}
                </p>

                {/* 3 Metric Highlights */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/70">
                  {currentSlide.stats.map((stat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="text-xs text-content-dim font-mono">{stat.label}</div>
                      <div className="text-base sm:text-lg font-black font-mono text-content-primary">
                        {stat.value}
                      </div>
                      {stat.hint && (
                        <div className="text-[10px] text-content-muted leading-tight">
                          {stat.hint}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Button: Jump Directly to Module in Console */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => onLaunchModule && onLaunchModule(currentSlide.id)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-glow hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch {currentSlide.title} in Console</span>
                  </button>

                  <div className="text-[11px] font-mono text-content-dim flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    <span>Interactive Realtime Data Preview</span>
                  </div>
                </div>
              </div>

              {/* Right Column: High-Fidelity UI Graphic Mockup Container */}
              <div className="lg:col-span-6 flex items-center justify-center">
                <div className="w-full h-[360px] sm:h-[400px] rounded-2xl bg-surface-elevated/90 border border-border shadow-2xl relative overflow-hidden backdrop-blur-xl flex flex-col">
                  {currentSlide.renderGraphic()}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default PlatformPageSlider;
