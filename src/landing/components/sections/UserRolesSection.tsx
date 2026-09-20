'use client';

import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  ShieldCheck,
  UserCheck,
  User,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';

export const UserRolesSection: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<number>(0);

  const roles = [
    {
      role: 'HR LEAD',
      icon: Briefcase,
      color: '#38bdf8',
      title: 'Human Resources Operations',
      overview: 'Reviews employee onboarding details, attendance inputs, leave deductions, and statutory allowance calculations.',
      permissions: [
        'Employee Profile Master Record Creation',
        'Allowance & Benefit Allocation Management',
        'Leave & Unpaid Time-Off Synchronization',
        'Initial Stage 1 Verification Authority',
      ],
      primaryGoal: 'Ensure 100% baseline accuracy before calculation lock.',
    },
    {
      role: 'DEPARTMENT MANAGER',
      icon: UserCheck,
      color: '#10b981',
      title: 'Team & Exception Oversight',
      overview: 'Reviews team bonus distributions, overtime authorizations, and anomaly inspection flags before sign-off.',
      permissions: [
        'Team Performance Bonus Granting',
        'Salary Anomaly Review & Memo Attachment',
        'Overtime Timesheet Sign-Off',
        'Stage 2 Departmental Approval Authority',
      ],
      primaryGoal: 'Verify compensation equity and justify unindexed variations.',
    },
    {
      role: 'PAYROLL ADMIN',
      icon: ShieldCheck,
      color: '#f59e0b',
      title: 'Financial & Statutory Controller',
      overview: 'Manages batch execution, runs the Smart Error Detector, verifies TDS withholdings, and signs off bank files.',
      permissions: [
        'Execution of Batch Calculation Engines',
        'Real-Time Mismatch & Error Resolution',
        'Statutory PF/Tax Computation Finalization',
        'Stage 3 Cryptographic Batch Sign-Off',
      ],
      primaryGoal: 'Zero calculation drift and full regulatory tax compliance.',
    },
    {
      role: 'EMPLOYEE',
      icon: User,
      color: '#a855f7',
      title: 'Self-Service Compensation Portal',
      overview: 'Accesses digital payslips, inspects transparent breakdown of Basic/Allowances/Deductions, and views salary history.',
      permissions: [
        'Instant Digitally Signed Payslip PDF Download',
        'Multi-Year Salary Revision History Inspection',
        'Tax Slab Declaration & Proof Submission',
        'Direct Resolution Ticket Generation',
      ],
      primaryGoal: 'Transparent, dispute-free visibility into take-home pay.',
    },
  ];

  return (
    <section id="roles" className="py-24 relative border-t border-border bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-mono text-primary font-bold">
            <Users className="w-3.5 h-3.5" /> ROLE-BASED ACCESS CONTROL
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-content-primary tracking-tight">
            TAILORED FOR <span className="gradient-text">EVERY STAKEHOLDER.</span>
          </h2>
          <p className="text-base text-content-secondary leading-relaxed">
            Granular permissions ensure each stakeholder operates within their governance scope with
            complete clarity and zero friction.
          </p>
        </div>

        {/* 4 User Roles Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((r, idx) => {
            const Icon = r.icon;
            const isSelected = selectedRole === idx;

            return (
              <div
                key={idx}
                onClick={() => setSelectedRole(idx)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
                  isSelected
                    ? 'glass-card border-primary shadow-glow bg-primary/10 scale-102'
                    : 'glass-panel border-border bg-surface-elevated/40 hover:border-border-strong'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${r.color}25`, color: r.color }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-content-dim font-bold">
                      ROLE 0{idx + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-content-primary">{r.role}</h3>
                    <p className="text-xs font-mono text-primary font-semibold mt-0.5">
                      {r.title}
                    </p>
                  </div>

                  <p className="text-xs text-content-secondary leading-relaxed">
                    {r.overview}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/50 space-y-2">
                  <div className="text-[10px] font-mono uppercase text-content-dim font-bold">
                    Key Governance Scope:
                  </div>
                  <ul className="space-y-1.5 text-xs text-content-primary">
                    {r.permissions.slice(0, 3).map((p, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
