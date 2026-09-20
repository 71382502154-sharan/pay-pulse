'use client';

import React from 'react';
import {
  Code,
  Server,
  Database,
  BarChart,
  Eye,
  GitBranch,
  Terminal,
  Cpu,
} from 'lucide-react';

export const TechnologySection: React.FC = () => {
  const techStack = [
    {
      category: 'Frontend & UI',
      icon: Code,
      color: '#38bdf8',
      tools: ['React 19', 'TypeScript', 'Vite & Tailwind CSS', 'Motion & Lucide Icons'],
      description: 'Responsive, accessible, high-performance interface with centralized design tokens.',
    },
    {
      category: 'Backend & AI Engine',
      icon: Server,
      color: '#10b981',
      tools: ['Node.js & Express REST API', 'Google Gemini AI Integration', 'JWT Authentication', 'Statutory Logic (EPF/ESI/TDS)'],
      description: 'Deterministic computation modules for Indian statutory equations, allowances, and escrow disbursements.',
    },
    {
      category: 'Database & Relational Schema',
      icon: Database,
      color: '#06b6d4',
      tools: ['MySQL Relational DB', 'SQLite (Development/Testing)', 'SQLAlchemy ORM', 'ACID Transactions'],
      description: 'Standardized tables (employees, salary_transactions, salary_revisions) with foreign keys.',
    },
    {
      category: 'Analytics & Anomaly Engine',
      icon: BarChart,
      color: '#f59e0b',
      tools: ['Python Pandas', 'NumPy Calculations', 'Statistical Deviation Scanners', 'Z-Score Thresholds'],
      description: 'Historical compensation modeling for sudden unindexed spike flags (>30% variance).',
    },
    {
      category: 'Visualization & Graphics',
      icon: Eye,
      color: '#a855f7',
      tools: ['Three.js (WebGL Ecosystem)', 'Chart.js Visualizations', 'Interactive SVG Ledgers', 'CSS Custom Vars'],
      description: 'Dynamic charts, 3D interactive ecosystem rendering, and time-series salary curves.',
    },
    {
      category: 'Development & Quality',
      icon: GitBranch,
      color: '#ec4899',
      tools: ['VS Code Workspace', 'Git Version Control', 'Automated Unit Test Suites', 'Type Safety Linters'],
      description: 'Clean modular code structure with strict separation between API services and views.',
    },
  ];

  return (
    <section id="technology" className="py-24 relative border-t border-border bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 border border-secondary/30 text-xs font-mono text-secondary font-bold">
            <Cpu className="w-3.5 h-3.5" /> ACCURATE STACK
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-content-primary tracking-tight">
            PRODUCTION TECHNOLOGY <span className="gradient-text">ECOSYSTEM.</span>
          </h2>
          <p className="text-base text-content-secondary leading-relaxed">
            Engineered with proven open-source enterprise foundations. High performance, zero
            proprietary lock-in, and strict mathematical predictability.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((stack, idx) => {
            const Icon = stack.icon;

            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-card border border-border hover:border-primary/40 transition-all shadow-sm flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${stack.color}20`, color: stack.color }}
                    >
                      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-content-dim">
                        TECH STACK
                      </span>
                      <h3 className="text-base font-bold text-content-primary">
                        {stack.category}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-content-secondary leading-relaxed mb-4">
                    {stack.description}
                  </p>
                </div>

                {/* Badges */}
                <div className="pt-3 border-t border-border/50 flex flex-wrap gap-1.5">
                  {stack.tools.map((tool, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-surface-elevated/70 border border-border text-content-primary font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
