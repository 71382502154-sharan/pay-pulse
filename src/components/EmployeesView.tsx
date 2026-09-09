import React, { useState } from 'react';
import { motion } from 'motion/react';
import { EmployeeRow } from '../types';
import { exportEmployeesToCSV } from '../utils/downloadUtils';

interface EmployeesViewProps {
  employees: EmployeeRow[];
  onOpenAddEmployee: () => void;
  onSelectEmployeeForPayRun?: (empId: string) => void;
  onShowToast: (msg: string) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  onOpenAddEmployee,
  onShowToast,
}) => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [viewingEmp, setViewingEmp] = useState<EmployeeRow | null>(null);

  const departments = [
    'All',
    'Engineering & Tech',
    'Operations & Support',
    'Product & Architecture',
    'Sales & Growth',
    'HR, Legal & G&A',
  ];

  const filtered = employees.filter((e) => {
    if (selectedDept !== 'All' && e.department !== selectedDept) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.code.toLowerCase().includes(q) ||
        e.designation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-['Hanken_Grotesk'] text-[0.6875rem] uppercase tracking-wider text-[#006a63] font-bold">
            Workforce Directory
          </span>
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#131b2e]">
            Employee Roster &amp; Comp Registry
          </h1>
          <p className="text-xs text-[#45464f]">
            1,428 active staff members across 5 operating units
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              exportEmployeesToCSV(employees);
              onShowToast('Exported & downloaded Master Employee Directory (CSV)');
            }}
            className="px-3.5 py-2 rounded-lg bg-white border border-[#eaedff] text-xs font-semibold text-[#131b2e] hover:bg-[#f2f3ff] transition-all shadow-sm inline-flex items-center gap-1.5 active:scale-95"
          >
            <span className="material-symbols-outlined text-[1.125rem]">download</span>
            <span>Export Roster (CSV)</span>
          </button>
          <button
            onClick={onOpenAddEmployee}
            className="px-4 py-2 rounded-lg bg-[#006a63] text-white text-xs font-semibold hover:bg-[#00504a] transition-all shadow-sm inline-flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[1.125rem]">person_add</span>
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {departments.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDept(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDept === d
                  ? 'bg-[#000f3f] text-white shadow-sm'
                  : 'bg-[#f2f3ff] text-[#45464f] hover:text-[#131b2e]'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#767680] text-[1.15rem]">
            search
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee or code..."
            type="search"
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] placeholder:text-[#767680] focus:ring-2 focus:ring-[#006a63] outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#eaedff] overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#f2f3ff] text-[#45464f] text-[0.6875rem] uppercase tracking-wider font-semibold">
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Department &amp; Title</th>
              <th className="py-3 px-4 text-right">Base Salary</th>
              <th className="py-3 px-4 text-right">Std. Allowances</th>
              <th className="py-3 px-4 text-right">Gross Monthly</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaedff] text-xs text-[#131b2e]">
            {filtered.map((emp) => {
              const gross = emp.baseMonthly + emp.stdAllowances + emp.adHocBonus;
              return (
                <tr key={emp.id} className="hover:bg-[#faf8ff] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#000f3f] text-white flex items-center justify-center font-bold text-xs">
                        {emp.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-[#131b2e]">{emp.name}</div>
                        <div className="text-[0.6875rem] text-[#45464f] font-mono">{emp.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-[#131b2e]">{emp.designation}</div>
                    <div className="text-[0.6875rem] text-[#45464f]">{emp.department}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-medium tabular-nums">
                    ₹{emp.baseMonthly.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-medium tabular-nums">
                    ₹{emp.stdAllowances.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-bold tabular-nums text-[#006a63]">
                    ₹{gross.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {emp.flagged ? (
                      <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] text-[0.625rem] font-bold">
                        REVIEW
                      </span>
                    ) : emp.isNewJoiner ? (
                      <span className="px-2 py-0.5 rounded bg-[#99efe5]/40 text-[#006f67] text-[0.625rem] font-bold">
                        NEW JOINER
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-[#eaedff] text-[#172554] text-[0.625rem] font-bold">
                        ACTIVE
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setViewingEmp(emp)}
                      className="p-1.5 rounded-lg hover:bg-[#eaedff] text-[#006a63] transition-colors inline-flex items-center gap-1 font-semibold text-xs"
                    >
                      <span className="material-symbols-outlined text-[1.125rem]">visibility</span>
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Employee Detail Modal */}
      {viewingEmp && (
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
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#eaedff]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#000f3f] text-white flex items-center justify-center font-bold text-sm">
                  {viewingEmp.initials}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#131b2e]">{viewingEmp.name}</h3>
                  <p className="text-xs text-[#45464f]">{viewingEmp.code}</p>
                </div>
              </div>
              <button onClick={() => setViewingEmp(null)} className="text-[#767680] hover:text-[#131b2e]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-[#eaedff]">
                <span className="text-[#45464f]">Designation:</span>
                <span className="font-semibold text-[#131b2e]">{viewingEmp.designation}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#eaedff]">
                <span className="text-[#45464f]">Department:</span>
                <span className="font-semibold text-[#131b2e]">{viewingEmp.department}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#eaedff]">
                <span className="text-[#45464f]">Base Monthly:</span>
                <span className="font-bold text-[#131b2e]">₹{viewingEmp.baseMonthly.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#eaedff]">
                <span className="text-[#45464f]">Allowances:</span>
                <span className="font-bold text-[#131b2e]">₹{viewingEmp.stdAllowances.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#eaedff]">
                <span className="text-[#45464f]">EPFO UAN:</span>
                <span className="font-mono text-[#131b2e]">101492834012</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#eaedff]">
                <span className="text-[#45464f]">PAN / Income Tax ID:</span>
                <span className="font-mono text-[#131b2e]">ABCDE1234F</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#eaedff]">
              <button
                onClick={() => {
                  onShowToast(`Generated Payslip Preview for ${viewingEmp.name}`);
                  setViewingEmp(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#eaedff] text-[#131b2e] font-semibold text-xs"
              >
                Preview Payslip
              </button>
              <button
                onClick={() => setViewingEmp(null)}
                className="px-4 py-2 rounded-lg bg-[#006a63] text-white font-semibold text-xs hover:bg-[#00504a]"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
