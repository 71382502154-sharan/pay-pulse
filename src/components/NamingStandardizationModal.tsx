import React from 'react';
import { motion } from 'motion/react';
import { NamingAliasItem } from '../types';

interface NamingStandardizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: NamingAliasItem[];
  onAcceptItem: (id: string) => void;
  onAcceptAll: () => void;
  onShowToast: (msg: string) => void;
}

export const NamingStandardizationModal: React.FC<NamingStandardizationModalProps> = ({
  isOpen,
  onClose,
  items,
  onAcceptItem,
  onAcceptAll,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const pendingCount = items.filter((i) => i.status === 'pending').length;

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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#006a63]/20 text-[#006f67] text-xs font-semibold">
              <span className="material-symbols-outlined text-[1rem]">auto_fix_high</span>
              <span>AI Compliance Audit</span>
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#131b2e]">
              Naming Standardization Center
            </h2>
            <p className="text-xs text-[#45464f]">
              Auto-resolving inconsistent casing, LDAP nicknames, and abbreviated titles before bank NEFT/RTGS generation.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#767680] hover:text-[#131b2e] hover:bg-[#f2f3ff]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between py-3 px-1">
          <span className="text-xs text-[#45464f]">
            Status: <strong className="text-[#131b2e]">{pendingCount}</strong> anomalies flagged for review
          </span>
          {pendingCount > 0 && (
            <button
              onClick={() => {
                onAcceptAll();
                onShowToast('All naming standardization suggestions applied across master roster');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-semibold shadow-sm transition-all"
            >
              Standardize All ({pendingCount})
            </button>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
          {items.map((item) => {
            const isPending = item.status === 'pending';

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isPending
                    ? 'bg-[#f2f3ff]/70 border-[#eaedff]'
                    : 'bg-white border-[#99efe5]/50 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="line-through text-[#ba1a1a] font-mono text-xs px-2 py-0.5 rounded bg-white border border-[#eaedff]">
                      {item.rawInput}
                    </span>
                    <span className="material-symbols-outlined text-[1rem] text-[#006a63]">
                      arrow_forward
                    </span>
                    <span className="font-bold text-xs text-[#131b2e] px-2 py-0.5 rounded bg-white border border-[#99efe5]">
                      {item.suggestedStandard}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#99efe5]/40 text-[#006f67] text-[0.625rem] font-bold">
                      {item.confidence}% Match
                    </span>
                  </div>

                  {isPending ? (
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      <button
                        onClick={() => {
                          onAcceptItem(item.id);
                          onShowToast(`Standardized to ${item.suggestedStandard}`);
                        }}
                        className="px-3 py-1 rounded bg-[#006a63] hover:bg-[#00504a] text-white text-xs font-semibold transition-all"
                      >
                        Accept
                      </button>
                    </div>
                  ) : (
                    <span className="text-[0.6875rem] font-bold text-[#006a63] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[0.875rem]">check</span>
                      Normalized
                    </span>
                  )}
                </div>

                <div className="mt-2 text-[0.6875rem] text-[#45464f] flex items-center justify-between">
                  <span>{item.department}</span>
                  <span className="text-[#767680] italic">{item.matchReason}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#eaedff] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] font-semibold text-xs transition-colors"
          >
            Close Center
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
