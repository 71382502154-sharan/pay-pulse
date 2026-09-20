'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  FileSpreadsheet,
  Cpu,
} from 'lucide-react';

export const ProblemSolutionSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'solution'>('solution');

  const frictionPoints = [
    {
      title: 'Inconsistent Variable Naming',
      legacy: 'empNm, sal, ded, grossSal, tbl_emp_mst',
      consequence: 'Developer friction, schema mismatches, brittle SQL joins and error-prone ETL scripts.',
    },
    {
      title: 'Manual Calculation Checking',
      legacy: 'Spreadsheets & ad-hoc arithmetic formulas',
      consequence: 'Gross and Net discrepancies going unnoticed until employee payslip dispute tickets.',
    },
    {
      title: 'Silent Salary Spikes & Drift',
      legacy: 'No historical anomaly threshold checks',
      consequence: 'Unindexed raises or accidental bonus double-entries slip past manual glance audits.',
    },
    {
      title: 'Opaque Salary Revision History',
      legacy: 'Scattered email threads and legacy PDF appraisal letters',
      consequence: 'Zero verifiable audit trail for historical base increments and promotions.',
    },
    {
      title: 'Bottlenecked Approval Chains',
      legacy: 'Unstructured approvals via chat messages and paper forms',
      consequence: 'Delayed payroll releases, lack of dual-signoff accountability, and compliance risk.',
    },
  ];

  const solutionPoints = [
    {
      title: 'Standardized Naming Conventions',
      solution: 'employeeName, basicSalary, deductionAmount, grossSalary, employees',
      benefit: 'Clean, self-documenting codebases, unified relational DB schemas, and typed API contracts.',
    },
    {
      title: 'Real-Time Error Detection Engine',
      solution: 'Automated Gross vs Recorded calculation scanners',
      benefit: 'Instant mismatch flag (e.g. ₹58,000 recorded vs ₹55,000 computed) with 1-click recalculation.',
    },
    {
      title: 'Intelligent Anomaly Detection',
      solution: 'Temporal deviation analysis with human review flags',
      benefit: 'Statistical flags for sudden unindexed surges (>30%) held safely in review queue.',
    },
    {
      title: 'Immutable Salary History Ledger',
      solution: 'Cryptographically ordered revision timeline',
      benefit: 'Traceable historical records with effective dates, approval VP stamps, and increment reasons.',
    },
    {
      title: '4-Stage Sequential Approval Workflow',
      solution: 'Locked state-machine: HR → Manager → Payroll → Disbursal',
      benefit: 'Strict four-eye verification with cryptographic timestamps and dual accountability.',
    },
  ];

  return (
    <section id="overview" className="py-24 relative border-t border-border bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-mono text-primary font-bold">
            PARADIGM SHIFT
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-content-primary tracking-tight">
            PAYROLL SHOULDN&apos;T REQUIRE <span className="gradient-text">GUESSWORK.</span>
          </h2>
          <p className="text-base text-content-secondary leading-relaxed">
            Legacy payroll systems rely on fragile spreadsheets, cryptic variable names, and manual
            human reviews that fail under scale. See how our standardized platform transforms the
            operational workflow.
          </p>
        </div>

        {/* Interactive Problem vs Solution Switcher */}
        <div className="mt-12 flex justify-center">
          <div className="p-1.5 rounded-xl glass-card border border-border flex items-center gap-2">
            <button
              onClick={() => setActiveTab('problem')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'problem'
                  ? 'bg-error/20 border border-error/50 text-error shadow-sm'
                  : 'text-content-muted hover:text-content-primary'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Legacy Manual Process</span>
            </button>

            <button
              onClick={() => setActiveTab('solution')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'solution'
                  ? 'bg-primary border border-primary text-white shadow-glow'
                  : 'text-content-muted hover:text-content-primary'
              }`}
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Standardized Enterprise Platform</span>
            </button>
          </div>
        </div>

        {/* Dynamic Comparison Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'problem' ? (
            frictionPoints.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border border-error/30 bg-error/5 hover:border-error/60 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-bold text-error px-2 py-0.5 rounded bg-error/15">
                      FRICTION #{idx + 1}
                    </span>
                    <XCircle className="w-4 h-4 text-error" />
                  </div>
                  <h3 className="text-base font-bold text-content-primary">{item.title}</h3>
                  <div className="mt-2 p-2.5 rounded bg-black/40 border border-error/20 font-mono text-xs text-error">
                    {item.legacy}
                  </div>
                </div>
                <p className="text-xs text-content-secondary leading-relaxed border-t border-error/20 pt-3">
                  {item.consequence}
                </p>
              </div>
            ))
          ) : (
            solutionPoints.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border border-primary/40 bg-primary/5 hover:border-primary/80 transition-all shadow-sm hover:shadow-glow flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary/15">
                      SYSTEM CAPABILITY #{idx + 1}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-content-primary">{item.title}</h3>
                  <div className="mt-2 p-2.5 rounded bg-black/40 border border-primary/30 font-mono text-xs text-primary font-semibold">
                    {item.solution}
                  </div>
                </div>
                <p className="text-xs text-content-secondary leading-relaxed border-t border-primary/20 pt-3">
                  {item.benefit}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Transformation Banner */}
        <div className="mt-12 p-6 rounded-2xl glass-card border border-primary/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shrink-0">
              <RefreshCw className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h4 className="text-base font-bold text-content-primary">
                Continuous Integrity Pipeline
              </h4>
              <p className="text-xs text-content-secondary">
                Data flows deterministically from Employee Input → Computation → Anomaly Scan → 4-Eye Approval.
              </p>
            </div>
          </div>

          <a
            href="#engine"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface-elevated hover:bg-primary hover:text-white border border-border hover:border-primary text-xs font-bold text-content-primary transition-all whitespace-nowrap"
          >
            <span>See Engine in Action</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};
