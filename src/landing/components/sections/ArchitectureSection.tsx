'use client';

import React, { useState } from 'react';
import {
  Layers,
  Users,
  Cpu,
  Brain,
  CheckCircle2,
  Database,
  ArrowDown,
  ShieldCheck,
} from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<number>(0);

  const layers = [
    {
      id: 'user',
      title: 'USER INTERACTION LAYER',
      icon: Users,
      color: '#38bdf8',
      description: 'Role-gated intuitive portals tailored for HR Leads, Department Managers, Payroll Controllers, and Employees.',
      components: ['HR Operations Portal', 'Manager Exception Desk', 'Payroll Admin Console', 'Self-Service Employee Portal'],
    },
    {
      id: 'application',
      title: 'APPLICATION & CORE LOGIC LAYER',
      icon: Cpu,
      color: '#10b981',
      description: 'Orchestrates modular management of employee contracts, salary scales, allowances, deductions, and calculation recipes.',
      components: ['Employee Contract Manager', 'Salary Band Engine', 'Allowance Processor', 'Deduction & Tax Calc Engine'],
    },
    {
      id: 'intelligence',
      title: 'INTELLIGENCE & VALIDATION LAYER',
      icon: Brain,
      color: '#f59e0b',
      description: 'Autonomous scanning engines checking arithmetic consistency, multi-year anomaly thresholds, and longitudinal ledger continuity.',
      components: ['Smart Payroll Error Detector', 'Longitudinal Anomaly Detector', 'Salary History Versioner', 'Zero-Drift Validator'],
    },
    {
      id: 'workflow',
      title: 'WORKFLOW & PRESENTATION LAYER',
      icon: CheckCircle2,
      color: '#6366f1',
      description: 'Cryptographic 4-eye approval gate, real-time telemetry dashboards, and exportable bank-compliant disbursal batches.',
      components: ['4-Stage Approval Gate', 'Executive Mission Control', 'Statutory Compliance Reports', 'Encrypted Bank Batch Builder'],
    },
    {
      id: 'data',
      title: 'DATA PERSISTENCE & AUDIT LAYER',
      icon: Database,
      color: '#a855f7',
      description: 'Relational ACID schema with standardized naming conventions, immutable audit ledgers, and revision tracking.',
      components: ['employees (Master Table)', 'salary_transactions (Ledger)', 'payroll_batches (Audit State)', 'salary_revisions (History)'],
    },
  ];

  return (
    <section id="architecture" className="py-24 relative border-t border-border bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-mono text-primary font-bold">
            <Layers className="w-3.5 h-3.5" /> SYSTEM ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-content-primary tracking-tight">
            5-TIER MODULAR <span className="gradient-text">ARCHITECTURE.</span>
          </h2>
          <p className="text-base text-content-secondary leading-relaxed">
            Data flows cleanly from User Input down through Application Rules, Intelligence Scanners,
            Approval Orchestration, and relational ACID persistence.
          </p>
        </div>

        {/* 5-Layer Visual Stack */}
        <div className="mt-14 max-w-4xl mx-auto space-y-4">
          {layers.map((layer, idx) => {
            const Icon = layer.icon;
            const isSelected = activeLayer === idx;

            return (
              <div key={layer.id} className="relative">
                <div
                  onClick={() => setActiveLayer(idx)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'glass-card border-primary shadow-glow bg-primary/10 scale-[1.01]'
                      : 'glass-panel border-border bg-surface-elevated/40 hover:border-border-strong'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${layer.color}25`, color: layer.color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-content-dim">
                          LAYER 0{idx + 1}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-content-primary">
                          {layer.title}
                        </h3>
                      </div>
                    </div>

                    <span className="text-xs font-mono px-3 py-1 rounded bg-black/40 border border-border text-content-secondary self-start sm:self-auto">
                      {isSelected ? 'ACTIVE BLUEPRINT' : 'INSPECT LAYER'}
                    </span>
                  </div>

                  <p className="text-xs text-content-secondary mt-3 leading-relaxed">
                    {layer.description}
                  </p>

                  {/* Component Modules Chips */}
                  <div className="mt-4 pt-3 border-t border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {layer.components.map((comp, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-2 rounded-lg bg-black/30 border border-border/60 text-[11px] font-mono text-content-primary truncate text-center"
                      >
                        {comp}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Downward Data Stream Arrow between layers */}
                {idx < layers.length - 1 && (
                  <div className="flex justify-center my-1 text-content-dim">
                    <ArrowDown className="w-4 h-4 animate-bounce text-primary/60" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
