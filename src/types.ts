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
  | 'naming-standardization'
  | 'notifications'
  | 'settings';

export interface EmployeeRow {
  id: string;
  code: string;
  name: string;
  initials: string;
  avatarBg?: string;
  designation: string;
  department: string;
  baseMonthly: number;
  stdAllowances: number;
  adHocBonus: number;
  reimbursements: number;
  deductionsLOP?: {
    amount: number;
    days?: number;
    reason: string;
  };
  flagged?: boolean;
  category: 'Special Allowances' | 'Reimbursements' | 'Variable Bonus' | 'Unpaid Leave (LOP)' | 'Standard';
  selected?: boolean;
  isNewJoiner?: boolean;
  joinDate?: string;
}

export interface ApprovalItem {
  id: string;
  employeeName: string;
  employeeCode: string;
  designation: string;
  initials: string;
  category: string;
  adjustment: number;
  submittedBy: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface MilestoneEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  dotColor: 'primary' | 'secondary' | 'surface-tint';
}

export interface NamingAliasItem {
  id: string;
  rawInput: string;
  suggestedStandard: string;
  department: string;
  confidence: number;
  matchReason: string;
  status: 'pending' | 'approved' | 'ignored';
}

export interface DiscrepancyEmployee {
  id: string;
  name: string;
  code: string;
  department: string;
  grossPay: number;
  loanEMI: number;
  tdsDeduction: number;
  netPay: number;
  resolutionOptions: string[];
  resolved: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  impact?: string;
  category: 'critical' | 'statutory' | 'fiduciary' | 'system';
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionType?: 'discrepancies' | 'naming' | 'approvals' | 'attendance' | 'payrun' | 'reports';
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  department?: string;
  avatarBg?: string;
}

