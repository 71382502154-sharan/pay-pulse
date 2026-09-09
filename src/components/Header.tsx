import React, { useState, useRef, useEffect } from 'react';
import { NavigationTab, UserProfile } from '../types';
import { getInitials } from '../utils/userUtils';

interface HeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenNewPayRun: () => void;
  onOpenAddEmployee: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isCollapsed: boolean;
  isBackendConnected?: boolean;
  unreadNotificationsCount?: number;
  user?: UserProfile;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewPayRun,
  onOpenAddEmployee,
  searchQuery,
  onSearchChange,
  isDark,
  onToggleTheme,
  isCollapsed,
  isBackendConnected = false,
  unreadNotificationsCount = 3,
  user,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-[#ffffff]/95 backdrop-blur-md z-40 px-6 flex items-center justify-between border-b border-[#eaedff] transition-all duration-300 shadow-[0_1px_4px_rgba(0,0,0,0.03)] ${
        isCollapsed ? 'left-20' : 'left-72'
      }`}
    >
      {/* Left: Breadcrumbs & Search */}
      <div className="flex items-center gap-6 flex-1 max-w-2xl">
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#45464f] shrink-0 font-['Hanken_Grotesk']">
          <span className="material-symbols-outlined text-[1.125rem]">home</span>
          <span>/</span>
          {currentTab === 'pay-runs' ? (
            <div className="flex items-center gap-1 font-medium">
              <span className="cursor-pointer hover:text-[#006a63]" onClick={() => onSelectTab('dashboard')}>Payroll</span>
              <span>&gt;</span>
              <span className="cursor-pointer hover:text-[#006a63]" onClick={() => onSelectTab('pay-runs')}>Pay Runs</span>
              <span>&gt;</span>
              <span className="text-[#131b2e] font-semibold bg-[#eaedff] px-1.5 py-0.5 rounded text-[0.6875rem]">PR-2025-03</span>
            </div>
          ) : (
            <span className="text-[#131b2e] font-semibold capitalize">
              {currentTab === 'dashboard' ? 'Payroll Console' : currentTab.replace('-', ' ')}
            </span>
          )}
        </div>

        {/* Global Search */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#767680] text-[1.15rem]">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Employee ID, Name, Department, Payslips (Cmd+K)..."
            type="search"
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-[#f2f3ff] text-[#131b2e] placeholder:text-[#767680] text-xs font-['Hanken_Grotesk'] focus:outline-none focus:ring-2 focus:ring-[#006a63]/30 border border-transparent focus:border-[#006a63]/40 transition-all"
          />
          <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 text-[0.625rem] text-[#767680] bg-white px-1.5 py-0.5 rounded border border-[#c6c5d0]">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Quick Action Buttons & Controls */}
      <div className="flex items-center gap-4">
        {/* Backend Live Indicator */}
        <div
          title={isBackendConnected ? "Connected to PayPulse Backend API" : "Running with local data fallback"}
          className={`hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.6875rem] font-medium transition-colors ${
            isBackendConnected
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs'
              : 'bg-amber-50 text-amber-800 border border-amber-200/80'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
          <span className="font-semibold">{isBackendConnected ? 'Backend Connected' : 'Offline Mode'}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewPayRun}
            type="button"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#000f3f] text-white hover:bg-[#172554] transition-all text-xs font-['Plus_Jakarta_Sans'] font-semibold shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[1.125rem]">play_circle</span>
            <span>New Pay Run</span>
          </button>

          <button
            onClick={onOpenAddEmployee}
            type="button"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#eaedff] text-[#131b2e] hover:bg-[#dae2fd] transition-all text-xs font-['Plus_Jakarta_Sans'] font-semibold active:scale-95"
          >
            <span className="material-symbols-outlined text-[1.125rem]">person_add</span>
            <span>Add Employee</span>
          </button>
        </div>

        <div className="h-6 w-px bg-[#eaedff] hidden sm:block"></div>

        {/* System action buttons */}
        <div className="flex items-center gap-1 relative">
          <button
            onClick={onToggleTheme}
            aria-label="Theme Switcher"
            title="Toggle theme mode"
            type="button"
            className="p-1.5 text-[#45464f] hover:text-[#131b2e] hover:bg-[#f2f3ff] rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[1.25rem]">
              {isDark ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowHelp(!showHelp)}
              aria-label="Help & Knowledge Base"
              title="Help & Statutory Guidelines"
              type="button"
              className="p-1.5 text-[#45464f] hover:text-[#131b2e] hover:bg-[#f2f3ff] rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[1.25rem]">help_outline</span>
            </button>

            {showHelp && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#eaedff] p-3 text-xs z-50 animate-in fade-in slide-in-from-top-2">
                <div className="font-semibold text-[#131b2e] mb-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[1rem] text-[#006a63]">verified</span>
                  EPFO &amp; TDS Statutory Manual
                </div>
                <p className="text-[#45464f] leading-relaxed">
                  Provident Fund ceiling capped at ₹15,000 basic wage (12% employee + 12% employer). TDS Form 24Q quarterly compliance is synced directly with TRACES.
                </p>
                <div className="mt-2.5 pt-2 border-t border-[#eaedff] flex justify-between items-center text-[#006a63] font-semibold">
                  <span>Helpdesk: Ext. 4410</span>
                  <button onClick={() => setShowHelp(false)} className="hover:underline">Close</button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications button with popup */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              type="button"
              className="relative p-1.5 text-[#45464f] hover:text-[#131b2e] hover:bg-[#f2f3ff] rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[1.25rem]">notifications</span>
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white animate-pulse"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#eaedff] p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#eaedff] mb-2">
                  <span className="font-bold text-[#131b2e]">Recent Notifications ({unreadNotificationsCount})</span>
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onSelectTab('notifications');
                    }}
                    className="text-[0.6875rem] text-[#006a63] font-semibold hover:underline"
                  >
                    Open Center
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      onSelectTab('notifications');
                    }}
                    className="p-2 rounded-lg bg-[#faf8ff] hover:bg-[#f2f3ff] transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-[#131b2e] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
                      3 Negative Net Pay Discrepancies
                    </div>
                    <div className="text-[#45464f] text-[0.6875rem]">Flagged for loan EMI deferral clearance.</div>
                    <div className="text-[#767680] text-[0.625rem] mt-1">10 mins ago</div>
                  </div>
                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      onSelectTab('notifications');
                    }}
                    className="p-2 rounded-lg bg-[#faf8ff] hover:bg-[#f2f3ff] transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-[#131b2e]">18 Naming Inconsistencies Flagged</div>
                    <div className="text-[#45464f] text-[0.6875rem]">AI audit detected format anomalies in banking records.</div>
                    <div className="text-[#767680] text-[0.625rem] mt-1">25 mins ago</div>
                  </div>
                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      onSelectTab('notifications');
                    }}
                    className="p-2 rounded-lg bg-[#faf8ff] hover:bg-[#f2f3ff] transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-[#131b2e]">EPFO ECR File Ready for March 2025</div>
                    <div className="text-[#45464f] text-[0.6875rem]">Universal text file formatted per EPFO specs.</div>
                    <div className="text-[#767680] text-[0.625rem] mt-1">Today, 11:30 AM</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#eaedff] mt-2 text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onSelectTab('notifications');
                    }}
                    className="text-xs font-semibold text-[#006a63] hover:underline"
                  >
                    View All In Notification Center &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Avatar & Name Profile Area */}
        <div className="relative pl-1" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#f2f3ff] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#006a63]/20"
            aria-label="User profile menu"
          >
            <div 
              className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 ring-2 ring-[#006a63]/30 shadow-xs"
              style={{ backgroundColor: user?.avatarBg || '#000f3f' }}
            >
              {getInitials(user?.name)}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="font-['Plus_Jakarta_Sans'] font-semibold text-xs text-[#131b2e] leading-tight max-w-[130px] truncate">
                {user?.name || 'User Profile'}
              </span>
              <span className="font-['Hanken_Grotesk'] text-[0.6875rem] text-[#45464f] leading-tight max-w-[130px] truncate">
                {user?.role || 'Admin'}
              </span>
            </div>
            <span className="material-symbols-outlined text-[1rem] text-[#767680] hidden xl:inline-block transition-transform duration-200" style={{ transform: showProfileMenu ? 'rotate(180deg)' : 'none' }}>
              expand_more
            </span>
          </button>

          {/* Profile Dropdown Popup */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#eaedff] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 p-2 bg-[#f2f3ff] rounded-xl border border-[#eaedff]">
                <div 
                  className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm"
                  style={{ backgroundColor: user?.avatarBg || '#000f3f' }}
                >
                  {getInitials(user?.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-['Plus_Jakarta_Sans'] font-bold text-xs text-[#131b2e] truncate">
                    {user?.name || 'Authorized User'}
                  </div>
                  <div className="text-[0.6875rem] text-[#45464f] truncate">
                    {user?.email || 'user@paypulse.corp'}
                  </div>
                  <div className="mt-0.5 inline-block text-[0.625rem] font-semibold text-[#006a63] bg-[#99efe5]/40 px-1.5 py-0.5 rounded">
                    {user?.role || 'Admin'}
                  </div>
                </div>
              </div>

              <div className="mt-2 space-y-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onSelectTab('settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#131b2e] hover:bg-[#faf8ff] transition-colors text-left font-medium"
                >
                  <span className="material-symbols-outlined text-base text-[#006a63]">manage_accounts</span>
                  <span>Profile &amp; Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onSelectTab('notifications');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#131b2e] hover:bg-[#faf8ff] transition-colors text-left font-medium"
                >
                  <span className="material-symbols-outlined text-base text-[#45464f]">notifications</span>
                  <span>Notification Center</span>
                </button>

                {onLogout && (
                  <div className="pt-1.5 border-t border-[#eaedff] mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors text-left font-semibold"
                    >
                      <span className="material-symbols-outlined text-base text-[#ba1a1a]">logout</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
