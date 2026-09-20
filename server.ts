/**
 * ============================================================================
 * PAYPULSE ENTERPRISE — UNIFIED REST API SERVER
 * ============================================================================
 * Express backend engine managing data persistence (`data/db.json`), JWT
 * session authentication, workforce CRUD, approvals workflow, discrepancy
 * resolution, and zero-drift pay run disbursement executions.
 * ============================================================================
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import {
  INITIAL_EMPLOYEES,
  INITIAL_APPROVALS,
  INITIAL_MILESTONES,
  INITIAL_DISCREPANCIES,
} from './src/data/payrollData';
import {
  EmployeeRow,
  ApprovalItem,
  MilestoneEvent,
  DiscrepancyEmployee,
  UserRecord,
} from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'paypulse-enterprise-super-secret-key-2025';

/* ========================================================================== */
/* 1. MIDDLEWARE & PERSISTENCE ENGINE                                         */
/* ========================================================================== */

app.use(cors());
app.use(express.json());

// Persistent File Store Location
const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

interface DatabaseSchema {
  users: UserRecord[];
  employees: EmployeeRow[];
  approvals: ApprovalItem[];
  milestones: MilestoneEvent[];
  discrepancies: DiscrepancyEmployee[];
}

function getSeedUsers(): UserRecord[] {
  return [
    {
      id: 'usr-admin-1',
      email: 'admin@paypulse.corp',
      passwordHash: bcrypt.hashSync('Admin@123', 10),
      name: 'Sashmitha S M',
      role: 'HR Payroll Director',
      department: 'People Operations',
      avatarBg: '#000f3f',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-finance-1',
      email: 'finance@paypulse.corp',
      passwordHash: bcrypt.hashSync('Finance@123', 10),
      name: 'Seashora R',
      role: 'Chief Financial Controller',
      department: 'Finance & Accounts',
      avatarBg: '#006a63',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-audit-1',
      email: 'audit@paypulse.corp',
      passwordHash: bcrypt.hashSync('Audit@123', 10),
      name: 'Sathana G',
      role: 'Compliance & Statutory Auditor',
      department: 'Internal Audit',
      avatarBg: '#1e3a8a',
      createdAt: new Date().toISOString(),
    },
  ];
}

// Initial DB state
let db: DatabaseSchema = {
  users: getSeedUsers(),
  employees: [...INITIAL_EMPLOYEES],
  approvals: [...INITIAL_APPROVALS],
  milestones: [...INITIAL_MILESTONES],
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
        users: (parsed.users && parsed.users.length > 0) ? parsed.users : getSeedUsers(),
        employees: parsed.employees || [...INITIAL_EMPLOYEES],
        approvals: parsed.approvals || [...INITIAL_APPROVALS],
        milestones: parsed.milestones || [...INITIAL_MILESTONES],
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

// Auth Middleware
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. Missing token.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedRequest['user'];
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired session token.' });
  }
}

// ==========================================
// AUTHENTICATION & EMAIL OTP API
// ==========================================

// In-memory 6-digit OTP Cache
interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
  pendingUser?: {
    name: string;
    role: string;
    department: string;
    passwordHash: string;
  };
}

const otpStore = new Map<string, OtpRecord>();

// Dynamic Nodemailer Transporter
function getMailTransporter() {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!user || !pass) {
    return null;
  }

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

// Endpoint: Send 6-Digit Email Verification Code (OTP)
app.post('/api/auth/send-otp', async (req: Request, res: Response) => {
  const { email, password, mode = 'signin', name, role, department } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, message: 'Corporate work email is required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (mode === 'register') {
    if (!name || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required for registration.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }
    const existing = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }
  } else {
    // Mode is signin
    const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      return res.status(404).json({
        success: false,
        code: 'EMAIL_NOT_FOUND',
        message: 'Email is not found in the database. Please verify your email address or register.',
      });
    }
    if (password) {
      const isValid = bcrypt.compareSync(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Invalid password for this account.' });
      }
    }
  }

  // Generate 6-digit OTP code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  const pendingUser = mode === 'register' && password ? {
    name: name.trim(),
    role: role?.trim() || 'Payroll Specialist',
    department: department?.trim() || 'Operations',
    passwordHash: bcrypt.hashSync(password, 10),
  } : undefined;

  otpStore.set(normalizedEmail, {
    code,
    expiresAt,
    attempts: 0,
    pendingUser,
  });

  // Attempt real email dispatch via SMTP/Nodemailer if configured
  let realEmailDelivered = false;
  let mailNotice = '';
  const transporter = getMailTransporter();

  if (transporter) {
    try {
      const sender = process.env.EMAIL_FROM || `"PayPulse Security" <${process.env.SMTP_USER}>`;
      await transporter.sendMail({
        from: sender,
        to: normalizedEmail,
        subject: `${code} is your PayPulse Verification Code`,
        text: `Your PayPulse verification code is: ${code}. It expires in 10 minutes.`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 28px; background-color: #ffffff; border: 1px solid #eaedff; border-radius: 20px; box-shadow: 0 4px 20px rgba(0, 15, 63, 0.05);">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
              <div style="font-size: 20px; font-weight: 800; color: #000f3f; letter-spacing: -0.5px;">PayPulse <span style="font-size: 11px; background: #eaedff; color: #006a63; padding: 3px 8px; border-radius: 6px; margin-left: 8px;">Security PIN</span></div>
            </div>
            <h2 style="font-size: 18px; color: #131b2e; margin: 0 0 10px 0; font-weight: 700;">Authorize Your Payroll Console Access</h2>
            <p style="font-size: 14px; color: #45464f; line-height: 1.5; margin: 0 0 24px 0;">Use the single-use 6-digit confirmation PIN below to complete your authentication. This security verification protects payroll disbursement operations.</p>
            <div style="background-color: #f2f3ff; border: 1px solid #eaedff; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 24px;">
              <div style="font-size: 11px; font-weight: 700; color: #767680; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Your 6-Digit Verification PIN</div>
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #006a63;">${code}</div>
            </div>
            <p style="font-size: 12px; color: #767680; line-height: 1.4; margin: 0 0 16px 0;">⏳ Valid for <strong>10 minutes</strong>. Never share this PIN with anyone.</p>
            <hr style="border: none; border-top: 1px solid #eaedff; margin: 20px 0;" />
            <p style="font-size: 11px; color: #94a3b8; margin: 0;">Automated message from PayPulse Identity Service &middot; If you didn't initiate this, report to your corporate IT security team.</p>
          </div>
        `,
      });
      realEmailDelivered = true;
      mailNotice = `Real verification email delivered to ${normalizedEmail}`;
      console.log(`[PayPulse Mailer] ✅ Real email successfully sent to: ${normalizedEmail}`);
    } catch (mailErr) {
      console.error(`[PayPulse Mailer] ⚠️ Error sending real email via SMTP:`, mailErr);
      mailNotice = 'SMTP mail error. Fallback test code provided below.';
    }
  } else {
    console.log(`[PayPulse Mailer] ℹ️ SMTP not configured in .env; running in local dev simulation mode.`);
  }

  console.log(`\n======================================================`);
  console.log(`[PayPulse Auth] 📧 6-DIGIT EMAIL VERIFICATION CODE`);
  console.log(`Recipient: ${normalizedEmail}`);
  console.log(`Code:      👉 ${code} 👈`);
  console.log(`Delivered: ${realEmailDelivered ? 'YES (Real Email Sent)' : 'NO (Dev Simulation)'}`);
  console.log(`Expires:   10 minutes`);
  console.log(`======================================================\n`);

  res.json({
    success: true,
    message: realEmailDelivered
      ? `A real verification code has been dispatched to your inbox at ${normalizedEmail}`
      : `A 6-digit verification code has been generated for ${normalizedEmail}`,
    email: normalizedEmail,
    realEmailDelivered,
    devCode: code, // Kept so local testing is never blocked even if SMTP is offline
  });
});

// Endpoint: Verify 6-Digit Email OTP and Grant Console Access
app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and 6-digit verification code are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const record = otpStore.get(normalizedEmail);

  if (!record) {
    return res.status(400).json({ success: false, message: 'No active verification code found. Please request a new code.' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedEmail);
    return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new code.' });
  }

  if (record.code !== otp.trim()) {
    record.attempts += 1;
    if (record.attempts >= 5) {
      otpStore.delete(normalizedEmail);
      return res.status(400).json({ success: false, message: 'Too many incorrect attempts. Please request a new code.' });
    }
    return res.status(400).json({
      success: false,
      message: `Invalid verification code. (${5 - record.attempts} attempts remaining)`,
    });
  }

  // Code verified! Clear OTP
  otpStore.delete(normalizedEmail);

  // If registering a new user
  let user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user && record.pendingUser) {
    const newUser: UserRecord = {
      id: `usr-${Date.now()}`,
      email: normalizedEmail,
      passwordHash: record.pendingUser.passwordHash,
      name: record.pendingUser.name,
      role: record.pendingUser.role,
      department: record.pendingUser.department,
      avatarBg: '#006a63',
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    saveDatabase();
    user = newUser;
  }

  if (!user) {
    return res.status(404).json({ success: false, message: 'User record not found.' });
  }

  // Issue 24-hour JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    message: 'Email successfully verified. Console access granted.',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatarBg: user.avatarBg,
    },
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, role, department } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newUser: UserRecord = {
    id: `usr-${Date.now()}`,
    email: normalizedEmail,
    passwordHash,
    name: name.trim(),
    role: role?.trim() || 'Payroll Specialist',
    department: department?.trim() || 'Operations',
    avatarBg: '#006a63',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDatabase();

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(201).json({
    success: true,
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      avatarBg: newUser.avatarBg,
    },
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatarBg: user.avatarBg,
    },
  });
});

app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = db.users.find((u) => u.id === req.user?.id || u.email.toLowerCase() === req.user?.email.toLowerCase());

  if (!user) {
    return res.status(404).json({ success: false, message: 'User session not found.' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatarBg: user.avatarBg,
    },
  });
});

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'PayPulse Unified API',
    timestamp: new Date().toISOString(),
    employeeCount: db.employees.length,
    userCount: db.users.length,
  });
});

// GET: All Initial Payroll State in a single fast call
app.get('/api/payroll/all', (_req: Request, res: Response) => {
  loadDatabase();
  const { users, ...publicDb } = db;
  res.json({
    success: true,
    data: publicDb,
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

/* ========================================================================== */
/* 8. STATIC FRONTEND SERVING (UNIFIED PRODUCTION DEPLOYMENT)                 */
/* ========================================================================== */

const DIST_DIR = path.join(__dirname, 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req: Request, res: Response) => {
    // Avoid intercepting API routes that fall through
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ success: false, message: 'API route not found' });
    }
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
  console.log(`[PayPulse Server] Serving production frontend from ${DIST_DIR}`);
}

/* ========================================================================== */
/* 9. SERVER BOOTSTRAP                                                        */
/* ========================================================================== */

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[PayPulse API Server] Running on http://localhost:${PORT}`);
  console.log(`[PayPulse API Server] Loaded ${db.employees.length} team members with file persistence.`);
});
