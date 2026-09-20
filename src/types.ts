/**
 * ============================================================================
 * PAYPULSE ENTERPRISE — CORE DOMAIN TYPE DEFINITIONS
 * ============================================================================
 * Centralized TypeScript type definitions and interfaces for the PayPulse
 * payroll orchestration, compliance engine, and administrative console.
 * ============================================================================
 */

/* ========================================================================== */
/* 1. NAVIGATION & LAYOUT TYPES                                               */
/* ========================================================================== */

/**
 * Valid view tabs supported by the primary navigation sidebar.
 */
export type NavigationTab =
  | 'dashboard'
  | 'employees'
  | 'pay-runs'
  | 'approvals'
  | 'attendance'
  | 'salary-structure'
  | 'allowances-and-deductions'
  | 'reimbursements'
  | 'payslips'
  | 'reports'
  | 'notifications'
  | 'settings';

/* ========================================================================== */
/* 2. WORKFORCE & COMPENSATION DOMAIN                                         */
/* ========================================================================== */

/**
 * Loss of Pay (LOP) deduction breakdown for unpaid leave.
 */
export interface LopDeduction {
  /** Total monetary deduction in INR */
  amount: number;
  /** Number of unpaid leave days */
  days?: number;
  /** Statutory or operational justification */
  reason: string;
}

/**
 * Comprehensive employee record used across payroll calculation tables,
 * pay run rosters, and employee management views.
 */
export interface EmployeeRow {
  /** Unique employee identifier (e.g. 'emp-1') */
  id: string;
  /** Institutional employee code (e.g. 'TEAM-001') */
  code: string;
  /** Full employee name */
  name: string;
  /** Two-letter uppercase initials for avatar */
  initials: string;
  /** Background hex color for user avatar */
  avatarBg?: string;
  /** Job title / organizational designation */
  designation: string;
  /** Organizational department */
  department: string;
  /** Fixed monthly base wage in INR */
  baseMonthly: number;
  /** Standard recurring monthly allowances in INR */
  stdAllowances: number;
  /** Cycle-specific ad-hoc bonus in INR */
  adHocBonus: number;
  /** Approved expense reimbursements in INR */
  reimbursements: number;
  /** Loss of Pay deduction details, if applicable */
  deductionsLOP?: LopDeduction;
  /** Flag indicating reconciliation attention required */
  flagged?: boolean;
  /** Primary compensation classification category */
  category: 'Special Allowances' | 'Reimbursements' | 'Variable Bonus' | 'Unpaid Leave (LOP)' | 'Standard';
  /** UI selection state in batch tables */
  selected?: boolean;
  /** True if employee joined within the active pay cycle */
  isNewJoiner?: boolean;
  /** ISO date string or formatted joining date */
  joinDate?: string;
}

/* ========================================================================== */
/* 3. APPROVALS & AUDIT GOVERNANCE                                            */
/* ========================================================================== */

/**
 * Discretionary adjustment or bonus request requiring executive review.
 */
export interface ApprovalItem {
  /** Unique approval item ID */
  id: string;
  /** Target employee full name */
  employeeName: string;
  /** Target employee code */
  employeeCode: string;
  /** Target employee designation */
  designation: string;
  /** Two-letter uppercase initials */
  initials: string;
  /** Category of proposed adjustment (e.g. 'Leadership Incentive') */
  category: string;
  /** Monetary delta to be applied in INR */
  adjustment: number;
  /** Department or supervisor submitting the request */
  submittedBy: string;
  /** Approval workflow status */
  status: 'pending' | 'approved' | 'rejected';
}

/**
 * Cryptographically-anchored audit milestone logged during pay runs.
 */
export interface MilestoneEvent {
  /** Unique milestone ID */
  id: string;
  /** Event headline */
  title: string;
  /** Detailed audit description */
  description: string;
  /** Human-readable timestamp */
  timestamp: string;
  /** Visual indicator style token */
  dotColor: 'primary' | 'secondary' | 'surface-tint';
}

/* ========================================================================== */
/* 4. DISCREPANCY RECONCILIATION                                              */
/* ========================================================================== */

/**
 * An employee record flagged by the rule engine for negative net pay or
 * conflicting statutory withholding thresholds.
 */
export interface DiscrepancyEmployee {
  /** Target employee ID */
  id: string;
  /** Employee full name */
  name: string;
  /** Employee organizational code */
  code: string;
  /** Department */
  department: string;
  /** Calculated gross compensation in INR */
  grossPay: number;
  /** Company loan EMI recovery in INR */
  loanEMI: number;
  /** Tax Deducted at Source (TDS) in INR */
  tdsDeduction: number;
  /** Resulting net pay (negative value represents discrepancy) */
  netPay: number;
  /** Pre-approved statutory resolution pathways */
  resolutionOptions: string[];
  /** Whether the discrepancy has been formally resolved */
  resolved: boolean;
}

/* ========================================================================== */
/* 5. NOTIFICATIONS & ALERTS                                                  */
/* ========================================================================== */

/**
 * System alert or action notification dispatched to console operators.
 */
export interface NotificationItem {
  /** Unique notification ID */
  id: string;
  /** Alert headline */
  title: string;
  /** Informational description */
  description: string;
  /** Business or fiduciary impact summary */
  impact?: string;
  /** Urgency / classification category */
  category: 'critical' | 'statutory' | 'fiduciary' | 'system';
  /** Human-readable dispatch time */
  timestamp: string;
  /** Read/acknowledged state */
  read: boolean;
  /** Call-to-action button text */
  actionLabel?: string;
  /** Target workflow to navigate upon clicking CTA */
  actionType?: 'discrepancies' | 'approvals' | 'attendance' | 'payrun' | 'reports';
}

/* ========================================================================== */
/* 6. USER PROFILES & AUTHENTICATION                                          */
/* ========================================================================== */

/**
 * Active authenticated session profile stored in browser context.
 */
export interface UserProfile {
  /** Unique user ID */
  id?: string;
  /** Operator display name */
  name: string;
  /** Corporate work email */
  email: string;
  /** Role designation */
  role: string;
  /** Assigned department */
  department?: string;
  /** Avatar background hex color */
  avatarBg?: string;
  /** Stateless JWT session token */
  token?: string;
}

/**
 * Persistent user account record saved in the backend JSON database.
 */
export interface UserRecord {
  /** Unique user ID */
  id: string;
  /** Primary corporate email address */
  email: string;
  /** Salted bcrypt hash of account password */
  passwordHash: string;
  /** Operator legal name */
  name: string;
  /** Designated administrative role */
  role: string;
  /** Department */
  department: string;
  /** Avatar background hex color */
  avatarBg?: string;
  /** ISO timestamp of account creation */
  createdAt: string;
}

/**
 * Standard API response payload returned by authentication endpoints.
 */
export interface AuthResponse {
  /** Request success indicator */
  success: boolean;
  /** User-facing message or error reason */
  message?: string;
  /** Issued session token */
  token?: string;
  /** Authenticated user profile */
  user?: UserProfile;
}
