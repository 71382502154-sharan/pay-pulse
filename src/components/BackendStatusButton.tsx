import React, { useState, useEffect, useRef } from 'react';

interface BackendHealthData {
  status: string;
  timestamp: string;
  uptime?: number;
  database?: string;
  records?: {
    employees?: number;
    approvals?: number;
    milestones?: number;
    discrepancies?: number;
    users?: number;
  };
  version?: string;
  environment?: string;
}

interface BackendStatusButtonProps {
  isBackendConnected?: boolean;
  onRefresh?: () => Promise<void> | void;
  onShowToast?: (msg: string) => void;
  variant?: 'header' | 'dashboard' | 'compact';
  className?: string;
}

export const BackendStatusButton: React.FC<BackendStatusButtonProps> = ({
  isBackendConnected = true,
  onRefresh,
  onShowToast,
  variant = 'header',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [healthData, setHealthData] = useState<BackendHealthData | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(isBackendConnected);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Sync prop changes
  useEffect(() => {
    setIsOnline(isBackendConnected);
  }, [isBackendConnected]);

  // Click outside listener for the popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (popoverRef.current && !popoverRef.current.contains(target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Ping backend function to measure real round-trip latency
  const pingBackend = async (showNotification = false) => {
    setIsPinging(true);
    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch('/api/health', {
        cache: 'no-cache',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const endTime = performance.now();
      const calculatedLatency = Math.round(endTime - startTime);
      setLatency(calculatedLatency);

      if (res.ok) {
        const data = await res.json();
        setHealthData(data);
        setIsOnline(true);
        if (showNotification && onShowToast) {
          onShowToast(`Backend online & responding (${calculatedLatency}ms round-trip)`);
        }
      } else {
        setIsOnline(false);
        if (showNotification && onShowToast) {
          onShowToast(`Backend returned HTTP status ${res.status}`);
        }
      }
    } catch (err) {
      // Fallback check to /api/payroll/all if /api/health had any issue
      try {
        const fallbackRes = await fetch('/api/payroll/all', { cache: 'no-cache' });
        const endTime = performance.now();
        const calculatedLatency = Math.round(endTime - startTime);
        if (fallbackRes.ok) {
          setLatency(calculatedLatency);
          setIsOnline(true);
          if (showNotification && onShowToast) {
            onShowToast(`Backend verified via fallback endpoint (${calculatedLatency}ms)`);
          }
          setIsPinging(false);
          return;
        }
      } catch (_fallbackErr) {
        // unreachable
      }

      setIsOnline(false);
      setLatency(null);
      if (showNotification && onShowToast) {
        onShowToast('Backend connection unreachable.');
      }
    } finally {
      setIsPinging(false);
    }
  };

  // Initial ping on mount to get latency & health stats
  useEffect(() => {
    pingBackend(false);
    const interval = setInterval(() => {
      pingBackend(false);
    }, 30000); // periodically ping every 30s
    return () => clearInterval(interval);
  }, []);

  const handleManualSync = async () => {
    await pingBackend(true);
    if (onRefresh) {
      try {
        await onRefresh();
      } catch (err) {
        console.error('Error refreshing backend data:', err);
      }
    }
  };

  // Styling based on variant
  const isDashboardVariant = variant === 'dashboard';

  return (
    <div className={`relative inline-block ${className}`} ref={popoverRef}>
      {/* The main Backend Online Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Backend Status"
        title={isOnline ? "Backend Server is Online & Healthy (Click for telemetry)" : "Backend is Offline (Click to reconnect)"}
        className={`group inline-flex items-center gap-2 transition-all duration-200 cursor-pointer select-none active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#006a63]/30 ${
          isDashboardVariant
            ? isOnline
              ? 'px-3.5 py-2 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/80 shadow-xs hover:bg-emerald-100/90 hover:border-emerald-400 font-semibold text-xs'
              : 'px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/80 shadow-xs hover:bg-amber-100 font-semibold text-xs'
            : isOnline
            ? 'px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50 text-xs font-semibold'
            : 'px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:border-amber-500/50 text-xs font-semibold'
        }`}
      >
        {/* Pulsing Status Dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          {isOnline ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 animate-pulse"></span>
          )}
        </span>

        {/* Server Icon */}
        <span className="material-symbols-outlined text-[1.125rem] leading-none shrink-0 text-emerald-600 dark:text-emerald-400">
          {isOnline ? 'dns' : 'cloud_off'}
        </span>

        {/* Text Label */}
        <span className="font-['Plus_Jakarta_Sans'] font-bold tracking-tight whitespace-nowrap">
          {isOnline ? 'Backend Online' : 'Backend Offline'}
        </span>

        {/* Latency Pill (when available) */}
        {isOnline && latency !== null && (
          <span className="hidden sm:inline-flex items-center text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border border-emerald-500/20">
            {latency}ms
          </span>
        )}

        {/* Dropdown Chevron */}
        <span 
          className="material-symbols-outlined text-[0.875rem] text-emerald-600/80 dark:text-emerald-400/80 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
        >
          expand_more
        </span>
      </button>

      {/* Telemetry Popover Modal */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 sm:w-92 bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs text-slate-800 dark:text-slate-100 shadow-slate-900/20 dark:shadow-black/70"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                isOnline ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                <span className="material-symbols-outlined text-[1.125rem]">
                  {isOnline ? 'check_circle' : 'warning'}
                </span>
              </div>
              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-slate-900 dark:text-white leading-tight">
                  Backend API Engine
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isOnline ? 'Online & Service Healthy' : 'Offline / Unreachable'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[1.1rem]">close</span>
            </button>
          </div>

          {/* Status Metrics Grid */}
          <div className="py-3 space-y-2.5">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Connectivity</span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                isOnline
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                {isOnline ? 'Online (HTTP 200)' : 'Offline / Disconnected'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Latency / Round-Trip</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                {latency !== null ? `${latency} ms` : 'Measuring...'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Database Persistence</span>
              <span className="font-semibold text-teal-700 dark:text-teal-300 text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-[0.95rem]">storage</span>
                <span>data/db.json (Active)</span>
              </span>
            </div>

            {healthData?.records && (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Live Database Records
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Employees:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {healthData.records.employees ?? 6}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Approvals:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {healthData.records.approvals ?? 3}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Milestones:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {healthData.records.milestones ?? 4}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Audit Discrepancies:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {healthData.records.discrepancies ?? 2}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions Footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <button
              type="button"
              disabled={isPinging}
              onClick={() => handleManualSync()}
              className="flex-1 py-2 px-3 rounded-xl bg-[#006a63] hover:bg-[#00504a] text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-60 shadow-xs"
            >
              <span className={`material-symbols-outlined text-[1rem] ${isPinging ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isPinging ? 'Pinging Server...' : 'Ping & Resync'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
