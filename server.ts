import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  INITIAL_EMPLOYEES,
  INITIAL_APPROVALS,
  INITIAL_MILESTONES,
  INITIAL_NAMING_ITEMS,
  INITIAL_DISCREPANCIES,
} from './src/data/payrollData';
import {
  EmployeeRow,
  ApprovalItem,
  MilestoneEvent,
  NamingAliasItem,
  DiscrepancyEmployee,
} from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Persistent File Store Location
const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

interface DatabaseSchema {
  employees: EmployeeRow[];
  approvals: ApprovalItem[];
  milestones: MilestoneEvent[];
  namingAliases: NamingAliasItem[];
  discrepancies: DiscrepancyEmployee[];
}

// Initial DB state
let db: DatabaseSchema = {
  employees: [...INITIAL_EMPLOYEES],
  approvals: [...INITIAL_APPROVALS],
  milestones: [...INITIAL_MILESTONES],
  namingAliases: [...INITIAL_NAMING_ITEMS],
  discrepancies: [...INITIAL_DISCREPANCIES],
};

// Load persistent data if exists, otherwise create it
function loadDatabase() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      db = {
        employees: parsed.employees || [...INITIAL_EMPLOYEES],
        approvals: parsed.approvals || [...INITIAL_APPROVALS],
        milestones: parsed.milestones || [...INITIAL_MILESTONES],
        namingAliases: parsed.namingAliases || [...INITIAL_NAMING_ITEMS],
        discrepancies: parsed.discrepancies || [...INITIAL_DISCREPANCIES],
      };
      console.log(`[PayPulse API] Loaded persistent data from ${DB_FILE}`);
    } else {
      saveDatabase();
      console.log(`[PayPulse API] Initialized persistent database at ${DB_FILE}`);
    }
  } catch (err) {
    console.error('[PayPulse API] Error loading database, using memory fallback:', err);
  }
}

function saveDatabase() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('[PayPulse API] Error saving database:', err);
  }
}

// Initialize DB
loadDatabase();

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'PayPulse Enterprise Unified API',
    timestamp: new Date().toISOString(),
    employeeCount: db.employees.length,
  });
});

// GET: All Initial Payroll State in a single fast call
app.get('/api/payroll/all', (_req: Request, res: Response) => {
  loadDatabase();
  res.json({
    success: true,
    data: db,
  });
});

// ==========================================
// EMPLOYEES API
// ==========================================
app.get('/api/employees', (_req: Request, res: Response) => {
  loadDatabase();
  res.json({ success: true, data: db.employees });
});

app.post('/api/employees', (req: Request, res: Response) => {
  const newEmp: EmployeeRow = {
    id: req.body.id || `emp-${Date.now()}`,
    code: req.body.code || `TEAM-00${db.employees.length + 1}`,
    name: req.body.name,
    initials: req.body.initials || (req.body.name ? req.body.name.substring(0, 2).toUpperCase() : 'EM'),
    designation: req.body.designation || 'Specialist',
    department: req.body.department || 'Engineering',
    baseMonthly: Number(req.body.baseMonthly) || 150000,
    stdAllowances: Number(req.body.stdAllowances) || 45000,
    adHocBonus: Number(req.body.adHocBonus) || 0,
    reimbursements: Number(req.body.reimbursements) || 0,
    category: req.body.category || 'Standard',
    selected: false,
    isNewJoiner: true,
  };
  db.employees.unshift(newEmp);
  saveDatabase();
  res.status(201).json({ success: true, data: newEmp });
});

app.patch('/api/employees/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.employees.findIndex((e) => e.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Employee not found' });
  }

  db.employees[index] = {
    ...db.employees[index],
    ...req.body,
  };

  saveDatabase();
  res.json({ success: true, data: db.employees[index] });
});

// ==========================================
// DISCREPANCIES API
// ==========================================
app.get('/api/discrepancies', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.discrepancies });
});

app.post('/api/discrepancies/:id/resolve', (req: Request, res: Response) => {
  const { id } = req.params;
  const { selectedOption } = req.body;
  const index = db.discrepancies.findIndex((d) => d.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Discrepancy record not found' });
  }

  db.discrepancies[index] = {
    ...db.discrepancies[index],
    resolved: true,
  };

  // Log a milestone for the resolution
  db.milestones.unshift({
    id: `m-${Date.now()}`,
    title: `Discrepancy Resolved: ${db.discrepancies[index].name}`,
    description: `Resolution applied: "${selectedOption || 'Rule Override Approved'}"`,
    timestamp: 'Just now',
    dotColor: 'secondary',
  });

  saveDatabase();
  res.json({ success: true, data: db.discrepancies[index] });
});

// ==========================================
// APPROVALS API
// ==========================================
app.get('/api/approvals', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.approvals });
});

app.post('/api/approvals/:id/action', (req: Request, res: Response) => {
  const { id } = req.params;
  const { action } = req.body;
  const index = db.approvals.findIndex((a) => a.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Approval item not found' });
  }

  db.approvals[index] = {
    ...db.approvals[index],
    status: action === 'rejected' ? 'rejected' : 'approved',
  };

  saveDatabase();
  res.json({ success: true, data: db.approvals[index] });
});

app.post('/api/approvals/batch-approve', (_req: Request, res: Response) => {
  db.approvals = db.approvals.map((a) => ({ ...a, status: 'approved' }));
  saveDatabase();
  res.json({ success: true, count: db.approvals.length, data: db.approvals });
});

// ==========================================
// NAMING ALIASES API
// ==========================================
app.get('/api/naming-aliases', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.namingAliases });
});

app.post('/api/naming-aliases/:id/action', (req: Request, res: Response) => {
  const { id } = req.params;
  const { action } = req.body;
  const index = db.namingAliases.findIndex((n) => n.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Alias item not found' });
  }

  db.namingAliases[index] = {
    ...db.namingAliases[index],
    status: action === 'ignored' ? 'ignored' : 'approved',
  };

  saveDatabase();
  res.json({ success: true, data: db.namingAliases[index] });
});

app.post('/api/naming-aliases/batch-accept', (_req: Request, res: Response) => {
  db.namingAliases = db.namingAliases.map((n) => ({ ...n, status: 'approved' }));
  saveDatabase();
  res.json({ success: true, count: db.namingAliases.length, data: db.namingAliases });
});

// ==========================================
// MILESTONES API
// ==========================================
app.get('/api/milestones', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.milestones });
});

// ==========================================
// PAY RUN EXECUTION API
// ==========================================
app.post('/api/payrun/execute', (req: Request, res: Response) => {
  const totalGross = db.employees.reduce((sum, e) => sum + e.baseMonthly + e.stdAllowances + e.adHocBonus, 0);
  const totalDeductions = db.employees.reduce((sum, e) => sum + (e.deductionsLOP?.amount || 0), 0);
  const netDisbursement = totalGross - totalDeductions;

  const cycleId = `CYCLE-${new Date().getFullYear()}-${new Date().getMonth() + 1}`;

  db.milestones.unshift({
    id: `m-${Date.now()}`,
    title: `Payroll Cycle ${cycleId} Executed`,
    description: `Disbursed ₹${netDisbursement.toLocaleString('en-IN')} across ${db.employees.length} team members.`,
    timestamp: 'Just now',
    dotColor: 'primary',
  });

  saveDatabase();

  res.json({
    success: true,
    message: 'Payroll execution batch successfully queued and locked.',
    cycleId,
    metrics: {
      teamSize: db.employees.length,
      grossTotal: totalGross,
      totalDeductions,
      netDisbursement,
    },
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[PayPulse API Server] Running on http://localhost:${PORT}`);
  console.log(`[PayPulse API Server] Loaded ${db.employees.length} team members with file persistence.`);
});
