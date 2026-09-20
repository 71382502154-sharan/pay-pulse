/**
 * ============================================================================
 * PAYPULSE ENTERPRISE — ROOT APPLICATION ORCHESTRATOR
 * ============================================================================
 * Central routing and state container managing active view keys (landing, auth,
 * console), user authentication sessions, live payroll entities (employees,
 * approvals, discrepancies, milestones), modals, and notifications.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavigationTab, EmployeeRow, ApprovalItem, MilestoneEvent, DiscrepancyEmployee, NotificationItem, UserProfile } from './types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_APPROVALS,
  INITIAL_MILESTONES,
  INITIAL_DISCREPANCIES,
  INITIAL_NOTIFICATIONS,
} from './data/payrollData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { PayPulseLandingPage } from './landing/PayPulseLandingPage';
import { PageTransitionOverlay } from './components/PageTransitionOverlay';
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

/* ========================================================================== */
/* ROOT COMPONENT DEFINITION                                                  */
/* ========================================================================== */

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
  const [isAuthView, setIsAuthView] = useState<boolean>(false);
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const [isTransit, setIsTransit] = useState<boolean>(false);
  const [transitMessage, setTransitMessage] = useState<string>('');
  const [transitTarget, setTransitTarget] = useState<string>('');

  const handleOpenAuth = (targetName = 'PayPulse Console Login') => {
    setSlideDirection(1);
    setTransitMessage('OPENING PAYPULSE LOGIN...');
    setTransitTarget(targetName);
    setIsTransit(true);
    setTimeout(() => {
      setIsAuthView(true);
      setIsTransit(false);
    }, 420);
  };

  const handleBackToLanding = () => {
    setSlideDirection(-1);
    setTransitMessage('RETURNING TO LANDING PAGE...');
    setTransitTarget('PayPulse Overview');
    setIsTransit(true);
    setTimeout(() => {
      setIsAuthView(false);
      setIsTransit(false);
    }, 380);
  };

  // Authentication & Profile State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('paypulse_auth_user');
      const savedToken = localStorage.getItem('paypulse_auth_token');
      if (saved && savedToken) {
        const parsed = JSON.parse(saved);
        return { ...parsed, token: savedToken };
      }
    } catch (e) {
      console.error('Failed to parse saved user:', e);
    }
    return null;
  });

  // Check auth session validity on startup against backend
  useEffect(() => {
    const verifySavedSession = async () => {
      const token = localStorage.getItem('paypulse_auth_token');
      if (!token) return;

      try {
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.user) {
            const authedUser = { ...result.user, token };
            setCurrentUser(authedUser);
            localStorage.setItem('paypulse_auth_user', JSON.stringify(authedUser));
          }
        } else {
          // Token expired or invalid on server
          console.warn('Authentication token expired or invalidated; logging out.');
          localStorage.removeItem('paypulse_auth_token');
          localStorage.removeItem('paypulse_auth_user');
          setCurrentUser(null);
        }
      } catch (e) {
        console.warn('Backend server offline during session check:', e);
      }
    };

    verifySavedSession();
  }, []);

  const handleLogin = (user: UserProfile, token: string) => {
    setSlideDirection(1);
    setTransitMessage(`SIGNING IN AS ${user.name.toUpperCase()}...`);
    setTransitTarget('PayPulse Enterprise Console');
    setIsTransit(true);
    setTimeout(() => {
      const authedUser = { ...user, token };
      setCurrentUser(authedUser);
      setIsTransit(false);
      try {
        localStorage.setItem('paypulse_auth_user', JSON.stringify(authedUser));
        localStorage.setItem('paypulse_auth_token', token);
      } catch {}
      setToastMessage(`Welcome back, ${user.name}!`);
    }, 450);
  };

  const handleLogout = () => {
    setSlideDirection(-1);
    setTransitMessage('SIGNING OUT...');
    setTransitTarget('PayPulse Overview');
    setIsTransit(true);
    setTimeout(() => {
      setCurrentUser(null);
      setIsAuthView(false);
      setIsTransit(false);
      try {
        localStorage.removeItem('paypulse_auth_user');
        localStorage.removeItem('paypulse_auth_token');
      } catch {}
      setToastMessage('Signed out of PayPulse console');
    }, 350);
  };

  const handleUpdateUser = (updated: UserProfile) => {
    const authedUser = { ...updated, token: currentUser?.token };
    setCurrentUser(authedUser);
    try {
      localStorage.setItem('paypulse_auth_user', JSON.stringify(authedUser));
    } catch {}
    setToastMessage('User profile updated');
  };

  // Sync dark/light class on document root and persist preference
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        localStorage.setItem('paypulse_theme', 'dark');
        window.dispatchEvent(new CustomEvent('paypulse-theme-change', { detail: { theme: 'dark' } }));
      } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
      try {
        localStorage.setItem('paypulse_theme', 'light');
        window.dispatchEvent(new CustomEvent('paypulse-theme-change', { detail: { theme: 'light' } }));
      } catch {}
    }
  }, [isDark]);

  // Two-way synchronization with landing page theme changes
  useEffect(() => {
    const handleExternalThemeSync = () => {
      try {
        const theme = localStorage.getItem('paypulse_theme');
        if (theme === 'dark') setIsDark(true);
        if (theme === 'light') setIsDark(false);
      } catch {}
    };

    window.addEventListener('storage', handleExternalThemeSync);
    window.addEventListener('paypulse-theme-change', handleExternalThemeSync);
    return () => {
      window.removeEventListener('storage', handleExternalThemeSync);
      window.removeEventListener('paypulse-theme-change', handleExternalThemeSync);
    };
  }, []);

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

  const getAuthHeaders = () => {
    const token = localStorage.getItem('paypulse_auth_token') || currentUser?.token;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // Fetch initial data from backend API
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const response = await fetch('/api/payroll/all', {
          headers: getAuthHeaders(),
        });
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
  }, [currentUser]);

  // Handlers with Backend Sync
  const handleUpdateEmployeeBonus = async (id: string, newBonus: number) => {
    // Optimistic UI update
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, adHocBonus: newBonus } : e))
    );

    try {
      await fetch(`/api/employees/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
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
      await fetch('/api/approvals/batch-approve', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
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
        headers: getAuthHeaders(),
        body: JSON.stringify({ selectedOption }),
      });
      // Refresh milestones to reflect the resolution
      const res = await fetch('/api/milestones', {
        headers: getAuthHeaders(),
      });
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
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
        body: JSON.stringify(newEmp),
      });
    } catch (e) {
      console.error('Failed to sync new employee to backend:', e);
    }
  };

  const currentViewKey = currentUser ? 'console' : isAuthView ? 'auth' : 'landing';

  const pageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.985,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.985,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    }),
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-background">
      <PageTransitionOverlay
        isTransitioning={isTransit}
        message={transitMessage}
        targetViewName={transitTarget}
      />

      <AnimatePresence mode="wait" custom={slideDirection}>
        {currentViewKey === 'landing' && (
          <motion.div
            key="landing"
            custom={slideDirection}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full min-h-screen"
          >
            <PayPulseLandingPage
              onOpenLogin={() => handleOpenAuth('PayPulse Authentication')}
              onOpenDashboard={() => handleOpenAuth('PayPulse Enterprise Console')}
              isAuthenticated={false}
              isDark={isDark}
              onToggleTheme={() => setIsDark((prev) => !prev)}
            />
          </motion.div>
        )}

        {currentViewKey === 'auth' && (
          <motion.div
            key="auth"
            custom={slideDirection}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full min-h-screen"
          >
            <LoginPage
              onLogin={handleLogin}
              onBackToLanding={handleBackToLanding}
            />
          </motion.div>
        )}

        {currentViewKey === 'console' && (
          <motion.div
            key="console"
            custom={slideDirection}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className={`min-h-screen bg-[#faf8ff] dark:bg-[#0b0f19] text-[#131b2e] dark:text-[#f8fafc] font-['Hanken_Grotesk'] ${isDark ? 'dark bg-[#0b0f19] text-[#f8fafc]' : ''}`}
          >
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
              notifications={notifications}
              onToggleNotificationRead={handleToggleReadNotification}
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
                      user={currentUser || undefined}
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
                      isCollapsed={isCollapsed}
                      isDark={isDark}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#131b2e] text-white shadow-2xl border border-[#eaedff]/20 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[1.25rem] text-[#71f8e4]">
            info
          </span>
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-[#767680] hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-[1rem]">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
