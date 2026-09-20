/**
 * ============================================================================
 * PAYPULSE ENTERPRISE — CONSOLE SIDEBAR NAVIGATION
 * ============================================================================
 * Primary persistent navigation sidebar with expandable/collapsible state,
 * dynamic badge counters, active tab indicators, and user profile footer.
 * ============================================================================
 */

import React from 'react';
import { NavigationTab, UserProfile } from '../types';
import { getInitials } from '../utils/userUtils';
import { PayPulseLogo } from './PayPulseLogo';

/* ========================================================================== */
/* 1. TYPES & NAVIGATION CONFIGURATION                                        */
/* ========================================================================== */

interface SidebarProps {
  /** Active selected navigation tab */
  currentTab: NavigationTab;
  /** Tab switch callback */
  onSelectTab: (tab: NavigationTab) => void;
  /** Whether the sidebar is collapsed into mini-icon mode */
  isCollapsed: boolean;
  /** Toggle collapse handler */
  onToggleCollapse: () => void;
  /** Number of pending approvals requiring attention */
  pendingApprovalsCount: number;
  /** Unread notification badge count */
  unreadNotificationsCount?: number;
  /** Authenticated operator profile */
  user?: UserProfile;
  /** Logout session callback */
  onLogout?: () => void;
}

interface NavItemConfig {
  tab: NavigationTab;
  label: string;
  icon: string;
  badgeType?: 'approvals' | 'notifications';
}

interface NavSectionConfig {
  title: string;
  items: NavItemConfig[];
}

/**
 * Declarative navigation structure. New tabs and sections can be added,
 * reordered, or edited directly within this array.
 */
const SIDEBAR_SECTIONS: NavSectionConfig[] = [
  {
    title: 'Main',
    items: [
      { tab: 'dashboard', label: 'Dashboard', icon: 'space_dashboard' },
      { tab: 'employees', label: 'Employees', icon: 'badge' },
      { tab: 'pay-runs', label: 'Pay Runs', icon: 'payments' },
      { tab: 'approvals', label: 'Approvals', icon: 'fact_check', badgeType: 'approvals' },
    ],
  },
  {
    title: 'Workforce & Time',
    items: [
      { tab: 'attendance', label: 'Attendance', icon: 'schedule' },
      { tab: 'salary-structure', label: 'Salary Structure', icon: 'account_tree' },
      { tab: 'allowances-and-deductions', label: 'Allowances & Deductions', icon: 'price_change' },
      { tab: 'reimbursements', label: 'Reimbursements', icon: 'receipt_long' },
    ],
  },
  {
    title: 'Financial & Compliance',
    items: [
      { tab: 'payslips', label: 'Payslips', icon: 'description' },
      { tab: 'reports', label: 'Reports', icon: 'bar_chart' },
    ],
  },
  {
    title: 'System',
    items: [
      { tab: 'notifications', label: 'Notifications', icon: 'notifications', badgeType: 'notifications' },
      { tab: 'settings', label: 'Settings', icon: 'settings' },
    ],
  },
];

/* ========================================================================== */
/* 2. COMPONENT IMPLEMENTATION                                                */
/* ========================================================================== */

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  pendingApprovalsCount,
  unreadNotificationsCount = 0,
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
        {/* Top Logo & Header Bar */}
        {!isCollapsed ? (
          <div className="h-16 px-4 flex items-center justify-between bg-[#000f3f] shrink-0 border-b border-[#172554]/50">
            <div
              className="flex items-center gap-3 cursor-pointer select-none group"
              onClick={() => onSelectTab('dashboard')}
            >
              <PayPulseLogo size="md" variant="badge" className="group-hover:scale-105 transition-transform" />
              <div className="flex flex-col">
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-xl tracking-tight text-white leading-none">
                  PayPulse
                </span>
              </div>
            </div>

            <button
              onClick={onToggleCollapse}
              aria-label="Collapse navigation"
              title="Collapse sidebar"
              className="text-[#808dc2] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#172554] shrink-0 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[1.25rem]">menu_open</span>
            </button>
          </div>
        ) : (
          <div className="h-16 flex items-center justify-center bg-[#000f3f] shrink-0 border-b border-[#172554]/50 px-2">
            <button
              onClick={onToggleCollapse}
              aria-label="Expand navigation"
              title="Expand sidebar"
              className="p-2 rounded-lg text-[#808dc2] hover:text-white hover:bg-[#172554] transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[1.25rem]">menu</span>
            </button>
          </div>
        )}

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
          {SIDEBAR_SECTIONS.map((section) => (
            <nav key={section.title} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 pb-1">
                  <span className="font-['Hanken_Grotesk'] text-[0.6875rem] uppercase tracking-wider text-[#808dc2] font-bold">
                    {section.title}
                  </span>
                </div>
              )}

              {section.items.map((item) => {
                const isActive = currentTab === item.tab;
                const hasApprovalsBadge = item.badgeType === 'approvals' && pendingApprovalsCount > 0;
                const hasNotificationsBadge = item.badgeType === 'notifications' && unreadNotificationsCount > 0;

                return (
                  <button
                    key={item.tab}
                    onClick={() => onSelectTab(item.tab)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left font-medium relative cursor-pointer ${
                      isActive
                        ? 'bg-[#006a63] text-white font-semibold shadow-sm'
                        : 'text-[#808dc2] hover:bg-[#172554] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="material-symbols-outlined text-[1.25rem] shrink-0">
                        {item.icon}
                      </span>
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {/* Approvals Counter Badge */}
                    {!isCollapsed && hasApprovalsBadge && (
                      <span className="px-1.5 py-0.5 rounded bg-[#172554] text-[#99efe5] font-bold text-[0.6875rem] shrink-0">
                        {pendingApprovalsCount}
                      </span>
                    )}

                    {/* Notifications Counter Badge */}
                    {!isCollapsed && hasNotificationsBadge && (
                      <span className="px-1.5 py-0.5 rounded-full bg-[#ba1a1a] text-white font-bold text-[0.625rem] shrink-0 animate-pulse">
                        {unreadNotificationsCount}
                      </span>
                    )}

                    {/* Collapsed Mode Floating Notification Indicator */}
                    {isCollapsed && hasNotificationsBadge && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-[#000f3f] animate-pulse"></span>
                    )}
                  </button>
                );
              })}
            </nav>
          ))}
        </div>
      </div>

      {/* User Footer Profile & Sign Out */}
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
                <div
                  className="font-['Plus_Jakarta_Sans'] font-semibold text-white text-sm truncate"
                  title={user?.name || 'User Profile'}
                >
                  {user?.name || 'User Profile'}
                </div>
                <div
                  className="font-['Hanken_Grotesk'] text-[0.6875rem] text-[#808dc2] truncate"
                  title={user?.role || 'Admin'}
                >
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
