# CyberSathi AI

AI-powered cyber fraud detection and protection platform for Indian citizens. Detect scams, report frauds, generate complaints, and stay safe online.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool and dev server |
| **Tailwind CSS 3** | Styling (dark theme) |
| **React Router v7** | Client-side routing |
| **Lucide React** | Icons |
| **Clerk** (`@clerk/react`) | Authentication (login/signup/user management) |
| **Supabase Client** (`@supabase/supabase-js`) | Database access from frontend |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime |
| **Express 4** | REST API server |
| **TypeScript** | Type safety |
| **Supabase** (`@supabase/supabase-js`) | PostgreSQL database + real-time |
| **OpenRouter API** | LLM integration (Google Gemini 2.0 Flash) |
| **CORS** | Cross-origin requests |
| **dotenv** | Environment variables |
| **tsx** | TypeScript execution (dev) |
| **uuid** | Unique ID generation |

---

## Project Structure

```
project/
├── src/                          # Frontend (React)
│   ├── components/
│   │   ├── Layout.tsx            # App shell with Navbar + Footer
│   │   ├── Navbar.tsx            # Navigation bar
│   │   ├── Footer.tsx            # Footer
│   │   └── CyberFraudAnimation.tsx  # Hero section animation
│   ├── pages/
│   │   ├── Home.tsx              # Landing page
│   │   ├── Chatbot.tsx           # AI Chatbot (Gemini via OpenRouter)
│   │   ├── ScamDetector.tsx      # Multi-format scam detection + Report Fraud
│   │   ├── QRScanner.tsx         # QR code scanner & validator
│   │   ├── ComplaintGenerator.tsx # AI complaint letter generator
│   │   ├── LearningCenter.tsx    # Cyber safety quizzes & tips
│   │   ├── CyberScore.tsx        # Cyber safety score calculator
│   │   ├── Emergency.tsx         # Emergency contacts & helplines
│   │   ├── GovtPortals.tsx       # Government portal links
│   │   └── Login.tsx             # Login/Register page
│   ├── lib/                      # Utility functions
│   ├── App.tsx                   # Route definitions
│   ├── main.tsx                  # App entry point
│   └── index.css                 # Global styles
│
├── server/                       # Backend (Express)
│   └── src/
│       ├── index.ts              # Express server setup
│       ├── routes/
│       │   ├── chat.ts           # AI chat endpoint (OpenRouter/Gemini)
│       │   ├── fraudReports.ts   # CRUD for fraud reports
│       │   ├── complaints.ts     # Complaint storage
│       │   ├── chatHistory.ts    # Chat history persistence
│       │   └── scamAlerts.ts     # Scam alerts
│       ├── lib/
│       │   └── supabase.ts       # Supabase client init
│       └── middleware/
│           └── errorHandler.ts   # Global error handler
│
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Features

### 1. AI Chatbot (`/chatbot`)
- Multilingual chat (Hindi, English, Hinglish)
- Powered by Google Gemini 2.0 Flash via OpenRouter API
- Risk score extraction from AI responses
- Chat history saved to Supabase

### 2. AI Scam Detector (`/scam-detector`)
- **Scan Tab**: Analyze SMS, WhatsApp messages, emails, screenshots, QR codes, UPI IDs, phone numbers, websites
- **Report Tab**: 4-step fraud reporting wizard with AI-generated complaint
- Regex-based pattern detection for known scam keywords
- Risk score calculation (0-100) with severity levels

### 3. QR Scanner (`/qr-scanner`)
- Upload QR code images for analysis
- URL safety verification
- UPI ID validation
- Suspicious domain detection

### 4. Complaint Generator (`/complaint-generator`)
- AI-powered complaint letter generation
- Multiple complaint categories
- Export-ready format for cybercrime.gov.in

### 5. Learning Center (`/learning`)
- Cyber safety quizzes
- Daily tips and awareness content
- Real vs fake example comparisons

### 6. Cyber Safety Score (`/cyber-score`)
- Password strength check
- 2FA status evaluation
- Device security assessment
- Overall safety score (0-100)

### 7. Emergency Help (`/emergency`)
- One-tap call to 1930 (Cyber Crime Helpline)
- Police station locator info
- FIR filing guide

### 8. Government Portals (`/govt-portals`)
- Direct links to cybercrime.gov.in, CERT-In, RBI, SEBI
- State-wise cyber crime portal links

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Send messages to AI chatbot |
| `GET` | `/api/fraud-reports` | Fetch all fraud reports |
| `POST` | `/api/fraud-reports` | Submit a fraud report |
| `GET` | `/api/fraud-reports/:id` | Get specific fraud report |
| `GET` | `/api/complaints` | Fetch complaints |
| `POST` | `/api/complaints` | Submit a complaint |
| `GET` | `/api/chat-history` | Fetch chat history |
| `POST` | `/api/chat-history` | Save chat history |
| `GET` | `/api/scam-alerts` | Fetch scam alerts |
| `GET` | `/api/health` | Health check |

---

## Environment Variables

### Frontend (`.env`)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

### Backend (`server/.env`)
```
PORT=3001
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for database)
- OpenRouter API key (for AI chat)

### Install & Run

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..

# Start both frontend and backend
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

### Production Build

```bash
npm run build
npm run preview
```

---

## Database (Supabase)

Tables used:
- `fraud_reports` - Submitted fraud reports
- `complaints` - Generated complaints
- `chat_history` - User chat sessions
- `scam_alerts` - Active scam alerts

---

## Key Numbers

| Helpline | Purpose |
|---|---|
| **1930** | National Cyber Crime Helpline |
| **100** | Police Emergency |
| **1800-11-0031** | Women Helpline |

| Portal | URL |
|---|---|
| Cyber Crime Portal | cybercrime.gov.in |
| CERT-In | cert-in.org.in |
| RBI | rbi.org.in |

---

## License

Private project. All rights reserved.
