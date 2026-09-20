/**
 * ============================================================================
 * PAYPULSE ENTERPRISE — PAY RUN EXECUTION ENGINE
 * ============================================================================
 * Institutional 8-stage pay run processor supporting batch adjustments, inline
 * bonus editing, statutory LOP recalculation, discrepancy resolution hooks,
 * and encrypted escrow disbursement file generation.
 * ============================================================================
 */

import React, { useState } from 'react';
import { EmployeeRow } from '../types';
import { exportReconciliationLedger } from '../utils/downloadUtils';

/* ========================================================================== */
/* 1. TYPES & PROPS                                                           */
/* ========================================================================== */

interface PayRunExecutionViewProps {
  onBackToDashboard: () => void;
  employees: EmployeeRow[];
  onUpdateEmployeeBonus: (id: string, newBonus: number) => void;
  onOpenBatchUpload: () => void;
  onOpenRuleLogs: () => void;
  onOpenAddAllowance: () => void;
  onOpenDiscrepancies: () => void;
  onShowToast: (msg: string) => void;
  isCollapsed?: boolean;
  isDark?: boolean;
}

type TabCategory = 'All Employees' | 'Special Allowances' | 'Reimbursements' | 'Variable Bonus' | 'Unpaid Leave (LOP)';

/* ========================================================================== */
/* 2. COMPONENT IMPLEMENTATION & STEPPER CONFIGURATION                        */
/* ========================================================================== */

export const PayRunExecutionView: React.FC<PayRunExecutionViewProps> = ({
  onBackToDashboard,
  employees,
  onUpdateEmployeeBonus,
  onOpenBatchUpload,
  onOpenRuleLogs,
  onOpenAddAllowance,
  onOpenDiscrepancies,
  onShowToast,
  isCollapsed = false,
  isDark = false,
}) => {
  const [activeStep, setActiveStep] = useState<number>(4);
  const [activeTab, setActiveTab] = useState<TabCategory>('All Employees');
  const [tableSearch, setTableSearch] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['emp-5']));
  const [editingBonusId, setEditingBonusId] = useState<string | null>(null);
  const [bonusInputVal, setBonusInputVal] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showExemptionMatrix, setShowExemptionMatrix] = useState<boolean>(false);
  const [showRosterModal, setShowRosterModal] = useState<boolean>(false);

  // Filter employees based on active tab and search query
  const filteredEmployees = employees.filter((emp) => {
    if (activeTab === 'Special Allowances' && emp.category !== 'Special Allowances') return false;
    if (activeTab === 'Reimbursements' && emp.category !== 'Reimbursements') return false;
    if (activeTab === 'Variable Bonus' && emp.category !== 'Variable Bonus') return false;
    if (activeTab === 'Unpaid Leave (LOP)' && emp.category !== 'Unpaid Leave (LOP)') return false;

    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      const matchName = emp.name.toLowerCase().includes(q);
      const matchCode = emp.code.toLowerCase().includes(q);
      const matchDesig = emp.designation.toLowerCase().includes(q);
      const matchDept = emp.department.toLowerCase().includes(q);
      return matchName || matchCode || matchDesig || matchDept;
    }
    return true;
  });

  const handleToggleSelect = (id: string) => {
    const updated = new Set(selectedIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedIds(updated);
  };

  const handleSelectAllOnPage = () => {
    if (selectedIds.size >= filteredEmployees.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredEmployees.map((e) => e.id)));
    }
  };

  const handleStartEditBonus = (emp: EmployeeRow) => {
    setEditingBonusId(emp.id);
    setBonusInputVal(emp.adHocBonus.toString());
  };

  const handleSaveBonus = (id: string) => {
    const num = parseInt(bonusInputVal, 10);
    if (!isNaN(num) && num >= 0) {
      onUpdateEmployeeBonus(id, num);
      onShowToast(`Updated ad-hoc bonus to ₹${num.toLocaleString('en-IN')}`);
    }
    setEditingBonusId(null);
  };

  // Steps definition matching screenshot
  const steps = [
    { num: 1, label: 'Period', sub: '01-31 Mar', done: true },
    { num: 2, label: 'Employees', sub: '1,428 Active', done: true },
    { num: 3, label: 'Base Salary', sub: 'Locked Base', done: true },
    { num: 4, label: 'Allowances & Bonus', sub: 'In Review', active: true },
    { num: 5, label: 'Deductions', sub: 'Statutory & TDS' },
    { num: 6, label: 'Reconciliation', sub: 'Delta & Variances' },
    { num: 7, label: 'Approvals', sub: 'Director Sign-off' },
    { num: 8, label: 'Disbursement', sub: 'Banking File' },
  ];

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1600px] mx-auto w-full pb-24">
      {/* Header Breadcrumbs & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-[#45464f] font-['Hanken_Grotesk']">
          <button onClick={onBackToDashboard} className="hover:text-[#006a63]">Home</button>
          <span>&gt;</span>
          <button onClick={onBackToDashboard} className="hover:text-[#006a63]">Payroll</button>
          <span>&gt;</span>
          <span className="text-[#45464f]">Pay Runs</span>
          <span>&gt;</span>
          <span className="text-[#131b2e] font-semibold bg-[#eaedff] px-2 py-0.5 rounded text-[0.6875rem]">
            PR-2025-03
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#45464f]">
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#006f67]">
            <span className="w-2 h-2 rounded-full bg-[#006a63]"></span>
            Cycle in Draft Execution
          </span>
          <span className="text-[#767680]">•</span>
          <span>Last saved: Today, 14:32 IST</span>
        </div>
      </div>

      {/* Main Execution Title & Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="font-['Hanken_Grotesk'] text-[0.6875rem] uppercase tracking-wider text-[#006a63] font-bold">
            Standard Institutional Pay Run
          </span>
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight mt-0.5">
            Pay Run Execution — March 2025
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onOpenBatchUpload}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-[#eaedff] text-[#131b2e] hover:bg-[#f2f3ff] transition-all text-xs font-semibold shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[1.125rem]">upload_file</span>
            <span>Batch Upload Adjustments</span>
          </button>
          <button
            onClick={onOpenRuleLogs}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-[#eaedff] text-[#131b2e] hover:bg-[#f2f3ff] transition-all text-xs font-semibold shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[1.125rem]">receipt_long</span>
            <span>Rule Engine Logs</span>
          </button>
        </div>
      </div>

      {/* 8-Step Stepper Component */}
      <div className="overflow-x-auto py-2">
        <div className="min-w-[960px] flex items-center justify-between relative">
          {steps.map((step, idx) => {
            const isCompleted = step.num < activeStep;
            const isCurrent = step.num === activeStep;
            const isFuture = step.num > activeStep;

            return (
              <React.Fragment key={step.num}>
                {/* Step Item */}
                <div
                  onClick={() => setActiveStep(step.num)}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                      isCompleted
                        ? 'bg-[#006a63] text-white shadow-sm'
                        : isCurrent
                        ? 'bg-[#000f3f] text-white ring-4 ring-[#eaedff] animate-pulse-halo shadow-md'
                        : 'bg-[#eaedff] text-[#767680] group-hover:bg-[#dae2fd]'
                    }`}
                  >
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-[1rem]">check</span>
                    ) : (
                      step.num
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`font-['Plus_Jakarta_Sans'] text-xs font-semibold leading-tight ${
                        isCurrent ? 'text-[#131b2e]' : isCompleted ? 'text-[#006a63]' : 'text-[#767680]'
                      }`}
                    >
                      {step.num}. {step.label}
                    </span>
                    <span className="text-[0.625rem] text-[#45464f] leading-tight mt-0.5">
                      {step.sub}
                    </span>
                  </div>
                </div>

                {/* Connecting Line */}
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded-full ${
                      step.num < activeStep ? 'bg-[#006a63]' : 'bg-[#eaedff]'
                    }`}
                  ></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Top Navy Summary Metrics Card */}
      <div className="rounded-2xl bg-[#172554] text-white p-6 shadow-md relative overflow-hidden border border-[#172554]">
        <div className="absolute -right-16 -top-16 w-96 h-96 rounded-full bg-gradient-to-br from-[#006a63]/30 via-[#4fdbc8]/15 to-transparent blur-3xl pointer-events-none animate-ambient-glow"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-gradient-to-tr from-[#000f3f]/50 via-[#808dc2]/15 to-transparent blur-2xl pointer-events-none animate-ambient-glow" style={{ animationDelay: '-4s' }}></div>

        {/* Sub-Header Row */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#808dc2]/25">
          <div className="flex flex-wrap items-center gap-6 lg:gap-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Hanken_Grotesk'] text-[0.6875rem] uppercase tracking-wider text-[#808dc2] font-semibold">
                  Payroll Period
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#006a63]/40 text-[#99efe5] text-[0.625rem] font-bold">
                  <span className="material-symbols-outlined text-[0.75rem]">verified_user</span>
                  EPFO &amp; Form 16 Sync Ready
                </span>
              </div>
              <div className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-white mt-0.5">
                01 Mar 2025 — 31 Mar 2025
              </div>
            </div>

            <div>
              <span className="font-['Hanken_Grotesk'] text-[0.6875rem] uppercase tracking-wider text-[#808dc2] font-semibold">
                Scheduled Value Date
              </span>
              <div className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[1rem] text-[#4fdbc8]">event</span>
                31 March 2025 (NEFT/RTGS)
              </div>
            </div>

            <div>
              <span className="font-['Hanken_Grotesk'] text-[0.6875rem] uppercase tracking-wider text-[#808dc2] font-semibold">
                Eligible Workforce
              </span>
              <div className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[1rem] text-[#4fdbc8]">groups</span>
                1,428 Employees
              </div>
            </div>
          </div>
        </div>

        {/* 4 Cards Grid inside Navy Container */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-6">
          {/* Total Gross Payroll */}
          <div className="rounded-xl bg-[#000f3f]/60 backdrop-blur-md p-4 border border-[#808dc2]/25 flex flex-col justify-between card-interactive cursor-pointer group">
            <div className="flex items-center justify-between">
              <span className="font-['Hanken_Grotesk'] text-[0.6875rem] uppercase tracking-wider text-[#808dc2] font-semibold">
                Total Gross Payroll
              </span>
              <span className="material-symbols-outlined text-[#808dc2] group-hover:text-white transition-colors text-[1.125rem]">credit_card</span>
            </div>
            <div className="py-2">
              <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-white tabular-nums">
                ₹8,42,65,000
              </div>
            </div>
            <div className="text-[0.6875rem] text-[#80d5cb] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[0.875rem]">trending_up</span>
              +2.3% vs. Feb 2025 cycle
            </div>
          </div>

          {/* Allowances & Variable */}
          <div className="rounded-xl bg-[#000f3f]/60 backdrop-blur-md p-4 border border-[#808dc2]/25 flex flex-col justify-between card-interactive cursor-pointer group">
            <div className="flex items-center justify-between">
              <span className="font-['Hanken_Grotesk'] text-[0.6875rem] uppercase tracking-wider text-[#808dc2] font-semibold">
                Allowances &amp; Variable
              </span>
              <span className="material-symbols-outlined text-[#808dc2] group-hover:text-white transition-colors text-[1.125rem]">add_circle</span>
            </div>
            <div className="py-2">
              <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-white tabular-nums">
                ₹64,20,000
              </div>
            </div>
            <div className="flex items-center justify-between text-[0.6875rem]">
              <span className="text-[#808dc2]">HRA, Travel, Performance</span>
              <span className="px-1.5 py-0.5 rounded bg-[#172554] text-[#99efe5] text-[0.625rem] font-bold">
                142 claim items
              </span>
            </div>
          </div>

          {/* Total Deductions */}
          <div className="rounded-xl bg-[#000f3f]/60 backdrop-blur-md p-4 border border-[#808dc2]/25 flex flex-col justify-between card-interactive cursor-pointer group">
            <div className="flex items-center justify-between">
              <span className="font-['Hanken_Grotesk'] text-[0.6875rem] uppercase tracking-wider text-[#808dc2] font-semibold">
                Total Deductions
              </span>
              <span className="material-symbols-outlined text-[#808dc2] group-hover:text-white transition-colors text-[1.125rem]">remove_circle</span>
            </div>
            <div className="py-2">
              <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-white tabular-nums">
                ₹1,48,50,000
              </div>
            </div>
            <div className="text-[0.6875rem] text-[#808dc2] truncate">
              PF ₹68L • TDS ₹62L • PT ₹2.8L • Ins ₹15.7L
            </div>
          </div>

          {/* Estimated Net Payout */}
          <div className="rounded-xl bg-[#006a63]/50 backdrop-blur-md p-4 border border-[#006a63] flex flex-col justify-between card-interactive cursor-pointer group shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-['Hanken_Grotesk'] text-[0.6875rem] uppercase tracking-wider text-[#99efe5] font-semibold">
                Estimated Net Payout
              </span>
              <span className="material-symbols-outlined text-[#99efe5] group-hover:rotate-12 transition-transform text-[1.125rem]">payments</span>
            </div>
            <div className="py-2">
              <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-white tabular-nums">
                ₹6,94,15,000
              </div>
            </div>
            <div className="flex items-center justify-between text-[0.6875rem]">
              <span className="text-[#99efe5]">Disbursement Escrow</span>
              <span className="px-2 py-0.5 rounded bg-[#006a63] text-white text-[0.625rem] font-bold">
                Funds Reserved
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Status Banner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: EPFO Validation */}
        <div className="rounded-xl bg-white p-4 shadow-sm border border-[#eaedff] flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#99efe5]/40 text-[#006a63] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[1.125rem]">verified</span>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[#131b2e]">EPFO Statutory Validation</span>
              <span className="px-2 py-0.5 rounded bg-[#99efe5]/40 text-[#006f67] text-[0.625rem] font-bold">
                PASSED
              </span>
            </div>
            <p className="text-[0.6875rem] text-[#45464f] leading-relaxed">
              PF &amp; ESI calculation matches EPFO statutory formula (12% basic ceiling applied across all bands).
            </p>
          </div>
        </div>

        {/* Card 2: Negative Net Pay Discrepancy */}
        <div className="rounded-xl bg-[#ffdad6]/20 p-4 shadow-sm border border-[#ffdad6] flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[1.125rem]">warning</span>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[#ba1a1a]">Negative Net Pay Discrepancy</span>
              <span className="px-2 py-0.5 rounded bg-[#ba1a1a] text-white text-[0.625rem] font-bold">
                ACTION REQUIRED
              </span>
            </div>
            <p className="text-[0.6875rem] text-[#45464f] leading-relaxed">
              3 employees have negative net pay due to high loan EMI and tax adjustments — flagged for clearance.
            </p>
            <button
              onClick={onOpenDiscrepancies}
              className="text-[#ba1a1a] hover:underline font-semibold text-[0.6875rem] inline-flex items-center gap-1 pt-0.5"
            >
              <span>Resolve 3 Cases</span>
              <span className="material-symbols-outlined text-[0.875rem]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Card 3: Mid-Month Joiner Pro-ration */}
        <div className="rounded-xl bg-white p-4 shadow-sm border border-[#eaedff] flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#f2f3ff] text-[#172554] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[1.125rem]">info</span>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[#131b2e]">Mid-Month Joiner Pro-ration</span>
              <span className="px-2 py-0.5 rounded bg-[#eaedff] text-[#172554] text-[0.625rem] font-bold">
                AUTOMATED
              </span>
            </div>
            <p className="text-[0.6875rem] text-[#45464f] leading-relaxed">
              14 new joiners pro-rated based on exact date of joining; biometric logs and attendance synced.
            </p>
            <button
              onClick={() => setShowRosterModal(true)}
              className="text-[#006a63] hover:underline font-semibold text-[0.6875rem] inline-flex items-center gap-1 pt-0.5"
            >
              <span>View Joined Employee Roster</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ledger Table Section */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-[#eaedff] space-y-4">
        {/* Table Top Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-base font-semibold text-[#131b2e]">
              Allowance &amp; Loss-of-Pay Ledger Adjustments
            </h2>
            <p className="font-['Hanken_Grotesk'] text-xs text-[#45464f]">
              Review monthly variable compensation, one-off project awards, and unapproved absence days before locking deductions.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onShowToast('Filter panel applied: Active status and department heads active')}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-semibold border border-[#eaedff] transition-all"
            >
              <span className="material-symbols-outlined text-[1.125rem]">tune</span>
              <span>Filters</span>
            </button>
            <button
              onClick={() => onShowToast('Column view configuration: All 7 statutory columns visible')}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-semibold border border-[#eaedff] transition-all"
            >
              <span className="material-symbols-outlined text-[1.125rem]">view_column</span>
              <span>Configure Columns</span>
            </button>
            <button
              onClick={onOpenAddAllowance}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-semibold transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[1.125rem]">add</span>
              <span>Add Custom Allowance</span>
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-[#eaedff] pb-3">
          {(
            [
              { id: 'All Employees', label: 'All Employees', count: 1428, isError: false },
              { id: 'Special Allowances', label: 'Special Allowances', count: 142, isError: false },
              { id: 'Reimbursements', label: 'Reimbursements', count: 86, isError: false },
              { id: 'Variable Bonus', label: 'Variable Bonus', count: 45, isError: false },
              { id: 'Unpaid Leave (LOP)', label: 'Unpaid Leave (LOP)', count: 18, isError: true },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabCategory)}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#172554] text-white shadow-sm'
                  : 'bg-[#f2f3ff] text-[#45464f] hover:text-[#131b2e]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[0.625rem] font-bold ${
                  tab.isError
                    ? 'bg-[#ffdad6] text-[#ba1a1a]'
                    : activeTab === tab.id
                    ? 'bg-[#000f3f] text-[#99efe5]'
                    : 'bg-[#eaedff] text-[#45464f]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table Filter Input */}
        <div className="relative max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#767680] text-[1.15rem]">
            search
          </span>
          <input
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            placeholder="Filter by Employee, ID, Designation..."
            type="search"
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-[#f2f3ff] text-[#131b2e] placeholder:text-[#767680] text-xs font-['Hanken_Grotesk'] focus:outline-none focus:ring-2 focus:ring-[#006a63]/30 border border-transparent focus:border-[#006a63]/40 transition-all"
          />
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-[#eaedff] rounded-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f2f3ff] text-[#45464f] text-[0.6875rem] uppercase tracking-wider font-semibold">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.size > 0 && selectedIds.size >= filteredEmployees.length}
                    onChange={handleSelectAllOnPage}
                    className="rounded border-[#c6c5d0] text-[#006a63] focus:ring-[#006a63] w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Employee Details</th>
                <th className="py-3 px-4 text-right">Base Monthly</th>
                <th className="py-3 px-4 text-right">Std. Allowances</th>
                <th className="py-3 px-4 text-right">Ad-Hoc Bonus / Incentive</th>
                <th className="py-3 px-4 text-right">Reimbursements</th>
                <th className="py-3 px-4 text-right">Deductions / LOP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaedff] text-xs text-[#131b2e]">
              {filteredEmployees.map((emp) => {
                const isChecked = selectedIds.has(emp.id);
                const isEditingThisBonus = editingBonusId === emp.id;

                return (
                  <tr
                    key={emp.id}
                    className={`hover:bg-[#faf8ff] transition-colors ${
                      isChecked ? 'bg-[#f2f3ff]/60' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleSelect(emp.id)}
                        className="rounded border-[#c6c5d0] text-[#006a63] focus:ring-[#006a63] w-4 h-4 cursor-pointer"
                      />
                    </td>

                    {/* Employee Details */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#000f3f] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {emp.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#131b2e]">{emp.name}</span>
                            <span className="px-1.5 py-0.5 rounded bg-[#eaedff] text-[#172554] text-[0.625rem] font-bold">
                              {emp.code}
                            </span>
                            {emp.flagged && (
                              <span className="px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] text-[0.625rem] font-bold uppercase">
                                FLAGGED
                              </span>
                            )}
                          </div>
                          <div className="text-[0.6875rem] text-[#45464f] mt-0.5">
                            {emp.designation}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Base Monthly */}
                    <td className="py-3 px-4 text-right font-medium tabular-nums">
                      ₹{emp.baseMonthly.toLocaleString('en-IN')}
                    </td>

                    {/* Std Allowances */}
                    <td className="py-3 px-4 text-right font-medium tabular-nums">
                      ₹{emp.stdAllowances.toLocaleString('en-IN')}
                    </td>

                    {/* Ad-Hoc Bonus / Incentive (Editable) */}
                    <td className="py-3 px-4 text-right">
                      {isEditingThisBonus ? (
                        <div className="inline-flex items-center gap-1 justify-end">
                          <span className="text-[#45464f]">₹</span>
                          <input
                            type="number"
                            value={bonusInputVal}
                            onChange={(e) => setBonusInputVal(e.target.value)}
                            className="w-24 px-2 py-1 text-right text-xs rounded border border-[#006a63] focus:ring-1 focus:ring-[#006a63] outline-none"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveBonus(emp.id);
                              if (e.key === 'Escape') setEditingBonusId(null);
                            }}
                          />
                          <button
                            onClick={() => handleSaveBonus(emp.id)}
                            className="p-1 rounded bg-[#006a63] text-white hover:bg-[#00504a]"
                            title="Save"
                          >
                            <span className="material-symbols-outlined text-[1rem]">check</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEditBonus(emp)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f2f3ff] hover:bg-[#eaedff] border border-[#eaedff] text-[#131b2e] font-semibold tabular-nums text-xs transition-colors group cursor-pointer"
                          title="Click to edit ad-hoc bonus"
                        >
                          <span>₹</span>
                          <span>{emp.adHocBonus.toLocaleString('en-IN')}</span>
                          <span className="material-symbols-outlined text-[0.875rem] text-[#767680] group-hover:text-[#006a63]">
                            edit
                          </span>
                        </button>
                      )}
                    </td>

                    {/* Reimbursements */}
                    <td className="py-3 px-4 text-right font-medium tabular-nums">
                      ₹{emp.reimbursements.toLocaleString('en-IN')}
                    </td>

                    {/* Deductions / LOP */}
                    <td className="py-3 px-4 text-right">
                      {emp.deductionsLOP ? (
                        <div className="inline-flex flex-col items-end">
                          <span className="text-[0.625rem] text-[#ba1a1a] font-semibold">
                            {emp.deductionsLOP.reason}
                          </span>
                          <span className="text-[#ba1a1a] font-bold tabular-nums">
                            -₹{emp.deductionsLOP.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#767680]">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#45464f] pt-2">
          <div className="flex items-center gap-2">
            <span>
              Showing 1-{filteredEmployees.length} of 1,428 entries
            </span>
            <span>•</span>
            <span className="font-semibold text-[#131b2e]">
              Selected: {selectedIds.size} record{selectedIds.size === 1 ? '' : 's'}
            </span>
            <span>•</span>
            <button
              onClick={() => setSelectedIds(new Set(employees.map((e) => e.id)))}
              className="text-[#006a63] hover:underline font-semibold"
            >
              Select all 1,428 employees
            </button>
          </div>

          <div className="flex items-center gap-1 self-end sm:self-auto">
            <button
              onClick={() => setCurrentPage(1)}
              className="p-1 rounded hover:bg-[#f2f3ff] text-[#767680]"
              title="First Page"
            >
              <span className="material-symbols-outlined text-[1.125rem]">first_page</span>
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded hover:bg-[#f2f3ff] text-[#767680]"
              title="Previous Page"
            >
              <span className="material-symbols-outlined text-[1.125rem]">chevron_left</span>
            </button>
            <span className="px-2 py-1 rounded bg-[#f2f3ff] text-xs font-semibold text-[#131b2e]">
              Page {currentPage} of 286
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(286, p + 1))}
              className="p-1 rounded hover:bg-[#f2f3ff] text-[#767680]"
              title="Next Page"
            >
              <span className="material-symbols-outlined text-[1.125rem]">chevron_right</span>
            </button>
            <button
              onClick={() => setCurrentPage(286)}
              className="p-1 rounded hover:bg-[#f2f3ff] text-[#767680]"
              title="Last Page"
            >
              <span className="material-symbols-outlined text-[1.125rem]">last_page</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom 3 Summary Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Allowance Breakdown (4 cols) */}
        <div className="lg:col-span-4 rounded-xl bg-white p-5 shadow-sm border border-[#eaedff] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-semibold text-[#131b2e]">
                Allowance Breakdown
              </h3>
              <span className="px-2 py-0.5 rounded bg-[#f2f3ff] text-[#45464f] text-[0.625rem] font-bold">
                INR (Lakhs)
              </span>
            </div>
            <p className="text-[0.6875rem] text-[#45464f] mt-1">
              Aggregate distribution of monthly additional compensations across departments.
            </p>

            {/* Vertical Bar Chart */}
            <div className="pt-6 pb-4 flex items-end justify-between h-40 px-2 gap-2 border-b border-[#eaedff]">
              {/* HRA */}
              <div className="flex flex-col items-center gap-1 flex-1">
                <span className="text-[0.625rem] font-bold text-[#131b2e]">₹34.2L</span>
                <div className="w-full max-w-[28px] h-28 rounded-t bg-[#000f3f]"></div>
                <span className="text-[0.625rem] text-[#45464f]">HRA</span>
              </div>

              {/* Special */}
              <div className="flex flex-col items-center gap-1 flex-1">
                <span className="text-[0.625rem] font-bold text-[#131b2e]">₹18.4L</span>
                <div className="w-full max-w-[28px] h-20 rounded-t bg-[#006a63]"></div>
                <span className="text-[0.625rem] text-[#45464f]">Special</span>
              </div>

              {/* Bonus */}
              <div className="flex flex-col items-center gap-1 flex-1">
                <span className="text-[0.625rem] font-bold text-[#131b2e]">₹6.2L</span>
                <div className="w-full max-w-[28px] h-12 rounded-t bg-[#80d5cb]"></div>
                <span className="text-[0.625rem] text-[#45464f]">Bonus</span>
              </div>

              {/* Medical */}
              <div className="flex flex-col items-center gap-1 flex-1">
                <span className="text-[0.625rem] font-bold text-[#131b2e]">₹3.8L</span>
                <div className="w-full max-w-[28px] h-8 rounded-t bg-[#808dc2]"></div>
                <span className="text-[0.625rem] text-[#45464f]">Medical</span>
              </div>

              {/* Claims */}
              <div className="flex flex-col items-center gap-1 flex-1">
                <span className="text-[0.625rem] font-bold text-[#131b2e]">₹1.6L</span>
                <div className="w-full max-w-[28px] h-5 rounded-t bg-[#dae2fd]"></div>
                <span className="text-[0.625rem] text-[#45464f]">Claims</span>
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between text-xs">
            <span className="text-[#45464f]">
              Non-taxable proportion: <strong className="text-[#131b2e]">61.4%</strong>
            </span>
            <button
              onClick={() => setShowExemptionMatrix(true)}
              className="text-[#006a63] font-semibold hover:underline"
            >
              View Exemption Matrix
            </button>
          </div>
        </div>

        {/* Payroll Officers On Duty (4 cols) */}
        <div className="lg:col-span-4 rounded-xl bg-white p-5 shadow-sm border border-[#eaedff] flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-semibold text-[#131b2e]">
                Payroll Officers On Duty
              </h3>
              <span className="w-2.5 h-2.5 rounded-full bg-[#006a63]"></span>
            </div>
            <p className="text-[0.6875rem] text-[#45464f]">
              Responsible controllers validating March 2025 pay registers.
            </p>

            {/* Officer 1 */}
            <div className="p-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#172554] text-white flex items-center justify-center font-bold text-xs">
                  AS
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#131b2e]">Ananya Sen</div>
                  <div className="text-[0.6875rem] text-[#45464f]">Chief Compensation Analyst</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#99efe5]/40 text-[#006f67] text-[0.625rem] font-bold">
                Base Verified
              </span>
            </div>

            {/* Officer 2 */}
            <div className="p-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#000f3f] text-white flex items-center justify-center font-bold text-xs">
                  VR
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#131b2e]">Vikramaditya Rao</div>
                  <div className="text-[0.6875rem] text-[#45464f]">Director of Statutory Tax</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#dae2fd] text-[#172554] text-[0.625rem] font-bold">
                TDS Pending
              </span>
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={onOpenRuleLogs}
              className="w-full py-2 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-semibold text-xs transition-colors border border-[#eaedff]"
            >
              Open Execution Audit Log
            </button>
          </div>
        </div>

        {/* Treasury Verification Escrow Card (4 cols) */}
        <div className="lg:col-span-4 rounded-xl bg-[#000f3f] text-white p-5 shadow-sm border border-[#172554] flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-widest text-[#4fdbc8] font-bold">
              <span className="material-symbols-outlined text-[1rem]">account_balance</span>
              <span>Treasury Verification</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-white">
              Escrow Payout Pre-Validation
            </h3>
            <p className="text-xs text-[#808dc2] leading-relaxed">
              HDFC Corporate Nodal Account (A/C: **** 9924) holds sufficient liquid reserves for this cycle's net disbursement of ₹6,94,15,000.
            </p>

            <div className="p-3 rounded-lg bg-[#172554]/60 border border-[#808dc2]/20 flex items-center justify-between mt-3">
              <span className="text-xs text-[#808dc2]">Bank Batch Code:</span>
              <span className="font-mono text-xs font-bold text-white">HDFC - SAL - 202503 - RTGS</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-[0.6875rem] text-[#808dc2] border-t border-[#172554]">
            <span className="flex items-center gap-1.5 text-[#4fdbc8]">
              <span className="w-2 h-2 rounded-full bg-[#4fdbc8]"></span>
              RTGS / CMS Integrated
            </span>
            <span>256-Bit Encrypted</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar with Dynamic Sidebar Offset & Theme Responsive Colors */}
      <div className={`fixed bottom-0 right-0 backdrop-blur-md border-t px-6 py-3.5 z-40 transition-all duration-300 ${
        isCollapsed ? 'left-20' : 'left-72'
      } ${
        isDark 
          ? 'bg-[#000f3f]/95 border-[#172554] text-white shadow-[0_-4px_24px_rgba(0,0,0,0.6)]' 
          : 'bg-white/95 border-[#eaedff] text-[#131b2e] shadow-[0_-4px_16px_rgba(0,0,0,0.06)]'
      }`}>
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onShowToast('March 2025 Pay Run Draft Saved Successfully')}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all text-xs font-semibold cursor-pointer shadow-sm ${
                isDark
                  ? 'bg-[#172554] border-[#25356e] text-white hover:bg-[#20316b]'
                  : 'bg-white border-[#eaedff] text-[#131b2e] hover:bg-[#f2f3ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[1.125rem]">save</span>
              <span>Save Draft</span>
            </button>
            <button
              onClick={() => {
                exportReconciliationLedger(employees);
                onShowToast('Downloaded Reconciliation Ledger spreadsheet (CSV/Excel)');
              }}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all text-xs font-semibold active:scale-95 cursor-pointer shadow-sm ${
                isDark
                  ? 'bg-[#172554] border-[#25356e] text-white hover:bg-[#20316b]'
                  : 'bg-white border-[#eaedff] text-[#131b2e] hover:bg-[#f2f3ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[1.125rem]">table_view</span>
              <span>Download Reconciliation Excel</span>
            </button>
            <button
              onClick={() => {
                setSelectedIds(new Set(['emp-5']));
                onShowToast('Step 4 values reset to baseline lock');
              }}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all text-xs font-semibold cursor-pointer shadow-sm ${
                isDark
                  ? 'bg-[#ba1a1a]/20 border-[#ba1a1a]/50 text-[#ffdad6] hover:bg-[#ba1a1a]/35'
                  : 'bg-white border-[#eaedff] text-[#ba1a1a] hover:bg-[#ffdad6]/40'
              }`}
            >
              <span className="material-symbols-outlined text-[1.125rem]">restart_alt</span>
              <span>Reset Current Step</span>
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-5">
            <div className="hidden md:flex flex-col text-right">
              <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-[#131b2e]'}`}>
                Step {activeStep} of 8 Completed
              </span>
              <span className={`text-[0.6875rem] font-medium ${isDark ? 'text-[#71f8e4]' : 'text-[#006a63]'}`}>
                Ready for Statutory Deductions
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStep((s) => Math.max(1, s - 1))}
                type="button"
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isDark
                    ? 'bg-[#172554] border border-[#25356e] text-white hover:bg-[#20316b]'
                    : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#dae2fd]'
                }`}
              >
                <span className="material-symbols-outlined text-[1.125rem]">arrow_back</span>
                <span>Previous Step</span>
              </button>

              <button
                onClick={() => {
                  if (activeStep < 8) {
                    setActiveStep(activeStep + 1);
                    onShowToast(`Proceeded to Step ${activeStep + 1}: Deductions & Statutory TDS`);
                  } else {
                    onShowToast('Final disbursement file generated for banking release');
                  }
                }}
                type="button"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Proceed to Statutory Deductions</span>
                <span className="material-symbols-outlined text-[1.125rem]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Exemption Matrix Modal */}
      {showExemptionMatrix && (
        <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#eaedff]">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
              <div className="font-bold text-base text-[#131b2e]">Income Tax Exemption Matrix (March 2025)</div>
              <button onClick={() => setShowExemptionMatrix(false)} className="text-[#767680] hover:text-[#131b2e]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between p-2 rounded bg-[#f2f3ff]">
                <span className="font-semibold text-[#131b2e]">House Rent Allowance (Sec 10(13A))</span>
                <span className="text-[#006a63] font-bold">50% Metros / 40% Non-metros</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#f2f3ff]">
                <span className="font-semibold text-[#131b2e]">Leave Travel Concession (Sec 10(5))</span>
                <span className="text-[#006a63] font-bold">Exempt up to 2 trips in 4-year block</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#f2f3ff]">
                <span className="font-semibold text-[#131b2e]">Standard Deduction (Sec 16(ia))</span>
                <span className="text-[#006a63] font-bold">₹75,000 New Regime Flat</span>
              </div>
            </div>
            <div className="flex justify-end pt-3 border-t border-[#eaedff]">
              <button onClick={() => setShowExemptionMatrix(false)} className="px-4 py-2 rounded-lg bg-[#006a63] text-white font-semibold text-xs">
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Roster Modal */}
      {showRosterModal && (
        <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#eaedff]">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
              <div className="font-bold text-base text-[#131b2e]">14 Mid-Month Joiners Pro-ration Roster</div>
              <button onClick={() => setShowRosterModal(false)} className="text-[#767680] hover:text-[#131b2e]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="py-4 space-y-2 max-h-64 overflow-y-auto text-xs">
              <div className="p-2.5 rounded-lg bg-[#f2f3ff] flex justify-between items-center">
                <div>
                  <div className="font-semibold text-[#131b2e]">Divya Krishnan (ENG-451)</div>
                  <div className="text-[0.6875rem] text-[#45464f]">Joined 12 Mar 2025 • 20/31 Days pro-rated</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#99efe5]/40 text-[#006f67] font-bold text-[0.625rem]">Synced</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#f2f3ff] flex justify-between items-center">
                <div>
                  <div className="font-semibold text-[#131b2e]">Kartik Iyer (SALES-109)</div>
                  <div className="text-[0.6875rem] text-[#45464f]">Joined 18 Mar 2025 • 14/31 Days pro-rated</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#99efe5]/40 text-[#006f67] font-bold text-[0.625rem]">Synced</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#f2f3ff] flex justify-between items-center">
                <div>
                  <div className="font-semibold text-[#131b2e]">Pooja Hegde (DES-340)</div>
                  <div className="text-[0.6875rem] text-[#45464f]">Joined 24 Mar 2025 • 8/31 Days pro-rated</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#99efe5]/40 text-[#006f67] font-bold text-[0.625rem]">Synced</span>
              </div>
            </div>
            <div className="flex justify-end pt-3 border-t border-[#eaedff]">
              <button onClick={() => setShowRosterModal(false)} className="px-4 py-2 rounded-lg bg-[#006a63] text-white font-semibold text-xs">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
