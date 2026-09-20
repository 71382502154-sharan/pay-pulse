/**
 * ============================================================================
 * PAYPULSE ENTERPRISE — PAYSLIPS & DISBURSEMENT DOCUMENTS VIEW
 * ============================================================================
 * Institutional payslip generator rendering compliant earnings & deductions
 * statements, real-time PF/TDS/PT withholdings, and single-click HTML/PDF download.
 * ============================================================================
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EmployeeRow } from '../types';
import { downloadPayslipHTML } from '../utils/downloadUtils';
import { PayPulseLogo } from './PayPulseLogo';

/* ========================================================================== */
/* 1. TYPES & PROPS                                                           */
/* ========================================================================== */

interface PayslipsViewProps {
  employees: EmployeeRow[];
  onShowToast: (msg: string) => void;
}

/* ========================================================================== */
/* 2. COMPONENT IMPLEMENTATION                                                */
/* ========================================================================== */

export const PayslipsView: React.FC<PayslipsViewProps> = ({ employees, onShowToast }) => {
  const [selectedEmp, setSelectedEmp] = useState<EmployeeRow>(employees[0]);
  const [cycle, setCycle] = useState('March 2025');

  const gross = selectedEmp.baseMonthly + selectedEmp.stdAllowances + selectedEmp.adHocBonus;
  const pf = Math.round(Math.min(selectedEmp.baseMonthly, 15000) * 0.12);
  const tds = Math.round(gross * 0.12);
  const pt = 200;
  const lop = selectedEmp.deductionsLOP?.amount || 0;
  const totalDeductions = pf + tds + pt + lop;
  const netPay = gross - totalDeductions;

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-['Hanken_Grotesk'] text-[0.6875rem] uppercase tracking-wider text-[#006a63] font-bold">
            Disbursement Documents
          </span>
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#131b2e]">
            Payslips &amp; Tax Declarations
          </h1>
          <p className="text-xs text-[#45464f]">Digital Form 16 and monthly payslip generation</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onShowToast(`Batch dispatched 1,428 encrypted payslips for ${cycle} to corporate emails`)}
            className="px-4 py-2 rounded-lg bg-[#006a63] text-white text-xs font-semibold hover:bg-[#00504a] transition-all shadow-sm inline-flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[1.125rem]">send</span>
            <span>Dispatch All Payslips</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left selector */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-[#eaedff] p-4 space-y-3">
          <div className="font-semibold text-xs text-[#131b2e] pb-2 border-b border-[#eaedff]">
            Select Employee to Preview
          </div>
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {employees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => setSelectedEmp(emp)}
                className={`p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                  selectedEmp.id === emp.id
                    ? 'bg-[#172554] text-white shadow-sm ring-2 ring-[#006a63]'
                    : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                }`}
              >
                <div>
                  <div className="font-semibold text-xs">{emp.name}</div>
                  <div
                    className={`text-[0.6875rem] ${
                      selectedEmp.id === emp.id ? 'text-[#99efe5]' : 'text-[#45464f]'
                    }`}
                  >
                    {emp.code} • {emp.department}
                  </div>
                </div>
                <span className="material-symbols-outlined text-[1rem]">chevron_right</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right formatted Payslip paper */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedEmp.id}
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 bg-white rounded-2xl shadow-md border border-[#eaedff] p-8 space-y-6"
          >
          <div className="flex items-start justify-between pb-6 border-b border-[#eaedff]">
            <div className="flex items-center gap-3">
              <PayPulseLogo size="md" variant="badge" />
              <div>

                <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#131b2e]">
                  PAYPULSE TECHNOLOGIES PVT. LTD.
                </h2>
                <p className="text-xs text-[#45464f]">CIN: U72200KA2020PTC139821 • Bengaluru, Karnataka</p>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded bg-[#eaedff] text-[#172554] text-xs font-bold font-mono">
                PAYSLIP — {cycle.toUpperCase()}
              </span>
              <div className="text-[0.6875rem] text-[#767680] mt-1">Generated: 31 Mar 2025</div>
            </div>
          </div>

          {/* Employee Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#f2f3ff] text-xs border border-[#eaedff]">
            <div>
              <span className="text-[#45464f] block text-[0.6875rem]">Employee Name</span>
              <strong className="text-[#131b2e]">{selectedEmp.name}</strong>
            </div>
            <div>
              <span className="text-[#45464f] block text-[0.6875rem]">Employee ID</span>
              <strong className="text-[#131b2e] font-mono">{selectedEmp.code}</strong>
            </div>
            <div>
              <span className="text-[#45464f] block text-[0.6875rem]">Designation</span>
              <strong className="text-[#131b2e]">{selectedEmp.designation}</strong>
            </div>
            <div>
              <span className="text-[#45464f] block text-[0.6875rem]">Days Worked</span>
              <strong className="text-[#006a63]">31 / 31 Days</strong>
            </div>
          </div>

          {/* Earnings & Deductions Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Earnings */}
            <div className="border border-[#eaedff] rounded-xl overflow-hidden">
              <div className="bg-[#f2f3ff] px-4 py-2 font-bold text-[#131b2e] border-b border-[#eaedff] flex justify-between">
                <span>EARNINGS</span>
                <span>AMOUNT (₹)</span>
              </div>
              <div className="p-4 space-y-2.5">
                <div className="flex justify-between">
                  <span>Basic Wage</span>
                  <span className="font-semibold font-mono">₹{selectedEmp.baseMonthly.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>House Rent Allowance (HRA)</span>
                  <span className="font-semibold font-mono">
                    ₹{Math.round(selectedEmp.stdAllowances * 0.6).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Special Allowance</span>
                  <span className="font-semibold font-mono">
                    ₹{Math.round(selectedEmp.stdAllowances * 0.4).toLocaleString('en-IN')}
                  </span>
                </div>
                {selectedEmp.adHocBonus > 0 && (
                  <div className="flex justify-between text-[#006a63]">
                    <span>Performance Incentive</span>
                    <span className="font-bold font-mono">₹{selectedEmp.adHocBonus.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#eaedff] flex justify-between font-bold text-[#131b2e]">
                  <span>Total Gross Earnings</span>
                  <span className="font-mono">₹{gross.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="border border-[#eaedff] rounded-xl overflow-hidden">
              <div className="bg-[#f2f3ff] px-4 py-2 font-bold text-[#ba1a1a] border-b border-[#eaedff] flex justify-between">
                <span>DEDUCTIONS</span>
                <span>AMOUNT (₹)</span>
              </div>
              <div className="p-4 space-y-2.5">
                <div className="flex justify-between">
                  <span>Provident Fund (EPFO Employee)</span>
                  <span className="font-semibold font-mono">₹{pf.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Deducted at Source (TDS)</span>
                  <span className="font-semibold font-mono">₹{tds.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Professional Tax (PT)</span>
                  <span className="font-semibold font-mono">₹{pt.toLocaleString('en-IN')}</span>
                </div>
                {lop > 0 && (
                  <div className="flex justify-between text-[#ba1a1a]">
                    <span>Loss of Pay (Absence)</span>
                    <span className="font-semibold font-mono">-₹{lop.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#eaedff] flex justify-between font-bold text-[#ba1a1a]">
                  <span>Total Deductions</span>
                  <span className="font-mono">₹{totalDeductions.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Pay Callout */}
          <div className="p-4 rounded-xl bg-[#99efe5]/20 border border-[#006a63]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[0.6875rem] uppercase tracking-wider text-[#006f67] font-bold">
                Net Disbursable Amount
              </span>
              <div className="font-['Plus_Jakarta_Sans'] font-bold text-2xl text-[#006a63] tabular-nums">
                ₹{netPay.toLocaleString('en-IN')}
              </div>
            </div>

            <button
              onClick={() => {
                downloadPayslipHTML(selectedEmp);
                onShowToast(`Downloaded Official Payslip Document for ${selectedEmp.name}`);
              }}
              className="px-4 py-2 rounded-lg bg-[#006a63] text-white font-semibold text-xs hover:bg-[#00504a] inline-flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[1.125rem]">download</span>
              <span>Download PDF / Print Payslip</span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  </div>
  );
};
