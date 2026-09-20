export interface EmployeeRecord {
  id: string;
  employeeName: string;
  designation: string;
  department: string;
  basicSalary: number;
  houseRentAllowance: number;
  bonusAmount: number;
  grossSalary: number;
  deductionAmount: number;
  netSalary: number;
  status: 'VERIFIED' | 'REVIEW_REQUIRED' | 'FLAGGED';
  avatarInitials: string;
}

export const SAMPLE_EMPLOYEE_RECORDS: EmployeeRecord[] = [
  {
    id: 'TEAM-001',
    employeeName: 'Sashmitha S M',
    designation: 'Project Lead & Manager',
    department: 'Project Management',
    basicSalary: 210000,
    houseRentAllowance: 75000,
    bonusAmount: 25000,
    grossSalary: 310000,
    deductionAmount: 29000,
    netSalary: 281000,
    status: 'VERIFIED',
    avatarInitials: 'SM',
  },
  {
    id: 'TEAM-002',
    employeeName: 'Sathana G',
    designation: 'Lead UI/UX & Frontend Designer',
    department: 'Design & Frontend',
    basicSalary: 130000,
    houseRentAllowance: 45000,
    bonusAmount: 15000,
    grossSalary: 190000,
    deductionAmount: 15000,
    netSalary: 175000,
    status: 'VERIFIED',
    avatarInitials: 'SG',
  },
  {
    id: 'TEAM-003',
    employeeName: 'Seashora R',
    designation: 'Senior Backend & Database Architect',
    department: 'Backend & Database',
    basicSalary: 145000,
    houseRentAllowance: 50000,
    bonusAmount: 18000,
    grossSalary: 213000,
    deductionAmount: 18000,
    netSalary: 195000,
    status: 'VERIFIED',
    avatarInitials: 'SR',
  },
  {
    id: 'TEAM-004',
    employeeName: 'Selvamanikandan S',
    designation: 'AI & Intelligence Specialist',
    department: 'AI & Intelligence',
    basicSalary: 155000,
    houseRentAllowance: 55000,
    bonusAmount: 20000,
    grossSalary: 230000,
    deductionAmount: 20000,
    netSalary: 210000,
    status: 'FLAGGED', // Anomaly demo: Unverified off-cycle bonus adjustment
    avatarInitials: 'SS',
  },
  {
    id: 'TEAM-005',
    employeeName: 'Sethu Raman V',
    designation: 'Full Stack & Systems Integration Engineer',
    department: 'Engineering & Integration',
    basicSalary: 150000,
    houseRentAllowance: 55000,
    bonusAmount: 16000,
    grossSalary: 221000,
    deductionAmount: 16000,
    netSalary: 205000,
    status: 'VERIFIED',
    avatarInitials: 'SV',
  },
  {
    id: 'TEAM-006',
    employeeName: 'Sharan R',
    designation: 'Principal Solutions Architect',
    department: 'Engineering & Architecture',
    basicSalary: 165000,
    houseRentAllowance: 60000,
    bonusAmount: 22000,
    grossSalary: 247000,
    deductionAmount: 22000,
    netSalary: 225000,
    status: 'VERIFIED',
    avatarInitials: 'SN',
  },
];

export const ANOMALY_CASE_DATA = {
  employeeId: 'TEAM-004',
  employeeName: 'Selvamanikandan S',
  department: 'AI & Intelligence',
  period: 'March 2025',
  previousSalary: 155000,
  currentSalary: 210000,
  deltaAmount: 55000,
  percentageChange: '+35.48%',
  historicalData: [
    { period: '2024 (Q1)', amount: 140000, label: 'Initial Baseline', isAnomaly: false },
    { period: '2024 (Q3)', amount: 148000, label: 'Annual Indexing', isAnomaly: false },
    { period: '2024 (Q4)', amount: 155000, label: 'Standard Cycle', isAnomaly: false },
    { period: '2025 (Q1)', amount: 155000, label: 'Normal Ledger', isAnomaly: false },
    { period: '2025 (March)', amount: 210000, label: 'Unlinked AI Bonus Spike', isAnomaly: true },
  ],
  systemAction: 'FLAGGED FOR HUMAN REVIEW',
  humanExplanation:
    'The anomaly detector identified a +35.48% compensation deviation without an associated Director sign-off attachment in the audit ledger. The payout is safely held in queue for 4-eye verification.',
};

export const SALARY_HISTORY_TIMELINE = [
  {
    year: '2024',
    effectiveDate: '15 Jan 2024',
    salary: 30000,
    revisionType: 'Initial Joining Baseline',
    approvedBy: 'HR Operations',
    status: 'RECORDED',
    notes: 'Contractual baseline established under Standard Software Engineer Band 2.',
  },
  {
    year: '2025',
    effectiveDate: '01 Apr 2025',
    salary: 35000,
    revisionType: 'Annual Performance Appraisal (+16.6%)',
    approvedBy: 'Engineering VP & HR Dir',
    status: 'VERIFIED & AUDITED',
    notes: 'Merit-based grade enhancement approved following H2 review rating 4.8/5.0.',
  },
  {
    year: '2026',
    effectiveDate: '01 Sep 2026',
    salary: 42000,
    revisionType: 'Senior Role Elevation (+20.0%)',
    approvedBy: 'Board Comp Committee',
    status: 'ACTIVE APPLIED',
    notes: 'Elevation to Senior Systems Specialist with expanded technical ownership.',
  },
];

export const APPROVAL_STAGES = [
  {
    step: 1,
    id: 'hr_review',
    title: 'HR Review',
    role: 'HR Operations Lead',
    time: 'Day 26 (09:00 AM)',
    description: 'Attendance verification, leave deduction cross-checks, and new joinee allowance validation.',
    status: 'APPROVED',
  },
  {
    step: 2,
    id: 'manager_review',
    title: 'Manager Review',
    role: 'Department Head',
    time: 'Day 27 (02:30 PM)',
    description: 'Overtime sign-offs, bonus allocations, and anomaly exception inspection.',
    status: 'APPROVED',
  },
  {
    step: 3,
    id: 'payroll_approval',
    title: 'Payroll Approval',
    role: 'Finance Controller',
    time: 'Day 28 (11:15 AM)',
    description: 'Statutory tax computations, bank batch generation, and dual-authorization verification.',
    status: 'IN_PROGRESS',
  },
  {
    step: 4,
    id: 'final_payroll',
    title: 'Final Payroll',
    role: 'Automated Disbursal Engine',
    time: 'Day 28 (05:00 PM)',
    description: 'Cryptographically signed direct bank NEFT/RTGS batch execution with real-time payslip distribution.',
    status: 'LOCKED',
  },
];

export const SYSTEM_KPIS = {
  totalEmployees: 1480,
  totalPayroll: '₹8,24,50,000',
  averageSalary: '₹55,709',
  accuracyRate: '99.98%',
  disbursalTimeAvg: '2.4 hrs',
  pendingApprovals: 3,
  resolvedAnomalies: 18,
  standardizedFields: 142,
};
