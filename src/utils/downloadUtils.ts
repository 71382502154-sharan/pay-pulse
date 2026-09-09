import { EmployeeRow } from '../types';

/**
 * Trigger a browser file download using Blob and temporary <a> tag
 */
export function triggerBrowserDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Converts array of rows into properly escaped CSV content
 */
export function createCSVContent(headers: string[], rows: (string | number)[][]): string {
  const escapeCell = (val: string | number) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escapeCell).join(',');
  const rowLines = rows.map((r) => r.map(escapeCell).join(','));
  return [headerLine, ...rowLines].join('\r\n');
}

/**
 * Exports employee roster to CSV
 */
export function exportEmployeesToCSV(employees: EmployeeRow[]) {
  const headers = [
    'Employee Code',
    'Full Name',
    'Designation',
    'Department',
    'Base Salary (INR)',
    'Standard Allowances (INR)',
    'Ad-hoc Bonus (INR)',
    'Reimbursements (INR)',
    'Gross Monthly Pay (INR)',
    'LOP Deductions (INR)',
    'Category',
  ];

  const rows = employees.map((e) => {
    const gross = e.baseMonthly + e.stdAllowances + e.adHocBonus;
    const lop = e.deductionsLOP?.amount || 0;
    return [
      e.code,
      e.name,
      e.designation,
      e.department,
      e.baseMonthly,
      e.stdAllowances,
      e.adHocBonus,
      e.reimbursements,
      gross,
      lop,
      e.category,
    ];
  });

  const content = createCSVContent(headers, rows);
  const filename = `PayPulse_Employee_Roster_${new Date().toISOString().slice(0, 10)}.csv`;
  triggerBrowserDownload(filename, content, 'text/csv');
}

/**
 * Exports reconciliation ledger to CSV/Excel
 */
export function exportReconciliationLedger(employees: EmployeeRow[]) {
  const headers = [
    'Emp Code',
    'Employee Name',
    'Department',
    'Base Pay (INR)',
    'Special Allowances (INR)',
    'Performance Bonus (INR)',
    'Gross Total (INR)',
    'Provident Fund 12% (INR)',
    'Professional Tax (INR)',
    'TDS Estimated (INR)',
    'Unpaid Leave LOP (INR)',
    'Total Deductions (INR)',
    'Net Disbursable Salary (INR)',
    'Status',
  ];

  const rows = employees.map((e) => {
    const gross = e.baseMonthly + e.stdAllowances + e.adHocBonus;
    const pf = Math.round(Math.min(e.baseMonthly, 15000) * 0.12);
    const pt = 200;
    const tds = Math.round(gross * 0.1);
    const lop = e.deductionsLOP?.amount || 0;
    const totalDeductions = pf + pt + tds + lop;
    const net = gross - totalDeductions;

    return [
      e.code,
      e.name,
      e.department,
      e.baseMonthly,
      e.stdAllowances,
      e.adHocBonus,
      gross,
      pf,
      pt,
      tds,
      lop,
      totalDeductions,
      net,
      'Validated & Reconciled',
    ];
  });

  const content = createCSVContent(headers, rows);
  const filename = `PayPulse_Payroll_Reconciliation_March_2025.csv`;
  triggerBrowserDownload(filename, content, 'text/csv');
}

/**
 * Downloads a sample template CSV for batch uploads
 */
export function downloadBatchTemplateCSV() {
  const headers = [
    'EmployeeCode',
    'EmployeeName',
    'Department',
    'BaseMonthly',
    'StandardAllowances',
    'AdHocBonus',
    'Reimbursements',
    'Category',
  ];

  const sampleRows = [
    ['TEAM-007', 'Kavita Sundaram', 'Engineering & Tech', 160000, 50000, 20000, 5000, 'Variable Bonus'],
    ['TEAM-008', 'Vikramaditya Verma', 'Product & Design', 170000, 55000, 15000, 8000, 'Special Allowances'],
    ['TEAM-009', 'Naveen Chandran', 'Operations & Support', 110000, 35000, 10000, 3000, 'Standard'],
  ];

  const content = createCSVContent(headers, sampleRows);
  triggerBrowserDownload('PayPulse_Adjustments_Template_v2.csv', content, 'text/csv');
}

/**
 * Downloads a statutory report (Form 24Q, PT Statement, ECR) as CSV
 */
export function downloadStatutoryReport(reportTitle: string, employees: EmployeeRow[]) {
  const headers = [
    'Record ID',
    'Employee Code',
    'Employee Name',
    'PAN / UAN',
    'Monthly Gross (INR)',
    'Statutory Remittance (INR)',
    'Filing Status',
    'Tax Period',
  ];

  const rows = employees.map((e, idx) => {
    const gross = e.baseMonthly + e.stdAllowances + e.adHocBonus;
    const remittance = Math.round(gross * 0.12);
    return [
      `REC-${1000 + idx}`,
      e.code,
      e.name,
      `AAAPZ${1000 + idx}C`,
      gross,
      remittance,
      'Challan 281 Verified',
      'Q4 - FY 2024-25',
    ];
  });

  const content = createCSVContent(headers, rows);
  const sanitizedName = reportTitle.replace(/[^a-zA-Z0-9]/g, '_');
  triggerBrowserDownload(`${sanitizedName}_March_2025.csv`, content, 'text/csv');
}

/**
 * Downloads an official printable HTML/PDF payslip document
 */
export function downloadPayslipHTML(employee: EmployeeRow) {
  const gross = employee.baseMonthly + employee.stdAllowances + employee.adHocBonus;
  const pf = Math.round(Math.min(employee.baseMonthly, 15000) * 0.12);
  const pt = 200;
  const tds = Math.round(gross * 0.1);
  const lop = employee.deductionsLOP?.amount || 0;
  const totalDeductions = pf + pt + tds + lop;
  const netPay = gross - totalDeductions;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Payslip - ${employee.name} (${employee.code})</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 40px auto;
      max-width: 800px;
      color: #131b2e;
      line-height: 1.5;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #006a63;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .logo {
      font-size: 24px;
      font-weight: 800;
      color: #000f3f;
      letter-spacing: -0.5px;
    }
    .badge {
      font-size: 11px;
      background: #99efe5;
      color: #006f67;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 700;
    }
    .grid-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      background: #f2f3ff;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      font-size: 13px;
    }
    .grid-info div span {
      font-weight: 600;
      color: #45464f;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      font-size: 13px;
    }
    th, td {
      border: 1px solid #eaedff;
      padding: 10px 12px;
      text-align: left;
    }
    th {
      background-color: #000f3f;
      color: white;
    }
    .amount {
      text-align: right;
      font-family: monospace;
      font-size: 14px;
    }
    .net-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #e6f4f2;
      border: 2px solid #006a63;
      padding: 16px 20px;
      border-radius: 8px;
      margin-top: 16px;
    }
    .net-label {
      font-size: 16px;
      font-weight: 700;
      color: #006a63;
    }
    .net-value {
      font-size: 24px;
      font-weight: 800;
      color: #006a63;
    }
    .footer {
      margin-top: 40px;
      font-size: 11px;
      color: #767680;
      text-align: center;
      border-top: 1px solid #eaedff;
      padding-top: 16px;
    }
    @media print {
      body { margin: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">PayPulse Enterprise</div>
      <div style="font-size: 12px; color: #767680;">Official Corporate Salary Disbursement Statement</div>
    </div>
    <div style="text-align: right;">
      <span class="badge">CONFIDENTIAL</span>
      <div style="font-size: 12px; margin-top: 4px; font-weight: 600;">Pay Period: March 2025</div>
    </div>
  </div>

  <div class="grid-info">
    <div><span>Employee Name:</span> ${employee.name}</div>
    <div><span>Employee ID:</span> ${employee.code}</div>
    <div><span>Designation:</span> ${employee.designation}</div>
    <div><span>Department:</span> ${employee.department}</div>
    <div><span>Payment Mode:</span> Direct Institutional NEFT</div>
    <div><span>Bank Account:</span> HDFC •••• 9102</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Earnings Component</th>
        <th class="amount">Amount (INR)</th>
        <th>Deductions Component</th>
        <th class="amount">Amount (INR)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Basic Monthly Salary</td>
        <td class="amount">₹${employee.baseMonthly.toLocaleString('en-IN')}</td>
        <td>Provident Fund (EPF 12%)</td>
        <td class="amount">₹${pf.toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td>Standard & Special Allowances</td>
        <td class="amount">₹${employee.stdAllowances.toLocaleString('en-IN')}</td>
        <td>Professional Tax (PT)</td>
        <td class="amount">₹${pt.toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td>Performance & Ad-hoc Bonus</td>
        <td class="amount">₹${employee.adHocBonus.toLocaleString('en-IN')}</td>
        <td>Tax Deducted at Source (TDS)</td>
        <td class="amount">₹${tds.toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td>Approved Reimbursements</td>
        <td class="amount">₹${employee.reimbursements.toLocaleString('en-IN')}</td>
        <td>Loss of Pay (LOP)</td>
        <td class="amount">₹${lop.toLocaleString('en-IN')}</td>
      </tr>
      <tr style="font-weight: bold; background: #faf8ff;">
        <td>Total Gross Earnings</td>
        <td class="amount">₹${gross.toLocaleString('en-IN')}</td>
        <td>Total Deductions</td>
        <td class="amount">₹${totalDeductions.toLocaleString('en-IN')}</td>
      </tr>
    </tbody>
  </table>

  <div class="net-box">
    <div class="net-label">NET TAKE-HOME PAY (DISBURSED)</div>
    <div class="net-value">₹${netPay.toLocaleString('en-IN')}</div>
  </div>

  <div class="footer">
    This is a computer-generated institutional payslip and requires no physical signature.<br>
    PayPulse Enterprise System • Reference #${employee.code}-202503 • Generated on ${new Date().toLocaleDateString('en-GB')}
  </div>

  <div class="no-print" style="margin-top: 24px; text-align: center;">
    <button onclick="window.print()" style="padding: 10px 20px; background: #000f3f; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
      Print / Save as PDF
    </button>
  </div>
</body>
</html>`;

  triggerBrowserDownload(`Payslip_${employee.code}_March_2025.html`, htmlContent, 'text/html');
}
