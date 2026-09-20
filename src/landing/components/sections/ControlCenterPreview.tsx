'use client';

import React from 'react';
import Link from '@/components/common/Link';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  PieChart,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { SYSTEM_KPIS } from '@/config/mockPayrollData';

export const ControlCenterPreview: React.FC = () => {
  return (
    <section id="dashboard" className="py-24 relative border-t border-border bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-mono text-primary font-bold">
            <LayoutDashboard className="w-3.5 h-3.5" /> PAYROLL CONTROL CENTER
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-content-primary tracking-tight">
            EVERYTHING HR NEEDS. <span className="gradient-text">ONE VIEW.</span>
          </h2>
          <p className="text-base text-content-secondary leading-relaxed">
            Transition from calculation logic into mission control. Live telemetry across workforce
            tiers, department distributions, anomaly review queues, and disbursal pipelines.
          </p>
        </div>

        {/* Realistic Enterprise Dashboard Preview Card */}
        <div className="mt-14 p-4 sm:p-6 lg:p-8 rounded-3xl glass-card border border-primary/40 shadow-2xl space-y-8">
          
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-content-primary">
                  Enterprise Payroll Hub — Cycle: October 2026
                </h3>
                <p className="text-xs text-content-muted font-mono">
                  Organization: Apex Global Technologies Ltd. (1,480 Active Contracts)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-warning/15 border border-warning/30 text-warning font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>STATUS: UNDER REVIEW (STAGE 3)</span>
              </span>

              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-glow transition-all"
              >
                <span>Launch Full App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 4 Real-World KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl glass-panel border border-border space-y-2">
              <div className="flex items-center justify-between text-content-dim">
                <span className="text-xs font-mono uppercase">TOTAL EMPLOYEES</span>
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-content-primary">
                {SYSTEM_KPIS.totalEmployees.toLocaleString()}
              </div>
              <div className="text-[11px] text-success flex items-center gap-1 font-medium">
                <span>+24 onboarded this cycle</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-border space-y-2">
              <div className="flex items-center justify-between text-content-dim">
                <span className="text-xs font-mono uppercase">TOTAL PAYROLL VALUE</span>
                <CreditCard className="w-4 h-4 text-secondary" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-primary">
                {SYSTEM_KPIS.totalPayroll}
              </div>
              <div className="text-[11px] text-content-muted">
                Statutory deductions pre-verified
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-border space-y-2">
              <div className="flex items-center justify-between text-content-dim">
                <span className="text-xs font-mono uppercase">AVERAGE SALARY</span>
                <TrendingUp className="w-4 h-4 text-accent" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-content-primary">
                {SYSTEM_KPIS.averageSalary}
              </div>
              <div className="text-[11px] text-content-muted">
                Standardized across 12 bands
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-border space-y-2">
              <div className="flex items-center justify-between text-content-dim">
                <span className="text-xs font-mono uppercase">SYSTEM ACCURACY INDEX</span>
                <ShieldCheck className="w-4 h-4 text-success" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-success">
                {SYSTEM_KPIS.accuracyRate}
              </div>
              <div className="text-[11px] text-success">
                0 calculation drift detected
              </div>
            </div>

          </div>

          {/* Middle Row: Analytics & Alerts Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Department Distribution & Budget Chart (7 Cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl glass-panel border border-border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-bold text-content-primary">
                    Department Salary Distribution
                  </h4>
                </div>
                <span className="text-xs font-mono text-content-dim">Q4 FY26</span>
              </div>

              {/* Progress bars for departments */}
              <div className="space-y-3 pt-2">
                {[
                  { dept: 'Engineering & Technology', pct: 42, amount: '₹3,46,29,000', color: 'bg-primary' },
                  { dept: 'Product & Design', pct: 24, amount: '₹1,97,88,000', color: 'bg-secondary' },
                  { dept: 'Operations & Support', pct: 18, amount: '₹1,48,41,000', color: 'bg-accent' },
                  { dept: 'Sales & Marketing', pct: 16, amount: '₹1,31,92,000', color: 'bg-warning' },
                ].map((d, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-content-secondary">{d.dept}</span>
                      <span className="font-bold text-content-primary">{d.amount} ({d.pct}%)</span>
                    </div>
                    <div className="h-2 w-full bg-surface-elevated rounded-full overflow-hidden">
                      <div className={`h-full ${d.color} rounded-full`} style={{ width: `${d.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Real-Time Action Alerts Queue (5 Cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl glass-panel border border-border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <h4 className="text-sm font-bold text-content-primary">
                    Real-Time Action Queue
                  </h4>
                </div>
                <span className="text-xs font-mono text-warning bg-warning/15 px-2 py-0.5 rounded font-bold">
                  3 ACTION ITEMS
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-error/10 border border-error/30 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-error">
                      2 Salary Anomalies Require Review
                    </div>
                    <div className="text-[11px] text-content-secondary">
                      EMP-1088 spike flagged (+85.7%). Awaiting manager appraisal memo.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-warning/10 border border-warning/30 flex items-start gap-3">
                  <Clock className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-warning">
                      7 Records Awaiting Dual Sign-Off
                    </div>
                    <div className="text-[11px] text-content-secondary">
                      Finance Controller sign-off pending for Final Stage release.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-success/10 border border-success/30 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-success">
                      Zero Calculation Mismatches
                    </div>
                    <div className="text-[11px] text-content-secondary">
                      All 1,480 employee records passed automated arithmetic scanner.
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-content-muted font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-ping" />
              <span>LIVE CLUSTER TELEMETRY CONNECTED</span>
            </div>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-hover group"
            >
              <span>Explore Employees, Calculation Sheets & Approval Desks in Full App</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
