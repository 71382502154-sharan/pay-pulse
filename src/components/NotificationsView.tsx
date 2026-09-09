import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NotificationItem, NavigationTab, EmployeeRow } from '../types';
import { downloadStatutoryReport } from '../utils/downloadUtils';

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
  onOpenNamingCenter: () => void;
  onShowToast: (msg: string) => void;
  employees?: EmployeeRow[];
}

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
  onOpenNamingCenter,
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
      case 'naming':
        onOpenNamingCenter();
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

  return (
    <div className="px-6 py-6 max-w-4xl mx-auto w-full space-y-5">
      {/* Clean & Focused Notification Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#eaedff]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#e2e7ff] text-[#000f3f] flex items-center justify-center">
            <span className="material-symbols-outlined text-[1.4rem]">notifications</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#131b2e]">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#ba1a1a] text-white text-[0.6875rem] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-xs text-[#45464f]">
              Alerts, operational updates, and payroll approvals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Simple All / Unread Filter */}
          <div className="flex items-center bg-[#eaedff] p-0.5 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-white text-[#131b2e] shadow-sm'
                  : 'text-[#45464f] hover:text-[#131b2e]'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                filter === 'unread'
                  ? 'bg-white text-[#131b2e] shadow-sm'
                  : 'text-[#45464f] hover:text-[#131b2e]'
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#eaedff] text-[#131b2e] hover:bg-[#f2f3ff] text-xs font-medium transition-all"
            >
              <span className="material-symbols-outlined text-[1rem] text-[#006a63]">done_all</span>
              <span>Mark all read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={() => {
                onClearAll();
                onShowToast('Notifications cleared');
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[#767680] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 text-xs font-medium transition-all"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#006a63] text-white text-xs font-semibold hover:bg-[#00504a] transition-all"
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
            const isCritical = item.category === 'critical';
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
                    ? isCritical
                      ? 'bg-[#fff8f7] border-[#ffdad6] shadow-sm'
                      : 'bg-white border-[#99efe5]/60 shadow-sm'
                    : 'bg-white/70 border-[#eaedff] opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left Indicator Icon */}
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isCritical
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : item.category === 'statutory'
                        ? 'bg-[#99efe5]/40 text-[#006f67]'
                        : 'bg-[#e2e7ff] text-[#000f3f]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[1.2rem]">
                      {isCritical
                        ? 'warning'
                        : item.category === 'statutory'
                        ? 'verified'
                        : 'notifications'}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#131b2e]">
                        {item.title}
                      </h3>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-[#006a63] shrink-0"></span>
                      )}
                      <span className="text-[0.6875rem] text-[#767680] ml-auto font-mono">
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-[#45464f] leading-relaxed">
                      {item.description}
                    </p>

                    {item.impact && (
                      <p className="text-[0.6875rem] text-[#006a63] font-medium pt-0.5">
                        • {item.impact}
                      </p>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 self-center">
                    {item.actionLabel && (
                      <button
                        onClick={() => handleActionClick(item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center gap-1 active:scale-95 ${
                          isCritical
                            ? 'bg-[#ba1a1a] hover:bg-[#93000a] text-white'
                            : 'bg-[#006a63] hover:bg-[#00504a] text-white'
                        }`}
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
                      className="p-1.5 rounded-md hover:bg-[#eaedff] text-[#45464f] transition-colors"
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
                      className="p-1.5 rounded-md hover:bg-[#ffdad6]/60 text-[#767680] hover:text-[#ba1a1a] transition-colors"
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
          <div className="rounded-xl bg-white p-10 border border-[#eaedff] text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#f2f3ff] text-[#006a63] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[1.25rem]">done_all</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#131b2e]">
              No notifications
            </h3>
            <p className="text-xs text-[#45464f]">
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
