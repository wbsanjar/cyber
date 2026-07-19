<div align="center">

# CyberSathi AI

### AI-Powered Cyber Fraud Detection & Protection Platform

**Protecting Indian citizens from cyber fraud with artificial intelligence**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express)](https://expressjs.com)
[![Supabase](https://img.shields.io/badge/Supabase-2.57-3FCF8E?logo=supabase)](https://supabase.com)

---

</div>

## Overview

CyberSathi AI is a full-stack web application that helps Indian citizens detect, report, and protect themselves from cyber fraud. The platform combines AI-powered scam detection, multilingual chatbot assistance, community-driven fraud reporting, and government portal integration into a single unified dashboard.

### Key Highlights

- **AI Chatbot** - Multilingual assistant (Hindi, English, Hinglish) powered by Google Gemini 2.0 Flash
- **8 Detection Modules** - SMS, WhatsApp, Email, QR Code, UPI ID, Phone Number, Website, Screenshot analysis
- **One-Click Complaint** - Auto-generated formatted complaints for cybercrime.gov.in
- **Live Risk Scoring** - Real-time risk assessment with 0-100 score and severity levels
- **Community Database** - User-reported scammer Telegram usernames, UPI IDs, phone numbers
- **Emergency Integration** - One-tap call to 1930 Cyber Crime Helpline

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI framework |
| TypeScript | 5.5 | Type safety |
| Vite | 5.4 | Build tool and dev server |
| Tailwind CSS | 3.4 | Utility-first styling (dark theme) |
| React Router | 7.18 | Client-side routing |
| Lucide React | 0.344 | Icon library |
| Clerk | 6.12 | Authentication (login/signup/user management) |
| Supabase JS | 2.57 | Database access from frontend |
| Concurrently | 10.0 | Run frontend + backend together |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime environment |
| Express | 4.21 | REST API server |
| TypeScript | 5.5 | Type safety |
| Supabase JS | 2.57 | PostgreSQL database + real-time subscriptions |
| OpenRouter API | - | LLM gateway (Google Gemini 2.0 Flash model) |
| CORS | 2.8 | Cross-origin resource sharing |
| dotenv | 16.4 | Environment variable management |
| tsx | 4.19 | TypeScript execution (development) |
| uuid | 11.1 | Unique ID generation |

### External Services

| Service | Purpose |
|---|---|
| [Supabase](https://supabase.com) | PostgreSQL database, authentication, real-time |
| [OpenRouter](https://openrouter.ai) | AI model gateway (Gemini 2.0 Flash) |
| [Clerk](https://clerk.com) | User authentication and session management |

---

## Project Structure

```
project/
├── src/                                # Frontend (React + TypeScript)
│   ├── components/
│   │   ├── Layout.tsx                  # App shell with Navbar + Footer
│   │   ├── Navbar.tsx                  # Responsive navigation bar
│   │   ├── Footer.tsx                  # Footer with links & contacts
│   │   └── CyberFraudAnimation.tsx     # Hero section SVG animation
│   ├── pages/
│   │   ├── Home.tsx                    # Landing page with features & stats
│   │   ├── Chatbot.tsx                 # AI Chatbot interface
│   │   ├── ScamDetector.tsx            # Scam detection + Report Fraud (tabbed)
│   │   ├── QRScanner.tsx               # QR code scanner & validator
│   │   ├── ComplaintGenerator.tsx      # AI complaint letter generator
│   │   ├── LearningCenter.tsx          # Cyber safety quizzes & tips
│   │   ├── CyberScore.tsx              # Cyber safety score calculator
│   │   ├── Emergency.tsx               # Emergency contacts & helplines
│   │   ├── GovtPortals.tsx             # Government portal directory
│   │   └── Login.tsx                   # Login/Register page (Clerk)
│   ├── lib/                            # Utility functions
│   ├── App.tsx                         # Route definitions
│   ├── main.tsx                        # App entry point
│   └── index.css                       # Global styles & Tailwind imports
│
├── server/                             # Backend (Express + TypeScript)
│   └── src/
│       ├── index.ts                    # Express server setup & middleware
│       ├── routes/
│       │   ├── chat.ts                 # AI chat endpoint (OpenRouter/Gemini)
│       │   ├── fraudReports.ts         # CRUD for fraud reports (Supabase)
│       │   ├── complaints.ts           # Complaint storage & retrieval
│       │   ├── chatHistory.ts          # Chat history persistence
│       │   └── scamAlerts.ts           # Active scam alerts feed
│       ├── lib/
│       │   └── supabase.ts             # Supabase client initialization
│       └── middleware/
│           └── errorHandler.ts         # Global error handler
│
├── package.json                        # Frontend dependencies & scripts
├── tailwind.config.js                  # Tailwind theme (dark colors, animations)
├── tsconfig.json                       # TypeScript configuration
└── vite.config.ts                      # Vite build configuration
```

---

## Features (Detailed)

### 1. AI Chatbot (`/chatbot`)

Multilingual AI assistant for cyber fraud guidance.

- Conversations in **Hindi**, **English**, or **Hinglish**
- Powered by **Google Gemini 2.0 Flash** via OpenRouter API
- Automatic **risk score extraction** (0-100) from AI responses
- Smart suggestions based on conversation context
- Chat history persisted in Supabase
- Quick actions: Report fraud, Call 1930, Check scam link

### 2. AI Scam Detector + Report Fraud (`/scam-detector`)

Dual-tab interface for scam analysis and fraud reporting.

**Scan Tab:**
- 8 detector types: SMS, WhatsApp, Email, Screenshot, QR Code, UPI ID, Phone Number, Website
- File upload for screenshot analysis
- Regex-based pattern detection with 50+ scam keyword patterns
- Domain reputation checking (suspicious TLDs, brand impersonation)
- Real-time risk scoring with severity levels (Safe / Low / Medium / High / Critical)
- Detailed recommendations and immediate action steps

**Report Tab:**
- 4-step fraud reporting wizard
- Step 1: Select fraud type (UPI, WhatsApp, Facebook, Telegram, OLX, Instagram, Bank, KYC, Job, Lottery, Investment, Other)
- Step 2: Personal details (name, phone, email, amount lost, date)
- Step 3: Fraud details & evidence upload (description, fraudster info, file attachments)
- Step 4: AI-generated complaint with risk score, copy-to-clipboard, next steps

### 3. QR Scanner (`/qr-scanner`)

QR code safety analysis tool.

- Upload QR code images (PNG, JPG)
- URL extraction and safety verification
- UPI ID validation and suspicious pattern detection
- Known phishing domain database check

### 4. Complaint Generator (`/complaint-generator`)

AI-powered formal complaint letter generation.

- Multiple complaint categories
- Structured format matching cybercrime.gov.in requirements
- Auto-generated reference IDs
- Copy-to-clipboard and export functionality

### 5. Learning Center (`/learning`)

Interactive cyber safety education.

- Cyber safety quizzes with scoring
- Daily tips and awareness content
- Real vs fake example comparisons
- Scam type identification practice

### 6. Cyber Safety Score (`/cyber-score`)

Personal security assessment tool.

- Password strength evaluation
- Two-factor authentication (2FA) status check
- Device security assessment
- Overall safety score (0-100) with improvement suggestions

### 7. Emergency Help (`/emergency`)

Quick access to emergency services.

- One-tap call to **1930** (National Cyber Crime Helpline)
- Police emergency number (100)
- Police station locator information
- Step-by-step FIR filing guide

### 8. Government Portals (`/govt-portals`)

Centralized directory of official portals.

- cybercrime.gov.in - Report cyber crime online
- CERT-In - Indian Computer Emergency Response Team
- RBI - Reserve Bank of India
- SEBI - Securities and Exchange Board of India
- State-wise cyber crime portal links

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/chat` | Send messages to AI chatbot | No |
| `GET` | `/api/fraud-reports` | Fetch all fraud reports | No |
| `POST` | `/api/fraud-reports` | Submit a fraud report | No |
| `GET` | `/api/fraud-reports/:id` | Get specific fraud report | No |
| `GET` | `/api/complaints` | Fetch complaints | No |
| `POST` | `/api/complaints` | Submit a complaint | No |
| `GET` | `/api/chat-history` | Fetch chat history | No |
| `POST` | `/api/chat-history` | Save chat history | No |
| `GET` | `/api/scam-alerts` | Fetch active scam alerts | No |
| `GET` | `/api/health` | Server health check | No |

### Chat Endpoint Response Format

```json
{
  "content": "AI response text...",
  "riskScore": 75,
  "type": "warning",
  "suggestions": ["Report it", "Emergency 1930", "Ask another question"]
}
```

---

## Environment Variables

### Frontend (`.env`)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

### Backend (`server/.env`)

```env
PORT=3001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- [npm](https://www.npmjs.com/) or yarn
- [Supabase](https://supabase.com) account (free tier works)
- [OpenRouter](https://openrouter.ai) API key (for AI chat)

### Installation

```bash
# Clone the repository
git clone https://github.com/wbsanjar/cybersathi.git
cd cybersathi/project

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### Configuration

```bash
# Create frontend .env file
cp .env.example .env
# Edit .env with your Supabase and OpenRouter keys

# Create backend .env file
cp server/.env.example server/.env
# Edit server/.env with your keys
```

### Run Development Server

```bash
# Start both frontend and backend concurrently
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

### Production Build

```bash
# Build frontend
npm run build

# Preview production build
npm run preview

# Run backend in production
cd server && npm run build && npm start
```

---

## Database Schema (Supabase)

### Tables

| Table | Description |
|---|---|
| `fraud_reports` | User-submitted fraud reports with type, description, amount, evidence |
| `complaints` | Generated complaint letters with reference IDs |
| `chat_history` | Chatbot conversation history per user session |
| `scam-alerts` | Active scam alerts and warnings |

### fraud_reports Columns

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | TEXT | User identifier (or 'anonymous') |
| `fraud_type` | TEXT | Type of fraud (upi, whatsapp, etc.) |
| `description` | TEXT | Fraud description |
| `amount` | NUMBER | Amount lost in INR |
| `date` | TIMESTAMP | Date of fraud incident |
| `status` | TEXT | Report status (pending/resolved) |
| `risk_score` | NUMBER | AI-assigned risk score |
| `evidence` | JSONB | Attached evidence files |
| `created_at` | TIMESTAMP | Report creation time |

---

## Emergency Numbers

| Number | Service |
|---|---|
| **1930** | National Cyber Crime Helpline |
| **100** | Police Emergency |
| **1800-11-0031** | Women Helpline |
| **1091** | Women in Distress |

## Important Portals

| Portal | URL | Purpose |
|---|---|---|
| Cyber Crime Portal | cybercrime.gov.in | Report cyber crime online |
| CERT-In | cert-in.org.in | Indian Computer Emergency Response Team |
| RBI | rbi.org.in | Reserve Bank of India |
| SEBI | sebi.gov.in | Securities and Exchange Board of India |
| NPCI | npci.org.in | UPI fraud complaints |

---

## License

Private project. All rights reserved.

---

<div align="center">

**Built with care for Indian cyber safety**

Report bugs and feature requests at [GitHub Issues](https://github.com/wbsanjar/cybersathi/issues)

</div>
