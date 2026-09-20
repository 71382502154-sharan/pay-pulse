/**
 * ============================================================================
 * PAYPULSE ENTERPRISE — DISCREPANCY RECONCILIATION MODAL
 * ============================================================================
 * Interactive resolution dialog presenting employees flagged by the rule engine
 * for statutory anomalies or negative net compensation.
 * ============================================================================
 */

import React from 'react';
import { motion } from 'motion/react';
import { DiscrepancyEmployee } from '../types';

/* ========================================================================== */
/* 1. TYPES & PROPS                                                           */
/* ========================================================================== */

interface DiscrepancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  discrepancies: DiscrepancyEmployee[];
  onResolveDiscrepancy: (id: string, selectedOption: string) => void;
  onShowToast: (msg: string) => void;
}

/* ========================================================================== */
/* 2. COMPONENT IMPLEMENTATION                                                */
/* ========================================================================== */

export const DiscrepancyModal: React.FC<DiscrepancyModalProps> = ({
  isOpen,
  onClose,
  discrepancies,
  onResolveDiscrepancy,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const pendingCount = discrepancies.filter((d) => !d.resolved).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#eaedff] flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#eaedff]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-xs font-semibold">
              <span className="material-symbols-outlined text-[1rem]">error_outline</span>
              <span>Statutory Compliance Override</span>
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#131b2e]">
              Resolve Negative Net Pay Discrepancies
            </h2>
            <p className="text-xs text-[#45464f]">
              3 staff members have deductions exceeding gross compensation due to concurrent loan recoveries and statutory TDS.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#767680] hover:text-[#131b2e] hover:bg-[#f2f3ff]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
          {discrepancies.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                item.resolved
                  ? 'bg-[#f2f3ff]/40 border-[#eaedff] opacity-60'
                  : 'bg-[#faf8ff] border-[#ffdad6]'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#eaedff]">
                <div>
                  <span className="font-bold text-sm text-[#131b2e]">{item.name}</span>
                  <span className="ml-2 text-xs text-[#45464f]">
                    {item.code} • {item.department}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[0.6875rem] text-[#ba1a1a] font-semibold block">Calculated Net Pay</span>
                  <span className="font-bold text-sm text-[#ba1a1a] tabular-nums">
                    -₹{Math.abs(item.netPay).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 text-[0.6875rem] text-[#45464f]">
                <div>Gross: ₹{item.grossPay.toLocaleString('en-IN')}</div>
                <div>Loan EMI: ₹{item.loanEMI.toLocaleString('en-IN')}</div>
                <div>TDS: ₹{item.tdsDeduction.toLocaleString('en-IN')}</div>
              </div>

              {!item.resolved ? (
                <div className="pt-2 space-y-2">
                  <div className="text-[0.6875rem] font-semibold text-[#131b2e]">
                    Select Restructuring Clearance Action:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.resolutionOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onResolveDiscrepancy(item.id, opt);
                          onShowToast(`Applied resolution for ${item.name}: ${opt}`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#eaedff] border border-[#eaedff] text-xs font-semibold text-[#131b2e] transition-all hover:border-[#006a63]"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pt-2 text-xs font-bold text-[#006a63] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[1rem]">check_circle</span>
                  Discrepancy cleared and rescheduled for subsequent ledger cycle.
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#eaedff] flex items-center justify-between">
          <span className="text-xs text-[#45464f]">
            {pendingCount === 0 ? 'All 3 discrepancies cleared' : `${pendingCount} cases pending resolution`}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#006a63] text-white font-semibold text-xs transition-colors hover:bg-[#00504a]"
          >
            Finished Review
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
