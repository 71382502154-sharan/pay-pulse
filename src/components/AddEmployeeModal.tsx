import React, { useState } from 'react';
import { motion } from 'motion/react';
import { EmployeeRow } from '../types';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (employee: EmployeeRow) => void;
  onShowToast: (msg: string) => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onAddEmployee,
  onShowToast,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('EMP-1429');
  const [department, setDepartment] = useState('Engineering & Tech');
  const [designation, setDesignation] = useState('Senior Software Engineer');
  const [baseMonthly, setBaseMonthly] = useState('185000');
  const [stdAllowances, setStdAllowances] = useState('65000');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onShowToast('Please provide an employee name.');
      return;
    }

    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('');

    const newEmp: EmployeeRow = {
      id: `emp-${Date.now()}`,
      name: name.trim(),
      code: code.trim(),
      initials: initials || 'EM',
      designation: `${designation} • ${department}`,
      department,
      baseMonthly: parseInt(baseMonthly, 10) || 150000,
      stdAllowances: parseInt(stdAllowances, 10) || 50000,
      adHocBonus: 0,
      reimbursements: 0,
      category: 'Standard',
      isNewJoiner: true,
      joinDate: '15 Mar 2025',
    };

    onAddEmployee(newEmp);
    onShowToast(`Employee ${name} successfully onboarded to active payroll roster`);
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
              Onboard New Employee
            </h3>
            <p className="text-xs text-[#45464f]">Create master employee profile &amp; initial salary baseline</p>
          </div>
          <button onClick={onClose} className="text-[#767680] hover:text-[#131b2e]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#131b2e] mb-1">Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Shalini Deshmukh"
                className="w-full px-3 py-2 rounded-lg border border-[#c6c5d0] focus:ring-2 focus:ring-[#006a63] outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#131b2e] mb-1">Employee Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#c6c5d0] focus:ring-2 focus:ring-[#006a63] outline-none font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#131b2e] mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#c6c5d0] bg-white text-[#131b2e] focus:ring-2 focus:ring-[#006a63] outline-none"
              >
                <option value="Engineering & Tech">Engineering &amp; Tech</option>
                <option value="Operations & Support">Operations &amp; Support</option>
                <option value="Product & Architecture">Product &amp; Architecture</option>
                <option value="Sales & Growth">Sales &amp; Growth</option>
                <option value="HR, Legal & G&A">HR, Legal &amp; G&amp;A</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#131b2e] mb-1">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="Lead Designer"
                className="w-full px-3 py-2 rounded-lg border border-[#c6c5d0] focus:ring-2 focus:ring-[#006a63] outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#131b2e] mb-1">Base Monthly (₹)</label>
              <input
                type="number"
                value={baseMonthly}
                onChange={(e) => setBaseMonthly(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#c6c5d0] focus:ring-2 focus:ring-[#006a63] outline-none font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#131b2e] mb-1">Std. Allowances (₹)</label>
              <input
                type="number"
                value={stdAllowances}
                onChange={(e) => setStdAllowances(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#c6c5d0] focus:ring-2 focus:ring-[#006a63] outline-none font-mono"
                required
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#f2f3ff] text-[0.6875rem] text-[#45464f] border border-[#eaedff]">
            Biometric ID &amp; Universal Account Number (UAN) for EPFO will be automatically requested via automated onboarding workflow.
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
              Save &amp; Enroll
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
