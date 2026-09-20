/**
 * ============================================================================
 * PAYPULSE ENTERPRISE — NOTIFICATIONS & ALERT CENTER VIEW
 * ============================================================================
 * Central hub for reviewing system, statutory, fiduciary, and critical alerts.
 * Features mark-all-read, filter unread, dismiss, and action-routing buttons.
 * ============================================================================
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NotificationItem, NavigationTab, EmployeeRow } from '../types';
import { downloadStatutoryReport } from '../utils/downloadUtils';

/* ========================================================================== */
/* 1. TYPES & PROPS                                                           */
/* ========================================================================== */

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onToggleRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onDeleteNotification: (id: string) => void;
  onResetNotifications: () => void;
  onNavigateToTab: (tab: NavigationTab) => void;
  onNavigateToPayRun: () => void;
  onOpenDiscrepancies: () => void;
  onShowToast: (msg: string) => void;
  employees?: EmployeeRow[];
}

/* ========================================================================== */
/* 2. COMPONENT IMPLEMENTATION & FILTERING                                    */
/* ========================================================================== */

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onToggleRead,
  onMarkAllRead,
  onClearAll,
  onDeleteNotification,
  onResetNotifications,
  onNavigateToTab,
  onNavigateToPayRun,
  onOpenDiscrepancies,
  onShowToast,
  employees = [],
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const handleActionClick = (n: NotificationItem) => {
    if (!n.read) onToggleRead(n.id);
    switch (n.actionType) {
      case 'discrepancies':
        onOpenDiscrepancies();
        break;
      case 'approvals':
        onNavigateToTab('approvals');
        break;
      case 'attendance':
        onNavigateToTab('attendance');
        break;
      case 'payrun':
        onNavigateToPayRun();
        break;
      case 'reports':
        downloadStatutoryReport('EPFO Electronic Challan Return (ECR)', employees);
        onShowToast('Generated & downloaded EPFO Electronic Challan Return (ECR)');
        break;
      default:
        break;
    }
  };

const getCategoryViewBadge = (category?: string) => {
  switch (category) {
    case 'critical':
      return {
        label: 'Critical',
        icon: 'error',
        cardUnreadBg: 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 hover:border-rose-300 dark:hover:border-rose-800',
        badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60',
        iconBg: 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400',
        dot: 'bg-rose-500',
        impact: 'bg-rose-100/70 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200 border-rose-200/80 dark:border-rose-800/60',
        actionBtn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs',
      };
    case 'statutory':
      return {
        label: 'Statutory',
        icon: 'verified_user',
        cardUnreadBg: 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-300 dark:hover:border-emerald-800',
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60',
        iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
        dot: 'bg-emerald-500',
        impact: 'bg-emerald-100/70 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 border-emerald-200/80 dark:border-emerald-800/60',
        actionBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs',
      };
    case 'fiduciary':
      return {
        label: 'Fiduciary',
        icon: 'account_balance',
        cardUnreadBg: 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60 hover:border-blue-300 dark:hover:border-blue-800',
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60',
        iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
        dot: 'bg-blue-500',
        impact: 'bg-blue-100/70 text-blue-900 dark:bg-blue-950/60 dark:text-blue-200 border-blue-200/80 dark:border-blue-800/60',
        actionBtn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs',
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
        actionBtn: 'bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-xs',
      };
  }
};

  return (
    <div className="px-6 py-6 max-w-4xl mx-auto w-full space-y-5 text-slate-800 dark:text-slate-100">
      {/* Clean & Focused Notification Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/50 flex items-center justify-center">
            <span className="material-symbols-outlined text-[1.4rem]">notifications</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-slate-900 dark:text-white">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[0.6875rem] font-bold shadow-xs">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Alerts, operational updates, and statutory compliance notices
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Simple All / Unread Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                filter === 'unread'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => {
                onMarkAllRead();
                onShowToast('All notifications marked as read');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 text-xs font-medium transition-all shadow-2xs"
            >
              <span className="material-symbols-outlined text-[1rem] text-teal-600 dark:text-teal-400">done_all</span>
              <span>Mark all read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={() => {
                onClearAll();
                onShowToast('Notifications cleared');
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium transition-all"
              title="Clear all notifications"
            >
              <span className="material-symbols-outlined text-[1.05rem]">clear_all</span>
              <span>Clear</span>
            </button>
          )}

          {notifications.length === 0 && (
            <button
              onClick={() => {
                onResetNotifications();
                onShowToast('Restored notifications');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[1rem]">refresh</span>
              <span>Restore</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        <AnimatePresence>
          {filtered.map((item) => {
            const style = getCategoryViewBadge(item.category);
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className={`group rounded-xl p-4 border transition-all ${
                  !item.read
                    ? `${style.cardUnreadBg} shadow-xs`
                    : 'bg-white/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 opacity-85 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left Indicator Icon */}
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${style.iconBg}`}
                  >
                    <span className="material-symbols-outlined text-[1.2rem]">
                      {style.icon}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[0.5625rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${style.badge}`}>
                        {style.label}
                      </span>
                      <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-slate-900 dark:text-white">
                        {item.title}
                      </h3>
                      {!item.read && (
                        <span className={`w-2 h-2 rounded-full ${style.dot} shrink-0`}></span>
                      )}
                      <span className="text-[0.6875rem] text-slate-400 dark:text-slate-500 ml-auto font-mono">
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    {item.impact && (
                      <div className={`text-[0.6875rem] font-medium px-2.5 py-1 rounded-lg border inline-block mt-1 ${style.impact}`}>
                        {item.impact}
                      </div>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 self-center">
                    {item.actionLabel && (
                      <button
                        onClick={() => handleActionClick(item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 active:scale-95 ${style.actionBtn}`}
                      >
                        <span>{item.actionLabel}</span>
                        <span className="material-symbols-outlined text-[0.875rem]">arrow_forward</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onToggleRead(item.id);
                        onShowToast(item.read ? 'Marked unread' : 'Marked read');
                      }}
                      title={item.read ? 'Mark unread' : 'Mark read'}
                      className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[1.1rem]">
                        {item.read ? 'mark_chat_unread' : 'check_circle'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        onDeleteNotification(item.id);
                        onShowToast('Removed notification');
                      }}
                      title="Dismiss"
                      className="p-1.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[1.1rem]">close</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="rounded-xl bg-white dark:bg-slate-900 p-10 border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[1.25rem]">done_all</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-slate-900 dark:text-white">
              No notifications
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {filter === 'unread'
                ? 'You are all caught up! No unread notifications.'
                : 'No notifications currently.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
