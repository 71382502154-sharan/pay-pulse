'use client';

import React from 'react';
import Link from '@/components/common/Link';
import { Activity, ShieldCheck, Github, Twitter, Linkedin, ArrowUpRight } from 'lucide-react';
import { useDesign } from '@/context/DesignContext';

export const Footer: React.FC = () => {
  const { config } = useDesign();

  return (
    <footer className="border-t border-border bg-transparent pt-16 pb-12 text-content-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-border">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-content-primary">
                  PAY<span className="text-primary">PULSE</span>
                </span>
                <p className="text-xs text-content-muted font-mono">
                  SMART • CONSISTENT • RELIABLE
                </p>
              </div>
            </div>

            <p className="text-sm text-content-secondary max-w-sm leading-relaxed">
              <strong>Employee Payroll Naming Conventions Improvement:</strong> Standardized,
              deterministic enterprise payroll management. Eliminates calculation mismatches,
              standardizes legacy naming schemas, and audits salary history in real time.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-elevated border border-border text-xs font-mono text-content-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>PAYPULSE CLUSTER LIVE</span>
              </div>
              <div className="text-xs text-content-dim font-mono">v2.4.0-PROD</div>
            </div>
          </div>

          {/* Nav Col 1: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-content-primary font-bold">
              Core Modules
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#platform-slider" className="hover:text-primary transition-colors">
                  Interactive Platform Modules
                </a>
              </li>
              <li>
                <a href="#error-detector" className="hover:text-primary transition-colors">
                  Error Scanner & Recalculation
                </a>
              </li>
              <li>
                <a href="#salary-history" className="hover:text-primary transition-colors">
                  Salary History Ledger
                </a>
              </li>
            </ul>
          </div>

          {/* Nav Col 2: Workflow & Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-content-primary font-bold">
              Architecture
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#workflow" className="hover:text-primary transition-colors">
                  Approval Sequence
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-primary transition-colors">
                  5-Layer System Stack
                </a>
              </li>
              <li>
                <a href="#technology" className="hover:text-primary transition-colors">
                  Python / Flask / MySQL
                </a>
              </li>
              <li>
                <a href="#roles" className="hover:text-primary transition-colors">
                  User Role Matrix
                </a>
              </li>
              <li>
                <a href="#metrics" className="hover:text-primary transition-colors">
                  Integrity Metrics
                </a>
              </li>
            </ul>
          </div>

          {/* Nav Col 3: Portal Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-content-primary font-bold">
              PayPulse Portals
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium text-content-primary"
                >
                  <span>PayPulse Login</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium text-content-primary"
                >
                  <span>PayPulse Control Hub</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <a
                  href="#platform-slider"
                  className="hover:text-primary transition-colors text-content-secondary"
                >
                  Interactive Modules
                </a>
              </li>
              <li>
                <div className="pt-2">
                  <span className="text-xs px-2.5 py-1 rounded bg-primary/15 text-primary border border-primary/30 font-mono">
                    Mode: {config.colorMode.toUpperCase()}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-content-dim">
          <div>
            &copy; {new Date().getFullYear()} PAYPULSE — EMPLOYEE PAYROLL NAMING CONVENTIONS IMPROVEMENT.
            All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Enterprise Compliance</span>
            <span>Deterministic Formulas</span>
            <span>ISO 27001 Prepared</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
