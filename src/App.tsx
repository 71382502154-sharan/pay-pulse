import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavigationTab, EmployeeRow, ApprovalItem, MilestoneEvent, DiscrepancyEmployee, NotificationItem, UserProfile } from './types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_APPROVALS,
  INITIAL_MILESTONES,
  INITIAL_DISCREPANCIES,
} from './data/payrollData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { DashboardView } from './components/DashboardView';
import { PayRunExecutionView } from './components/PayRunExecutionView';
import { EmployeesView } from './components/EmployeesView';
import { ApprovalsView } from './components/ApprovalsView';
import { PayslipsView } from './components/PayslipsView';
import { AuxiliaryViews } from './components/AuxiliaryViews';
import { NotificationsView } from './components/NotificationsView';
import { DiscrepancyModal } from './components/DiscrepancyModal';
import { AddAllowanceModal } from './components/AddAllowanceModal';
import { AddEmployeeModal } from './components/AddEmployeeModal';
import { BatchUploadModal } from './components/BatchUploadModal';
import { RuleEngineLogsModal } from './components/RuleEngineLogsModal';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '3 Negative Net Pay Discrepancies Flagged',
    description: 'Statutory withholdings and loan EMI recoveries exceed monthly gross compensation for 3 staff members.',
    impact: 'Automated escrow disbursement lock activated. Director resolution required.',
    category: 'critical',
    timestamp: '10 mins ago',
    read: false,
    actionLabel: 'Resolve Discrepancies',
    actionType: 'discrepancies',
  },
  {
    id: 'notif-2',
    title: 'Direct Escrow Disbursement Batch Formatted',
    description: '256-bit encrypted direct-deposit batch generated with automated negative net pay locks.',
    impact: 'Escrow clearing verification scheduled for today.',
    category: 'fiduciary',
    timestamp: '25 mins ago',
    read: false,
    actionLabel: 'View Pay Runs',
    actionType: 'payrun',
  },
  {
    id: 'notif-3',
    title: 'EPFO Electronic Challan Return (ECR) Ready for Submission',
    description: 'Universal text file formatted per EPFO unified portal specs generated for 1,428 staff UAN contributions.',
    impact: 'Statutory compliance deadline: 15 March 2025.',
    category: 'statutory',
    timestamp: 'Today, 11:30 AM',
    read: false,
    actionLabel: 'Download ECR Text File',
    actionType: 'reports',
  },
  {
    id: 'notif-4',
    title: 'March 2025 Biometric Timesheet Sync Completed',
    description: 'Pulled 21,480 biometric punch logs from ZK-Teco cloud gateway. 18 unpaid LOP deductions computed.',
    impact: 'Total LOP withholding: ₹1,42,800 across 3 departments.',
    category: 'system',
    timestamp: 'Today, 09:15 AM',
    read: true,
    actionLabel: 'Inspect LOP Ledger',
    actionType: 'attendance',
  },
  {
    id: 'notif-5',
    title: 'Director Sign-off Pending in Approvals Queue',
    description: '4 cycle adjustments and ad-hoc bonuses submitted by department leads require executive sign-off.',
    impact: 'Budget variance: +₹95,000 against departmental heads.',
    category: 'fiduciary',
    timestamp: 'Yesterday, 04:45 PM',
    read: true,
    actionLabel: 'Inspect Approvals',
    actionType: 'approvals',
  },
  {
    id: 'notif-6',
    title: 'HDFC Corporate Escrow CMS Balance Verified',
    description: 'Liquid escrow balance ₹12.4 Cr verified > ₹6.94 Cr required net payout. Scheduled value date: 31 March 2025.',
    impact: 'Zero liquidity shortfall detected.',
    category: 'system',
    timestamp: '06 Mar 2025',
    read: true,
    actionLabel: 'Review Pay Run Execution',
    actionType: 'payrun',
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('paypulse_theme') === 'dark';
    } catch {
      return false;
    }
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Authentication & Profile State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('paypulse_auth_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved user:', e);
    }
    return null;
  });

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('paypulse_auth_user', JSON.stringify(user));
    } catch {}
    setToastMessage(`Welcome back, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('paypulse_auth_user');
    } catch {}
    setToastMessage('Signed out of PayPulse console');
  };

  const handleUpdateUser = (updated: UserProfile) => {
    setCurrentUser(updated);
    try {
      localStorage.setItem('paypulse_auth_user', JSON.stringify(updated));
    } catch {}
    setToastMessage('User profile updated');
  };

  // Sync dark class on document root and persist preference
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('paypulse_theme', 'dark');
      } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('paypulse_theme', 'light');
      } catch {}
    }
  }, [isDark]);

  // Core Data States (Fallback to INITIAL_* while fetching)
  const [employees, setEmployees] = useState<EmployeeRow[]>(INITIAL_EMPLOYEES);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(INITIAL_APPROVALS);
  const [milestones, setMilestones] = useState<MilestoneEvent[]>(INITIAL_MILESTONES);
  const [discrepancies, setDiscrepancies] = useState<DiscrepancyEmployee[]>(INITIAL_DISCREPANCIES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Notification actions
  const handleToggleReadNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleMarkAllReadNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleResetNotifications = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Modals state
  const [isDiscrepancyModalOpen, setIsDiscrepancyModalOpen] = useState(false);
  const [isAddAllowanceModalOpen, setIsAddAllowanceModalOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isBatchUploadModalOpen, setIsBatchUploadModalOpen] = useState(false);
  const [isRuleLogsModalOpen, setIsRuleLogsModalOpen] = useState(false);

  // Toast auto-hide
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Fetch initial data from backend API
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const response = await fetch('/api/payroll/all');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        if (result.success && result.data) {
          setEmployees(result.data.employees);
          setApprovals(result.data.approvals);
          setMilestones(result.data.milestones);
          setDiscrepancies(result.data.discrepancies);
          setIsBackendConnected(true);
        }
      } catch (err) {
        console.warn('Backend server offline or unreachable; loaded local fallback data.', err);
        setIsBackendConnected(false);
      }
    };

    fetchBackendData();
  }, []);

  // Handlers with Backend Sync
  const handleUpdateEmployeeBonus = async (id: string, newBonus: number) => {
    // Optimistic UI update
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, adHocBonus: newBonus } : e))
    );

    try {
      await fetch(`/api/employees/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adHocBonus: newBonus }),
      });
    } catch (e) {
      console.error('Failed to sync bonus update to backend:', e);
    }
  };

  const handleApproveItem = async (id: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'approved' } : a))
    );
    showToast('Fiduciary approval recorded successfully.');

    try {
      await fetch(`/api/approvals/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approved' }),
      });
    } catch (e) {
      console.error('Failed to sync approval to backend:', e);
    }
  };

  const handleBatchApproveAll = async () => {
    setApprovals((prev) => prev.map((a) => ({ ...a, status: 'approved' })));
    showToast('All pending director exceptions batch-approved.');

    try {
      await fetch('/api/approvals/batch-approve', { method: 'POST' });
    } catch (e) {
      console.error('Failed to sync batch approval to backend:', e);
    }
  };

  const handleResolveDiscrepancy = async (id: string, selectedOption: string) => {
    setDiscrepancies((prev) =>
      prev.map((d) => (d.id === id ? { ...d, resolved: true } : d))
    );

    try {
      await fetch(`/api/discrepancies/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedOption }),
      });
      // Refresh milestones to reflect the resolution
      const res = await fetch('/api/milestones');
      const data = await res.json();
      if (data.success) {
        setMilestones(data.data);
      }
    } catch (e) {
      console.error('Failed to sync discrepancy resolution to backend:', e);
    }
  };

  const handleAddCustomAllowance = async (empId: string, amount: number, _category: string) => {
    const target = employees.find((e) => e.id === empId);
    if (!target) return;

    const updatedStd = target.stdAllowances + amount;
    const updatedBonus = target.adHocBonus + amount;

    setEmployees((prev) =>
      prev.map((e) =>
        e.id === empId
          ? { ...e, stdAllowances: updatedStd, adHocBonus: updatedBonus }
          : e
      )
    );

    try {
      await fetch(`/api/employees/${empId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stdAllowances: updatedStd, adHocBonus: updatedBonus }),
      });
    } catch (e) {
      console.error('Failed to sync allowance to backend:', e);
    }
  };

  const handleAddEmployee = async (newEmp: EmployeeRow) => {
    setEmployees((prev) => [newEmp, ...prev]);
    setMilestones((prev) => [
      {
        id: `ms-${Date.now()}`,
        title: `Employee Added: ${newEmp.name}`,
        description: `Enrolled into ${newEmp.department} with base salary ₹${newEmp.baseMonthly.toLocaleString('en-IN')}`,
        timestamp: 'Just now',
        dotColor: 'secondary',
      },
      ...prev,
    ]);

    try {
      await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmp),
      });
    } catch (e) {
      console.error('Failed to sync new employee to backend:', e);
    }
  };

  if (!currentUser) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#131b2e] text-white shadow-2xl border border-[#eaedff]/20 animate-in fade-in slide-in-from-bottom-2">
            <span className="material-symbols-outlined text-[1.25rem] text-[#71f8e4]">
              info
            </span>
            <span className="text-xs font-semibold">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 text-[#767680] hover:text-white"
            >
              <span className="material-symbols-outlined text-[1rem]">close</span>
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={`min-h-screen bg-[#faf8ff] text-[#131b2e] font-['Hanken_Grotesk'] ${isDark ? 'dark' : ''}`}>
      {/* Toast Notification Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#131b2e] text-white shadow-2xl border border-[#eaedff]/20 animate-in fade-in slide-in-from-top-3">
          <span className="material-symbols-outlined text-[1.25rem] text-[#006a63] bg-white rounded-full p-0.5">
            check
          </span>
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-[#767680] hover:text-white"
          >
            <span className="material-symbols-outlined text-[1rem]">close</span>
          </button>
        </div>
      )}

      {/* Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        pendingApprovalsCount={approvals.filter((a) => a.status === 'pending').length}
        unreadNotificationsCount={unreadNotificationsCount}
        user={currentUser}
        onLogout={handleLogout}
      />

      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenNewPayRun={() => setCurrentTab('pay-runs')}
        onOpenAddEmployee={() => setIsAddEmployeeModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDark={isDark}
        onToggleTheme={() => {
          setIsDark(!isDark);
          showToast(isDark ? 'Light mode enabled' : 'Dark mode enabled');
        }}
        isCollapsed={isCollapsed}
        isBackendConnected={isBackendConnected}
        unreadNotificationsCount={unreadNotificationsCount}
        user={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main
        className={`pt-16 min-h-screen transition-all duration-300 ${
          isCollapsed ? 'ml-20' : 'ml-72'
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {currentTab === 'dashboard' && (
              <DashboardView
                onNavigateToPayRun={() => setCurrentTab('pay-runs')}
                onNavigateToTab={(tab) => setCurrentTab(tab)}
                onOpenAddEmployee={() => setIsAddEmployeeModalOpen(true)}
                approvals={approvals}
                onApproveItem={handleApproveItem}
                onBatchApproveAll={handleBatchApproveAll}
                milestones={milestones}
                onShowToast={showToast}
                employees={employees}
              />
            )}

            {currentTab === 'pay-runs' && (
              <PayRunExecutionView
                onBackToDashboard={() => setCurrentTab('dashboard')}
                employees={employees}
                onUpdateEmployeeBonus={handleUpdateEmployeeBonus}
                onOpenBatchUpload={() => setIsBatchUploadModalOpen(true)}
                onOpenRuleLogs={() => setIsRuleLogsModalOpen(true)}
                onOpenAddAllowance={() => setIsAddAllowanceModalOpen(true)}
                onOpenDiscrepancies={() => setIsDiscrepancyModalOpen(true)}
                onShowToast={showToast}
              />
            )}

            {currentTab === 'employees' && (
              <EmployeesView
                employees={employees}
                onOpenAddEmployee={() => setIsAddEmployeeModalOpen(true)}
                onShowToast={showToast}
              />
            )}

            {currentTab === 'approvals' && (
              <ApprovalsView
                approvals={approvals}
                onApproveItem={handleApproveItem}
                onBatchApproveAll={handleBatchApproveAll}
                onShowToast={showToast}
              />
            )}

            {currentTab === 'payslips' && (
              <PayslipsView employees={employees} onShowToast={showToast} />
            )}

            {currentTab === 'notifications' && (
              <NotificationsView
                notifications={notifications}
                onToggleRead={handleToggleReadNotification}
                onMarkAllRead={handleMarkAllReadNotifications}
                onClearAll={handleClearAllNotifications}
                onDeleteNotification={handleDeleteNotification}
                onResetNotifications={handleResetNotifications}
                onNavigateToTab={(tab) => setCurrentTab(tab)}
                onNavigateToPayRun={() => setCurrentTab('pay-runs')}
                onOpenDiscrepancies={() => setIsDiscrepancyModalOpen(true)}
                onShowToast={showToast}
                employees={employees}
              />
            )}

            {(currentTab === 'salary-structure' ||
              currentTab === 'attendance' ||
              currentTab === 'reports' ||
              currentTab === 'allowances-and-deductions' ||
              currentTab === 'reimbursements' ||
              currentTab === 'settings') && (
              <AuxiliaryViews
                currentTab={currentTab}
                onShowToast={showToast}
                onNavigateToPayRun={() => setCurrentTab('pay-runs')}
                employees={employees}
                user={currentUser}
                onUpdateUser={handleUpdateUser}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modals */}

      <DiscrepancyModal
        isOpen={isDiscrepancyModalOpen}
        onClose={() => setIsDiscrepancyModalOpen(false)}
        discrepancies={discrepancies}
        onResolveDiscrepancy={handleResolveDiscrepancy}
        onShowToast={showToast}
      />

      <AddAllowanceModal
        isOpen={isAddAllowanceModalOpen}
        onClose={() => setIsAddAllowanceModalOpen(false)}
        employees={employees}
        onAddAllowance={handleAddCustomAllowance}
        onShowToast={showToast}
      />

      <AddEmployeeModal
        isOpen={isAddEmployeeModalOpen}
        onClose={() => setIsAddEmployeeModalOpen(false)}
        onAddEmployee={handleAddEmployee}
        onShowToast={showToast}
      />

      <BatchUploadModal
        isOpen={isBatchUploadModalOpen}
        onClose={() => setIsBatchUploadModalOpen(false)}
        onShowToast={showToast}
      />

      <RuleEngineLogsModal
        isOpen={isRuleLogsModalOpen}
        onClose={() => setIsRuleLogsModalOpen(false)}
        onShowToast={showToast}
      />
    </div>
  );
}
