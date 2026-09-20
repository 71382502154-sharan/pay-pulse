/**
 * ============================================================================
 * PAYPULSE ENTERPRISE — CYCLE APPROVALS VIEW
 * ============================================================================
 * Executive sign-off interface for departmental adjustments, ad-hoc incentives,
 * and leadership bonus recommendations. Supports item-level authorization and
 * 1-click batch approvals.
 * ============================================================================
 */

import React, { useState } from 'react';
import { ApprovalItem } from '../types';

/* ========================================================================== */
/* 1. TYPES & PROPS                                                           */
/* ========================================================================== */

interface ApprovalsViewProps {
  approvals: ApprovalItem[];
  onApproveItem: (id: string) => void;
  onBatchApproveAll: () => void;
  onShowToast: (msg: string) => void;
}

/* ========================================================================== */
/* 2. COMPONENT IMPLEMENTATION                                                */
/* ========================================================================== */

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({
  approvals,
  onApproveItem,
  onBatchApproveAll,
  onShowToast,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const filtered = approvals.filter((a) => {
    if (filter === 'pending') return a.status === 'pending';
    if (filter === 'approved') return a.status === 'approved';
    return true;
  });

  const pendingCount = approvals.filter((a) => a.status === 'pending').length;

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-['Hanken_Grotesk'] text-[0.6875rem] uppercase tracking-wider text-[#006a63] font-bold">
            Fiduciary Governance
          </span>
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#131b2e]">
            Cycle Approvals Queue
          </h1>
          <p className="text-xs text-[#45464f]">
            Director sign-offs and managerial exceptions for March 2025 cycle
          </p>
        </div>

        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <button
              onClick={onBatchApproveAll}
              className="px-4 py-2 rounded-lg bg-[#006a63] text-white text-xs font-semibold hover:bg-[#00504a] transition-all shadow-sm inline-flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[1.125rem]">done_all</span>
              <span>Batch Approve All ({pendingCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            filter === 'all' ? 'bg-[#000f3f] text-white' : 'bg-[#f2f3ff] text-[#45464f]'
          }`}
        >
          All Items ({approvals.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            filter === 'pending' ? 'bg-[#ba1a1a] text-white' : 'bg-[#f2f3ff] text-[#45464f]'
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            filter === 'approved' ? 'bg-[#006a63] text-white' : 'bg-[#f2f3ff] text-[#45464f]'
          }`}
        >
          Approved ({approvals.length - pendingCount})
        </button>
      </div>

      {/* Approvals Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#eaedff] overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#f2f3ff] text-[#45464f] text-[0.6875rem] uppercase tracking-wider font-semibold">
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Adjustment Category</th>
              <th className="py-3 px-4 text-right">Adjustment Amount</th>
              <th className="py-3 px-4">Submitted By</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaedff] text-xs text-[#131b2e]">
            {filtered.map((item) => {
              const isPending = item.status === 'pending';
              return (
                <tr key={item.id} className="hover:bg-[#faf8ff] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#eaedff] text-[#000f3f] flex items-center justify-center font-bold text-xs">
                        {item.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-[#131b2e]">{item.employeeName}</div>
                        <div className="text-[0.6875rem] text-[#45464f]">
                          {item.employeeCode} • {item.designation}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-[#f2f3ff] text-[#45464f] border border-[#eaedff]">
                      {item.category}
                    </span>
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-bold tabular-nums ${
                      item.adjustment < 0 ? 'text-[#ba1a1a]' : 'text-[#006a63]'
                    }`}
                  >
                    {item.adjustment < 0
                      ? `-₹${Math.abs(item.adjustment).toLocaleString('en-IN')}`
                      : `+₹${item.adjustment.toLocaleString('en-IN')}`}
                  </td>
                  <td className="py-3 px-4 text-[#45464f]">{item.submittedBy}</td>
                  <td className="py-3 px-4 text-center">
                    {isPending ? (
                      <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] text-[0.625rem] font-bold">
                        PENDING
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-[#99efe5]/40 text-[#006f67] text-[0.625rem] font-bold">
                        APPROVED
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {isPending ? (
                      <button
                        onClick={() => {
                          onApproveItem(item.id);
                          onShowToast(`Approved adjustment for ${item.employeeName}`);
                        }}
                        className="px-3 py-1 rounded bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-semibold transition-all inline-flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[1rem]">check</span>
                        Approve
                      </button>
                    ) : (
                      <span className="text-xs text-[#006a63] font-semibold flex items-center justify-end gap-1">
                        <span className="material-symbols-outlined text-[1rem]">verified</span>
                        Done
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
  );
};
