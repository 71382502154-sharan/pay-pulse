/**
 * ============================================================================
 * PAYPULSE ENTERPRISE — CONSOLE HEADER COMPONENT
 * ============================================================================
 * Top console bar hosting breadcrumb trail, global employee search, quick
 * actions ('New Pay Run', 'Add Employee'), theme switcher, notifications popover,
 * and operator profile dropdown.
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { NavigationTab, UserProfile, NotificationItem } from '../types';
import { getInitials } from '../utils/userUtils';
import { PayPulseLogo } from './PayPulseLogo';

/* ========================================================================== */
/* 1. TYPES & CATEGORY BADGE HELPERS                                          */
/* ========================================================================== */

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
  notifications?: NotificationItem[];
  onToggleNotificationRead?: (id: string) => void;
  user?: UserProfile;
  onLogout?: () => void;
}

const getCategoryBadge = (category?: string) => {
  switch (category) {
    case 'critical':
      return {
        label: 'Critical',
        icon: 'error',
        cardUnreadBg: 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 hover:border-rose-300 dark:hover:border-rose-800',
        badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60',
        iconBg: 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400',
        dot: 'bg-rose-500',
        impact: 'bg-rose-100/70 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200 border-rose-200/80 dark:border-rose-800/60',
        action: 'text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300',
      };
    case 'statutory':
      return {
        label: 'Statutory',
        icon: 'verified_user',
        cardUnreadBg: 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-300 dark:hover:border-emerald-800',
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60',
        iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
        dot: 'bg-emerald-500',
        impact: 'bg-emerald-100/70 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 border-emerald-200/80 dark:border-emerald-800/60',
        action: 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300',
      };
    case 'fiduciary':
      return {
        label: 'Fiduciary',
        icon: 'account_balance',
        cardUnreadBg: 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60 hover:border-blue-300 dark:hover:border-blue-800',
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60',
        iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
        dot: 'bg-blue-500',
        impact: 'bg-blue-100/70 text-blue-900 dark:bg-blue-950/60 dark:text-blue-200 border-blue-200/80 dark:border-blue-800/60',
        action: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300',
      };
    case 'system':
    default:
      return {
        label: 'System',
        icon: 'sync_alt',
        cardUnreadBg: 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600',
        badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        iconBg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
        dot: 'bg-slate-400',
        impact: 'bg-slate-100/80 text-slate-800 dark:bg-slate-800/60 dark:text-slate-200 border-slate-200 dark:border-slate-700',
        action: 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
      };
  }
};

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
  notifications = [],
  onToggleNotificationRead,
  user,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [expandedNotifId, setExpandedNotifId] = useState<string | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      const path = e.composedPath ? e.composedPath() : [];

      const isInsideProfile =
        (profileMenuRef.current && profileMenuRef.current.contains(target)) ||
        (profileMenuRef.current && path.includes(profileMenuRef.current));
      if (!isInsideProfile) {
        setShowProfileMenu(false);
      }

      const isInsideNotifications =
        (notificationsRef.current && notificationsRef.current.contains(target)) ||
        (notificationsRef.current && path.includes(notificationsRef.current));
      if (!isInsideNotifications) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 h-16 backdrop-blur-md z-40 px-6 flex items-center justify-between border-b transition-all duration-300 ${
        isCollapsed ? 'left-20' : 'left-72'
      } ${
        isDark
          ? 'bg-[#000f3f]/95 border-[#172554] text-white shadow-[0_1px_8px_rgba(0,0,0,0.3)]'
          : 'bg-[#ffffff]/95 border-[#eaedff] text-[#131b2e] shadow-[0_1px_4px_rgba(0,0,0,0.03)]'
      }`}
    >
      {/* Left: Breadcrumbs & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        {/* Mobile/Compact brand symbol */}
        <div 
          className="flex lg:hidden items-center cursor-pointer transition-transform hover:scale-105 active:scale-95" 
          onClick={() => onSelectTab('dashboard')}
          title="PayPulse"
        >
          <PayPulseLogo size="sm" variant="badge" />

        </div>

        <div className={`hidden lg:flex items-center gap-1.5 text-xs shrink-0 font-['Hanken_Grotesk'] font-medium ${
          isDark ? 'text-[#cbd5e1]' : 'text-[#020617]'
        }`}>
          <span className="material-symbols-outlined text-[1.125rem]">home</span>
          <span>/</span>

          {currentTab === 'pay-runs' ? (
            <div className="flex items-center gap-1 font-medium">
              <span className="cursor-pointer hover:text-[#006a63]" onClick={() => onSelectTab('dashboard')}>Payroll</span>
              <span>&gt;</span>
              <span className="cursor-pointer hover:text-[#006a63]" onClick={() => onSelectTab('pay-runs')}>Pay Runs</span>
              <span>&gt;</span>
              <span className={`font-semibold px-1.5 py-0.5 rounded text-[0.6875rem] ${
                isDark ? 'text-[#71f8e4] bg-[#172554]' : 'text-[#020617] bg-[#eaedff]'
              }`}>PR-2025-03</span>
            </div>
          ) : (
            <span className={`font-bold capitalize ${isDark ? 'text-white' : 'text-[#020617]'}`}>
              {currentTab === 'dashboard' ? 'Payroll Console' : currentTab.replace('-', ' ')}
            </span>
          )}
        </div>

        {/* Global Search */}
        <div className="relative flex-1 max-w-md">
          <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[1.15rem] ${
            isDark ? 'text-[#cbd5e1]' : 'text-[#45464f]'
          }`}>
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Employee ID, Name, Department, Payslips (Cmd+K)..."
            type="search"
            className={`w-full pl-9 pr-4 py-1.5 rounded-lg text-xs font-['Hanken_Grotesk'] font-medium focus:outline-none focus:ring-2 focus:ring-[#006a63]/30 border transition-all ${
              isDark
                ? 'bg-[#172554] text-white placeholder:text-[#94a3b8] border-[#25356e]'
                : 'bg-[#f2f3ff] text-[#020617] placeholder:text-[#475569] border-transparent focus:border-[#006a63]/40'
            }`}
          />
          <kbd className={`hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 text-[0.625rem] px-1.5 py-0.5 rounded border font-bold ${
            isDark ? 'bg-[#000f3f] text-[#cbd5e1] border-[#25356e]' : 'bg-white text-[#020617] border-[#c6c5d0]'
          }`}>
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Quick Action Buttons & Controls */}
      <div className="flex items-center gap-4">
        {/* Backend Connectivity Status Pill */}
        <div 
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.6875rem] font-medium font-['Hanken_Grotesk'] border transition-colors ${
            isBackendConnected 
              ? 'bg-[#e8f5e9] text-[#1b5e20] border-[#c8e6c9]' 
              : 'bg-[#fff3e0] text-[#e65100] border-[#ffe0b2]'
          }`}
          title={isBackendConnected ? "Connected to Express Backend & db.json" : "Using local fallback data"}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isBackendConnected ? 'bg-[#2e7d32] animate-pulse' : 'bg-[#f57c00]'}`}></span>
          <span>{isBackendConnected ? 'Backend Live' : 'Offline Mode'}</span>
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

          {/* Notifications button with popup */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              type="button"
              className="relative p-1.5 text-slate-600 dark:text-slate-300 hover:text-[#000f3f] dark:hover:text-white hover:bg-[#f2f3ff] dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[1.25rem]">notifications</span>
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
              )}
            </button>

            {showNotifications && (
              <div 
                className="absolute right-0 mt-2 w-84 sm:w-96 bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 shadow-slate-900/15 dark:shadow-black/70"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800 mb-2.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <span>Recent Notifications</span>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow-xs">
                        {unreadNotificationsCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNotifications(false);
                        onSelectTab('notifications');
                      }}
                      className="text-[0.6875rem] text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold hover:underline px-1.5 py-0.5 cursor-pointer"
                    >
                      Open Center
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
                      title="Close"
                      aria-label="Close notifications"
                    >
                      <span className="material-symbols-outlined text-[1.1rem]">close</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {(notifications && notifications.length > 0 ? notifications.slice(0, 5) : FALLBACK_NOTIFICATIONS).map((item) => {
                    const style = getCategoryBadge(item.category);
                    const isExpanded = expandedNotifId === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedNotifId(isExpanded ? null : item.id);
                          if (!item.read && onToggleNotificationRead) {
                            onToggleNotificationRead(item.id);
                          }
                        }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          !item.read
                            ? `${style.cardUnreadBg} shadow-xs`
                            : 'bg-white/90 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {/* Category Icon */}
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${style.iconBg}`}>
                            <span className="material-symbols-outlined text-[1.05rem]">
                              {style.icon}
                            </span>
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className={`text-[0.5625rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${style.badge}`}>
                                {style.label}
                              </span>
                              <span className="text-slate-400 dark:text-slate-500 text-[0.625rem] whitespace-nowrap">
                                {item.timestamp}
                              </span>
                            </div>

                            <div className="font-semibold text-slate-900 dark:text-white text-xs leading-snug">
                              {item.title}
                            </div>

                            <p className={`text-slate-600 dark:text-slate-300 text-[0.6875rem] mt-1 leading-relaxed ${
                              isExpanded ? '' : 'line-clamp-2'
                            }`}>
                              {item.description}
                            </p>

                            {item.impact && (
                              <div className={`text-[0.625rem] mt-1.5 font-medium px-2 py-1 rounded-lg border ${style.impact}`}>
                                {item.impact}
                              </div>
                            )}

                            {item.actionLabel && (
                              <div className="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-[0.625rem] text-slate-400 dark:text-slate-500">
                                  {isExpanded ? 'Expanded details' : 'Tap to expand'}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowNotifications(false);
                                    onSelectTab('notifications');
                                  }}
                                  className={`text-[0.6875rem] font-bold hover:underline flex items-center gap-0.5 cursor-pointer ${style.action}`}
                                >
                                  <span>{item.actionLabel}</span>
                                  <span className="material-symbols-outlined text-[0.8rem]">arrow_forward</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 mt-2.5 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifications(false);
                      onSelectTab('notifications');
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold inline-flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>View All In Notification Center</span>
                    <span className="material-symbols-outlined text-[0.85rem]">arrow_forward</span>
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
            <div 
              className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#111827] rounded-2xl shadow-xl border border-[#eaedff] dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-slate-100"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
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

                {/* Brand watermark footer */}
                <div className="mt-2.5 pt-2 border-t border-[#eaedff] flex items-center justify-between px-1 text-[0.6875rem] text-[#767680]">
                  <div className="flex items-center gap-1.5">
                    <PayPulseLogo size="sm" variant="badge" className="w-4 h-4" />
                    <span className="font-semibold text-[#131b2e] dark:text-[#94a3b8]">PayPulse</span>
                  </div>

                  <span className="font-mono text-[0.5625rem] px-1.5 py-0.5 rounded bg-[#f2f3ff] text-[#006a63] font-bold">
                    v2.5
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
