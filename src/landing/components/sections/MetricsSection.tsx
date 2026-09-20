'use client';

import React from 'react';
import { ShieldCheck, Layers, GitMerge, Award } from 'lucide-react';

export const MetricsSection: React.FC = () => {
  const metrics = [
    {
      value: '100%',
      label: 'STRUCTURED PAYROLL',
      subtext: 'Normalized variable naming conventions across schemas and APIs.',
      icon: ShieldCheck,
    },
    {
      value: '01',
      label: 'UNIFIED WORKFLOW',
      subtext: 'Continuous lifecycle from employee ingestion to bank disbursal.',
      icon: GitMerge,
    },
    {
      value: '06+',
      label: 'CORE MODULES',
      subtext: 'Employee, Salary, Allowances, Deductions, Anomalies, and Approvals.',
      icon: Layers,
    },
    {
      value: '04',
      label: 'APPROVAL STAGES',
      subtext: 'Strict sequential cryptographic gates enforcing four-eye sign-offs.',
      icon: Award,
    },
  ];

  return (
    <section id="metrics" className="py-20 relative border-t border-border bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((m, idx) => {
            const Icon = m.icon;

            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-panel border border-border/80 text-center space-y-3 hover:border-primary/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary mx-auto transition-transform group-hover:scale-110">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-content-primary">
                  {m.value}
                </div>

                <div className="text-xs font-mono font-bold tracking-widest text-primary uppercase">
                  {m.label}
                </div>

                <p className="text-xs text-content-secondary leading-relaxed">
                  {m.subtext}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
