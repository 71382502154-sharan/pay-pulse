import React from 'react';
import { NavigationTab, UserProfile } from '../types';
import { getInitials } from '../utils/userUtils';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  pendingApprovalsCount: number;
  unreadNotificationsCount?: number;
  user?: UserProfile;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  pendingApprovalsCount,
  unreadNotificationsCount = 3,
  user,
  onLogout,
}) => {
  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 bg-[#000f3f] text-white z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.06)] transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Top Logo Bar */}
        {!isCollapsed ? (
          <div className="h-16 px-4 flex items-center justify-between bg-[#000f3f] shrink-0 border-b border-[#172554]/50">
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={() => onSelectTab('dashboard')}
            >
              <div className="h-9 w-9 rounded-xl bg-[#006a63] flex items-center justify-center shrink-0 shadow-sm">
                <div className="w-5 h-4 flex flex-col justify-between items-start">
                  <span className="w-4 h-0.5 bg-white rounded-full"></span>
                  <span className="w-4 h-0.5 bg-white rounded-full"></span>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-white rounded-full"></span>
                    <span className="w-1.5 h-1.5 bg-[#4fdbc8] rounded-full"></span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-lg tracking-tight text-white leading-none">
                  PayPulse
                </span>
                <span className="font-['Hanken_Grotesk'] font-semibold text-[0.625rem] uppercase tracking-widest text-[#808dc2] mt-0.5">
                  ENTERPRISE
                </span>
              </div>
            </div>

            <button
              onClick={onToggleCollapse}
              aria-label="Collapse navigation"
              title="Collapse sidebar"
              className="text-[#808dc2] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#172554] shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[1.25rem]">menu_open</span>
            </button>
          </div>
        ) : (
          <div className="h-16 flex items-center justify-center bg-[#000f3f] shrink-0 border-b border-[#172554]/50 px-2">
            <div
              className="h-10 w-10 rounded-xl bg-[#006a63] hover:bg-[#007f76] flex items-center justify-center shrink-0 shadow-md cursor-pointer transition-all active:scale-95"
              onClick={() => onSelectTab('dashboard')}
              title="PayPulse Enterprise (Go to Dashboard)"
            >
              <div className="w-5 h-4 flex flex-col justify-between items-start">
                <span className="w-4 h-0.5 bg-white rounded-full"></span>
                <span className="w-4 h-0.5 bg-white rounded-full"></span>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-white rounded-full"></span>
                  <span className="w-1.5 h-1.5 bg-[#4fdbc8] rounded-full"></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Expand Button when Collapsed */}
          {isCollapsed && (
            <button
              onClick={onToggleCollapse}
              aria-label="Expand navigation"
              title="Expand sidebar"
              className="w-full flex items-center justify-center p-2 rounded-lg text-[#808dc2] hover:text-white hover:bg-[#172554] transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[1.25rem]">menu</span>
            </button>
          )}
          {/* Main Section */}
          <nav className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 pb-1">
                <span className="font-['Hanken_Grotesk'] text-[0.6875rem] uppercase tracking-wider text-[#808dc2] font-bold">
                  Main
                </span>
              </div>
            )}
            <button
              onClick={() => onSelectTab('dashboard')}
              title={isCollapsed ? 'Dashboard' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left font-medium ${
                currentTab === 'dashboard'
                  ? 'bg-[#006a63] text-white font-semibold shadow-sm'
                  : 'text-[#808dc2] hover:bg-[#172554] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[1.25rem] shrink-0">space_dashboard</span>
              {!isCollapsed && <span>Dashboard</span>}
            </button>

            <button
              onClick={() => onSelectTab('employees')}
              title={isCollapsed ? 'Employees' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left font-medium ${
                currentTab === 'employees'
                  ? 'bg-[#006a63] text-white font-semibold shadow-sm'
                  : 'text-[#808dc2] hover:bg-[#172554] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[1.25rem] shrink-0">badge</span>
              {!isCollapsed && <span>Employees</span>}
            </button>

            <button
              onClick={() => onSelectTab('pay-runs')}
              title={isCollapsed ? 'Pay Runs' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left font-medium ${
                currentTab === 'pay-runs'
                  ? 'bg-[#006a63] text-white font-semibold shadow-sm'
                  : 'text-[#808dc2] hover:bg-[#172554] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[1.25rem] shrink-0">payments</span>
              {!isCollapsed && <span>Pay Runs</span>}
            </button>

            <button
              onClick={() => onSelectTab('approvals')}
              title={isCollapsed ? 'Approvals' : undefined}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left font-medium ${
                currentTab === 'approvals'
                  ? 'bg-[#006a63] text-white font-semibold shadow-sm'
                  : 'text-[#808dc2] hover:bg-[#172554] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[1.25rem] shrink-0">fact_check</span>
                {!isCollapsed && <span>Approvals</span>}
              </div>
              {!isCollapsed && pendingApprovalsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-[#172554] text-[#99efe5] font-bold text-[0.6875rem]">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Workforce & Time Section */}
          <nav className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 pb-1">
                <span className="font-['Hanken_Grotesk'] text-[0.6875rem] uppercase tracking-wider text-[#808dc2] font-bold">
                  Workforce &amp; Time
                </span>
              </div>
            )}
            <button
              onClick={() => onSelectTab('attendance')}
              title={isCollapsed ? 'Attendance' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left font-medium ${
                currentTab === 'attendance'
                  ? 'bg-[#006a63] text-white font-semibold'
                  : 'text-[#808dc2] hover:bg-[#172554] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[1.25rem] shrink-0">schedule</span>
              {!isCollapsed && <span>Attendance</span>}
            </button>

            <button
              onClick={() => onSelectTab('salary-structure')}
              title={isCollapsed ? 'Salary Structure' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left font-medium ${
                currentTab === 'salary-structure'
                  ? 'bg-[#006a63] text-white font-semibold'
                  : 'text-[#808dc2] hover:bg-[#172554] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[1.25rem] shrink-0">account_tree</span>
              {!isCollapsed && <span>Salary Structure</span>}
            </button>

            <button
              onClick={() => onSelectTab('allowances-and-deductions')}
              title={isCollapsed ? 'Allowances & Deductions' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left font-medium ${
                currentTab === 'allowances-and-deductions'
                  ? 'bg-[#006a63] text-white font-semibold'
                  : 'text-[#808dc2] hover:bg-[#172554] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[1.25rem] shrink-0">price_change</span>
              {!isCollapsed && <span>Allowances &amp; Deductions</span>}
            </button>

            <button
              onClick={() => onSelectTab('reimbursements')}
              title={isCollapsed ? 'Reimbursements' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left font-medium ${
                currentTab === 'reimbursements'
                  ? 'bg-[#006a63] text-white font-semibold'
                  : 'text-[#808dc2] hover:bg-[#172554] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[1.25rem] shrink-0">receipt_long</span>
              {!isCollapsed && <span>Reimbursements</span>}
            </button>
          </nav>

          {/* Financial & Compliance Section */}
          <nav className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 pb-1">
                <span className="font-['Hanken_Grotesk'] text-[0.6875rem] uppercase tracking-wider text-[#808dc2] font-bold">
                  Financial &amp; Compliance
                </span>
              </div>
            )}
            <button
              onClick={() => onSelectTab('payslips')}
              title={isCollapsed ? 'Payslips' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left font-medium ${
                currentTab === 'payslips'
                  ? 'bg-[#006a63] text-white font-semibold'
                  : 'text-[#808dc2] hover:bg-[#172554] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[1.25rem] shrink-0">description</span>
              {!isCollapsed && <span>Payslips</span>}
            </button>

            <button
              onClick={() => onSelectTab('reports')}
              title={isCollapsed ? 'Reports' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left font-medium ${
                currentTab === 'reports'
                  ? 'bg-[#006a63] text-white font-semibold'
                  : 'text-[#808dc2] hover:bg-[#172554] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[1.25rem] shrink-0">bar_chart</span>
              {!isCollapsed && <span>Reports</span>}
            </button>
          </nav>

          {/* System Section */}
          <nav className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 pb-1">
                <span className="font-['Hanken_Grotesk'] text-[0.6875rem] uppercase tracking-wider text-[#808dc2] font-bold">
                  System
                </span>
              </div>
            )}
            <button
              onClick={() => onSelectTab('notifications')}
              title={isCollapsed ? 'Notifications' : undefined}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left font-medium relative ${
                currentTab === 'notifications'
                  ? 'bg-[#006a63] text-white font-semibold shadow-sm'
                  : 'text-[#808dc2] hover:bg-[#172554] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[1.25rem] shrink-0">notifications</span>
                {!isCollapsed && <span>Notifications</span>}
              </div>
              {!isCollapsed && unreadNotificationsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#ba1a1a] text-white font-bold text-[0.625rem] animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
              {isCollapsed && unreadNotificationsCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-[#000f3f] animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('settings')}
              title={isCollapsed ? 'Settings' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left font-medium ${
                currentTab === 'settings'
                  ? 'bg-[#006a63] text-white font-semibold'
                  : 'text-[#808dc2] hover:bg-[#172554] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[1.25rem] shrink-0">settings</span>
              {!isCollapsed && <span>Settings</span>}
            </button>
          </nav>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 shrink-0 bg-[#172554]/40 border-t border-[#172554]/50">
        <div className="bg-[#172554] rounded-xl p-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div 
              className="w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 ring-2 ring-[#006a63]/50 shadow-xs"
              style={{ backgroundColor: user?.avatarBg || '#006a63' }}
            >
              {getInitials(user?.name)}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="font-['Plus_Jakarta_Sans'] font-semibold text-white text-sm truncate" title={user?.name || 'User Profile'}>
                  {user?.name || 'User Profile'}
                </div>
                <div className="font-['Hanken_Grotesk'] text-[0.6875rem] text-[#808dc2] truncate" title={user?.role || 'Admin'}>
                  {user?.role || 'HR Payroll Director'}
                </div>
              </div>
            )}
          </div>
          {!isCollapsed && onLogout && (
            <button
              onClick={onLogout}
              aria-label="Sign Out"
              title="Sign Out"
              className="text-[#808dc2] hover:text-white p-1 transition-colors shrink-0 rounded-lg hover:bg-[#000f3f]/50 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[1.25rem]">logout</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
