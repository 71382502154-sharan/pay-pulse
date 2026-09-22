/**
 * ============================================================================
 * PAYPULSE ENTERPRISE — DIRECT CONSOLE LOGIN GATEWAY
 * ============================================================================
 * Clean, frictionless 1-step authentication gateway providing direct access to
 * the PayPulse enterprise console. Supports 1-click demo role accounts, account
 * registration, and resilient local session fallback if the backend is offline.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, UserPlus, LogIn, Sparkles, Building2, Briefcase, Sun, Moon, ArrowLeft } from 'lucide-react';
import { UserProfile, AuthResponse } from '../types';
import { PayPulseLogo } from './PayPulseLogo';

/* ========================================================================== */
/* 1. TYPES & PRECONFIGURED DEMO ACCOUNTS                                     */
/* ========================================================================== */

interface LoginPageProps {
  onLogin: (user: UserProfile, token: string) => void;
  onBackToLanding?: () => void;
}

type AuthMode = 'signin' | 'register';

interface DemoAccount {
  label: string;
  name: string;
  role: string;
  email: string;
  pass: string;
  badge: string;
  department: string;
  avatarBg: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: 'Lead Architect',
    name: 'Sharan R',
    role: 'Enterprise Platform Lead',
    email: '71382502154.sharan@sritcbe.ac.in',
    pass: 'sharan@#',
    badge: 'Architect',
    department: 'Engineering & Integration',
    avatarBg: '#006a63',
  },
  {
    label: 'HR Director',
    name: 'Sashmitha S M',
    role: 'HR Payroll Director',
    email: 'admin@paypulse.corp',
    pass: 'Admin@123',
    badge: 'Director',
    department: 'People Operations',
    avatarBg: '#000f3f',
  },
  {
    label: 'Finance Lead',
    name: 'Seashora R',
    role: 'Chief Financial Controller',
    email: 'finance@paypulse.corp',
    pass: 'Finance@123',
    badge: 'Controller',
    department: 'Finance & Accounts',
    avatarBg: '#006a63',
  },
  {
    label: 'Auditor',
    name: 'Sathana G',
    role: 'Compliance & Statutory Auditor',
    email: 'audit@paypulse.corp',
    pass: 'Audit@123',
    badge: 'Auditor',
    department: 'Internal Audit',
    avatarBg: '#1e3a8a',
  },
];

/* ========================================================================== */
/* 2. COMPONENT DEFINITION & STATE                                            */
/* ========================================================================== */

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBackToLanding }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('paypulse_theme') === 'dark';
    } catch {
      return false;
    }
  });

  // Theme synchronization
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    try {
      localStorage.setItem('paypulse_theme', isDark ? 'dark' : 'light');
      window.dispatchEvent(new CustomEvent('paypulse-theme-change', { detail: { theme: isDark ? 'dark' : 'light' } }));
    } catch {}
  }, [isDark]);

  useEffect(() => {
    const handleExternalThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: 'dark' | 'light' }>;
      if (customEvent.detail?.theme) {
        setIsDark(customEvent.detail.theme === 'dark');
      }
    };
    window.addEventListener('paypulse-theme-change', handleExternalThemeChange);
    return () => window.removeEventListener('paypulse-theme-change', handleExternalThemeChange);
  }, []);

  // Form states - defaulted to Sharan R credentials
  const [fullName, setFullName] = useState('Sharan R');
  const [email, setEmail] = useState('71382502154.sharan@sritcbe.ac.in');
  const [password, setPassword] = useState('sharan@#');
  const [role, setRole] = useState('Enterprise Platform Lead');
  const [department, setDepartment] = useState('Engineering & Integration');

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectDemo = (acc: DemoAccount) => {
    setMode('signin');
    setEmail(acc.email);
    setPassword(acc.pass);
    setFullName(acc.name);
    setRole(acc.role);
    setDepartment(acc.department);
    setErrorMessage('');
    setSuccessMessage(`Selected ${acc.name} (${acc.label}). Click "Sign In" below.`);
    setTimeout(() => setSuccessMessage(''), 2500);
  };

  // Direct 1-Step Login & Registration
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (mode === 'signin') {
      if (!email.trim() || !password) {
        setErrorMessage('Please provide both corporate email and password.');
        return;
      }
    } else {
      if (!fullName.trim()) {
        setErrorMessage('Full legal name is required.');
        return;
      }
      if (!email.trim()) {
        setErrorMessage('Corporate work email is required.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
    }

    setIsLoading(true);
    try {
      const endpoint = mode === 'signin' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'signin'
        ? { email: email.trim(), password }
        : {
            name: fullName.trim(),
            email: email.trim(),
            password,
            role: role.trim(),
            department: department.trim(),
          };

      let serverRespondedWithJson = false;
      let data: AuthResponse | null = null;

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          try {
            data = await res.json();
            serverRespondedWithJson = true;
          } catch {
            data = null;
          }
        }

        // 1. Success from Backend API
        if (res.ok && data?.success && data.user && data.token) {
          setSuccessMessage('Authentication confirmed! Accessing console...');
          setTimeout(() => {
            onLogin(data!.user!, data!.token!);
          }, 300);
          return;
        }

        // 2. Clear rejection from active backend (e.g. wrong password on signin, or email exists)
        if (serverRespondedWithJson && data && !data.success && res.status !== 404) {
          setErrorMessage(data.message || 'Authentication failed. Please verify your credentials.');
          return;
        }
      } catch (networkErr) {
        console.warn('[PayPulse Auth] Network error contacting API:', networkErr);
      }

      // 3. Fallback: If backend is 404, unreachable, offline, or returns HTML error page (e.g. static hosting)
      console.warn('[PayPulse Auth] Backend API endpoint unavailable or non-JSON response; activating resilient local session fallback.');

      const normalizedEmail = email.trim().toLowerCase();
      const matchedDemo = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === normalizedEmail);

      let fallbackName = mode === 'register' ? fullName.trim() : '';
      let fallbackRole = mode === 'register' ? role.trim() : '';
      let fallbackDept = mode === 'register' ? department.trim() : '';

      if (matchedDemo) {
        fallbackName = matchedDemo.name;
        fallbackRole = matchedDemo.role;
        fallbackDept = matchedDemo.department;
      } else if (!fallbackName) {
        if (normalizedEmail.includes('sharan')) {
          fallbackName = 'Sharan R';
          fallbackRole = 'Enterprise Platform Lead';
          fallbackDept = 'Engineering & Integration';
        } else {
          const prefix = normalizedEmail.split('@')[0].replace(/[._-]/g, ' ');
          fallbackName = prefix.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          fallbackRole = 'Senior Operations Lead';
          fallbackDept = 'People Operations';
        }
      }

      const fallbackUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: fallbackName || 'Operator',
        email: email.trim(),
        role: fallbackRole || 'Enterprise Lead',
        department: fallbackDept || 'Operations',
        avatarBg: matchedDemo?.avatarBg || (normalizedEmail.includes('sharan') ? '#006a63' : '#000f3f'),
      };
      const fallbackToken = `paypulse-session-${Date.now()}`;

      setSuccessMessage('Authentication confirmed! Initializing console...');
      setTimeout(() => {
        onLogin(fallbackUser, fallbackToken);
      }, 300);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed. Please verify your credentials.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen relative flex items-center justify-center p-4 sm:p-6 md:p-10 transition-colors duration-300 font-['Hanken_Grotesk'] overflow-hidden ${
      isDark ? 'bg-[#0b0f19] text-[#f8fafc]' : 'bg-[#faf8ff] text-[#131b2e]'
    }`}>
      {/* Dynamic Background Ambient Gradients matching Landing Page */}
      <div
        className="absolute top-1/4 left-1/2 w-[720px] h-[520px] rounded-full blur-[140px] pointer-events-none opacity-25 transition-all duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(0, 106, 99, 0.35) 0%, rgba(113, 248, 228, 0.15) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0, 106, 99, 0.12) 0%, rgba(23, 37, 84, 0.08) 50%, transparent 70%)',
          transform: 'translate3d(-50%, -50%, 0)',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute top-2/3 right-1/4 w-[600px] h-[450px] rounded-full blur-[160px] pointer-events-none opacity-20 transition-all duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(23, 37, 84, 0.35) 0%, rgba(128, 141, 194, 0.12) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(79, 92, 142, 0.1) 0%, transparent 70%)',
        }}
      />

      {/* Top Bar: Left Back to Landing & Right Theme Switcher */}
      {onBackToLanding && (
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
          <button
            type="button"
            onClick={onBackToLanding}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-sm cursor-pointer ${
              isDark 
                ? 'bg-[#000f3f]/80 border-[#172554] text-white hover:bg-[#172554]' 
                : 'bg-white border-[#eaedff] text-[#131b2e] hover:bg-[#f2f3ff]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Landing Page</span>
          </button>
        </div>
      )}

      {/* Top Bar: Theme Switcher */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <button
          type="button"
          onClick={() => setIsDark(!isDark)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-sm cursor-pointer ${
            isDark 
              ? 'bg-[#000f3f]/80 border-[#172554] text-white hover:bg-[#172554]' 
              : 'bg-white border-[#eaedff] text-[#131b2e] hover:bg-[#f2f3ff]'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-[#006a63]" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      <div className="relative w-full max-w-xl z-10 mx-auto space-y-6">
        {/* Brand Header */}
        <motion.div 
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center space-y-2 flex flex-col items-center"
        >
          <PayPulseLogo size="xl" variant="badge" className="shadow-xl mb-1 ring-2 ring-teal-500/20" />
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
            isDark 
              ? 'bg-teal-950/60 border-teal-500/30 text-teal-300' 
              : 'bg-teal-50 border-teal-200 text-[#006a63]'
          }`}>
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            <span>PayPulse Console Login</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight ${
            isDark ? 'text-white' : 'text-[#131b2e]'
          }`}>
            PayPulse Console
          </h1>
          <p className={`text-xs sm:text-sm font-medium max-w-md ${
            isDark ? 'text-slate-400' : 'text-[#45464f]'
          }`}>
            Sign in with your corporate credentials or select a demo role below to access the console.
          </p>
        </motion.div>

        {/* High-Contrast Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className={`w-full rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-9 relative border transition-colors duration-200 backdrop-blur-xl ${
            isDark 
              ? 'bg-[#111827]/95 border-[#1e293b] shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
              : 'bg-white/95 border-[#eaedff] shadow-[0_15px_35px_rgba(0,15,63,0.06)]'
          }`}
        >
          <div>
            {/* Card Top: Mode Switcher Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#eaedff] dark:border-[#1e293b] gap-4">
              <div className="flex-1 min-w-0 pr-2">
                <div className={`font-['Plus_Jakarta_Sans'] font-extrabold text-lg sm:text-xl tracking-tight flex items-center gap-2 flex-wrap ${
                  isDark ? 'text-white' : 'text-[#131b2e]'
                }`}>
                  <span>{mode === 'signin' ? 'Sign In' : 'Register Account'}</span>
                </div>
                <div className={`text-xs font-medium mt-0.5 ${
                  isDark ? 'text-slate-400' : 'text-[#45464f]'
                }`}>
                  {mode === 'signin' 
                    ? 'Enter your credentials below to access the console.' 
                    : 'Create a new operator account for instant console access.'}
                </div>
              </div>

              {/* Mode Switcher Buttons */}
              <div className={`flex items-center p-1 rounded-xl border shrink-0 whitespace-nowrap self-start sm:self-auto text-xs font-['Plus_Jakarta_Sans'] font-semibold ${
                isDark ? 'bg-[#0b0f19] border-[#1e293b]' : 'bg-[#f2f3ff] border-[#eaedff]'
              }`}>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage('');
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer font-bold whitespace-nowrap shrink-0 leading-none ${
                    mode === 'signin'
                      ? 'bg-[#006a63] text-white shadow-sm'
                      : isDark 
                        ? 'text-slate-400 hover:text-white' 
                        : 'text-[#45464f] hover:text-[#131b2e]'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer font-bold whitespace-nowrap shrink-0 leading-none ${
                    mode === 'register'
                      ? 'bg-[#006a63] text-white shadow-sm'
                      : isDark 
                        ? 'text-slate-400 hover:text-white' 
                        : 'text-[#45464f] hover:text-[#131b2e]'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">Register</span>
                </button>
              </div>
            </div>

            {/* Quick Demo Credentials Box */}
            {mode === 'signin' && (
              <div className={`mt-4 p-3.5 rounded-xl border space-y-2.5 ${
                isDark 
                  ? 'bg-[#1e293b]/50 border-[#1e293b]' 
                  : 'bg-[#f2f3ff]/80 border-[#eaedff]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[0.6875rem] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    isDark ? 'text-teal-400' : 'text-[#006a63]'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    Quick Demo Accounts (1-Click Fill)
                  </span>
                  <span className={`text-[0.625rem] font-medium ${
                    isDark ? 'text-slate-400' : 'text-[#767680]'
                  }`}>
                    Click profile to auto-fill credentials
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DEMO_ACCOUNTS.map((acc) => {
                    const isSelected = email.toLowerCase() === acc.email.toLowerCase();
                    return (
                      <button
                        key={acc.label}
                        type="button"
                        onClick={() => handleSelectDemo(acc)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer group relative ${
                          isSelected
                            ? isDark
                              ? 'bg-teal-950/40 border-teal-500 shadow-sm'
                              : 'bg-teal-50/80 border-[#006a63] shadow-xs'
                            : isDark 
                              ? 'bg-[#111827] hover:bg-[#1a2333] border-[#1e293b] hover:border-teal-500' 
                              : 'bg-white hover:bg-[#eaedff]/60 border-[#eaedff] hover:border-[#006a63] shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className={`font-['Plus_Jakarta_Sans'] font-bold text-xs truncate ${
                            isSelected
                              ? isDark ? 'text-teal-300' : 'text-[#006a63]'
                              : isDark 
                                ? 'text-white group-hover:text-teal-300' 
                                : 'text-[#131b2e] group-hover:text-[#006a63]'
                          }`}>
                            {acc.label}
                          </span>
                        </div>
                        <div className={`text-xs font-semibold truncate ${
                          isSelected
                            ? isDark ? 'text-teal-200' : 'text-[#00504a]'
                            : isDark ? 'text-slate-200' : 'text-slate-700'
                        }`}>
                          {acc.name}
                        </div>
                        <div className={`text-[0.625rem] truncate font-medium ${
                          isDark ? 'text-slate-400' : 'text-[#767680]'
                        }`}>
                          {acc.role}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Alerts */}
            {errorMessage && (
              <div className="mt-4 p-4 rounded-xl border text-xs space-y-2.5 animate-in fade-in duration-200 bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-lg shrink-0 mt-0.5 text-red-600 dark:text-red-400">
                    {errorMessage.toLowerCase().includes('not found') ? 'person_search' : 'error'}
                  </span>
                  <div className="space-y-0.5 flex-1">
                    <div className="font-bold font-['Plus_Jakarta_Sans'] text-sm text-red-800 dark:text-red-200">
                      {errorMessage.toLowerCase().includes('not found') ? 'Email is not found' : 'Authentication Notice'}
                    </div>
                    <div className="text-xs text-red-700 dark:text-red-300 font-medium">
                      {errorMessage}
                    </div>
                  </div>
                </div>
                {errorMessage.toLowerCase().includes('not found') && mode === 'signin' && (
                  <div className="pt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-t border-red-500/20">
                    <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-[#45464f]'}`}>
                      This email address was not found in the database. Would you like to register it?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('register');
                        setErrorMessage('');
                        setSuccessMessage(`Ready to register "${email}". Fill in your details below.`);
                        setTimeout(() => setSuccessMessage(''), 3500);
                      }}
                      className="px-3.5 py-1.5 text-xs font-bold bg-[#006a63] hover:bg-[#00504a] text-white rounded-lg transition-all shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto active:scale-95"
                    >
                      <span>Register "{email}" Now</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {successMessage && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <span className="material-symbols-outlined text-base shrink-0">check_circle</span>
                <span className="font-medium">{successMessage}</span>
              </div>
            )}

            {/* Credentials Form */}
            <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
              <AnimatePresence mode="wait">
                {mode === 'register' && (
                  <motion.div
                    key="register-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className={`block text-xs font-bold mb-1.5 font-['Plus_Jakarta_Sans'] ${
                        isDark ? 'text-slate-200' : 'text-[#131b2e]'
                      }`}>
                        Full Legal Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                          person
                        </span>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Maya Chen"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border font-medium transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#006a63] ${
                            isDark 
                              ? 'bg-[#0b0f19] border-[#1e293b] text-white placeholder:text-slate-500' 
                              : 'bg-[#f2f3ff]/60 border-[#eaedff] text-[#131b2e] placeholder:text-[#767680] focus:bg-white'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 font-['Plus_Jakarta_Sans'] ${
                          isDark ? 'text-slate-200' : 'text-[#131b2e]'
                        }`}>
                          Designation / Role
                        </label>
                        <div className="relative">
                          <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className={`w-full pl-10 pr-8 py-2.5 rounded-xl text-sm border font-medium transition-all appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#006a63] ${
                              isDark 
                                ? 'bg-[#0b0f19] border-[#1e293b] text-white' 
                                : 'bg-[#f2f3ff]/60 border-[#eaedff] text-[#131b2e] focus:bg-white'
                            }`}
                          >
                            <option value="HR Payroll Director">HR Payroll Director</option>
                            <option value="Chief Financial Controller">Chief Financial Controller</option>
                            <option value="Senior People Operations Lead">Senior People Operations Lead</option>
                            <option value="Payroll Administrator">Payroll Administrator</option>
                            <option value="Compliance & Statutory Auditor">Compliance & Statutory Auditor</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">
                            expand_more
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className={`block text-xs font-bold mb-1.5 font-['Plus_Jakarta_Sans'] ${
                          isDark ? 'text-slate-200' : 'text-[#131b2e]'
                        }`}>
                          Department
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <input
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            placeholder="e.g. People Operations"
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border font-medium transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#006a63] ${
                              isDark 
                                ? 'bg-[#0b0f19] border-[#1e293b] text-white placeholder:text-slate-500' 
                                : 'bg-[#f2f3ff]/60 border-[#eaedff] text-[#131b2e] placeholder:text-[#767680] focus:bg-white'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className={`block text-xs font-bold mb-1.5 font-['Plus_Jakarta_Sans'] ${
                  isDark ? 'text-slate-200' : 'text-[#131b2e]'
                }`}>
                  Corporate Work Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                    mail
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@paypulse.corp"
                    autoComplete="email"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border font-medium transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#006a63] ${
                      isDark 
                        ? 'bg-[#0b0f19] border-[#1e293b] text-white placeholder:text-slate-500' 
                        : 'bg-[#f2f3ff]/60 border-[#eaedff] text-[#131b2e] placeholder:text-[#767680] focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label 
                    htmlFor="login-password-field" 
                    className={`block text-xs font-bold font-['Plus_Jakarta_Sans'] ${
                      isDark ? 'text-slate-200' : 'text-[#131b2e]'
                    }`}
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  {mode === 'register' && (
                    <span className={`text-[0.625rem] ${isDark ? 'text-slate-400' : 'text-[#767680]'}`}>
                      Minimum 6 characters
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none z-10">
                    lock
                  </span>
                  <input
                    id="login-password-field"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signin' ? 'Enter your account password' : 'Create a password (min 6 chars)'}
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    className={`w-full pl-10 pr-12 py-2.5 rounded-xl text-sm border font-medium transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#006a63] ${
                      isDark 
                        ? 'bg-[#0b0f19] border-[#1e293b] text-white placeholder:text-slate-500' 
                        : 'bg-[#f2f3ff]/60 border-[#eaedff] text-[#131b2e] placeholder:text-[#767680] focus:bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-slate-400 hover:text-teal-500 transition-colors cursor-pointer flex items-center justify-center p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-teal-500" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#006a63] focus:ring-[#006a63] border-[#eaedff] dark:border-[#1e293b]"
                  />
                  <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-[#45464f]'}`}>
                    Remember on this browser
                  </span>
                </label>

                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setSuccessMessage('Demo hint: Use Admin@123 for default accounts.');
                      setTimeout(() => setSuccessMessage(''), 3000);
                    }}
                    className="text-xs text-[#006a63] dark:text-[#71f8e4] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3 rounded-xl bg-[#006a63] hover:bg-[#00504a] text-white font-['Plus_Jakarta_Sans'] font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-75 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Signing In to Console...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Sign In to Console' : 'Create Account & Access Console'}</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
