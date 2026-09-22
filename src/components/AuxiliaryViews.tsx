/**
 * ============================================================================
 * PAYPULSE ENTERPRISE — AUXILIARY CONSOLE VIEWS
 * ============================================================================
 * Hosts modular sub-views for specialized console workflows:
 * - 'salary-structure': Grade-wise CTC breakdown & statutory wage bands
 * - 'attendance': Biometric punch logs, shift rosters, and unpaid LOP tracking
 * - 'allowances-and-deductions': Statutory and discretionary rules matrix
 * - 'reimbursements': Expense claim verification and receipt auditing
 * - 'reports': Statutory EPFO, ESIC, Form 24Q, and compliance exports
 * - 'settings': Organization settings, profile config, and API integrations
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { NavigationTab, EmployeeRow, UserProfile } from '../types';
import { downloadStatutoryReport } from '../utils/downloadUtils';
import { INITIAL_EMPLOYEES } from '../data/payrollData';
import { getInitials } from '../utils/userUtils';

/* ========================================================================== */
/* 1. TYPES & PROPS                                                           */
/* ========================================================================== */

interface AuxiliaryViewsProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onShowToast: (msg: string) => void;
  onNavigateToPayRun: () => void;
  employees?: EmployeeRow[];
  user?: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
}

/* ========================================================================== */
/* 2. COMPONENT ROUTING & SUB-VIEWS                                           */
/* ========================================================================== */

export const AuxiliaryViews: React.FC<AuxiliaryViewsProps> = ({
  currentTab,
  onSelectTab,
  onShowToast,
  onNavigateToPayRun,
  employees = INITIAL_EMPLOYEES,
  user,
  onUpdateUser,
}) => {
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileRole, setProfileRole] = useState(user?.role || '');
  const [profileDept, setProfileDept] = useState(user?.department || '');

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
      setProfileRole(user.role || '');
      setProfileDept(user.department || '');
    }
  }, [user]);

  /* ------------------------------------------------------------------------ */
  /* TAB: SALARY STRUCTURE & STATUTORY BANDS                                  */
  /* ------------------------------------------------------------------------ */
  if (currentTab === 'salary-structure') {
    return (
      <div className="px-6 py-6 space-y-6 max-w-[1600px] mx-auto w-full">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[0.6875rem] uppercase tracking-wider text-[#006a63] font-bold font-['Hanken_Grotesk']">
              Compensation Architecture
            </span>
            <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#131b2e]">
              Salary Structure &amp; Statutory Bands
            </h1>
            <p className="text-xs text-[#45464f]">Grade-wise CTC breakdown compliant with Indian Labor Codes</p>
          </div>
          <button
            onClick={() => onShowToast('Salary band matrix exported to PDF')}
            className="px-4 py-2 rounded-lg bg-[#006a63] text-white text-xs font-semibold hover:bg-[#00504a]"
          >
            Export Band Matrix
          </button>
        </div>

        {/* 4 Bands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              band: 'Band E (Executive)',
              ctc: '₹45L — ₹1.2 Cr',
              basic: '50% Basic Wage',
              hra: '25% HRA',
              special: '15% Special',
              perf: '10% Retention LTI',
              count: 18,
            },
            {
              band: 'Band L (Lead & Staff)',
              ctc: '₹28L — ₹42L',
              basic: '50% Basic Wage',
              hra: '25% HRA',
              special: '15% Special',
              perf: '10% Annual Variable',
              count: 142,
            },
            {
              band: 'Band S (Senior)',
              ctc: '₹16L — ₹26L',
              basic: '50% Basic Wage',
              hra: '25% HRA',
              special: '20% Special',
              perf: '5% Performance',
              count: 486,
            },
            {
              band: 'Band A (Associate & Ops)',
              ctc: '₹6L — ₹14L',
              basic: '50% Basic Wage',
              hra: '30% HRA',
              special: '20% Special',
              perf: 'Standard Bonus',
              count: 782,
            },
          ].map((b, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-[#eaedff] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#131b2e]">{b.band}</span>
                <span className="px-2 py-0.5 rounded bg-[#f2f3ff] text-xs font-bold text-[#000f3f]">
                  {b.count} staff
                </span>
              </div>
              <div className="font-['Plus_Jakarta_Sans'] font-bold text-xl text-[#006a63]">{b.ctc}</div>
              <div className="space-y-1.5 text-xs text-[#45464f] pt-2 border-t border-[#eaedff]">
                <div className="flex justify-between">
                  <span>Basic:</span>
                  <span className="font-semibold text-[#131b2e]">{b.basic}</span>
                </div>
                <div className="flex justify-between">
                  <span>HRA:</span>
                  <span className="font-semibold text-[#131b2e]">{b.hra}</span>
                </div>
                <div className="flex justify-between">
                  <span>Special Allowance:</span>
                  <span className="font-semibold text-[#131b2e]">{b.special}</span>
                </div>
                <div className="flex justify-between">
                  <span>Variable:</span>
                  <span className="font-semibold text-[#131b2e]">{b.perf}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statutory Compliance Rules */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#eaedff] space-y-4">
          <h2 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#131b2e]">
            Statutory Rules &amp; Caps Active in March 2025 Run
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] space-y-1">
              <span className="font-bold text-[#131b2e]">EPFO Wage Ceiling (Rule 29)</span>
              <p className="text-[#45464f]">Capped at ₹15,000 monthly basic wage for statutory employer PF matching (12%).</p>
            </div>
            <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] space-y-1">
              <span className="font-bold text-[#131b2e]">Gratuity Provision (Sec 4(2))</span>
              <p className="text-[#45464f]">Accrued at 15 days basic wage per completed year of tenure (4.81% monthly accrual).</p>
            </div>
            <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] space-y-1">
              <span className="font-bold text-[#131b2e]">New Tax Regime Defaults</span>
              <p className="text-[#45464f]">Rebate under Section 87A up to ₹7,00,000 taxable threshold + ₹75,000 standard deduction.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentTab === 'attendance') {
    return (
      <div className="px-6 py-6 space-y-6 max-w-[1600px] mx-auto w-full">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[0.6875rem] uppercase tracking-wider text-[#006a63] font-bold font-['Hanken_Grotesk']">
              Biometric &amp; Timesheet Sync
            </span>
            <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#131b2e]">
              Attendance &amp; Loss of Pay (LOP) Ledger
            </h1>
            <p className="text-xs text-[#45464f]">Syncing 21,480 attendance punches for March 2025 cycle</p>
          </div>
          <button
            onClick={() => onShowToast('Biometric cloud gateway sync completed. All 18 LOP adjustments locked.')}
            className="px-4 py-2 rounded-lg bg-[#006a63] text-white text-xs font-semibold hover:bg-[#00504a]"
          >
            Force Gateway Sync
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#eaedff] shadow-sm">
            <span className="text-xs text-[#45464f]">Total Monthly Work Days</span>
            <div className="text-2xl font-bold text-[#131b2e] mt-1">21 Working Days</div>
            <span className="text-[0.6875rem] text-[#006a63] font-semibold">10 Weekends • 0 Public Holidays</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-[#eaedff] shadow-sm">
            <span className="text-xs text-[#45464f]">Average Attendance Rate</span>
            <div className="text-2xl font-bold text-[#131b2e] mt-1">96.8%</div>
            <span className="text-[0.6875rem] text-[#006a63] font-semibold">+0.4% from February</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-[#eaedff] shadow-sm">
            <span className="text-xs text-[#45464f]">Flagged LOP Deductions</span>
            <div className="text-2xl font-bold text-[#ba1a1a] mt-1">18 Cases</div>
            <span className="text-[0.6875rem] text-[#ba1a1a] font-semibold">Total deduction: ₹1,42,800</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#eaedff] p-6 space-y-4">
          <h2 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#131b2e]">
            Unapproved Absences &amp; LOP Adjustments (March 2025)
          </h2>
          <div className="overflow-x-auto border border-[#eaedff] rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f2f3ff] text-[#45464f] font-semibold uppercase tracking-wider text-[0.6875rem]">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Unapproved Days</th>
                  <th className="py-3 px-4">Daily Wage Basis</th>
                  <th className="py-3 px-4 text-right">Computed Deduction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaedff]">
                <tr className="hover:bg-[#faf8ff]">
                  <td className="py-3 px-4 font-semibold text-[#131b2e]">Aakash Varma (ENG-1089)</td>
                  <td className="py-3 px-4 text-[#45464f]">Engineering &amp; Tech</td>
                  <td className="py-3 px-4 text-[#ba1a1a] font-bold">2.5 Days</td>
                  <td className="py-3 px-4">₹5,833 / day</td>
                  <td className="py-3 px-4 text-right font-bold text-[#ba1a1a]">-₹14,583</td>
                </tr>
                <tr className="hover:bg-[#faf8ff]">
                  <td className="py-3 px-4 font-semibold text-[#131b2e]">Meera Nair (OPS-2041)</td>
                  <td className="py-3 px-4 text-[#45464f]">Operations &amp; Support</td>
                  <td className="py-3 px-4 text-[#ba1a1a] font-bold">1.0 Day</td>
                  <td className="py-3 px-4">₹3,420 / day</td>
                  <td className="py-3 px-4 text-right font-bold text-[#ba1a1a]">-₹3,420</td>
                </tr>
                <tr className="hover:bg-[#faf8ff]">
                  <td className="py-3 px-4 font-semibold text-[#131b2e]">Gaurav Joshi (PROD-092)</td>
                  <td className="py-3 px-4 text-[#45464f]">Product &amp; Architecture</td>
                  <td className="py-3 px-4 text-[#ba1a1a] font-bold">3.0 Days</td>
                  <td className="py-3 px-4">₹7,200 / day</td>
                  <td className="py-3 px-4 text-right font-bold text-[#ba1a1a]">-₹21,600</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (currentTab === 'allowances-and-deductions') {
    return (
      <div className="px-6 py-6 space-y-6 max-w-[1600px] mx-auto w-full">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[0.6875rem] uppercase tracking-wider text-[#006a63] font-bold font-['Hanken_Grotesk']">
              Statutory Master Architecture
            </span>
            <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#131b2e]">
              Allowances &amp; Deductions Configuration
            </h1>
            <p className="text-xs text-[#45464f]">Master formula mappings for statutory allowances and withholding slabs</p>
          </div>
          <button
            onClick={() => onShowToast('Master salary formula schedule exported')}
            className="px-4 py-2 rounded-lg bg-[#006a63] text-white text-xs font-semibold hover:bg-[#00504a]"
          >
            Export Formula Policy
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#eaedff] space-y-4">
            <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
              <h2 className="font-bold text-sm text-[#131b2e]">Standard Allowance Rules</h2>
              <span className="px-2 py-0.5 rounded bg-[#99efe5]/40 text-[#006f67] text-xs font-bold">Taxable / Exempt</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#f2f3ff] flex justify-between items-center">
                <div>
                  <div className="font-semibold text-[#131b2e]">House Rent Allowance (HRA)</div>
                  <div className="text-[0.6875rem] text-[#45464f]">40% of Basic (Non-Metro) / 50% (Metro)</div>
                </div>
                <span className="font-bold text-[#006a63]">Section 10(13A)</span>
              </div>
              <div className="p-3 rounded-lg bg-[#f2f3ff] flex justify-between items-center">
                <div>
                  <div className="font-semibold text-[#131b2e]">Special Allowance</div>
                  <div className="text-[0.6875rem] text-[#45464f]">Residual CTC component fully taxable</div>
                </div>
                <span className="font-bold text-[#131b2e]">100% Taxable</span>
              </div>
              <div className="p-3 rounded-lg bg-[#f2f3ff] flex justify-between items-center">
                <div>
                  <div className="font-semibold text-[#131b2e]">Leave Travel Allowance (LTA)</div>
                  <div className="text-[0.6875rem] text-[#45464f]">Exempt twice in block of 4 calendar years</div>
                </div>
                <span className="font-bold text-[#006a63]">Section 10(5)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#eaedff] space-y-4">
            <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
              <h2 className="font-bold text-sm text-[#131b2e]">Statutory Withholding Rules</h2>
              <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold">Mandatory Caps</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#f2f3ff] flex justify-between items-center">
                <div>
                  <div className="font-semibold text-[#131b2e]">Provident Fund (EPFO)</div>
                  <div className="text-[0.6875rem] text-[#45464f]">12% Employee + 12% Employer (Capped basic ₹15,000)</div>
                </div>
                <span className="font-bold text-[#131b2e]">Rule 29</span>
              </div>
              <div className="p-3 rounded-lg bg-[#f2f3ff] flex justify-between items-center">
                <div>
                  <div className="font-semibold text-[#131b2e]">Professional Tax (Karnataka)</div>
                  <div className="text-[0.6875rem] text-[#45464f]">₹200 / month on gross salary &gt; ₹15,000</div>
                </div>
                <span className="font-bold text-[#131b2e]">State Act</span>
              </div>
              <div className="p-3 rounded-lg bg-[#f2f3ff] flex justify-between items-center">
                <div>
                  <div className="font-semibold text-[#131b2e]">Gratuity Provision</div>
                  <div className="text-[0.6875rem] text-[#45464f]">4.81% of monthly basic pay accrual</div>
                </div>
                <span className="font-bold text-[#006a63]">Payment of Gratuity</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentTab === 'reimbursements') {
    return (
      <div className="px-6 py-6 space-y-6 max-w-[1600px] mx-auto w-full">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[0.6875rem] uppercase tracking-wider text-[#006a63] font-bold font-['Hanken_Grotesk']">
              Claims &amp; Expenses
            </span>
            <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#131b2e]">
              Reimbursements &amp; Claims Management
            </h1>
            <p className="text-xs text-[#45464f]">Verified business expense vouchers for March 2025 pay cycle</p>
          </div>
          <button
            onClick={() => onShowToast('All 48 approved reimbursement claims queued for disbursement')}
            className="px-4 py-2 rounded-lg bg-[#006a63] text-white text-xs font-semibold hover:bg-[#00504a]"
          >
            Queue for Pay Run
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#eaedff] shadow-sm">
            <span className="text-xs text-[#45464f]">Total Active Claims</span>
            <div className="text-2xl font-bold text-[#131b2e] mt-1">₹4,82,000</div>
            <span className="text-[0.6875rem] text-[#006a63] font-semibold">48 Claim Items</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-[#eaedff] shadow-sm">
            <span className="text-xs text-[#45464f]">Audit Verified</span>
            <div className="text-2xl font-bold text-[#006a63] mt-1">100% Passed</div>
            <span className="text-[0.6875rem] text-[#006a63] font-semibold">GST receipts matched</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-[#eaedff] shadow-sm">
            <span className="text-xs text-[#45464f]">Tax-Free Component</span>
            <div className="text-2xl font-bold text-[#131b2e] mt-1">₹3,94,500</div>
            <span className="text-[0.6875rem] text-[#006a63] font-semibold">Sec 10(14) compliant</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#eaedff] p-6 space-y-4">
          <h2 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#131b2e]">
            Pending Reimbursement Ledger
          </h2>
          <div className="overflow-x-auto border border-[#eaedff] rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f2f3ff] text-[#45464f] font-semibold uppercase tracking-wider text-[0.6875rem]">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Receipt Ref</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaedff]">
                <tr className="hover:bg-[#faf8ff]">
                  <td className="py-3 px-4 font-semibold text-[#131b2e]">Aakash Varma (ENG-1089)</td>
                  <td className="py-3 px-4 text-[#45464f]">Cloud Certification &amp; Books</td>
                  <td className="py-3 px-4 font-mono text-[#767680]">AWS-77182</td>
                  <td className="py-3 px-4 text-right font-bold text-[#131b2e]">₹24,500</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-[#99efe5]/40 text-[#006f67] text-[0.6875rem] font-bold">Approved</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#faf8ff]">
                  <td className="py-3 px-4 font-semibold text-[#131b2e]">Dr. Ananya Roy (PROD-092)</td>
                  <td className="py-3 px-4 text-[#45464f]">Customer Onsite Travel</td>
                  <td className="py-3 px-4 font-mono text-[#767680]">IND-88192</td>
                  <td className="py-3 px-4 text-right font-bold text-[#131b2e]">₹38,200</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-[#99efe5]/40 text-[#006f67] text-[0.6875rem] font-bold">Approved</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#faf8ff]">
                  <td className="py-3 px-4 font-semibold text-[#131b2e]">Meera Nair (OPS-2041)</td>
                  <td className="py-3 px-4 text-[#45464f]">Broadband &amp; Telecommunication</td>
                  <td className="py-3 px-4 font-mono text-[#767680]">ACT-33291</td>
                  <td className="py-3 px-4 text-right font-bold text-[#131b2e]">₹2,499</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-[#99efe5]/40 text-[#006f67] text-[0.6875rem] font-bold">Approved</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (currentTab === 'settings') {
    return (
      <div className="px-6 py-6 space-y-6 max-w-[1600px] mx-auto w-full">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[0.6875rem] uppercase tracking-wider text-[#006a63] font-bold font-['Hanken_Grotesk']">
              System Configuration
            </span>
            <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#131b2e]">
              Institutional Payroll &amp; Compliance Settings
            </h1>
            <p className="text-xs text-[#45464f]">Entity credentials, banking escrow API endpoints, and EPFO credentials</p>
          </div>
          <button
            onClick={() => onShowToast('Payroll settings saved successfully')}
            className="px-4 py-2 rounded-lg bg-[#006a63] text-white text-xs font-semibold hover:bg-[#00504a]"
          >
            Save Configuration
          </button>
        </div>

        {/* Active User Profile Identity Card */}
        <div className="bg-white p-6 rounded-xl border border-[#eaedff] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-xs"
                style={{ backgroundColor: user?.avatarBg || '#000f3f' }}
              >
                {getInitials(profileName || user?.name)}
              </div>
              <div>
                <h2 className="font-bold text-sm text-[#131b2e]">Active User Profile</h2>
                <p className="text-[0.6875rem] text-[#45464f]">Identity and role credentials displayed across PayPulse headers &amp; audit trails</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#99efe5]/40 text-[#006f67] text-[0.6875rem] font-bold">
              Active Session
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#45464f] font-semibold mb-1">Display Full Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 rounded-lg bg-[#f2f3ff] border border-[#eaedff] font-semibold text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a63]"
              />
            </div>
            <div>
              <label className="block text-[#45464f] font-semibold mb-1">Work Email</label>
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                placeholder="name@paypulse.corp"
                className="w-full px-3 py-2 rounded-lg bg-[#f2f3ff] border border-[#eaedff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a63]"
              />
            </div>
            <div>
              <label className="block text-[#45464f] font-semibold mb-1">Assigned Role</label>
              <input
                type="text"
                value={profileRole}
                onChange={(e) => setProfileRole(e.target.value)}
                placeholder="e.g., HR Payroll Director"
                className="w-full px-3 py-2 rounded-lg bg-[#f2f3ff] border border-[#eaedff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a63]"
              />
            </div>
            <div>
              <label className="block text-[#45464f] font-semibold mb-1">Department</label>
              <input
                type="text"
                value={profileDept}
                onChange={(e) => setProfileDept(e.target.value)}
                placeholder="e.g., People Operations"
                className="w-full px-3 py-2 rounded-lg bg-[#f2f3ff] border border-[#eaedff] text-[#131b2e] focus:bg-white focus:outline-none focus:border-[#006a63]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                if (onUpdateUser && profileName.trim()) {
                  onUpdateUser({
                    name: profileName.trim(),
                    email: profileEmail.trim(),
                    role: profileRole.trim() || 'Payroll Specialist',
                    department: profileDept.trim() || 'Operations',
                    avatarBg: user?.avatarBg || '#000f3f',
                  });
                  onShowToast('User profile updated successfully');
                }
              }}
              className="px-4 py-2 rounded-lg bg-[#000f3f] hover:bg-[#172554] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>Update Profile Info</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#eaedff] shadow-sm space-y-4">
            <h2 className="font-bold text-sm text-[#131b2e] border-b border-[#eaedff] pb-2">
              Corporate Legal Entity Details
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#45464f] mb-1">Company Registered Name</label>
                <input
                  type="text"
                  readOnly
                  value="PayPulse Technologies Pvt. Ltd."
                  className="w-full px-3 py-2 rounded-lg bg-[#f2f3ff] border border-[#eaedff] font-semibold text-[#131b2e]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#45464f] mb-1">Corporate TAN</label>
                  <input
                    type="text"
                    readOnly
                    value="BLRP12345E"
                    className="w-full px-3 py-2 rounded-lg bg-[#f2f3ff] border border-[#eaedff] font-mono text-[#131b2e]"
                  />
                </div>
                <div>
                  <label className="block text-[#45464f] mb-1">Corporate PAN</label>
                  <input
                    type="text"
                    readOnly
                    value="AABCP9928M"
                    className="w-full px-3 py-2 rounded-lg bg-[#f2f3ff] border border-[#eaedff] font-mono text-[#131b2e]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#eaedff] shadow-sm space-y-4">
            <h2 className="font-bold text-sm text-[#131b2e] border-b border-[#eaedff] pb-2">
              Banking Escrow Gateway
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#45464f] mb-1">Lead Disbursement Bank</label>
                <input
                  type="text"
                  readOnly
                  value="HDFC Corporate CMS Banking (Direct API Integration)"
                  className="w-full px-3 py-2 rounded-lg bg-[#f2f3ff] border border-[#eaedff] font-semibold text-[#131b2e]"
                />
              </div>
              <div>
                <label className="block text-[#45464f] mb-1">Treasury Escrow Account</label>
                <input
                  type="text"
                  readOnly
                  value="50200088192341 (IFSC: HDFC0000240)"
                  className="w-full px-3 py-2 rounded-lg bg-[#f2f3ff] border border-[#eaedff] font-mono text-[#131b2e]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reports view
  return (
    <div className="px-6 py-6 space-y-6 max-w-[1600px] mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[0.6875rem] uppercase tracking-wider text-[#006a63] font-bold font-['Hanken_Grotesk']">
            Statutory Filings
          </span>
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#131b2e]">
            Statutory Remittance &amp; Compliance Reports
          </h1>
          <p className="text-xs text-[#45464f]">Government submission batch files ready for TRACES, EPFO &amp; Banks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: 'EPFO Electronic Challan Return (ECR)',
            desc: 'Universal text file formatted per EPFO unified portal specs for 1,428 staff UAN contributions.',
            ext: 'ECR (.txt)',
            action: 'Generate ECR Text File',
          },
          {
            title: 'TDS Form 24Q Quarterly Return',
            desc: 'Validated against TRACES FVU utility. Section 192 salary tax deductions with Challan 281 details.',
            ext: 'FVU (.fvu)',
            action: 'Download Form 24Q Batch',
          },
          {
            title: 'HDFC Corporate CMS Banking Batch',
            desc: 'Standard 256-bit encrypted NEFT/RTGS direct deposit batch for instant escrow distribution.',
            ext: 'TXT / CSV',
            action: 'Export Bank Disbursement File',
          },
          {
            title: 'Professional Tax (PT) Form 5 Statement',
            desc: 'Karnataka state monthly PT challan schedule covering all active Bengaluru roster staff.',
            ext: 'PDF / XLS',
            action: 'Download PT Statement',
          },
        ].map((r, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-[#eaedff] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#131b2e]">{r.title}</h3>
                <span className="px-2 py-0.5 rounded bg-[#f2f3ff] text-xs font-mono font-bold text-[#000f3f]">
                  {r.ext}
                </span>
              </div>
              <p className="text-xs text-[#45464f] mt-1.5 leading-relaxed">{r.desc}</p>
            </div>

            <button
              onClick={() => {
                downloadStatutoryReport(r.title, employees);
                onShowToast(`Generated & downloaded ${r.title} (CSV)`);
              }}
              className="w-full py-2.5 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-semibold border border-[#eaedff] transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-[1.125rem] text-[#006a63]">download</span>
              <span>{r.action}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
