import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import { UserProfile } from '../types';
import { getInitials } from '../utils/userUtils';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
}

const PRESET_ACCOUNTS: UserProfile[] = [
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@paypulse.corp',
    role: 'HR Payroll Director',
    department: 'People Operations',
    avatarBg: '#006a63',
  },
  {
    name: 'Alexander Chen',
    email: 'alex.chen@paypulse.corp',
    role: 'Chief Financial Controller',
    department: 'Corporate Finance',
    avatarBg: '#172554',
  },
  {
    name: 'Nithis S.',
    email: 'nithis@paypulse.corp',
    role: 'Payroll Administrator',
    department: 'Enterprise Operations',
    avatarBg: '#000f3f',
  },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('HR Payroll Director');
  const [department, setDepartment] = useState('People Operations');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name to proceed.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      onLogin({
        name: fullName.trim(),
        email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}@paypulse.corp`,
        role: role.trim() || 'Payroll Specialist',
        department: department.trim() || 'Operations',
      });
      setIsLoading(false);
    }, 450);
  };

  const handleSelectPreset = (preset: UserProfile) => {
    setFullName(preset.name);
    setEmail(preset.email);
    setRole(preset.role);
    setDepartment(preset.department || 'Operations');
    setPassword('PayPulse@2025');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#000f3f] relative flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-hidden font-['Hanken_Grotesk'] text-[#131b2e]">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#006a63]/25 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#172554] rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#99efe5]/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Grid line pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative w-full max-w-5xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Brand Narrative & Key Capabilities */}
        <motion.div 
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 text-white space-y-6 hidden lg:block pr-4"
        >
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#172554]/80 border border-[#808dc2]/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#71f8e4] animate-pulse"></span>
            <span className="text-xs font-semibold tracking-wide text-[#71f8e4] uppercase font-['Plus_Jakarta_Sans']">
              Enterprise Release v2.4
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl xl:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight leading-tight text-white">
              PayPulse <span className="text-[#71f8e4]">Enterprise</span>
            </h1>
            <p className="text-sm text-[#808dc2] leading-relaxed">
              Unified compensation structuring, statutory escrow oversight, and intelligence-driven biometric reconciliation console.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
              <span className="material-symbols-outlined text-[#71f8e4] text-xl shrink-0 mt-0.5">verified_user</span>
              <div>
                <h4 className="text-xs font-bold font-['Plus_Jakarta_Sans'] text-white">Automated Statutory Governance</h4>
                <p className="text-[0.6875rem] text-[#808dc2]">Instant EPFO ECR, Section 192 TDS Form 24Q, and state PT challan compliance generation.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
              <span className="material-symbols-outlined text-[#71f8e4] text-xl shrink-0 mt-0.5">account_balance</span>
              <div>
                <h4 className="text-xs font-bold font-['Plus_Jakarta_Sans'] text-white">Direct Escrow Disbursement</h4>
                <p className="text-[0.6875rem] text-[#808dc2]">256-bit encrypted bank direct-deposit batches with negative net pay locks.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
              <span className="material-symbols-outlined text-[#71f8e4] text-xl shrink-0 mt-0.5">psychology</span>
              <div>
                <h4 className="text-xs font-bold font-['Plus_Jakarta_Sans'] text-white">Rule Engine Anomaly Intelligence</h4>
                <p className="text-[0.6875rem] text-[#808dc2]">Real-time detection of naming discrepancies, unapproved absences, and LOP variances.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#eaedff] p-6 sm:p-8 md:p-10 relative overflow-hidden"
        >
          {/* Top Logo Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-[#eaedff]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#000f3f] text-[#71f8e4] flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
              </div>
              <div>
                <div className="font-['Plus_Jakarta_Sans'] font-extrabold text-lg text-[#000f3f] tracking-tight flex items-center gap-1.5">
                  PayPulse <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#eaedff] text-[#006a63]">Secure Portal</span>
                </div>
                <div className="text-xs text-[#45464f]">Identity &amp; Role-Based Access Control</div>
              </div>
            </div>

            {fullName.trim() && (
              <div className="flex items-center gap-2 bg-[#f2f3ff] px-3 py-1.5 rounded-full border border-[#eaedff]">
                <div className="w-6 h-6 rounded-full bg-[#000f3f] text-[#71f8e4] flex items-center justify-center font-bold text-[0.6875rem]">
                  {getInitials(fullName)}
                </div>
                <span className="text-xs font-semibold text-[#131b2e] truncate max-w-[100px]">
                  {fullName}
                </span>
              </div>
            )}
          </div>

          {/* Quick 1-Click Presets */}
          <div className="my-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[0.6875rem] uppercase font-bold tracking-wider text-[#45464f]">
                Quick 1-Click Profile Presets
              </span>
              <span className="text-[0.6875rem] text-[#006a63] font-medium">Auto-populates credentials</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESET_ACCOUNTS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-left p-2.5 rounded-xl border transition-all flex items-center gap-2.5 ${
                    fullName === preset.name
                      ? 'bg-[#f2f3ff] border-[#006a63] ring-1 ring-[#006a63]'
                      : 'bg-[#faf8ff] border-[#eaedff] hover:bg-[#f2f3ff] hover:border-[#808dc2]/40'
                  }`}
                >
                  <div 
                    className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0"
                    style={{ backgroundColor: preset.avatarBg || '#000f3f' }}
                  >
                    {getInitials(preset.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#131b2e] truncate">{preset.name}</div>
                    <div className="text-[0.625rem] text-[#45464f] truncate">{preset.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-[#eaedff]"></div>
            <span className="flex-shrink mx-4 text-[0.6875rem] text-[#767680] uppercase tracking-wider font-semibold">
              Or Enter Your Credentials
            </span>
            <div className="flex-grow border-t border-[#eaedff]"></div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-[#ffdad6]/60 border border-[#ba1a1a]/30 text-[#ba1a1a] text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#131b2e] mb-1.5 font-['Plus_Jakarta_Sans']">
                Your Full Name <span className="text-[#ba1a1a]">*</span>
                <span className="font-normal text-[#45464f] ml-1.5 text-[0.6875rem]">(This will display in your profile header)</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#767680] text-lg">
                  person
                </span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Sarah Jenkins, Priya Sharma, or your name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f2f3ff] text-sm text-[#131b2e] placeholder:text-[#767680] border border-[#eaedff] focus:border-[#006a63] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006a63]/20 transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1.5 font-['Plus_Jakarta_Sans']">
                  Work Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#767680] text-lg">
                    mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@enterprise.corp"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f2f3ff] text-sm text-[#131b2e] placeholder:text-[#767680] border border-[#eaedff] focus:border-[#006a63] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006a63]/20 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1.5 font-['Plus_Jakarta_Sans']">
                  Designation / Role
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#767680] text-lg">
                    badge
                  </span>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#f2f3ff] text-sm text-[#131b2e] border border-[#eaedff] focus:border-[#006a63] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006a63]/20 transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="HR Payroll Director">HR Payroll Director</option>
                    <option value="Chief Financial Controller">Chief Financial Controller</option>
                    <option value="Payroll Administrator">Payroll Administrator</option>
                    <option value="Senior People Operations Lead">Senior People Operations Lead</option>
                    <option value="Compliance &amp; Statutory Auditor">Compliance &amp; Statutory Auditor</option>
                    <option value="Executive Director">Executive Director</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#767680] pointer-events-none text-base">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="login-password-field" 
                  className="block text-xs font-bold text-[#131b2e] font-['Plus_Jakarta_Sans']"
                >
                  Access Security PIN / Password
                </label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword((prev) => !prev);
                  }}
                  className="text-[0.6875rem] text-[#006a63] font-semibold hover:underline cursor-pointer flex items-center gap-1 focus:outline-none"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#767680] text-lg pointer-events-none">
                  lock
                </span>
                <input
                  id="login-password-field"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security PIN or password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-[#f2f3ff] text-sm text-[#131b2e] placeholder:text-[#767680] border border-[#eaedff] focus:border-[#006a63] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006a63]/20 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword((prev) => !prev);
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-2 text-[#767680] hover:text-[#131b2e] hover:bg-[#eaedff] rounded-lg transition-all cursor-pointer flex items-center justify-center focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-[#006a63]" />
                  ) : (
                    <Eye className="w-4 h-4 text-[#767680]" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#006a63] focus:ring-[#006a63] border-[#eaedff]"
                />
                <span className="text-xs text-[#45464f]">Remember profile on this workstation</span>
              </label>

              <button
                type="button"
                onClick={() => handleSelectPreset(PRESET_ACCOUNTS[0])}
                className="text-xs text-[#006a63] font-semibold hover:underline"
              >
                Use Demo Login
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-[#000f3f] hover:bg-[#172554] text-white font-['Plus_Jakarta_Sans'] font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-75 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Authenticating Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Payroll Console</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-[#eaedff] flex items-center justify-between text-[0.6875rem] text-[#767680]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#006a63]">lock</span>
              <span>256-bit TLS Encrypted Session</span>
            </div>
            <span>Corporate Single Sign-On (SSO) Active</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
