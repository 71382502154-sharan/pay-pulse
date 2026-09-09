# PayPulse Enterprise 💼⚡

> **Enterprise Corporate Payroll Management, Compensation Structuring, and Compliance Oversight Console**

PayPulse Enterprise is a modern, responsive web application designed for enterprise HR and finance teams to execute payroll runs, manage employee compensation structures, handle multi-tier approvals, and enforce regulatory compliance with AI-powered anomaly detection and validation.

---

## ✨ Key Features

- 📊 **Executive Dashboard**: Real-time payroll metrics, upcoming cycle trackers, department distributions, and compliance health scoring.
- ⚙️ **Pay Run Execution**: Streamlined payroll processing engine with automated rule checking, discrepancy detection, and execution logs.
- 👥 **Employee Directory**: Comprehensive employee records, salary tier management, allowance configurations, and CSV/batch imports.
- 📑 **Payslip Generation**: Detailed itemized payslips with breakdown of basic pay, allowances, tax deductions, and EPF/statutory contributions.
- 🛡️ **Compliance & Rule Engine**: Automated validation checks, naming standardizations, discrepancy flagging, and audit trail logging.
- ✍️ **Approvals Workflow**: Multi-level authorization workflows for off-cycle adjustments, bonus requests, and final sign-offs.
- 🤖 **Gemini AI Integration**: Server-side AI assistance for payroll analytics, discrepancy resolution, and intelligent reporting.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons & Animation**: [Lucide React](https://lucide.dev/), [Motion](https://motion.dev/)
- **AI & Backend**: [@google/genai](https://www.npmjs.com/package/@google/genai), Express

---

## 📋 Prerequisites

Before running the application, ensure you have the following installed on your machine:

- **Node.js** (v18.0 or higher recommended)
- **npm** (comes bundled with Node.js) or **yarn** / **pnpm**

Check your versions:
```bash
node -v
npm -v
```

---

## 🚀 Quick Start & Local Setup

Follow these steps to get PayPulse Enterprise running locally:

### 1. Install Dependencies
In the root directory of the project, run:
```bash
npm install
```

### 2. Configure Environment Variables
Create a local environment configuration file:

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env.local
```

**macOS / Linux:**
```bash
cp .env.example .env.local
```

Open `.env.local` and configure the required keys:
```env
# Required for Gemini AI features
GEMINI_API_KEY="your-gemini-api-key-here"

# Application URL (defaults to http://localhost:3000 locally)
APP_URL="http://localhost:3000"
```

*(You can get a Gemini API key at [Google AI Studio](https://aistudio.google.com/app/apikey).)*

### 3. Start the Development Server
```bash
npm run dev
```

### 4. Open in Your Browser
Once the dev server is running, navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local development server at `http://localhost:3000` |
| `npm run build` | Compiles TypeScript and builds the production bundle into `/dist` |
| `npm run preview` | Locally previews the production build |
| `npm run lint` | Runs TypeScript compiler checks (`tsc --noEmit`) |
| `npm run clean` | Cleans up the `dist` folder and build artifacts |

---

## 📂 Project Structure

```text
├── public/                # Static assets (favicons, logos)
├── src/
│   ├── components/        # React components & UI views
│   │   ├── DashboardView.tsx           # Main overview dashboard
│   │   ├── PayRunExecutionView.tsx     # Payroll processing workflows
│   │   ├── EmployeesView.tsx           # Employee management
│   │   ├── PayslipsView.tsx            # Payslip generation & viewing
│   │   ├── ApprovalsView.tsx           # Multi-level approval console
│   │   ├── AuxiliaryViews.tsx          # Settings & secondary views
│   │   ├── Header.tsx                  # App navigation header
│   │   ├── Sidebar.tsx                 # Navigation sidebar
│   │   └── ...Modals                   # Creation, batch upload, & rule modals
│   ├── data/              # Mock databases & initial state records
│   ├── types.ts           # TypeScript interfaces & domain data models
│   ├── App.tsx            # Main application layout & router
│   ├── main.tsx           # React entry point
│   └── index.css          # Design system & Tailwind styling
├── index.html             # HTML entry file & Google Fonts
├── package.json           # Project dependencies and npm scripts
├── tsconfig.json          # TypeScript compiler options
├── vite.config.ts         # Vite build and server configuration
└── .env.example           # Sample environment variables
```

---

## ☁️ Deployment

This project can be containerized or hosted on modern cloud platforms (such as Google Cloud Run, Vercel, or Netlify).

