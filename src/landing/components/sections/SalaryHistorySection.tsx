'use client';

import React, { useState } from 'react';
import {
  History,
  Calendar,
  Award,
  CheckCircle2,
  FileCheck2,
  TrendingUp,
  User,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { SALARY_HISTORY_TIMELINE } from '@/config/mockPayrollData';

export const SalaryHistorySection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2); // Default to latest active revision

  return (
    <section id="salary-history" className="py-24 relative border-t border-border bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-mono text-primary font-bold">
            <History className="w-3.5 h-3.5" /> IMMUTABLE LEDGER
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-content-primary tracking-tight">
            SALARY HISTORY & <span className="gradient-text">AUDIT TRAIL.</span>
          </h2>
          <p className="text-base text-content-secondary leading-relaxed">
            Every increment, grade elevation, and revision is indexed into a cryptographically ordered
            timeline with signed authorization memos.
          </p>
        </div>

        {/* Timeline Component */}
        <div className="mt-16 max-w-4xl mx-auto">
          {/* Horizontal Stepper Bar */}
          <div className="relative flex items-center justify-between mb-12 px-4">
            {/* Connecting Track */}
            <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-border -z-0">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(activeStep / (SALARY_HISTORY_TIMELINE.length - 1)) * 100}%` }}
              />
            </div>

            {SALARY_HISTORY_TIMELINE.map((item, idx) => {
              const isActive = activeStep === idx;
              const isPast = idx <= activeStep;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className="relative z-10 flex flex-col items-center group focus:outline-none"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-primary text-white shadow-glow scale-110'
                        : isPast
                        ? 'bg-surface-elevated text-primary border-2 border-primary'
                        : 'bg-surface-elevated text-content-muted border border-border group-hover:border-content-muted'
                    }`}
                  >
                    {item.year}
                  </div>
                  <span
                    className={`mt-2 text-xs font-mono font-semibold transition-colors ${
                      isActive ? 'text-primary' : 'text-content-dim'
                    }`}
                  >
                    ₹{(item.salary / 1000).toFixed(0)}K
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Milestone Card */}
          {SALARY_HISTORY_TIMELINE[activeStep] && (
            <div className="p-6 sm:p-8 rounded-2xl glass-card border border-primary/40 shadow-2xl space-y-6 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-content-primary">
                      {SALARY_HISTORY_TIMELINE[activeStep].revisionType}
                    </h3>
                    <p className="text-xs text-content-muted font-mono flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>Effective Date: {SALARY_HISTORY_TIMELINE[activeStep].effectiveDate}</span>
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-primary/15 text-primary border border-primary/30">
                  {SALARY_HISTORY_TIMELINE[activeStep].status}
                </span>
              </div>

              {/* Revision Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-black/40 border border-border">
                  <div className="text-[10px] text-content-dim uppercase">REVISED BASELINE</div>
                  <div className="text-xl font-black text-content-primary mt-1">
                    ₹{SALARY_HISTORY_TIMELINE[activeStep].salary.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-content-muted mt-0.5">Per Contractual Month</div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-border">
                  <div className="text-[10px] text-content-dim uppercase">AUTHORIZED BY</div>
                  <div className="text-sm font-bold text-content-primary mt-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-primary" />
                    <span>{SALARY_HISTORY_TIMELINE[activeStep].approvedBy}</span>
                  </div>
                  <div className="text-[10px] text-success font-semibold mt-0.5">Signed & Archived</div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-border">
                  <div className="text-[10px] text-content-dim uppercase">AUDIT VERIFICATION</div>
                  <div className="text-sm font-bold text-success mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    <span>Immutable Hash</span>
                  </div>
                  <div className="text-[10px] text-content-dim mt-0.5 font-mono">#HIST-{SALARY_HISTORY_TIMELINE[activeStep].year}-991</div>
                </div>
              </div>

              {/* Notes */}
              <div className="p-4 rounded-xl bg-surface-elevated/60 border border-border text-xs text-content-secondary space-y-1">
                <span className="font-mono text-[10px] uppercase text-content-dim block">
                  Compensation Committee Memo:
                </span>
                <p className="leading-relaxed">
                  {SALARY_HISTORY_TIMELINE[activeStep].notes}
                </p>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
