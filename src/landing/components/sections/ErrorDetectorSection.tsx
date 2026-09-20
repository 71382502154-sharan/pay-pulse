'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ScanLine,
  ArrowRight,
  Check,
  Activity,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

export const ErrorDetectorSection: React.FC = () => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [resolutionStep, setResolutionStep] = useState<'idle' | 'reviewed' | 'corrected' | 'recalculated'>('idle');

  // Baseline values
  const basicPay = 42000;
  const hra = 8000;
  const bonus = 5000;
  const expectedGross = basicPay + hra + bonus; // ₹55,000
  const recordedGross = hasError ? 58000 : 55000; // Injected mismatch of +₹3,000
  const deductions = 7500;
  const netSalary = (hasError ? recordedGross : expectedGross) - deductions;

  const handleToggleError = () => {
    setIsScanning(true);
    setResolutionStep('idle');
    setTimeout(() => {
      setHasError((prev) => !prev);
      setIsScanning(false);
    }, 600);
  };

  const handleResolve = () => {
    setResolutionStep('reviewed');
    setTimeout(() => {
      setResolutionStep('corrected');
      setTimeout(() => {
        setHasError(false);
        setResolutionStep('recalculated');
      }, 500);
    }, 500);
  };

  return (
    <section id="error-detector" className="py-24 relative border-t border-border bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/15 border border-warning/30 text-xs font-mono text-warning font-bold">
            <ScanLine className="w-3.5 h-3.5" /> SMART PAYROLL ERROR DETECTOR
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-content-primary tracking-tight">
            INSTANT MISMATCH SCANNING. <span className="gradient-text">ZERO CALCULATION LEAKS.</span>
          </h2>
          <p className="text-base text-content-secondary leading-relaxed">
            Our automated scanner inspects every payroll ledger record against contractual salary
            equations. If recorded values drift from computed baselines, it triggers immediate review
            before disbursal.
          </p>
        </div>

        {/* Interactive Calculation & Scanner Showcase */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="p-6 sm:p-8 rounded-2xl glass-card border border-border shadow-2xl relative overflow-hidden">
            
            {/* Top Bar with Status and Interactive Trigger */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    hasError
                      ? 'bg-error/20 border border-error/40 text-error'
                      : 'bg-success/20 border border-success/40 text-success'
                  }`}
                >
                  {hasError ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-content-primary">
                    Employee Record: <span className="font-mono text-primary">Aarav Mehta (EMP-1042)</span>
                  </h3>
                  <p className="text-xs text-content-muted font-mono">
                    Department: Senior Engineering | Cycle: Oct 2026
                  </p>
                </div>
              </div>

              {/* Error Toggle Simulation Button */}
              <button
                onClick={handleToggleError}
                disabled={isScanning}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold font-mono transition-all ${
                  hasError
                    ? 'bg-primary hover:bg-primary-hover text-white shadow-glow'
                    : 'bg-error/20 hover:bg-error/30 text-error border border-error/40'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>{hasError ? 'RESTORE VALID STATE' : '⚡ SIMULATE ERROR INJECTION'}</span>
              </button>
            </div>

            {/* Calculation Terminal with Scanning Beam */}
            <div className="mt-6 p-6 rounded-xl bg-black/70 border border-border relative overflow-hidden font-mono text-xs sm:text-sm space-y-3">
              
              {/* Visual Scanning Line Animation */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-primary/30 to-transparent animate-scan-line h-12" />
              )}

              {/* Items Breakdown */}
              <div className="flex justify-between items-center py-1.5 border-b border-border/50 text-content-secondary">
                <span>BASIC PAY</span>
                <span className="font-bold text-content-primary">₹{basicPay.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-border/50 text-content-secondary">
                <span>HOUSE RENT ALLOWANCE (HRA)</span>
                <span className="font-bold text-content-primary">₹{hra.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-border/50 text-content-secondary">
                <span>PERFORMANCE BONUS</span>
                <span className="font-bold text-content-primary">₹{bonus.toLocaleString()}</span>
              </div>

              {/* Gross Calculation Line (Shows Mismatch if Injected) */}
              <div
                className={`flex justify-between items-center py-2.5 px-3 rounded-lg border transition-all ${
                  hasError
                    ? 'bg-error/20 border-error/50 text-error font-bold'
                    : 'bg-surface-elevated/40 border-border text-content-primary font-bold'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>GROSS SALARY</span>
                  {hasError && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-error text-white font-mono">
                      MISMATCH DETECTED
                    </span>
                  )}
                </div>
                <div className="text-right">
                  {hasError ? (
                    <div>
                      <span className="line-through text-content-dim mr-2 text-xs">
                        ₹{expectedGross.toLocaleString()}
                      </span>
                      <span className="text-error font-black text-sm">
                        ₹{recordedGross.toLocaleString()} (Over-recorded)
                      </span>
                    </div>
                  ) : (
                    <span className="text-content-primary font-black">
                      ₹{expectedGross.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Deductions */}
              <div className="flex justify-between items-center py-1.5 border-b border-border/50 text-content-secondary">
                <span>TOTAL DEDUCTIONS (PF + TAX)</span>
                <span className="font-bold text-error">-₹{deductions.toLocaleString()}</span>
              </div>

              {/* Net Salary Final */}
              <div
                className={`flex justify-between items-center py-3 px-3 rounded-lg border text-sm sm:text-base font-black transition-all ${
                  hasError
                    ? 'bg-error/10 border-error/40 text-error'
                    : 'bg-primary/15 border-primary/40 text-primary'
                }`}
              >
                <span>CALCULATED NET SALARY</span>
                <span>₹{netSalary.toLocaleString()}</span>
              </div>

            </div>

            {/* Dynamic Status / Resolution Alert Banner */}
            <div className="mt-6">
              {hasError ? (
                <div className="p-5 rounded-xl bg-error/15 border border-error/50 space-y-4 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5 animate-bounce" />
                    <div>
                      <h4 className="text-sm font-bold text-error">
                        ⚠ CALCULATION MISMATCH DETECTED (DELTA: +₹3,000)
                      </h4>
                      <p className="text-xs text-content-secondary mt-1">
                        Expected computed sum: <strong className="text-content-primary">₹55,000</strong>.
                        Recorded batch input: <strong className="text-error">₹58,000</strong>.
                        Payroll release blocked for this record until rectified.
                      </p>
                    </div>
                  </div>

                  {/* Resolution Flow: Review -> Correct -> Recalculate */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-error/30">
                    <div className="flex items-center gap-2 text-xs font-mono text-content-secondary">
                      <span className={resolutionStep !== 'idle' ? 'text-success font-bold' : 'text-content-muted'}>
                        1. Review
                      </span>
                      <span>→</span>
                      <span className={resolutionStep === 'corrected' || resolutionStep === 'recalculated' ? 'text-success font-bold' : 'text-content-muted'}>
                        2. Correct
                      </span>
                      <span>→</span>
                      <span className={resolutionStep === 'recalculated' ? 'text-success font-bold' : 'text-content-muted'}>
                        3. Recalculate
                      </span>
                    </div>

                    <button
                      onClick={handleResolve}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-error hover:bg-red-600 text-white font-bold text-xs shadow-md transition-all"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${resolutionStep !== 'idle' ? 'animate-spin' : ''}`} />
                      <span>Execute 1-Click Fix & Recalculate</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-xl bg-success/15 border border-success/40 flex items-center justify-between gap-4 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-success">
                        ✓ PAYROLL VERIFIED — ZERO DRIFT
                      </h4>
                      <p className="text-xs text-content-secondary">
                        All mathematical terms match baseline formulas. Integrity check passed 100%.
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-success px-3 py-1 rounded bg-success/20 border border-success/30 hidden sm:inline-block">
                    AUDIT STAMP: #VAL-9921
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
