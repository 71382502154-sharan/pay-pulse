/**
 * ============================================================================
 * PAYPULSE ENTERPRISE — RULE ENGINE AUDIT LOGS MODAL
 * ============================================================================
 * Cryptographic calculation log terminal displaying rule executions, statutory
 * checks (EPFO, ESIC, Section 10, TDS), and negative net pay barrier evaluations.
 * ============================================================================
 */

import React from 'react';
import { motion } from 'motion/react';

/* ========================================================================== */
/* 1. TYPES & PROPS                                                           */
/* ========================================================================== */

interface RuleEngineLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

/* ========================================================================== */
/* 2. COMPONENT IMPLEMENTATION                                                */
/* ========================================================================== */

export const RuleEngineLogsModal: React.FC<RuleEngineLogsModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const logs = [
    {
      time: '14:32:08.102',
      level: 'INFO',
      rule: 'RULE_EPFO_CEILING_CAP',
      message: 'Verified 1,428 employees against ₹15,000 basic wage limit. 0 exceptions noted.',
    },
    {
      time: '14:32:08.245',
      level: 'INFO',
      rule: 'RULE_TDS_SECTION_192',
      message: 'Calculated marginal tax rates using FY24-25 New Tax Regime defaults for 1,190 opt-ins.',
    },
    {
      time: '14:32:08.410',
      level: 'WARN',
      rule: 'RULE_NEGATIVE_NET_DETECT',
      message: 'Detected net disbursable < 0 for EMP-1044, EMP-1089, EMP-1120. Overdraft prevention lock triggered.',
    },
    {
      time: '14:32:08.620',
      level: 'INFO',
      rule: 'RULE_BIOMETRIC_SYNC',
      message: 'Pulled 21,480 punch logs from ZK-Teco biometric gateway. 18 unpaid LOP deductions computed.',
    },
    {
      time: '14:32:08.910',
      level: 'SUCCESS',
      rule: 'RULE_BANK_ESCROW_PRECHECK',
      message: 'HDFC Corporate CMS balance verified (₹12.4 Cr available > ₹6.94 Cr required).',
    },
  ];

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
        className="bg-[#000f3f] text-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#172554] flex flex-col max-h-[85vh]"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#808dc2]/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4fdbc8] text-[1.25rem]">terminal</span>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-white">
                Rule Engine Execution Logs
              </h3>
              <p className="text-xs text-[#808dc2]">Live evaluation traces for March 2025 pay cycle</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#808dc2] hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto font-mono text-xs space-y-2.5 py-4 pr-1">
          {logs.map((log, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-[#172554]/50 border border-[#808dc2]/15">
              <div className="flex items-center justify-between text-[0.6875rem] text-[#808dc2] mb-1">
                <span>{log.time}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[0.625rem] font-bold ${
                    log.level === 'WARN'
                      ? 'bg-[#ba1a1a]/30 text-[#ffdad6]'
                      : log.level === 'SUCCESS'
                      ? 'bg-[#006a63]/50 text-[#99efe5]'
                      : 'bg-[#808dc2]/20 text-white'
                  }`}
                >
                  {log.level}
                </span>
              </div>
              <div className="text-[#4fdbc8] font-semibold text-[0.6875rem]">{log.rule}</div>
              <div className="text-white text-xs mt-0.5">{log.message}</div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[#808dc2]/20 flex items-center justify-between">
          <button
            onClick={() => onShowToast('Copied rule engine raw logs to clipboard')}
            className="text-xs text-[#4fdbc8] hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[1rem]">content_copy</span>
            Copy Raw Logs
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#006a63] text-white font-semibold text-xs hover:bg-[#00504a]"
          >
            Close Terminal
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
