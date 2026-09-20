'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  UserCheck,
  Building,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Check,
} from 'lucide-react';
import { APPROVAL_STAGES } from '@/config/mockPayrollData';

export const ApprovalWorkflowSection: React.FC = () => {
  const [unlockedStep, setUnlockedStep] = useState<number>(3); // 1-indexed (1 to 4)

  const handleNextStage = () => {
    if (unlockedStep < 4) {
      setUnlockedStep((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setUnlockedStep(1);
  };

  const isAllApproved = unlockedStep === 4;

  return (
    <section id="workflow" className="py-24 relative border-t border-border bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-mono text-primary font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> MULTI-ROLE GOVERNANCE
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-content-primary tracking-tight">
            4-STAGE SEQUENTIAL <span className="gradient-text">APPROVAL WORKFLOW.</span>
          </h2>
          <p className="text-base text-content-secondary leading-relaxed">
            Ensure complete organizational accountability across off-cycle adjustments and monthly pay runs through a structured multi-role sign-off pipeline involving Department Managers, HR, Finance, and Executive Controllers.
          </p>
        </div>

        {/* Interactive Sequence Controls */}
        <div className="mt-12 flex justify-center gap-4">
          <button
            onClick={handleNextStage}
            disabled={isAllApproved}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              isAllApproved
                ? 'bg-surface-elevated text-content-dim cursor-not-allowed border border-border'
                : 'bg-primary hover:bg-primary-hover text-white shadow-glow hover:scale-105 active:scale-95'
            }`}
          >
            <span>{isAllApproved ? 'All 4 Stages Authorized' : 'Unlock Next Stage →'}</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border bg-surface-elevated/40 text-xs font-semibold text-content-secondary hover:text-content-primary"
            title="Reset Workflow sequence to stage 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>

        {/* 4-Stage Horizontal Pipeline Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {APPROVAL_STAGES.map((stage) => {
            const isUnlocked = stage.step <= unlockedStep;
            const isCurrent = stage.step === unlockedStep;

            return (
              <div
                key={stage.id}
                className={`p-6 rounded-2xl transition-all duration-500 relative flex flex-col justify-between space-y-6 ${
                  isUnlocked
                    ? isCurrent && !isAllApproved
                      ? 'glass-card border-2 border-primary shadow-glow bg-primary/10 scale-102'
                      : 'glass-card border border-primary/40 bg-surface'
                    : 'glass-panel border border-border/70 opacity-60 bg-surface-elevated/40'
                }`}
              >
                {/* Header with Step # and Lock/Unlock Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-primary px-2.5 py-1 rounded bg-primary/15 border border-primary/25">
                    STAGE 0{stage.step}
                  </span>
                  
                  {isUnlocked ? (
                    <div className="flex items-center gap-1 text-success text-xs font-mono font-bold">
                      <Unlock className="w-4 h-4 text-success" />
                      <span>{isAllApproved ? 'AUTHORIZED' : isCurrent ? 'IN REVIEW' : 'PASSED'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-content-dim text-xs font-mono">
                      <Lock className="w-4 h-4 text-content-dim" />
                      <span>LOCKED</span>
                    </div>
                  )}
                </div>

                {/* Stage Body */}
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-content-primary tracking-tight">
                    {stage.title}
                  </h3>
                  <div className="text-xs font-mono text-primary font-semibold flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{stage.role}</span>
                  </div>
                  <p className="text-xs text-content-secondary leading-relaxed pt-2">
                    {stage.description}
                  </p>
                </div>

                {/* Footer Timestamp / Status Stamp */}
                <div className="pt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-content-dim">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-primary" />
                    <span>{stage.time}</span>
                  </span>
                  {isUnlocked && (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Final Completion Banner when Stage 4 is Reached */}
        {isAllApproved && (
          <div className="mt-12 p-6 sm:p-8 rounded-2xl glass-card border border-success/60 bg-success/10 shadow-glow text-center space-y-3 animate-fade-in">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-success/20 text-success mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-content-primary uppercase tracking-tight">
              ✓ PAYROLL APPROVED & DISBURSED
            </h3>
            <p className="text-sm text-content-secondary max-w-xl mx-auto">
              1,480 salary batches cryptographically authorized. Bank transmission batch generated
              and encrypted with zero recorded calculation mismatches.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
