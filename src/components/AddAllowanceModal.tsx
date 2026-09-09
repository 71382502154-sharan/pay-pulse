import React, { useState } from 'react';
import { motion } from 'motion/react';
import { EmployeeRow } from '../types';

interface AddAllowanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: EmployeeRow[];
  onAddAllowance: (empId: string, amount: number, category: string) => void;
  onShowToast: (msg: string) => void;
}

export const AddAllowanceModal: React.FC<AddAllowanceModalProps> = ({
  isOpen,
  onClose,
  employees,
  onAddAllowance,
  onShowToast,
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');
  const [amount, setAmount] = useState<string>('25000');
  const [allowanceCategory, setAllowanceCategory] = useState<string>('Special Project Award');
  const [taxExempt, setTaxExempt] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseInt(amount, 10);
    if (!selectedEmpId || isNaN(parsedAmount) || parsedAmount <= 0) {
      onShowToast('Please provide a valid employee and allowance amount.');
      return;
    }
    onAddAllowance(selectedEmpId, parsedAmount, allowanceCategory);
    onShowToast(`Added ${allowanceCategory} of ₹${parsedAmount.toLocaleString('en-IN')}`);
    onClose();
  };

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
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#eaedff]"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#131b2e]">
              Add Custom Allowance / Incentive
            </h3>
            <p className="text-xs text-[#45464f]">One-off compensation adjustment for March 2025 cycle.</p>
          </div>
          <button onClick={onClose} className="text-[#767680] hover:text-[#131b2e]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#131b2e] mb-1">Target Employee</label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#c6c5d0] bg-white text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006a63]"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.code}) — {emp.designation}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#131b2e] mb-1">Allowance Type</label>
            <select
              value={allowanceCategory}
              onChange={(e) => setAllowanceCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#c6c5d0] bg-white text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006a63]"
            >
              <option value="Special Project Award">Special Project Award</option>
              <option value="Performance Bonus">Performance Bonus</option>
              <option value="Relocation Subsidy">Relocation Subsidy</option>
              <option value="Remote Work Equipment Grant">Remote Work Equipment Grant</option>
              <option value="Client Travel Per Diem">Client Travel Per Diem</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#131b2e] mb-1">Amount (INR ₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45464f] font-semibold">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="25000"
                className="w-full pl-8 pr-4 py-2 rounded-lg border border-[#c6c5d0] focus:outline-none focus:ring-2 focus:ring-[#006a63] font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#f2f3ff] border border-[#eaedff]">
            <input
              type="checkbox"
              id="taxExemptCheck"
              checked={taxExempt}
              onChange={(e) => setTaxExempt(e.target.checked)}
              className="rounded text-[#006a63] focus:ring-[#006a63]"
            />
            <label htmlFor="taxExemptCheck" className="text-xs text-[#131b2e] cursor-pointer">
              Section 10 Tax Exemption Applicable (Proof verified by Corporate Payroll)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#eaedff]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#eaedff] text-[#131b2e] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#006a63] text-white font-semibold hover:bg-[#00504a]"
            >
              Confirm Allowance
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
