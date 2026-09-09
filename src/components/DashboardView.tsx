import React, { useState } from 'react';
import { ApprovalItem, MilestoneEvent, NavigationTab, EmployeeRow } from '../types';
import { exportReconciliationLedger } from '../utils/downloadUtils';
import { INITIAL_EMPLOYEES } from '../data/payrollData';

interface DashboardViewProps {
  onNavigateToPayRun: () => void;
  onNavigateToTab: (tab: NavigationTab) => void;
  onOpenNamingCenter: () => void;
  onOpenAddEmployee: () => void;
  approvals: ApprovalItem[];
  onApproveItem: (id: string) => void;
  onBatchApproveAll: () => void;
  milestones: MilestoneEvent[];
  onShowToast: (msg: string) => void;
  employees?: EmployeeRow[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToPayRun,
  onNavigateToTab,
  onOpenNamingCenter,
  onOpenAddEmployee,
  approvals,
  onApproveItem,
  onBatchApproveAll,
  milestones,
  onShowToast,
  employees = INITIAL_EMPLOYEES,
}) => {
  const [chartPeriod, setChartPeriod] = useState<'Monthly' | 'Quarterly' | 'Statutory'>('Monthly');
  const [previewApproval, setPreviewApproval] = useState<ApprovalItem | null>(null);
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);

  const pendingApprovals = approvals.filter((a) => a.status === 'pending');

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Executive Greeting & Payroll Cycle Cockpit */}
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-[#eaedff] p-6 lg:p-7 transition-all duration-300">
        <div className="absolute -right-16 -top-16 w-96 h-96 rounded-full bg-gradient-to-br from-[#006a63]/20 via-[#4fdbc8]/15 to-transparent blur-3xl pointer-events-none animate-ambient-glow"></div>
        <div className="absolute right-32 -bottom-20 w-80 h-80 rounded-full bg-gradient-to-tr from-[#172554]/20 via-[#808dc2]/15 to-transparent blur-2xl pointer-events-none animate-ambient-glow" style={{ animationDelay: '-5s' }}></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#99efe5]/40 text-[#006f67] font-['Hanken_Grotesk'] text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#006a63] animate-pulse"></span>
                Active Cycle: 01 Mar – 31 Mar, 2025
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ffdad6]/60 text-[#93000a] font-['Hanken_Grotesk'] text-xs font-semibold animate-pulse-halo">
                <span className="material-symbols-outlined text-[0.875rem]">schedule</span>
                Cycle Closes in 4 Days
              </span>
            </div>

            <div className="pt-1">
              <h1 className="font-['Plus_Jakarta_Sans'] text-2xl lg:text-[1.75rem] text-[#131b2e] font-bold tracking-tight">
                Good morning, Priya
              </h1>
              <p className="font-['Hanken_Grotesk'] text-sm text-[#45464f] max-w-2xl mt-0.5 leading-relaxed">
                Fiduciary review for March 2025 cycle. {pendingApprovals.length} director sign-offs pending; statutory remittance reconciliation ready for submission.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap shrink-0">
            <button
              onClick={() => {
                exportReconciliationLedger(employees);
                onShowToast('March 2025 Executive Payroll Summary exported & downloaded (CSV/Excel)');
              }}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#eaedff] text-[#131b2e] hover:bg-[#dae2fd] transition-all font-['Plus_Jakarta_Sans'] text-xs font-semibold active:scale-95 shadow-sm hover:shadow"
            >
              <span className="material-symbols-outlined text-[1.125rem]">download</span>
              <span>Export Summary</span>
            </button>
            <button
              onClick={onNavigateToPayRun}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#006a63] text-white hover:bg-[#00504a] transition-all font-['Plus_Jakarta_Sans'] text-xs font-semibold shadow-md hover:shadow-lg active:scale-95 hover:brightness-105"
            >
              <span className="material-symbols-outlined text-[1.125rem]">play_circle</span>
              <span>Process March Pay Run</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Workforce */}
        <div
          onClick={() => onNavigateToTab('employees')}
          className="rounded-xl bg-white p-5 shadow-sm border border-[#eaedff] flex flex-col justify-between card-interactive stat-glow cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="font-['Hanken_Grotesk'] text-[0.6875rem] uppercase tracking-wider text-[#45464f] font-semibold">
                Total Employees
              </span>
              <div className="font-['Plus_Jakarta_Sans'] font-bold text-2xl text-[#131b2e] tracking-tight tabular-nums">
                {employees.length > 0 ? employees.length : '6'}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-[#000f3f] group-hover:bg-[#000f3f] group-hover:text-white group-hover:rotate-6 transition-all duration-300">
              <span className="material-symbols-outlined text-[1.35rem]">groups</span>
            </div>
          </div>
          {/* Animated Mini Sparkline */}
          <div className="py-2">
            <svg className="w-full h-7 overflow-visible" viewBox="0 0 160 28" preserveAspectRatio="none">
              <defs>
                <linearGradient id="kpiGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#006a63" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#006a63" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,22 Q35,18 70,14 T130,8 T160,4 L160,28 L0,28 Z" fill="url(#kpiGrad1)" />
              <path d="M0,22 Q35,18 70,14 T130,8 T160,4" fill="none" stroke="#006a63" strokeWidth="2" strokeLinecap="round" />
              <circle cx="160" cy="4" r="3" fill="#006a63" className="animate-ping" style={{ animationDuration: '3s' }} />
              <circle cx="160" cy="4" r="2.5" fill="#006a63" />
            </svg>
          </div>
          <div className="pt-2 flex items-center justify-between text-xs text-[#45464f] border-t border-[#eaedff]/60">
            <div className="inline-flex items-center gap-1 text-[#006a63] font-semibold">
              <span className="material-symbols-outlined text-[0.95rem]">trending_up</span>
              <span>+100% verified</span>
            </div>
            <span className="font-medium text-[#006a63]">Active Roster</span>
          </div>
        </div>

        {/* Estimated Gross Payroll */}
        <div
          onClick={onNavigateToPayRun}
          className="rounded-xl bg-white p-5 shadow-sm border border-[#eaedff] flex flex-col justify-between card-interactive stat-glow cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="font-['Hanken_Grotesk'] text-[0.6875rem] uppercase tracking-wider text-[#45464f] font-semibold">
                Estimated Gross Payroll
              </span>
              <div className="font-['Plus_Jakarta_Sans'] font-bold text-2xl text-[#131b2e] tracking-tight tabular-nums">
                ₹13,55,000
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#99efe5]/40 flex items-center justify-center text-[#006f67] group-hover:bg-[#006a63] group-hover:text-white group-hover:scale-110 transition-all duration-300">
              <span className="material-symbols-outlined text-[1.35rem]">payments</span>
            </div>
          </div>
          {/* Animated Mini Sparkline */}
          <div className="py-2">
            <svg className="w-full h-7 overflow-visible" viewBox="0 0 160 28" preserveAspectRatio="none">
              <defs>
                <linearGradient id="kpiGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#172554" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#172554" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,18 Q40,6 80,15 T160,5 L160,28 L0,28 Z" fill="url(#kpiGrad2)" />
              <path d="M0,18 Q40,6 80,15 T160,5" fill="none" stroke="#172554" strokeWidth="2" strokeLinecap="round" />
              <circle cx="160" cy="5" r="3" fill="#172554" className="animate-ping" style={{ animationDuration: '3s' }} />
              <circle cx="160" cy="5" r="2.5" fill="#172554" />
            </svg>
          </div>
          <div className="pt-2 flex items-center justify-between text-xs text-[#45464f] border-t border-[#eaedff]/60">
            <div className="inline-flex items-center gap-1 text-[#006a63] font-semibold">
              <span className="material-symbols-outlined text-[0.95rem]">insights</span>
              <span>March Cycle</span>
            </div>
            <span className="font-medium">6 Members Calculated</span>
          </div>
        </div>

        {/* Pending Approval Queue */}
        <div
          onClick={() => onNavigateToTab('approvals')}
          className="rounded-xl bg-white p-5 shadow-sm border border-[#eaedff] flex flex-col justify-between card-interactive stat-glow cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="font-['Hanken_Grotesk'] text-[0.6875rem] uppercase tracking-wider text-[#45464f] font-semibold">
                Pending Approval Queue
              </span>
              <div className="font-['Plus_Jakarta_Sans'] font-bold text-2xl text-[#131b2e] tracking-tight tabular-nums">
                {pendingApprovals.length} Requests
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#e2e7ff] flex items-center justify-center text-[#000f3f] group-hover:bg-[#000f3f] group-hover:text-white group-hover:-rotate-6 transition-all duration-300">
              <span className="material-symbols-outlined text-[1.35rem]">pending_actions</span>
            </div>
          </div>
          {/* Animated Mini Sparkline */}
          <div className="py-2">
            <svg className="w-full h-7 overflow-visible" viewBox="0 0 160 28" preserveAspectRatio="none">
              <defs>
                <linearGradient id="kpiGrad3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ba1a1a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,6 Q40,12 80,16 T160,22 L160,28 L0,28 Z" fill="url(#kpiGrad3)" />
              <path d="M0,6 Q40,12 80,16 T160,22" fill="none" stroke="#ba1a1a" strokeWidth="2" strokeLinecap="round" />
              <circle cx="160" cy="22" r="3" fill="#ba1a1a" className="animate-ping" style={{ animationDuration: '3s' }} />
              <circle cx="160" cy="22" r="2.5" fill="#ba1a1a" />
            </svg>
          </div>
          <div className="pt-2 flex items-center justify-between text-xs text-[#45464f] border-t border-[#eaedff]/60">
            <div className="inline-flex items-center gap-1 text-[#ba1a1a] font-semibold">
              <span className="material-symbols-outlined text-[0.95rem]">error_outline</span>
              <span>{pendingApprovals.length} director holds</span>
            </div>
            <span className="text-[#006a63] font-medium">Fiduciary Review</span>
          </div>
        </div>

        {/* Compliance & Attendance */}
        <div
          onClick={() => onNavigateToTab('attendance')}
          className="rounded-xl bg-white p-5 shadow-sm border border-[#eaedff] flex flex-col justify-between card-interactive stat-glow cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="font-['Hanken_Grotesk'] text-[0.6875rem] uppercase tracking-wider text-[#45464f] font-semibold">
                Compliance &amp; Attendance
              </span>
              <div className="font-['Plus_Jakarta_Sans'] font-bold text-2xl text-[#131b2e] tracking-tight tabular-nums flex items-center gap-2">
                <span>99.2%</span>
                <span className="text-[0.6875rem] px-1.5 py-0.5 rounded bg-[#99efe5]/50 text-[#006f67] font-semibold">
                  EXCELLENT
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-[#000f3f] group-hover:bg-[#000f3f] group-hover:text-white group-hover:scale-110 transition-all duration-300">
              <span className="material-symbols-outlined text-[1.35rem]">verified_user</span>
            </div>
          </div>
          {/* Animated Mini Sparkline */}
          <div className="py-2">
            <svg className="w-full h-7 overflow-visible" viewBox="0 0 160 28" preserveAspectRatio="none">
              <defs>
                <linearGradient id="kpiGrad4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#006f67" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#006f67" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,14 Q40,8 80,11 T160,5 L160,28 L0,28 Z" fill="url(#kpiGrad4)" />
              <path d="M0,14 Q40,8 80,11 T160,5" fill="none" stroke="#006f67" strokeWidth="2" strokeLinecap="round" />
              <circle cx="160" cy="5" r="3" fill="#006f67" className="animate-ping" style={{ animationDuration: '3s' }} />
              <circle cx="160" cy="5" r="2.5" fill="#006f67" />
            </svg>
          </div>
          <div className="pt-2 flex items-center justify-between text-xs text-[#45464f] border-t border-[#eaedff]/60">
            <div className="inline-flex items-center gap-1 text-[#006a63] font-semibold">
              <span className="material-symbols-outlined text-[0.95rem]">check_circle</span>
              <span>Statutory pass</span>
            </div>
            <span>EPFO / TDS ready</span>
          </div>
        </div>
      </div>

      {/* Analytics & Payroll Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* 6-Month Ledger Overview (Chart) */}
        <div className="lg:col-span-8 rounded-xl bg-white p-6 shadow-sm border border-[#eaedff] flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-base font-semibold text-[#131b2e]">
                Payroll Trajectory &amp; Cost Composition
              </h2>
              <p className="font-['Hanken_Grotesk'] text-xs text-[#45464f]">
                Gross disbursement vs statutory deductions over the trailing 6 months (INR Cr)
              </p>
            </div>
            <div className="flex items-center gap-1 bg-[#f2f3ff] p-1 rounded-lg self-start sm:self-auto">
              {(['Monthly', 'Quarterly', 'Statutory'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  type="button"
                  className={`px-3 py-1 text-xs rounded transition-all font-semibold ${
                    chartPeriod === period
                      ? 'bg-white text-[#000f3f] shadow-sm'
                      : 'text-[#45464f] hover:text-[#131b2e]'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Financial Graph */}
          <div className="w-full h-56 relative pt-2">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 760 190">
              <defs>
                <linearGradient id="grossGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#172554" stopOpacity="0.35" />
                  <stop offset="70%" stopColor="#172554" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#172554" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="netGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#006a63" stopOpacity="0.4" />
                  <stop offset="70%" stopColor="#006a63" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#006a63" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#006a63" floodOpacity="0.35" />
                </filter>
              </defs>

              {/* Horizontal Grid lines */}
              <line stroke="#eaedff" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="760" y1="15" y2="15" />
              <line stroke="#eaedff" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="760" y1="60" y2="60" />
              <line stroke="#eaedff" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="760" y1="105" y2="105" />
              <line stroke="#eaedff" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="760" y1="150" y2="150" />

              {/* Gross Area & Line */}
              <polygon fill="url(#grossGrad)" points="20,150 20,80 160,72 300,68 440,55 580,48 720,38 720,150" />
              <polyline
                fill="none"
                points="20,80 160,72 300,68 440,55 580,48 720,38"
                stroke="#172554"
                strokeWidth="3"
                strokeLinecap="round"
                className="transition-all duration-300"
              />

              {/* Net Area & Line */}
              <polygon fill="url(#netGrad)" points="20,150 20,105 160,98 300,92 440,82 580,74 720,62 720,150" />
              <polyline
                fill="none"
                points="20,105 160,98 300,92 440,82 580,74 720,62"
                stroke="#006a63"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#glowEffect)"
                className="transition-all duration-300"
              />

              {/* Data Nodes with Pulsing Glow on Hover */}
              {[
                { x: 20, y: 80 }, { x: 160, y: 72 }, { x: 300, y: 68 },
                { x: 440, y: 55 }, { x: 580, y: 48 }
              ].map((pt, idx) => (
                <circle key={`gross-${idx}`} cx={pt.x} cy={pt.y} fill="#172554" r="3.5" stroke="#ffffff" strokeWidth="1.5" className="hover:r-5 transition-all cursor-pointer" />
              ))}

              {[
                { x: 20, y: 105 }, { x: 160, y: 98 }, { x: 300, y: 92 },
                { x: 440, y: 82 }, { x: 580, y: 74 }
              ].map((pt, idx) => (
                <circle key={`net-${idx}`} cx={pt.x} cy={pt.y} fill="#006a63" r="3.5" stroke="#ffffff" strokeWidth="1.5" className="hover:r-5 transition-all cursor-pointer" />
              ))}

              {/* Highlight Nodes on Latest March Point */}
              <circle cx="720" cy="38" fill="#172554" r="6" stroke="#ffffff" strokeWidth="2.5" className="animate-pulse" />
              <circle cx="720" cy="62" fill="#006a63" r="6" stroke="#ffffff" strokeWidth="2.5" className="animate-pulse" />
            </svg>

            {/* Graph X Labels */}
            <div className="flex justify-between font-['Hanken_Grotesk'] text-[0.6875rem] text-[#45464f] pt-2 px-1">
              <span>Oct '24</span>
              <span>Nov '24</span>
              <span>Dec '24</span>
              <span>Jan '25</span>
              <span>Feb '25</span>
              <span className="font-bold text-[#006a63] bg-[#99efe5]/40 px-2 py-0.5 rounded-full border border-[#006a63]/20 shadow-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006a63] animate-pulse"></span>
                Mar '25 (Active)
              </span>
            </div>
          </div>

          {/* Metric Badges Legend */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-[#f2f3ff] flex items-center justify-between border border-[#eaedff] card-interactive">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#172554] shadow-xs"></span>
                <span className="text-xs text-[#45464f] font-medium">Gross Payroll</span>
              </div>
              <span className="text-xs font-bold text-[#131b2e] tabular-nums">₹8.43 Cr</span>
            </div>

            <div className="p-3 rounded-xl bg-[#f2f3ff] flex items-center justify-between border border-[#eaedff] card-interactive">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#006a63] shadow-xs"></span>
                <span className="text-xs text-[#45464f] font-medium">Net Disbursable</span>
              </div>
              <span className="text-xs font-bold text-[#006a63] tabular-nums">₹7.19 Cr</span>
            </div>

            <div className="p-3 rounded-xl bg-[#f2f3ff] flex items-center justify-between border border-[#eaedff] card-interactive">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#4f5c8e] shadow-xs"></span>
                <span className="text-xs text-[#45464f] font-medium">Statutory TDS/PF</span>
              </div>
              <span className="text-xs font-bold text-[#131b2e] tabular-nums">₹1.24 Cr</span>
            </div>
          </div>
        </div>

        {/* Cost by Department */}
        <div className="lg:col-span-4 rounded-xl bg-white p-6 shadow-sm border border-[#eaedff] flex flex-col space-y-4 card-interactive">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-base font-semibold text-[#131b2e]">
                Cost by Department
              </h2>
              <p className="font-['Hanken_Grotesk'] text-xs text-[#45464f]">Top operational allocations</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-[#006a63]">
              <span className="material-symbols-outlined text-[1.25rem]">donut_small</span>
            </div>
          </div>

          {/* Interactive Donut Chart Graphic */}
          <div className="flex items-center justify-center pt-1 pb-1 relative">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="transparent"
                  stroke="#eaedff"
                  strokeWidth="15"
                />

                {/* Engineering (40.3%): 146.8 */}
                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="transparent"
                  stroke="#172554"
                  strokeWidth={hoveredDept === 'eng' ? '19' : '15'}
                  strokeDasharray="144 364.42"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredDept('eng')}
                  onMouseLeave={() => setHoveredDept(null)}
                />

                {/* Operations (21.4%): 77.9 */}
                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="transparent"
                  stroke="#006a63"
                  strokeWidth={hoveredDept === 'ops' ? '19' : '15'}
                  strokeDasharray="75.5 364.42"
                  strokeDashoffset="-146.8"
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredDept('ops')}
                  onMouseLeave={() => setHoveredDept(null)}
                />

                {/* Product (14.2%): 51.7 */}
                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="transparent"
                  stroke="#4f5c8e"
                  strokeWidth={hoveredDept === 'prod' ? '19' : '15'}
                  strokeDasharray="49.5 364.42"
                  strokeDashoffset="-224.7"
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredDept('prod')}
                  onMouseLeave={() => setHoveredDept(null)}
                />

                {/* Sales (13.1%): 47.7 */}
                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="transparent"
                  stroke="#006f67"
                  strokeWidth={hoveredDept === 'sales' ? '19' : '15'}
                  strokeDasharray="45.5 364.42"
                  strokeDashoffset="-276.4"
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredDept('sales')}
                  onMouseLeave={() => setHoveredDept(null)}
                />

                {/* HR & Legal (11.0%): 40.0 */}
                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="transparent"
                  stroke="#767680"
                  strokeWidth={hoveredDept === 'hr' ? '19' : '15'}
                  strokeDasharray="38 364.42"
                  strokeDashoffset="-324.1"
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredDept('hr')}
                  onMouseLeave={() => setHoveredDept(null)}
                />
              </svg>

              {/* Center Readout Badge */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-2">
                <span className="text-[0.625rem] font-['Hanken_Grotesk'] uppercase tracking-wider text-[#45464f] font-semibold">
                  {hoveredDept === 'eng'
                    ? 'Engineering'
                    : hoveredDept === 'ops'
                    ? 'Operations'
                    : hoveredDept === 'prod'
                    ? 'Product'
                    : hoveredDept === 'sales'
                    ? 'Sales'
                    : hoveredDept === 'hr'
                    ? 'HR & Admin'
                    : 'Total Head'}
                </span>
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#131b2e] leading-tight">
                  {hoveredDept === 'eng'
                    ? '₹3.40 Cr'
                    : hoveredDept === 'ops'
                    ? '₹1.80 Cr'
                    : hoveredDept === 'prod'
                    ? '₹1.20 Cr'
                    : hoveredDept === 'sales'
                    ? '₹1.10 Cr'
                    : hoveredDept === 'hr'
                    ? '₹0.93 Cr'
                    : '₹8.43 Cr'}
                </span>
                <span className="text-[0.625rem] text-[#006a63] font-semibold">
                  {hoveredDept === 'eng'
                    ? '40.3% share'
                    : hoveredDept === 'ops'
                    ? '21.4% share'
                    : hoveredDept === 'prod'
                    ? '14.2% share'
                    : hoveredDept === 'sales'
                    ? '13.1% share'
                    : hoveredDept === 'hr'
                    ? '11.0% share'
                    : '100% Allocated'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {/* Engineering */}
            <div
              className={`space-y-1.5 group cursor-pointer p-1.5 rounded-lg transition-colors ${
                hoveredDept === 'eng' ? 'bg-[#f2f3ff]' : ''
              }`}
              onMouseEnter={() => setHoveredDept('eng')}
              onMouseLeave={() => setHoveredDept(null)}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#000f3f]"></span>
                  <span className="font-semibold text-[#131b2e] group-hover:text-[#006a63] transition-colors">Engineering &amp; Tech</span>
                </div>
                <span className="font-bold text-[#131b2e] tabular-nums">
                  ₹3,40,00,000 <span className="font-normal text-[#45464f] text-[0.6875rem]">(40.3%)</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#eaedff] overflow-hidden p-0.5">
                <div className="h-full rounded-full bg-gradient-to-r from-[#000f3f] to-[#172554] shadow-xs transition-all duration-700 group-hover:brightness-125" style={{ width: '40.3%' }}></div>
              </div>
            </div>

            {/* Operations */}
            <div
              className={`space-y-1.5 group cursor-pointer p-1.5 rounded-lg transition-colors ${
                hoveredDept === 'ops' ? 'bg-[#f2f3ff]' : ''
              }`}
              onMouseEnter={() => setHoveredDept('ops')}
              onMouseLeave={() => setHoveredDept(null)}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#006a63]"></span>
                  <span className="font-semibold text-[#131b2e] group-hover:text-[#006a63] transition-colors">Operations &amp; Support</span>
                </div>
                <span className="font-bold text-[#131b2e] tabular-nums">
                  ₹1,80,00,000 <span className="font-normal text-[#45464f] text-[0.6875rem]">(21.4%)</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#eaedff] overflow-hidden p-0.5">
                <div className="h-full rounded-full bg-gradient-to-r from-[#006a63] to-[#4fdbc8] shadow-xs transition-all duration-700 group-hover:brightness-125" style={{ width: '21.4%' }}></div>
              </div>
            </div>

            {/* Product & Design */}
            <div
              className={`space-y-1.5 group cursor-pointer p-1.5 rounded-lg transition-colors ${
                hoveredDept === 'prod' ? 'bg-[#f2f3ff]' : ''
              }`}
              onMouseEnter={() => setHoveredDept('prod')}
              onMouseLeave={() => setHoveredDept(null)}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4f5c8e]"></span>
                  <span className="font-semibold text-[#131b2e] group-hover:text-[#006a63] transition-colors">Product &amp; Architecture</span>
                </div>
                <span className="font-bold text-[#131b2e] tabular-nums">
                  ₹1,20,00,000 <span className="font-normal text-[#45464f] text-[0.6875rem]">(14.2%)</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#eaedff] overflow-hidden p-0.5">
                <div className="h-full rounded-full bg-gradient-to-r from-[#4f5c8e] to-[#808dc2] shadow-xs transition-all duration-700 group-hover:brightness-125" style={{ width: '14.2%' }}></div>
              </div>
            </div>

            {/* Sales */}
            <div
              className={`space-y-1.5 group cursor-pointer p-1.5 rounded-lg transition-colors ${
                hoveredDept === 'sales' ? 'bg-[#f2f3ff]' : ''
              }`}
              onMouseEnter={() => setHoveredDept('sales')}
              onMouseLeave={() => setHoveredDept(null)}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#006f67]"></span>
                  <span className="font-semibold text-[#131b2e] group-hover:text-[#006a63] transition-colors">Sales &amp; Growth</span>
                </div>
                <span className="font-bold text-[#131b2e] tabular-nums">
                  ₹1,10,00,000 <span className="font-normal text-[#45464f] text-[0.6875rem]">(13.1%)</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#eaedff] overflow-hidden p-0.5">
                <div className="h-full rounded-full bg-gradient-to-r from-[#006f67] to-[#80d5cb] shadow-xs transition-all duration-700 group-hover:brightness-125" style={{ width: '13.1%' }}></div>
              </div>
            </div>

            {/* HR */}
            <div
              className={`space-y-1.5 group cursor-pointer p-1.5 rounded-lg transition-colors ${
                hoveredDept === 'hr' ? 'bg-[#f2f3ff]' : ''
              }`}
              onMouseEnter={() => setHoveredDept('hr')}
              onMouseLeave={() => setHoveredDept(null)}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#767680]"></span>
                  <span className="font-semibold text-[#131b2e] group-hover:text-[#006a63] transition-colors">HR, Legal &amp; G&amp;A</span>
                </div>
                <span className="font-bold text-[#131b2e] tabular-nums">
                  ₹92,65,000 <span className="font-normal text-[#45464f] text-[0.6875rem]">(11.0%)</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#eaedff] overflow-hidden p-0.5">
                <div className="h-full rounded-full bg-gradient-to-r from-[#767680] to-[#c6c5d0] shadow-xs transition-all duration-700 group-hover:brightness-125" style={{ width: '11%' }}></div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#eaedff]">
            <button
              onClick={() => onNavigateToTab('salary-structure')}
              type="button"
              className="text-[#006a63] hover:text-[#00504a] text-xs font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <span>Inspect Department Breakdown</span>
              <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Highlight Feature: Naming Standardization Intelligence Widget */}
      <div className="rounded-2xl bg-gradient-to-r from-[#172554] to-[#000f3f] text-white p-6 shadow-md border border-[#172554] relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-60 h-60 rounded-full bg-[#006a63]/25 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#006a63]/30 text-[#99efe5] text-xs font-semibold">
              <span className="material-symbols-outlined text-[1rem]">auto_fix_high</span>
              <span>AI Compliance Audit</span>
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-white">
              Naming Standardization Intelligence
            </h2>
            <p className="font-['Hanken_Grotesk'] text-sm text-[#808dc2] leading-relaxed">
              Data Quality Health: <strong className="text-white">94.2% Standardized</strong>. 18 duplicate aliases and inconsistent casing profiles detected prior to bank file generation.
            </p>
          </div>

          {/* Sample preview chips */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-[#000f3f]/60 backdrop-blur-md rounded-xl p-3 flex flex-col gap-2 border border-[#808dc2]/20 shadow-sm">
              <div className="flex items-center gap-2 text-xs">
                <span className="line-through text-[#808dc2]">SHARAN R</span>
                <span className="material-symbols-outlined text-[0.875rem] text-[#4fdbc8]">arrow_forward</span>
                <span className="text-white font-semibold">Sharan R.</span>
                <span className="px-1.5 py-0.5 rounded bg-[#006a63]/40 text-[#99efe5] text-[0.625rem] font-bold">
                  98% Match
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="line-through text-[#808dc2]">dr. ananya roy</span>
                <span className="material-symbols-outlined text-[0.875rem] text-[#4fdbc8]">arrow_forward</span>
                <span className="text-white font-semibold">Dr. Ananya Roy</span>
                <span className="px-1.5 py-0.5 rounded bg-[#006a63]/40 text-[#99efe5] text-[0.625rem] font-bold">
                  100% Match
                </span>
              </div>
            </div>

            <button
              onClick={onOpenNamingCenter}
              type="button"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#006a63] text-white hover:bg-[#00504a] transition-all text-xs font-['Plus_Jakarta_Sans'] font-semibold shrink-0 shadow-sm active:scale-95"
            >
              <span>Review in Naming Center</span>
              <span className="material-symbols-outlined text-[1.125rem]">north_east</span>
            </button>
          </div>
        </div>
      </div>

      {/* Operations Split: Pending Approvals & Recent Pay Run Ledger Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Pending Approvals Table (8 Cols) */}
        <div className="xl:col-span-8 rounded-xl bg-white p-6 shadow-sm border border-[#eaedff] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="font-['Plus_Jakarta_Sans'] text-base font-semibold text-[#131b2e]">
                Cycle Approval Queue
              </h2>
              {pendingApprovals.length > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-xs font-bold">
                  {pendingApprovals.length} Pending
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-[#99efe5]/40 text-[#006f67] text-xs font-bold">
                  All Approved
                </span>
              )}
            </div>

            {pendingApprovals.length > 0 && (
              <button
                onClick={onBatchApproveAll}
                type="button"
                className="text-[#006a63] hover:text-[#00504a] text-xs font-semibold hover:underline"
              >
                Batch Approve All
              </button>
            )}
          </div>

          <div className="overflow-x-auto border border-[#eaedff] rounded-xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f2f3ff] text-[#45464f] text-[0.6875rem] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Item / Employee</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Adjustment</th>
                  <th className="py-3 px-4">Submitted By</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaedff] text-xs text-[#131b2e]">
                {approvals.map((appr) => {
                  const isPending = appr.status === 'pending';
                  return (
                    <tr
                      key={appr.id}
                      className={`hover:bg-[#faf8ff] transition-colors ${
                        !isPending ? 'opacity-60 bg-[#f2f3ff]/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#eaedff] flex items-center justify-center font-bold text-[#000f3f] text-xs shrink-0">
                            {appr.initials}
                          </div>
                          <div>
                            <div className="font-semibold text-[#131b2e]">{appr.employeeName}</div>
                            <div className="text-[0.6875rem] text-[#45464f]">
                              {appr.employeeCode} • {appr.designation}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-[#f2f3ff] text-xs text-[#45464f] font-medium border border-[#eaedff]">
                          {appr.category}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-bold tabular-nums ${
                          appr.adjustment < 0 ? 'text-[#ba1a1a]' : 'text-[#131b2e]'
                        }`}
                      >
                        {appr.adjustment < 0
                          ? `-₹${Math.abs(appr.adjustment).toLocaleString('en-IN')}`
                          : `+₹${appr.adjustment.toLocaleString('en-IN')}`}
                      </td>
                      <td className="py-3 px-4 text-[#45464f]">{appr.submittedBy}</td>
                      <td className="py-3 px-4 text-right">
                        {isPending ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => onApproveItem(appr.id)}
                              type="button"
                              className="p-1.5 rounded-lg hover:bg-[#99efe5]/40 text-[#006a63] transition-colors"
                              title="Approve adjustment"
                            >
                              <span className="material-symbols-outlined text-[1.2rem]">check_circle</span>
                            </button>
                            <button
                              onClick={() => setPreviewApproval(appr)}
                              type="button"
                              className="p-1.5 rounded-lg hover:bg-[#eaedff] text-[#767680] transition-colors"
                              title="Review details"
                            >
                              <span className="material-symbols-outlined text-[1.2rem]">visibility</span>
                            </button>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[0.6875rem] font-bold text-[#006a63]">
                            <span className="material-symbols-outlined text-[1rem]">check</span>
                            Approved
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Milestones & Audit Trail (4 Cols) */}
        <div className="xl:col-span-4 rounded-xl bg-white p-6 shadow-sm border border-[#eaedff] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-['Plus_Jakarta_Sans'] text-base font-semibold text-[#131b2e]">
              Milestones &amp; Audit Trail
            </h2>
            <span className="material-symbols-outlined text-[#767680] text-[1.25rem]">history</span>
          </div>

          <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#eaedff]">
            {milestones.map((m) => (
              <div key={m.id} className="relative">
                <div
                  className={`absolute -left-6 top-1 w-3 h-3 rounded-full ring-4 ring-white ${
                    m.dotColor === 'secondary'
                      ? 'bg-[#006a63]'
                      : m.dotColor === 'primary'
                      ? 'bg-[#000f3f]'
                      : 'bg-[#4f5c8e]'
                  }`}
                ></div>
                <div>
                  <div className="text-xs font-semibold text-[#131b2e]">{m.title}</div>
                  <p className="text-[0.6875rem] text-[#45464f] mt-0.5">{m.description}</p>
                  <span className="text-[0.625rem] text-[#767680] mt-1 inline-block">{m.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#eaedff]">
            <button
              onClick={() => onNavigateToTab('reports')}
              type="button"
              className="text-[#006a63] hover:text-[#00504a] text-xs font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <span>View Full Compliance Archive</span>
              <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Executive Quick Actions Bar */}
      <div className="rounded-xl bg-[#f2f3ff] p-5 shadow-sm border border-[#eaedff]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#dae2fd] flex items-center justify-center text-[#000f3f]">
              <span className="material-symbols-outlined text-[1.35rem]">bolt</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-semibold text-[#131b2e]">
                Instant Executive Actions
              </h3>
              <p className="text-xs text-[#45464f]">One-click operational shortcuts for current billing window</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={onOpenAddEmployee}
              type="button"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white text-[#131b2e] hover:bg-[#eaedff] transition-all text-xs font-semibold shadow-sm border border-[#eaedff] active:scale-95"
            >
              <span className="material-symbols-outlined text-[1.125rem] text-[#006a63]">person_add</span>
              <span>Add Employee</span>
            </button>

            <button
              onClick={onNavigateToPayRun}
              type="button"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white text-[#131b2e] hover:bg-[#eaedff] transition-all text-xs font-semibold shadow-sm border border-[#eaedff] active:scale-95"
            >
              <span className="material-symbols-outlined text-[1.125rem] text-[#000f3f]">calculate</span>
              <span>Generate Run</span>
            </button>

            <button
              onClick={() => onNavigateToTab('payslips')}
              type="button"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white text-[#131b2e] hover:bg-[#eaedff] transition-all text-xs font-semibold shadow-sm border border-[#eaedff] active:scale-95"
            >
              <span className="material-symbols-outlined text-[1.125rem] text-[#006f67]">receipt_long</span>
              <span>Issue Payslips</span>
            </button>

            <button
              onClick={() => onShowToast('Audit report compiled. ISO 27001 & SOC-2 compliance check passed.')}
              type="button"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white text-[#131b2e] hover:bg-[#eaedff] transition-all text-xs font-semibold shadow-sm border border-[#eaedff] active:scale-95"
            >
              <span className="material-symbols-outlined text-[1.125rem] text-[#4fdbc8]">verified</span>
              <span>Audit Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Review Item Modal */}
      {previewApproval && (
        <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#eaedff] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
              <div className="font-bold text-base text-[#131b2e]">Cycle Approval Detail</div>
              <button
                onClick={() => setPreviewApproval(null)}
                className="text-[#767680] hover:text-[#131b2e]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#45464f]">Employee:</span>
                <span className="font-semibold text-[#131b2e]">
                  {previewApproval.employeeName} ({previewApproval.employeeCode})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45464f]">Category:</span>
                <span className="font-semibold text-[#131b2e]">{previewApproval.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45464f]">Requested Adjustment:</span>
                <span className="font-bold text-[#006a63]">
                  ₹{Math.abs(previewApproval.adjustment).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45464f]">Submitted By:</span>
                <span className="text-[#131b2e]">{previewApproval.submittedBy}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#f2f3ff] text-[#45464f] text-[0.6875rem]">
                Fiduciary compliance verified against budget head allocation. Requires director authorization before lock step.
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-[#eaedff]">
              <button
                onClick={() => setPreviewApproval(null)}
                className="px-4 py-2 rounded-lg bg-[#eaedff] text-[#131b2e] font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onApproveItem(previewApproval.id);
                  setPreviewApproval(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#006a63] text-white font-semibold"
              >
                Approve Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
