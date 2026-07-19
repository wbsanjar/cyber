import React, { useState, useCallback } from 'react';
import {
  TrendingUp,
  Shield,
  Search,
  AlertTriangle,
  Phone,
  Copy,
  ExternalLink,
  MessageSquare,
  Flag,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe,
  Smartphone,
  CreditCard,
  Users,
  Clock,
  Send,
  FileText,
  Loader,
  Eye,
  Ban,
  Info,
  ArrowRight,
  ChevronDown,
  Plus,
  X,
  Zap,
  Lock,
  BarChart3,
  Mail,
  DollarSign,
  TrendingDown,
  Activity,
  Check,
  BanIcon,
} from 'lucide-react';

// ============ TYPES ============
interface ScamPattern {
  id: string;
  name: string;
  regex: RegExp;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  weight: number;
}

interface PatternMatch {
  pattern: ScamPattern;
  matchedText: string;
}

interface RiskScore {
  score: number;
  level: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  color: string;
  label: string;
}

interface ScamPlatform {
  name: string;
  category: string;
  status: 'confirmed_scam' | 'suspicious' | 'under_review' | 'unverified';
  reports: number;
  details: string;
}

interface CommunityEntry {
  id: string;
  type: 'telegram' | 'upi' | 'phone' | 'website';
  value: string;
  reports: number;
  status: 'confirmed_scam' | 'suspicious' | 'under_review';
  lastReported: string;
  description: string;
}

interface ChecklistQuestion {
  id: number;
  question: string;
  weight: number;
  category: string;
  answer: 'yes' | 'no' | null;
}

interface ReportForm {
  name: string;
  phone: string;
  amountLost: string;
  description: string;
  scammerTelegram: string;
  scammerUpi: string;
  scammerPhone: string;
}

// ============ CONSTANTS ============
const SCAM_PATTERNS: ScamPattern[] = [
  {
    id: 'guaranteed_returns',
    name: 'Guaranteed Returns Promise',
    regex: /guaranteed?\s*(returns?|profit|income|earnings?)|100%?\s*(profit|return|guarantee)|fixed\s*(returns?|income)/gi,
    severity: 'critical',
    description: 'Promises guaranteed financial returns',
    weight: 25,
  },
  {
    id: 'double_money',
    name: 'Double Money Claim',
    regex: /double\s*(your|money|investment)|2x\s*(returns?|money|profit)|twice\s*(your|the)\s*(money|investment)/gi,
    severity: 'critical',
    description: 'Claims you can double your money',
    weight: 30,
  },
  {
    id: 'unrealistic_multiplier',
    name: 'Unrealistic Multiplier Returns',
    regex: /(\d+)x\s*(returns?|profit|money|investment)|(\d+)\s*times\s*(returns?|profit|money)|10x|20x|50x|100x/gi,
    severity: 'critical',
    description: 'Promises unrealistic multiplied returns',
    weight: 30,
  },
  {
    id: 'urgency_pressure',
    name: 'Urgency/Pressure Tactics',
    regex: /last\s*chance|hurry|limited\s*time|don'?t\s*miss|act\s*now|only\s*(\d+)\s*seats?|slots?\s*left|expire|urgently|within\s*(\d+)\s*(hour|minute|day)/gi,
    severity: 'high',
    description: 'Creates artificial urgency to pressure victims',
    weight: 20,
  },
  {
    id: 'pay_to_withdraw',
    name: 'Pay-to-Withdraw Scam',
    regex: /pay\s*(to|for)\s*(withdraw|release|unlock)|withdrawal\s*fee|processing\s*fee\s*(to|for)|tax\s*(to|for)\s*withdraw|pay\s*(tax|fee)\s*first/gi,
    severity: 'critical',
    description: 'Asks for payment before allowing withdrawals',
    weight: 30,
  },
  {
    id: 'vip_insider',
    name: 'VIP/Insider Group Pitch',
    regex: /vip\s*(group|channel|member|club)|insider\s*(group|tip|info)|premium\s*(group|member)|exclusive\s*(group|access|tip)/gi,
    severity: 'high',
    description: 'Promotes exclusive VIP or insider trading groups',
    weight: 20,
  },
  {
    id: 'platform_migration',
    name: 'Platform Migration Pressure',
    regex: /migrat(e|ion)\s*to|shift\s*to\s*(new\s*)?(platform|app)|new\s*platform|upgrade\s*(to|your)\s*(account|platform)|transfer\s*to\s*new/gi,
    severity: 'high',
    description: 'Pressures you to move to a different platform',
    weight: 20,
  },
  {
    id: 'high_minimum',
    name: 'High Minimum Investment',
    regex: /minimum\s*(investment|deposit|amount)\s*(?:of\s*)?(\$|₹|usd|inr|btc|eth)?\s*(\d{3,})|invest\s*(?:at\s*least\s*)?(\$|₹|usd|inr)?\s*(\d{3,})|deposit\s*(?:at\s*least\s*)?(\$|₹|usd|inr)?\s*(\d{3,})/gi,
    severity: 'medium',
    description: 'Requires high minimum investment amounts',
    weight: 15,
  },
  {
    id: 'no_risk',
    name: 'No Risk Claim',
    regex: /no\s*risk|risk[\s-]*free|zero\s*risk|without\s*risk|100%?\s*safe|completely\s*safe|no\s*chance\s*of\s*(loss|losing)/gi,
    severity: 'critical',
    description: 'Claims there is no risk involved',
    weight: 25,
  },
  {
    id: 'daily_income',
    name: 'Daily Income Promise',
    regex: /daily\s*(income|profit|return|earning|payment)|earn\s*(₹|\$|usd|inr|btc|eth)?\s*\d+[\s-]*daily|every\s*day\s*(income|profit|earning)/gi,
    severity: 'high',
    description: 'Promises guaranteed daily income',
    weight: 20,
  },
  {
    id: 'referral_mlm',
    name: 'Referral/MLM Structure',
    regex: /referr(al|s?\s*and\s*earn)|bring\s*(people|friends?|members?)|team\s*build|mlm|multi[\s-]*level|chain\s*system|pyramid|downline|upline/gi,
    severity: 'high',
    description: 'Uses referral or MLM recruitment structure',
    weight: 20,
  },
  {
    id: 'withdrawal_issues',
    name: 'Withdrawal Issues',
    regex: /can'?t\s*withdraw|unable\s*to\s*withdraw|withdrawal\s*(failed|pending|delayed|problem|issue)|money\s*(stuck|trapped)|not\s*getting\s*(money|payment)/gi,
    severity: 'critical',
    description: 'Reports of withdrawal problems',
    weight: 25,
  },
  {
    id: 'crypto_pitch',
    name: 'Crypto Investment Pitch',
    regex: /invest\s*in\s*(crypto|bitcoin|btc|ethereum|eth|usdt|coin)|crypto\s*(invest|trading|profit)|buy\s*(crypto|bitcoin|btc)|crypto\s*mining\s*(invest|return)/gi,
    severity: 'medium',
    description: 'Promotes crypto investment schemes',
    weight: 15,
  },
  {
    id: 'binary_options',
    name: 'Binary Options Platform',
    regex: /binary\s*(options?|trading)|option\s*trading|trade\s*options|binomo|olymp\s*trade|iq\s*option|quotex/gi,
    severity: 'high',
    description: 'References binary options trading platforms',
    weight: 20,
  },
  {
    id: 'forex_pitch',
    name: 'Forex Trading Pitch',
    regex: /forex\s*(trading|invest|profit|signals?)|currency\s*trading|fx\s*(trading|signals?|invest)|trade\s*forex|forex\s*masters?/gi,
    severity: 'medium',
    description: 'Promotes forex trading schemes',
    weight: 15,
  },
  {
    id: 'regulatory_name_drop',
    name: 'Regulatory Name Drop',
    regex: /sebi\s*(registered?|approved|certified)|rbi\s*(approved|registered)|irdai\s*(registered?|approved)|rbi\s*govt\s*approved/gi,
    severity: 'low',
    description: 'Drops regulatory names without verification',
    weight: 5,
  },
];

const KNOWN_SCAM_PLATFORMS: ScamPlatform[] = [
  { name: 'Exotic Trade', category: 'Binary Options', status: 'confirmed_scam', reports: 1247, details: 'Fake binary options platform with manipulated charts' },
  { name: 'FrostFX', category: 'Forex', status: 'confirmed_scam', reports: 892, details: 'Unregulated forex broker blocking withdrawals' },
  { name: 'TradeBucks', category: 'Crypto', status: 'confirmed_scam', reports: 2103, details: 'Crypto investment scam with fake dashboard' },
  { name: 'WinTrade Pro', category: 'Binary Options', status: 'confirmed_scam', reports: 567, details: 'Binary options scam with pay-to-withdraw scheme' },
  { name: 'CryptoMax Profit', category: 'Crypto', status: 'confirmed_scam', reports: 1890, details: 'Fake crypto mining and trading platform' },
  { name: 'StockVision AI', category: 'Stock Trading', status: 'unverified', reports: 234, details: 'Unverified AI stock trading platform - verify before investing' },
  { name: 'QuickReturns', category: 'Forex', status: 'confirmed_scam', reports: 3401, details: 'High-return forex scam with MLM referral system' },
  { name: 'ProFX Signals', category: 'Forex Signals', status: 'suspicious', reports: 456, details: 'Suspicious forex signal service with paid reviews' },
  { name: 'DailyCash earn', category: 'MLM', status: 'confirmed_scam', reports: 2780, details: 'MLM/pyramid scheme disguised as earning platform' },
  { name: 'NeoTrade Hub', category: 'Binary Options', status: 'suspicious', reports: 189, details: 'Newer platform with suspicious marketing tactics' },
];

const INITIAL_COMMUNITY_ENTRIES: CommunityEntry[] = [
  { id: '1', type: 'telegram', value: '@forex_master_pro', reports: 45, status: 'confirmed_scam', lastReported: '2 hours ago', description: 'Promises 50x returns on forex trading' },
  { id: '2', type: 'upi', value: 'quickcash@paytm', reports: 23, status: 'confirmed_scam', lastReported: '5 hours ago', description: 'Collects money via UPI and blocks users' },
  { id: '3', type: 'phone', value: '+91 98765 43210', reports: 67, status: 'confirmed_scam', lastReported: '1 hour ago', description: 'Cold calls promising guaranteed stock tips' },
  { id: '4', type: 'telegram', value: '@crypto_signals_official', reports: 34, status: 'suspicious', lastReported: '12 hours ago', description: 'Charges upfront fee for crypto signals' },
  { id: '5', type: 'website', value: 'investprofit24.com', reports: 89, status: 'confirmed_scam', lastReported: '30 minutes ago', description: 'Fake investment platform with cloned website' },
  { id: '6', type: 'upi', value: 'tradepro@ybl', reports: 12, status: 'suspicious', lastReported: '1 day ago', description: 'Collects payments for unregistered trading course' },
  { id: '7', type: 'phone', value: '+91 87654 32109', reports: 41, status: 'confirmed_scam', lastReported: '3 hours ago', description: 'Impersonates SEBI official demanding fees' },
  { id: '8', type: 'telegram', value: '@binance_earn_group', reports: 56, status: 'confirmed_scam', lastReported: '45 minutes ago', description: 'Fake Binance earning group with referral scheme' },
];

const CHECKLIST_QUESTIONS: Omit<ChecklistQuestion, 'answer'>[] = [
  { id: 1, question: 'Is the company SEBI/RBI/IRDAI registered?', weight: 30, category: 'Registration' },
  { id: 2, question: 'Can you verify the registration on official government websites?', weight: 20, category: 'Registration' },
  { id: 3, question: 'Are the promised returns realistic? Above 15% annually is suspicious', weight: 25, category: 'Returns' },
  { id: 4, question: 'Is there a genuine physical office you can visit?', weight: 10, category: 'Legitimacy' },
  { id: 5, question: 'Are they asking for money to "unlock" or "release" your profits?', weight: 30, category: 'Red Flags' },
  { id: 6, question: 'Is there pressure to invest quickly or miss out?', weight: 20, category: 'Red Flags' },
  { id: 7, question: 'Can you withdraw your money easily without extra payments?', weight: 25, category: 'Red Flags' },
  { id: 8, question: 'Is the communication primarily through Telegram/WhatsApp groups?', weight: 15, category: 'Red Flags' },
  { id: 9, question: 'Do they guarantee returns or claim "no risk"?', weight: 30, category: 'Red Flags' },
  { id: 10, question: 'Is there a referral/MLM structure to earn more?', weight: 20, category: 'Red Flags' },
  { id: 11, question: 'Can you find genuine reviews not paid/fake?', weight: 15, category: 'Reputation' },
  { id: 12, question: 'Is the company listed on stock exchanges or private/unknown?', weight: 10, category: 'Reputation' },
];

const SAMPLE_MESSAGES = [
  {
    label: 'Investment Scam',
    text: `URGENT! Join our VIP Investment Group NOW! 🔥\n\nWe guarantee 10x returns on your investment in just 30 days! Our AI-powered trading system has NEVER had a loss.\n\n✅ 100% Risk-Free\n✅ Daily profits deposited to your account\n✅ Double your money in 2 weeks\n\nMinimum investment: ₹5,000\n\nOnly 5 slots left! This is your LAST CHANCE to become financially free.\n\nClick here to join immediately before we close registration!\n\nBring 3 friends and earn ₹1,000 bonus for each referral!`,
  },
  {
    label: 'Lottery Scam',
    text: `Congratulations! You have won ₹25,00,000 in the WhatsApp Lottery 2024! 🎉\n\nYour mobile number was randomly selected as our Grand Prize Winner!\n\nTo claim your prize, you need to pay a small processing fee of ₹2,500 and a tax of ₹5,000.\n\nPlease send the amount to UPI: lotteryclaim@paytm\n\nThis offer expires in 24 hours! Act now or lose your prize forever!\n\nNote: This is a verified government lottery. SEBI registered.`,
  },
  {
    label: 'Safe Message',
    text: `Hi, wanted to check if you're interested in our new mutual fund scheme. It's SEBI registered and you can verify all details on the AMFI website.\n\nWe offer diversified equity funds with historically 12-15% annual returns (not guaranteed).\n\nYou can start with ₹500 monthly SIP. No pressure - take your time to research and decide.\n\nHappy to answer any questions or schedule a meeting at our office.`,
  },
];

// ============ UTILITY FUNCTIONS ============
function analyzeMessage(text: string): PatternMatch[] {
  const matches: PatternMatch[] = [];
  for (const pattern of SCAM_PATTERNS) {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    const found = text.match(regex);
    if (found) {
      matches.push({ pattern, matchedText: found[0] });
    }
  }
  return matches;
}

function calculateRiskScore(matches: PatternMatch[]): RiskScore {
  let score = 0;
  const maxScore = 100;
  for (const match of matches) {
    score += match.pattern.weight;
  }
  const normalizedScore = Math.min(Math.round((score / 200) * 100), maxScore);

  if (normalizedScore >= 80) return { score: normalizedScore, level: 'critical', color: 'bg-red-500', label: 'Critical Scam Detected' };
  if (normalizedScore >= 60) return { score: normalizedScore, level: 'high', color: 'bg-red-400', label: 'High Scam Risk' };
  if (normalizedScore >= 35) return { score: normalizedScore, level: 'medium', color: 'bg-amber-500', label: 'Medium Risk' };
  if (normalizedScore >= 15) return { score: normalizedScore, level: 'low', color: 'bg-amber-400', label: 'Low Risk' };
  return { score: normalizedScore, level: 'safe', color: 'bg-green-500', label: 'Safe' };
}

function generateComplaintRef(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CCR-${dateStr}-${random}`;
}

// ============ COMPONENT ============
export default function InvestmentShield() {
  const [activeTab, setActiveTab] = useState(0);
  const [messageText, setMessageText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<PatternMatch[]>([]);
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const [platformSearch, setPlatformSearch] = useState('');
  const [platformResult, setPlatformResult] = useState<ScamPlatform | null | undefined>(undefined);

  const [communitySearch, setCommunitySearch] = useState('');
  const [communityFilter, setCommunityFilter] = useState<string>('All');
  const [communityEntries, setCommunityEntries] = useState<CommunityEntry[]>(INITIAL_COMMUNITY_ENTRIES);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportType, setReportType] = useState('telegram');
  const [reportValue, setReportValue] = useState('');
  const [reportPlatform, setReportPlatform] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const [checklist, setChecklist] = useState<ChecklistQuestion[]>(
    CHECKLIST_QUESTIONS.map((q) => ({ ...q, answer: null }))
  );

  const [reportForm, setReportForm] = useState<ReportForm>({
    name: '',
    phone: '',
    amountLost: '',
    description: '',
    scammerTelegram: '',
    scammerUpi: '',
    scammerPhone: '',
  });
  const [complaintGenerated, setComplaintGenerated] = useState(false);
  const [complaintText, setComplaintText] = useState('');
  const [complaintRef, setComplaintRef] = useState('');
  const [copied, setCopied] = useState(false);

  // ============ TAB 1: AI SCAM ANALYZER ============
  const handleAnalyze = useCallback(() => {
    if (!messageText.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      const matches = analyzeMessage(messageText);
      const score = calculateRiskScore(matches);
      setAnalysisResult(matches);
      setRiskScore(score);
      setAnalyzing(false);
    }, 800);
  }, [messageText]);

  const handleSampleMessage = (text: string) => {
    setMessageText(text);
    setAnalysisResult([]);
    setRiskScore(null);
  };

  // ============ TAB 2: PLATFORM CHECKER ============
  const handlePlatformSearch = () => {
    const query = platformSearch.trim().toLowerCase();
    if (!query) return;
    const found = KNOWN_SCAM_PLATFORMS.find(
      (p) => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
    );
    setPlatformResult(found ?? null);
  };

  // ============ TAB 3: COMMUNITY DATABASE ============
  const filteredCommunity = communityEntries.filter((entry) => {
    const matchesFilter = communityFilter === 'All' || entry.type === communityFilter;
    const matchesSearch = entry.value.toLowerCase().includes(communitySearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleReportSubmit = () => {
    if (!reportValue.trim()) return;
    const newEntry: CommunityEntry = {
      id: Date.now().toString(),
      type: reportType as CommunityEntry['type'],
      value: reportValue,
      reports: 1,
      status: 'under_review',
      lastReported: 'Just now',
      description: reportReason,
    };
    setCommunityEntries((prev) => [newEntry, ...prev]);
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setShowReportForm(false);
      setReportValue('');
      setReportPlatform('');
      setReportReason('');
    }, 3000);
  };

  // ============ TAB 4: CHECKLIST ============
  const handleChecklistAnswer = (id: number, answer: 'yes' | 'no') => {
    setChecklist((prev) => prev.map((q) => (q.id === id ? { ...q, answer } : q)));
  };

  const answeredCount = checklist.filter((q) => q.answer !== null).length;
  const totalWeight = checklist.reduce((sum, q) => sum + q.weight, 0);
  const earnedWeight = checklist.reduce((sum, q) => {
    if (q.answer === 'yes') return sum + q.weight;
    if (q.answer === 'no') return sum;
    return sum;
  }, 0);
  const completionPercent = Math.round((answeredCount / checklist.length) * 100);
  const safePercent = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

  const categoryGroups = checklist.reduce<Record<string, ChecklistQuestion[]>>((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {});

  const getChecklistVerdict = () => {
    if (answeredCount === 0) return null;
    if (safePercent >= 75) return { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', icon: CheckCircle, label: 'Safe to Invest', desc: 'This investment appears to meet key safety criteria. Always do final verification.' };
    if (safePercent >= 45) return { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', icon: AlertTriangle, label: 'Verify First - Proceed with Caution', desc: 'Some red flags detected. Verify registration and promises before investing.' };
    return { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: XCircle, label: 'High Scam Risk - Do Not Invest', desc: 'Multiple scam indicators found. Do not invest. Report to authorities.' };
  };

  // ============ TAB 5: ONE-CLICK REPORT ============
  const handleGenerateComplaint = () => {
    const ref = generateComplaintRef();
    const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const text = `
========================================
CYBER CRIME COMPLAINT
========================================

Reference ID: ${ref}
Date: ${date}
Complainant: ${reportForm.name || 'N/A'}
Phone: ${reportForm.phone || 'N/A'}

----------------------------------------
DETAILS OF FRAUD
----------------------------------------
${reportForm.description || 'No description provided.'}

Amount Lost: ${reportForm.amountLost ? `₹${reportForm.amountLost}` : 'Not specified'}

----------------------------------------
SCAMMER DETAILS
----------------------------------------
Telegram: ${reportForm.scammerTelegram || 'Not provided'}
UPI ID: ${reportForm.scammerUpi || 'Not provided'}
Phone: ${reportForm.scammerPhone || 'Not provided'}

----------------------------------------
PRAYER / STATEMENT
----------------------------------------
I, ${reportForm.name || '[Your Name]'}, hereby report the above fraud to the Cyber Crime Cell. I request you to investigate the matter and take appropriate action against the perpetrators. I am ready to provide any additional information or evidence as required.

I declare that the information provided above is true and correct to the best of my knowledge.

----------------------------------------
NEXT STEPS
----------------------------------------
1. Save this Reference ID: ${ref}
2. Call Cyber Crime Helpline: 1930
3. File complaint at: cybercrime.gov.in
4. Keep all screenshots and evidence ready
5. Visit your nearest police station if needed

========================================
`.trim();

    setComplaintRef(ref);
    setComplaintText(text);
    setComplaintGenerated(true);
  };

  const handleCopyComplaint = async () => {
    try {
      await navigator.clipboard.writeText(complaintText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = complaintText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ============ SEVERITY/STATUS HELPERS ============
  const severityBadge = (severity: string) => {
    const styles: Record<string, string> = {
      critical: 'bg-red-500/20 text-red-400 border-red-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };
    return styles[severity] || styles.medium;
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed_scam: 'bg-red-500/20 text-red-400 border-red-500/30',
      suspicious: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      under_review: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      unverified: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };
    return styles[status] || styles.under_review;
  };

  const statusLabel = (status: string) => {
    const labels: Record<string, string> = {
      confirmed_scam: 'Confirmed Scam',
      suspicious: 'Suspicious',
      under_review: 'Under Review',
      unverified: 'Unverified',
    };
    return labels[status] || status;
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'telegram': return <MessageSquare size={16} />;
      case 'upi': return <CreditCard size={16} />;
      case 'phone': return <Phone size={16} />;
      case 'website': return <Globe size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const tabs = [
    { name: 'Scam Analyzer', icon: <Shield size={16} /> },
    { name: 'Platform Checker', icon: <Search size={16} /> },
    { name: 'Scam Database', icon: <Database size={16} /> },
    { name: 'Investment Checklist', icon: <CheckCircle size={16} /> },
    { name: 'One-Click Report', icon: <FileText size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <div className="border-b border-dark-700 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-500/10 rounded-xl border border-primary-500/20">
              <TrendingUp className="text-primary-400" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Investment Scam Shield</h1>
              <p className="text-sm text-gray-400">Telegram/Trading/Investment fraud detection and community protection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-dark-700 bg-dark-800/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map((tab, idx) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === idx
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ============ TAB 1: SCAM ANALYZER ============ */}
        {activeTab === 0 && (
          <div className="space-y-6">
            {/* Input Area */}
            <div className="card bg-dark-800 border border-dark-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-primary-400" size={20} />
                <h2 className="text-lg font-semibold">AI Investment Scam Analyzer</h2>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Paste a Telegram message, WhatsApp text, or any suspicious investment communication to analyze for scam patterns.
              </p>

              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Paste the suspicious message here..."
                className="input-field w-full h-48 bg-dark-700 border border-dark-600 rounded-xl p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-primary-500 transition-colors"
              />

              <div className="flex flex-wrap gap-2 mt-4">
                {SAMPLE_MESSAGES.map((sample) => (
                  <button
                    key={sample.label}
                    onClick={() => handleSampleMessage(sample.text)}
                    className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-medium bg-dark-700 hover:bg-dark-600 text-gray-300 border border-dark-600 transition-all"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!messageText.trim() || analyzing}
                className="btn-primary mt-4 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-primary-500/20 flex items-center gap-2"
              >
                {analyzing ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    Analyze Message
                  </>
                )}
              </button>
            </div>

            {/* Results */}
            {riskScore && (
              <div className="space-y-6">
                {/* Risk Score Bar */}
                <div className="card bg-dark-800 border border-dark-700 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Risk Score</h3>
                    <span className={`text-2xl font-bold ${
                      riskScore.level === 'critical' ? 'text-red-400' :
                      riskScore.level === 'high' ? 'text-red-300' :
                      riskScore.level === 'medium' ? 'text-amber-400' :
                      riskScore.level === 'low' ? 'text-amber-300' : 'text-green-400'
                    }`}>
                      {riskScore.score}/100
                    </span>
                  </div>
                  <div className="w-full h-4 bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${riskScore.color}`}
                      style={{ width: `${riskScore.score}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <AlertCircle size={16} className={
                      riskScore.level === 'critical' ? 'text-red-400' :
                      riskScore.level === 'high' ? 'text-red-300' :
                      riskScore.level === 'medium' ? 'text-amber-400' :
                      riskScore.level === 'low' ? 'text-amber-300' : 'text-green-400'
                    } />
                    <span className={`font-semibold ${
                      riskScore.level === 'critical' ? 'text-red-400' :
                      riskScore.level === 'high' ? 'text-red-300' :
                      riskScore.level === 'medium' ? 'text-amber-400' :
                      riskScore.level === 'low' ? 'text-amber-300' : 'text-green-400'
                    }`}>
                      {riskScore.label}
                    </span>
                  </div>
                </div>

                {/* Matched Patterns */}
                <div className="card bg-dark-800 border border-dark-700 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Detected Red Flags ({analysisResult.length})</h3>
                  {analysisResult.length === 0 ? (
                    <p className="text-gray-400">No scam patterns detected. This message appears relatively safe.</p>
                  ) : (
                    <div className="space-y-3">
                      {analysisResult.map((match, idx) => (
                        <div
                          key={`${match.pattern.id}-${idx}`}
                          className="flex items-start gap-3 p-3 bg-dark-700/50 rounded-xl border border-dark-600"
                        >
                          <AlertTriangle
                            size={18}
                            className={
                              match.pattern.severity === 'critical' ? 'text-red-400 mt-0.5 shrink-0' :
                              match.pattern.severity === 'high' ? 'text-orange-400 mt-0.5 shrink-0' :
                              match.pattern.severity === 'medium' ? 'text-amber-400 mt-0.5 shrink-0' :
                              'text-blue-400 mt-0.5 shrink-0'
                            }
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{match.pattern.name}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${severityBadge(match.pattern.severity)}`}>
                                {match.pattern.severity}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">{match.pattern.description}</p>
                            <p className="text-xs text-primary-400 mt-1 truncate">"{match.matchedText}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Verdict & Recommendations */}
                <div className="card bg-dark-800 border border-dark-700 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Verdict & Recommendations</h3>
                  <div className={`p-4 rounded-xl border mb-4 ${
                    riskScore.level === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                    riskScore.level === 'high' ? 'bg-red-500/10 border-red-500/30' :
                    riskScore.level === 'medium' ? 'bg-amber-500/10 border-amber-500/30' :
                    riskScore.level === 'low' ? 'bg-amber-500/10 border-amber-500/30' :
                    'bg-green-500/10 border-green-500/30'
                  }`}>
                    <p className={`font-semibold ${
                      riskScore.level === 'critical' ? 'text-red-400' :
                      riskScore.level === 'high' ? 'text-red-300' :
                      riskScore.level === 'medium' ? 'text-amber-400' :
                      riskScore.level === 'low' ? 'text-amber-300' : 'text-green-400'
                    }`}>
                      {riskScore.level === 'critical' && '🚨 CRITICAL SCAM DETECTED - DO NOT ENGAGE'}
                      {riskScore.level === 'high' && '⚠️ HIGH SCAM RISK - DO NOT INVEST'}
                      {riskScore.level === 'medium' && '⚠️ MEDIUM RISK - VERIFY BEFORE INVESTING'}
                      {riskScore.level === 'low' && 'ℹ️ LOW RISK - EXERCISE CAUTION'}
                      {riskScore.level === 'safe' && '✅ APPEARS SAFE - BUT ALWAYS VERIFY'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {(riskScore.level === 'critical' || riskScore.level === 'high') && (
                      <>
                        <div className="flex items-start gap-2 p-3 bg-dark-700/50 rounded-lg">
                          <Ban size={16} className="text-red-400 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-300">Do not send any money or share personal financial information</span>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-dark-700/50 rounded-lg">
                          <Ban size={16} className="text-red-400 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-300">Block the sender and report their account on the platform</span>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-dark-700/50 rounded-lg">
                          <Phone size={16} className="text-amber-400 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-300">If you have already lost money, call Cyber Crime Helpline: <strong className="text-white">1930</strong></span>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-dark-700/50 rounded-lg">
                          <FileText size={16} className="text-blue-400 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-300">File a complaint at <strong className="text-primary-400">cybercrime.gov.in</strong> immediately</span>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-dark-700/50 rounded-lg">
                          <Eye size={16} className="text-primary-400 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-300">Save all screenshots and communication as evidence</span>
                        </div>
                      </>
                    )}
                    {riskScore.level === 'medium' && (
                      <>
                        <div className="flex items-start gap-2 p-3 bg-dark-700/50 rounded-lg">
                          <Search size={16} className="text-amber-400 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-300">Verify the company on SEBI's website (sebi.gov.in)</span>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-dark-700/50 rounded-lg">
                          <Search size={16} className="text-amber-400 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-300">Check the platform in our Scam Database tab</span>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-dark-700/50 rounded-lg">
                          <Users size={16} className="text-amber-400 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-300">Ask for proof of SEBI/RBI registration before investing</span>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-dark-700/50 rounded-lg">
                          <DollarSign size={16} className="text-amber-400 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-300">Never pay any fee to "unlock" or "release" your profits</span>
                        </div>
                      </>
                    )}
                    {riskScore.level === 'low' && (
                      <>
                        <div className="flex items-start gap-2 p-3 bg-dark-700/50 rounded-lg">
                          <CheckCircle size={16} className="text-green-400 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-300">Continue with caution - verify all claims independently</span>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-dark-700/50 rounded-lg">
                          <Search size={16} className="text-blue-400 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-300">Use the Investment Checklist tab for a thorough evaluation</span>
                        </div>
                      </>
                    )}
                    {riskScore.level === 'safe' && (
                      <div className="flex items-start gap-2 p-3 bg-dark-700/50 rounded-lg">
                        <CheckCircle size={16} className="text-green-400 mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-300">No major red flags detected. However, always do your own research before investing.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============ TAB 2: PLATFORM CHECKER ============ */}
        {activeTab === 1 && (
          <div className="space-y-6">
            <div className="card bg-dark-800 border border-dark-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Search className="text-primary-400" size={20} />
                <h2 className="text-lg font-semibold">Verified Platform Checker</h2>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Check if a trading/investment platform is in our verified scam database. Search by platform name or category.
              </p>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={platformSearch}
                  onChange={(e) => setPlatformSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePlatformSearch()}
                  placeholder="Enter platform name (e.g., TradeBucks, FrostFX)..."
                  className="input-field flex-1 bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
                <button
                  onClick={handlePlatformSearch}
                  className="btn-primary px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white transition-all hover:shadow-lg hover:shadow-primary-500/20 flex items-center gap-2"
                >
                  <Search size={18} />
                  Check
                </button>
              </div>
            </div>

            {/* Known Scam Platforms */}
            <div className="card bg-dark-800 border border-dark-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Known Scam & Suspicious Platforms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {KNOWN_SCAM_PLATFORMS.map((platform) => (
                  <div
                    key={platform.name}
                    className="p-4 bg-dark-700/50 rounded-xl border border-dark-600 hover:border-dark-500 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{platform.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge(platform.status)}`}>
                        {statusLabel(platform.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                      <span>{platform.category}</span>
                      <span className="flex items-center gap-1">
                        <Flag size={12} />
                        {platform.reports.toLocaleString()} reports
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{platform.details}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Result */}
            {platformResult !== undefined && (
              <div className={`card bg-dark-800 border rounded-2xl p-6 ${
                platformResult ? 'border-red-500/30' : 'border-amber-500/30'
              }`}>
                {platformResult ? (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-red-500/10 rounded-lg">
                        <Ban className="text-red-400" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-red-400">Platform Found in Database</h3>
                        <p className="text-sm text-gray-400">This platform has been flagged as {statusLabel(platformResult.status)}</p>
                      </div>
                    </div>
                    <div className="bg-dark-700/50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm w-32">Platform:</span>
                        <span className="font-medium">{platformResult.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm w-32">Category:</span>
                        <span>{platformResult.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm w-32">Status:</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge(platformResult.status)}`}>
                          {statusLabel(platformResult.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm w-32">Reports:</span>
                        <span className="flex items-center gap-1 text-red-400 font-medium">
                          <Flag size={14} />
                          {platformResult.reports.toLocaleString()} reports filed
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 text-sm w-32 mt-0.5">Details:</span>
                        <span className="text-sm">{platformResult.details}</span>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="text-red-400 mt-0.5 shrink-0" size={18} />
                        <div>
                          <p className="text-sm font-medium text-red-400">Warning</p>
                          <p className="text-sm text-gray-300 mt-1">
                            Do not invest any money in this platform. If you have already invested, try to withdraw immediately and report to Cyber Crime Helpline at 1930.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-500/10 rounded-lg">
                        <Info className="text-amber-400" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-amber-400">Not Found in Database</h3>
                        <p className="text-sm text-gray-400">This platform is not in our known scam database. Verify manually.</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-300 mb-4">
                      Just because a platform isn't in our database doesn't mean it's safe. Please verify independently:
                    </p>

                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-primary-400">SEBI Verification Checklist</h4>
                      {[
                        { name: 'SEBI Website', url: 'https://www.sebi.gov.in', desc: 'Check if the entity is registered with SEBI' },
                        { name: 'MCA Portal', url: 'https://www.mca.gov.in', desc: 'Verify company registration on Ministry of Corporate Affairs' },
                        { name: 'NSE/BSE Member List', url: 'https://www.nseindia.com', desc: 'Check if broker is a member of NSE or BSE' },
                        { name: 'SEBI Warning List', url: 'https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes', desc: 'Check SEBI\'s list of warned entities' },
                        { name: 'AMFI', url: 'https://www.amfiindia.com', desc: 'Verify if mutual fund distributor is registered' },
                        { name: 'IRDAI', url: 'https://www.irdai.gov.in', desc: 'Verify insurance company registration' },
                      ].map((item) => (
                        <div key={item.name} className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-xl border border-dark-600">
                          <ExternalLink className="text-primary-400 shrink-0" size={16} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{item.name}</span>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
                              >
                                Visit <ArrowRight size={10} />
                              </a>
                            </div>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============ TAB 3: SCAM DATABASE ============ */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <div className="card bg-dark-800 border border-dark-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Database className="text-primary-400" size={20} />
                <h2 className="text-lg font-semibold">Community Scam Database</h2>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Community-reported scam identifiers. Search and filter to check known scammers.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    value={communitySearch}
                    onChange={(e) => setCommunitySearch(e.target.value)}
                    placeholder="Search by username, phone, UPI, or website..."
                    className="input-field w-full bg-dark-700 border border-dark-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {['All', 'Telegram', 'UPI', 'Phone', 'Website'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setCommunityFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      communityFilter === filter
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'bg-dark-700 text-gray-400 border border-dark-600 hover:text-gray-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Entries */}
            <div className="space-y-3">
              {filteredCommunity.length === 0 ? (
                <div className="card bg-dark-800 border border-dark-700 rounded-2xl p-8 text-center">
                  <Search className="mx-auto text-gray-600 mb-3" size={32} />
                  <p className="text-gray-400">No entries found matching your search.</p>
                </div>
              ) : (
                filteredCommunity.map((entry) => (
                  <div key={entry.id} className="card bg-dark-800 border border-dark-700 rounded-2xl p-4 hover:border-dark-600 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        entry.type === 'telegram' ? 'bg-blue-500/10 text-blue-400' :
                        entry.type === 'upi' ? 'bg-green-500/10 text-green-400' :
                        entry.type === 'phone' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-purple-500/10 text-purple-400'
                      }`}>
                        {typeIcon(entry.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-sm">{entry.value}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge(entry.status)}`}>
                            {statusLabel(entry.status)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{entry.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 text-xs text-red-400 mb-1">
                          <Flag size={12} />
                          {entry.reports} reports
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={12} />
                          {entry.lastReported}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Report Form Toggle */}
            <div className="card bg-dark-800 border border-dark-700 rounded-2xl p-6">
              {!showReportForm ? (
                <button
                  onClick={() => setShowReportForm(true)}
                  className="btn-primary w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white transition-all hover:shadow-lg hover:shadow-primary-500/20 flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Report a Scammer
                </button>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Report a Scammer</h3>
                    <button onClick={() => setShowReportForm(false)} className="text-gray-400 hover:text-white transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  {reportSubmitted ? (
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
                      <CheckCircle className="mx-auto text-green-400 mb-2" size={32} />
                      <p className="text-green-400 font-medium">Report submitted successfully!</p>
                      <p className="text-sm text-gray-400 mt-1">The entry has been added to the community database.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Scammer Type</label>
                        <select
                          value={reportType}
                          onChange={(e) => setReportType(e.target.value)}
                          className="input-field w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                        >
                          <option value="telegram">Telegram Username</option>
                          <option value="upi">UPI ID</option>
                          <option value="phone">Phone Number</option>
                          <option value="website">Website</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Value (Username/Phone/UPI/Website)</label>
                        <input
                          type="text"
                          value={reportValue}
                          onChange={(e) => setReportValue(e.target.value)}
                          placeholder={
                            reportType === 'telegram' ? '@scammer_username' :
                            reportType === 'upi' ? 'scammer@upi' :
                            reportType === 'phone' ? '+91 98765 43210' :
                            'scamwebsite.com'
                          }
                          className="input-field w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Platform Name (optional)</label>
                        <input
                          type="text"
                          value={reportPlatform}
                          onChange={(e) => setReportPlatform(e.target.value)}
                          placeholder="e.g., TradeBucks, QuickReturns"
                          className="input-field w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Reason / Description</label>
                        <textarea
                          value={reportReason}
                          onChange={(e) => setReportReason(e.target.value)}
                          placeholder="Describe how this scammer operates..."
                          rows={3}
                          className="input-field w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-primary-500 transition-colors"
                        />
                      </div>
                      <button
                        onClick={handleReportSubmit}
                        disabled={!reportValue.trim()}
                        className="btn-primary w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-primary-500/20 flex items-center justify-center gap-2"
                      >
                        <Send size={18} />
                        Submit Report
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ TAB 4: CHECKLIST ============ */}
        {activeTab === 3 && (
          <div className="space-y-6">
            <div className="card bg-dark-800 border border-dark-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="text-primary-400" size={20} />
                <h2 className="text-lg font-semibold">Safe Investment Checklist</h2>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Answer these 12 questions to evaluate whether an investment opportunity is legitimate or potentially a scam.
              </p>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Progress</span>
                  <span className="text-sm font-medium">{answeredCount}/{checklist.length} answered</span>
                </div>
                <div className="w-full h-2.5 bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Questions by Category */}
            {Object.entries(categoryGroups).map(([category, questions]) => (
              <div key={category} className="card bg-dark-800 border border-dark-700 rounded-2xl p-6">
                <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
                  {category === 'Registration' && <Lock className="text-blue-400" size={18} />}
                  {category === 'Returns' && <TrendingUp className="text-green-400" size={18} />}
                  {category === 'Legitimacy' && <Building className="text-purple-400" size={18} />}
                  {category === 'Red Flags' && <AlertTriangle className="text-red-400" size={18} />}
                  {category === 'Reputation' && <Star className="text-amber-400" size={18} />}
                  {category}
                </h3>
                <div className="space-y-3">
                  {questions.map((q) => (
                    <div key={q.id} className="p-4 bg-dark-700/50 rounded-xl border border-dark-600">
                      <p className="text-sm text-gray-200 mb-3">
                        <span className="text-primary-400 font-medium mr-1">{q.id}.</span>
                        {q.question}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleChecklistAnswer(q.id, 'yes')}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${
                            q.answer === 'yes'
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-dark-700 text-gray-400 border-dark-600 hover:border-green-500/30 hover:text-green-400'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <Check size={14} />
                            Yes
                          </div>
                        </button>
                        <button
                          onClick={() => handleChecklistAnswer(q.id, 'no')}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${
                            q.answer === 'no'
                              ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : 'bg-dark-700 text-gray-400 border-dark-600 hover:border-red-500/30 hover:text-red-400'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <XCircle size={14} />
                            No
                          </div>
                        </button>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">Weight: {q.weight} points</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Verdict */}
            {answeredCount > 0 && (
              <div className="card bg-dark-800 border border-dark-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Your Assessment</h3>
                  <span className="text-2xl font-bold text-primary-400">{safePercent}%</span>
                </div>

                <div className="w-full h-3 bg-dark-700 rounded-full overflow-hidden mb-6">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      safePercent >= 75 ? 'bg-green-500' :
                      safePercent >= 45 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${safePercent}%` }}
                  />
                </div>

                {(() => {
                  const verdict = getChecklistVerdict();
                  if (!verdict) return null;
                  const VerdictIcon = verdict.icon;
                  return (
                    <div className={`p-4 rounded-xl border ${verdict.bg}`}>
                      <div className="flex items-center gap-3">
                        <VerdictIcon className={verdict.color} size={24} />
                        <div>
                          <p className={`font-semibold ${verdict.color}`}>{verdict.label}</p>
                          <p className="text-sm text-gray-400 mt-1">{verdict.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="mt-4 p-3 bg-dark-700/50 rounded-xl">
                  <p className="text-xs text-gray-500">
                    Score breakdown: {earnedWeight}/{totalWeight} weighted points. Positive answers (safe indicators) contribute to the score. Higher score = safer investment.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============ TAB 5: ONE-CLICK REPORT ============ */}
        {activeTab === 4 && (
          <div className="space-y-6">
            <div className="card bg-dark-800 border border-dark-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="text-primary-400" size={20} />
                <h2 className="text-lg font-semibold">One-Click Cyber Crime Report</h2>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Generate a formatted cyber crime complaint that you can copy and submit to authorities. Fill in the details below.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={reportForm.name}
                    onChange={(e) => setReportForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Full name"
                    className="input-field w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Your Phone Number</label>
                  <input
                    type="tel"
                    value={reportForm.phone}
                    onChange={(e) => setReportForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="input-field w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Amount Lost (optional)</label>
                  <input
                    type="text"
                    value={reportForm.amountLost}
                    onChange={(e) => setReportForm((prev) => ({ ...prev, amountLost: e.target.value }))}
                    placeholder="₹ amount"
                    className="input-field w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Scammer Telegram Username</label>
                  <input
                    type="text"
                    value={reportForm.scammerTelegram}
                    onChange={(e) => setReportForm((prev) => ({ ...prev, scammerTelegram: e.target.value }))}
                    placeholder="@scammer_username"
                    className="input-field w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Scammer UPI ID</label>
                  <input
                    type="text"
                    value={reportForm.scammerUpi}
                    onChange={(e) => setReportForm((prev) => ({ ...prev, scammerUpi: e.target.value }))}
                    placeholder="scammer@upi"
                    className="input-field w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Scammer Phone Number</label>
                  <input
                    type="tel"
                    value={reportForm.scammerPhone}
                    onChange={(e) => setReportForm((prev) => ({ ...prev, scammerPhone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="input-field w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Description of Fraud</label>
                <textarea
                  value={reportForm.description}
                  onChange={(e) => setReportForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what happened, how the scammer contacted you, what they promised, and what you lost..."
                  rows={5}
                  className="input-field w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              <button
                onClick={handleGenerateComplaint}
                className="btn-primary mt-6 w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white transition-all hover:shadow-lg hover:shadow-primary-500/20 flex items-center justify-center gap-2"
              >
                <FileText size={18} />
                Generate Complaint
              </button>
            </div>

            {/* Generated Complaint */}
            {complaintGenerated && (
              <div className="card bg-dark-800 border border-primary-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Complaint Generated</h3>
                    <p className="text-xs text-gray-400 mt-1">Reference ID: <span className="text-primary-400 font-mono">{complaintRef}</span></p>
                  </div>
                  <button
                    onClick={handleCopyComplaint}
                    className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                      copied
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-primary-500/20 text-primary-400 border border-primary-500/30 hover:bg-primary-500/30'
                    }`}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                </div>

                <pre className="bg-dark-900 rounded-xl p-4 text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap font-mono border border-dark-600 max-h-96 overflow-y-auto">
                  {complaintText}
                </pre>

                {/* Quick Actions */}
                <div className="mt-6 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-300">Quick Actions</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href="tel:1930"
                      className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-colors"
                    >
                      <Phone className="text-red-400 shrink-0" size={20} />
                      <div>
                        <p className="text-sm font-semibold text-red-400">Call 1930</p>
                        <p className="text-xs text-gray-400">Cyber Crime Helpline (24/7)</p>
                      </div>
                    </a>
                    <a
                      href="https://cybercrime.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl hover:bg-blue-500/20 transition-colors"
                    >
                      <ExternalLink className="text-blue-400 shrink-0" size={20} />
                      <div>
                        <p className="text-sm font-semibold text-blue-400">Submit on cybercrime.gov.in</p>
                        <p className="text-xs text-gray-400">File online complaint</p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="mt-6 p-4 bg-dark-700/50 rounded-xl border border-dark-600">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Info className="text-primary-400" size={16} />
                    Next Steps
                  </h4>
                  <ol className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-400 font-bold shrink-0">1.</span>
                      Save your Reference ID: <span className="text-primary-400 font-mono">{complaintRef}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-400 font-bold shrink-0">2.</span>
                      Call Cyber Crime Helpline at <strong className="text-white">1930</strong> (available 24/7)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-400 font-bold shrink-0">3.</span>
                      File a formal complaint at <strong className="text-primary-400">cybercrime.gov.in</strong>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-400 font-bold shrink-0">4.</span>
                      Preserve all evidence: screenshots, transaction receipts, chat logs, emails
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-400 font-bold shrink-0">5.</span>
                      Visit your nearest police station with a printed copy if the amount is significant
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-400 font-bold shrink-0">6.</span>
                      If money was transferred via UPI/bank, contact your bank immediately to raise a dispute
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-400 font-bold shrink-0">7.</span>
                      Do not engage further with the scammer - block them on all platforms
                    </li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Small helper icons (not in lucide-react)
function Database(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}

function Building(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}

function Star(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
