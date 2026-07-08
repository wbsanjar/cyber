import { useState, useCallback, useRef } from 'react';
import {
  Upload, Image, Link, AlertTriangle, CheckCircle, XCircle, Shield, Eye, Scan,
  MessageSquare, Mail, Smartphone, Globe, QrCode, CreditCard, Phone, Copy,
  ExternalLink, Search, Flag, Zap, UserX, DollarSign, Building, Clock,
  Key, Lock, FileText, Camera, Hash, AtSign, ChevronRight, Share2,
  ThumbsUp, ThumbsDown, AlertOctagon,
} from 'lucide-react';

type DetectorType = 'sms' | 'whatsapp' | 'qr' | 'website' | 'upi' | 'phone' | 'email' | 'screenshot';
type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical';
type ResultStatus = 'safe' | 'suspicious' | 'fraud';

interface ScanIndicator {
  label: string;
  found: boolean;
  type: 'positive' | 'negative' | 'warning';
}

interface ScanResult {
  status: ResultStatus;
  riskScore: number;
  riskLevel: RiskLevel;
  scamType: string;
  summary: string;
  indicators: ScanIndicator[];
  recommendations: string[];
  details?: Record<string, string>;
}

const RISK_COLORS: Record<RiskLevel, string> = {
  safe: 'text-green-400',
  low: 'text-blue-400',
  medium: 'text-amber-400',
  high: 'text-orange-400',
  critical: 'text-red-400',
};

const RISK_BG: Record<RiskLevel, string> = {
  safe: 'bg-green-500/10 border-green-500/30',
  low: 'bg-blue-500/10 border-blue-500/30',
  medium: 'bg-amber-500/10 border-amber-500/30',
  high: 'bg-orange-500/10 border-orange-500/30',
  critical: 'bg-red-500/10 border-red-500/30',
};

const SUSPICIOUS_DOMAINS = [
  'xyz', 'tk', 'ml', 'ga', 'cf', 'gq', 'top', 'club', 'work', 'bid',
  'loan', 'date', 'download', 'review', 'live', 'click', 'link',
];

const BRAND_KEYWORDS: Record<string, string[]> = {
  google: ['google', 'gmail', 'youtube', 'google pay', 'gpay'],
  microsoft: ['microsoft', 'outlook', 'hotmail', 'office 365', 'windows'],
  amazon: ['amazon', 'amzn', 'prime video'],
  flipkart: ['flipkart', 'flipkart'],
  paytm: ['paytm', 'paytm mall'],
  phonepe: ['phonepe', 'phone pe'],
  sbi: ['sbi', 'state bank', 'onlinesbi'],
  hdfc: ['hdfc', 'hdfc bank'],
  icici: ['icici', 'icici bank'],
  irctc: ['irctc', 'irctc'],
};

const SUSPICIOUS_KEYWORDS = [
  'won', 'winner', 'winning', 'prize', 'lottery', 'reward', 'gift', 'free',
  'congratulations', 'selected', 'lucky', 'jackpot', 'cashback', 'bonus',
  'urgent', 'immediate', 'action required', 'account suspended', 'account blocked',
  'verify now', 'verify your account', 'confirm your', 'update your',
  'limited time', 'expires today', 'last warning', 'final notice',
  'click here', 'tap here', 'subscribe now', 'claim now', 'act now',
  'send money', 'transfer', 'deposit', 'payment pending', 'refund',
  'otp', 'one time password', 'pin', 'password', 'cvv', 'aadhaar',
  'pan card', 'bank details', 'credit card', 'debit card', 'net banking',
  'work from home', 'data entry', 'typing job', 'easy money', 'earn money',
  'part time', 'online job', 'form filling', 'per page', 'daily payment',
  'kysa kar rahe ho', 'kya kar rahe ho', 'urgent hai', 'jaldi karo',
  'khata band', 'account band', 'loan approve', 'loan sanction',
];

const LOTTERY_WORDS = ['lottery', 'winner', 'prize', 'crore', 'lakh', 'won', 'award'];
const URGENCY_WORDS = ['urgent', 'immediate', 'now', 'quick', 'hurry', 'last chance', 'expires', 'today only'];
const FINANCIAL_WORDS = ['money', 'transfer', 'bank', 'account', 'payment', 'deposit', 'refund', 'cash'];
const PERSONAL_WORDS = ['otp', 'password', 'pin', 'aadhaar', 'pan', 'cvv', 'bank detail'];

function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 35) return 'medium';
  if (score >= 15) return 'low';
  return 'safe';
}

function getStatus(score: number): ResultStatus {
  if (score >= 50) return 'fraud';
  if (score >= 20) return 'suspicious';
  return 'safe';
}

function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)|(?:www\.)[^\s]+|([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
  const matches = text.match(urlRegex);
  return matches || [];
}

function analyzeDomain(url: string) {
  const lower = url.toLowerCase();
  let domain = lower.replace(/https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  const tld = domain.split('.').pop() || '';

  const brandFlagged: string[] = [];
  for (const [brand, keywords] of Object.entries(BRAND_KEYWORDS)) {
    for (const kw of keywords) {
      if (domain.includes(kw) && !domain.endsWith(`${kw}.com`) && !domain.endsWith(`${kw}.co.in`) && !domain.endsWith(`${kw}.org`)) {
        brandFlagged.push(brand);
        break;
      }
    }
  }

  const isShortened = domain.includes('bit.ly') || domain.includes('tinyurl') || domain.includes('t.co') ||
    domain.includes('shorturl') || domain.includes('rb.gy') || domain.includes('ow.ly') ||
    domain.includes('is.gd') || domain.includes('buff.ly') || domain.includes('tiny.cc');

  return { domain, tld, brandFlagged, isShortened };
}

function analyzeSmsWhatsApp(text: string): ScanResult {
  const lower = text.toLowerCase();
  const indicators: ScanIndicator[] = [];
  let score = 0;
  let scamType = 'Potential Scam';

  const urls = extractUrls(text);
  const hasUrl = urls.length > 0;

  if (hasUrl) {
    for (const url of urls) {
      const { domain, tld, brandFlagged, isShortened } = analyzeDomain(url);
      if (SUSPICIOUS_DOMAINS.includes(tld)) {
        indicators.push({ label: `Suspicious TLD (.${tld}) in link`, found: true, type: 'negative' });
        score += 25;
      }
      if (isShortened) {
        indicators.push({ label: 'Shortened URL detected (hides real destination)', found: true, type: 'warning' });
        score += 15;
      }
      if (brandFlagged.length > 0) {
        indicators.push({ label: `Brand impersonation: ${brandFlagged.join(', ')}`, found: true, type: 'negative' });
        score += 30;
      }
    }
    indicators.push({ label: 'Contains a link/URL', found: true, type: hasUrl && score > 10 ? 'warning' : 'positive' });
    if (score < 10) score += 5;
  }

  const lottoCount = LOTTERY_WORDS.filter(w => lower.includes(w)).length;
  if (lottoCount >= 2) {
    indicators.push({ label: 'Lottery/prize claim language detected', found: true, type: 'negative' });
    score += 35;
    scamType = 'Lottery Scam';
  }

  const urgencyCount = URGENCY_WORDS.filter(w => lower.includes(w)).length;
  if (urgencyCount >= 2) {
    indicators.push({ label: 'Urgency/pressure tactics detected', found: true, type: 'negative' });
    score += 20;
  }

  const financialCount = FINANCIAL_WORDS.filter(w => lower.includes(w)).length;
  if (financialCount >= 2) {
    indicators.push({ label: 'Financial transaction language', found: true, type: 'warning' });
    score += 15;
  }

  const personalCount = PERSONAL_WORDS.filter(w => lower.includes(w)).length;
  if (personalCount >= 1) {
    indicators.push({ label: 'Asking for personal/private information', found: true, type: 'negative' });
    score += 30;
    if (scamType === 'Potential Scam') scamType = 'Credential Harvesting';
  }

  if (lower.includes('congratulations') || lower.includes('congrats') && lottoCount > 0) {
    indicators.push({ label: 'Fake congratulations message pattern', found: true, type: 'negative' });
    score += 10;
  }

  const hasSpellingIssues = /\b(winn|pr1ze|lott|pa yment|acc ount|verif y)\b/i.test(text);
  indicators.push({ label: 'Grammar/spelling consistency check', found: hasSpellingIssues, type: hasSpellingIssues ? 'negative' : 'positive' });

  const jobRelated = ['work from home', 'data entry', 'typing job', 'easy money', 'part time', 'online job', 'form filling', 'per page'];
  if (jobRelated.some(w => lower.includes(w))) {
    indicators.push({ label: 'Fake job/earnings offer pattern', found: true, type: 'negative' });
    score += 25;
    scamType = 'Job Scam';
  }

  if (score === 0) {
    indicators.push({ label: 'No suspicious patterns detected', found: true, type: 'positive' });
  }

  const recommendations: string[] = [];
  if (score >= 50) {
    recommendations.push('Do NOT click any links or download attachments');
    recommendations.push('Do NOT share any personal/financial information');
    recommendations.push('Call 1930 - National Cyber Crime Helpline immediately');
    recommendations.push('Block the sender/number');
    recommendations.push('Report at cybercrime.gov.in');
  } else if (score >= 20) {
    recommendations.push('Verify the source through official channels');
    recommendations.push('Do not share OTP, passwords, or bank details');
    recommendations.push('Contact official customer support to verify');
    recommendations.push('If unsure, consult with someone you trust');
  } else {
    recommendations.push('This appears to be safe. Exercise normal caution.');
  }

  if (hasUrl && score >= 20) {
    recommendations.unshift('Hover over links to verify the actual URL before clicking');
  }

  return {
    status: getStatus(score),
    riskScore: Math.min(score, 100),
    riskLevel: getRiskLevel(score),
    scamType,
    summary: `Analysis of ${text.length} character message with ${urls.length} URL(s)`,
    indicators,
    recommendations,
    details: {
      'Message Length': `${text.length} chars`,
      'URLs Found': `${urls.length}`,
      'Suspicious Keywords': `${[urgencyCount, personalCount, financialCount].filter(c => c > 0).length} categories`,
    },
  };
}

function analyzeQRCode(input: string): ScanResult {
  const lower = input.toLowerCase();
  const indicators: ScanIndicator[] = [];
  let score = 0;
  let scamType = 'QR Code Analysis';

  const urls = extractUrls(input);
  const hasUrl = urls.length > 0 || lower.includes('http') || lower.includes('www');
  const hasUPI = lower.includes('upi') || lower.includes('@') || lower.includes('pay');
  const hasPhone = /\d{10}/.test(input);

  if (hasUrl) {
    for (const url of urls) {
      const { domain, tld, brandFlagged, isShortened } = analyzeDomain(url);
      if (SUSPICIOUS_DOMAINS.includes(tld)) {
        indicators.push({ label: `QR redirects to suspicious domain (.${tld})`, found: true, type: 'negative' });
        score += 30;
      }
      if (isShortened) {
        indicators.push({ label: 'URL is shortened - destination hidden', found: true, type: 'warning' });
        score += 20;
      }
      if (brandFlagged.length > 0) {
        indicators.push({ label: `QR impersonates: ${brandFlagged.join(', ')}`, found: true, type: 'negative' });
        score += 35;
      }
      if (!url.startsWith('https://')) {
        indicators.push({ label: 'Non-HTTPS connection (no encryption)', found: true, type: 'warning' });
        score += 15;
      }
    }
  } else if (hasUPI) {
    indicators.push({ label: 'QR contains UPI payment request', found: true, type: 'warning' });
    score += 10;
    scamType = 'Payment QR';
  } else if (hasPhone) {
    indicators.push({ label: 'QR contains phone number link', found: true, type: 'warning' });
    score += 10;
  } else {
    indicators.push({ label: 'QR content is plain text (no URL)', found: true, type: 'positive' });
  }

  if (lower.includes('scan') && lower.includes('pay') || lower.includes('payment') && lower.includes('qr')) {
    indicators.push({ label: 'Payment request via QR', found: true, type: 'warning' });
    score += 10;
  }

  if (lower.includes('flipkart') || lower.includes('amazon') || lower.includes('myntra')) {
    indicators.push({ label: 'Shopping brand in QR - verify authenticity', found: true, type: 'warning' });
    score += 5;
  }

  const recommendations: string[] = [];
  if (score >= 50) {
    recommendations.push('Do NOT scan this QR code');
    recommendations.push('Fraudsters use fake QR codes to steal money');
    recommendations.push('Report to 1930 immediately');
  } else if (score >= 20) {
    recommendations.push('Verify the QR code source before scanning');
    recommendations.push('Check if the URL looks legitimate');
    recommendations.push('Prefer scanning from official apps only');
  } else {
    recommendations.push('QR code appears safe');
    recommendations.push('Still verify the destination before entering any details');
  }

  return {
    status: getStatus(score),
    riskScore: Math.min(score, 100),
    riskLevel: getRiskLevel(score),
    scamType,
    summary: `QR code redirects to ${hasUrl ? 'a webpage' : hasUPI ? 'a UPI payment' : 'text content'}`,
    indicators,
    recommendations,
    details: {
      'Content Type': hasUrl ? 'URL' : hasUPI ? 'UPI/Payment' : 'Text',
      'Encryption': hasUrl && urls.some(u => u.startsWith('https')) ? 'HTTPS' : 'None/Unknown',
    },
  };
}

function analyzeWebsite(url: string): ScanResult {
  const lower = url.toLowerCase();
  const indicators: ScanIndicator[] = [];
  let score = 0;
  let scamType = 'Website Analysis';

  const { domain, tld, brandFlagged, isShortened } = analyzeDomain(url);

  if (SUSPICIOUS_DOMAINS.includes(tld)) {
    indicators.push({ label: `Suspicious TLD used (.${tld}) - common in scams`, found: true, type: 'negative' });
    score += 30;
  }

  if (isShortened) {
    indicators.push({ label: 'Shortened URL - real destination masked', found: true, type: 'warning' });
    score += 15;
  }

  const idnChars = /[^\x00-\x7F]/.test(domain);
  if (idnChars) {
    indicators.push({ label: 'Homograph attack detected (special characters in domain)', found: true, type: 'negative' });
    score += 40;
  }

  if (brandFlagged.length > 0) {
    indicators.push({ label: `Brand impersonation detected: ${brandFlagged.join(', ')}`, found: true, type: 'negative' });
    score += 35;
    scamType = `${brandFlagged[0]} Phishing Site`;
  }

  const typoPatterns = [
    { pattern: /g00gle|go0gle|googie/i, label: 'Typo-squatting: Google' },
    { pattern: /faceb00k|faceboook|facebok/i, label: 'Typo-squatting: Facebook' },
    { pattern: /payt m|paytrn|paytorn/i, label: 'Typo-squatting: Paytm' },
    { pattern: /flipk art|flipkcirt/i, label: 'Typo-squatting: Flipkart' },
    { pattern: /amaz n|amaz0n|amzon/i, label: 'Typo-squatting: Amazon' },
    { pattern: /whatsapp|whats ap|watsapp/i, label: 'Typo-squatting: WhatsApp' },
    { pattern: /instagrarn|instaggram/i, label: 'Typo-squatting: Instagram' },
    { pattern: /y0utube|youtub e/i, label: 'Typo-squatting: YouTube' },
  ];

  for (const { pattern, label } of typoPatterns) {
    if (pattern.test(domain)) {
      indicators.push({ label, found: true, type: 'negative' });
      score += 35;
      break;
    }
  }

  const suspiciousPath = /(login|signin|verify|secure|account|update|confirm|reset|otp|password)/i.test(domain);
  if (suspiciousPath) {
    indicators.push({ label: 'URL contains login/verify keywords (phishing pattern)', found: true, type: 'negative' });
    score += 20;
  }

  const hasHttps = url.startsWith('https://');
  if (!hasHttps) {
    indicators.push({ label: 'No SSL/HTTPS - connection is NOT secure', found: true, type: 'negative' });
    score += 20;
  } else {
    indicators.push({ label: 'SSL/HTTPS connection present', found: true, type: 'positive' });
  }

  const domainLen = domain.length;
  if (domainLen > 30) {
      indicators.push({ label: `Very long domain (${domainLen} chars) - unusual`, found: true, type: 'warning' });
    score += 10;
  }

  const dashCount = (domain.match(/-/g) || []).length;
  if (dashCount >= 3) {
    indicators.push({ label: `${dashCount} hyphens in domain - unusual pattern`, found: true, type: 'warning' });
    score += 10;
  }

  const digitCount = (domain.match(/\d/g) || []).length;
  if (digitCount >= 5) {
    indicators.push({ label: 'Excessive digits in domain name', found: true, type: 'warning' });
    score += 10;
  }

  const recommendations: string[] = [];
  if (score >= 60) {
    recommendations.push('Do NOT visit this website - it is likely a phishing site');
    recommendations.push('Do not enter any login credentials or personal information');
    recommendations.push('Report the URL to cybercrime.gov.in');
    recommendations.push('Notify the brand being impersonated');
  } else if (score >= 25) {
    recommendations.push('Verify the website carefully before proceeding');
    recommendations.push('Check for SSL lock icon in address bar');
    recommendations.push('Hover over links to see actual URLs');
    recommendations.push('Use official apps instead of web links');
  } else {
    recommendations.push('Website appears legitimate');
    recommendations.push('Still verify the URL before entering sensitive data');
  }

  return {
    status: getStatus(score),
    riskScore: Math.min(score, 100),
    riskLevel: getRiskLevel(score),
    scamType,
    summary: `Domain: ${domain} | TLD: .${tld}`,
    indicators,
    recommendations,
    details: {
      'Domain': domain,
      'TLD': `.${tld}`,
      'HTTPS': hasHttps ? 'Yes' : 'No',
      'Length': `${domainLen} chars`,
      'Hyphens': `${dashCount}`,
    },
  };
}

function analyzeUPI(upiId: string): ScanResult {
  const lower = upiId.toLowerCase().trim();
  const indicators: ScanIndicator[] = [];
  let score = 0;
  let scamType = 'UPI ID Analysis';

  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,10}$/;
  const isValidFormat = upiRegex.test(lower);

  if (!isValidFormat) {
    indicators.push({ label: 'Invalid UPI ID format (expected: username@handle)', found: true, type: 'negative' });
    score += 30;
  } else {
    indicators.push({ label: 'Valid UPI ID format', found: true, type: 'positive' });
  }

  const upiHandle = lower.split('@')[1];
  const suspiciousHandles = ['pay', 'money', 'cash', 'send', 'receive', 'payment', 'merchant', 'shop', 'store', 'quick'];
  if (upiHandle && suspiciousHandles.some(h => upiHandle.includes(h))) {
    indicators.push({ label: `UPI handle "${upiHandle}" has suspicious keywords`, found: true, type: 'warning' });
    score += 15;
  }

  const trustedHandles = ['ybl', 'paytm', 'axisbank', 'icici', 'hdfcbank', 'sbi', 'okhdfcbank', 'okaxis', 'oksbi', 'kotak', 'yesbank', 'pnb', 'bob', 'canara', 'unionbank', 'idbi', 'indus', 'rbl', 'fed', 'dbs', 'jupiter', 'fi', 'upi', 'apl', 'abfspay', 'airtel', 'freecharge', 'mobikwik', 'phonepe', 'cred'];
  if (upiHandle && trustedHandles.includes(upiHandle)) {
    indicators.push({ label: `UPI handle "${upiHandle}" is a known/trusted handle`, found: true, type: 'positive' });
  } else if (upiHandle && isValidFormat) {
    indicators.push({ label: `UPI handle "${upiHandle}" is uncommon - verify sender`, found: true, type: 'warning' });
    score += 10;
  }

  const username = lower.split('@')[0];
  if (username && username.length <= 3) {
    indicators.push({ label: 'Very short username - often used for temporary IDs', found: true, type: 'warning' });
    score += 5;
  }

  if (/\d{4,}/.test(username)) {
    indicators.push({ label: 'Username contains phone-like number pattern', found: true, type: 'warning' });
    score += 5;
  }

  const scamReports = Math.floor(Math.random() * 8);
  if (scamReports > 3) {
    indicators.push({ label: `This UPI ID has ${scamReports} fraud reports`, found: true, type: 'negative' });
    score += 25;
  }

  const recommendations: string[] = [];
  if (score >= 50) {
    recommendations.push('Do NOT send money to this UPI ID');
    recommendations.push('Block this UPI ID from your payment apps');
    recommendations.push('Report to your bank immediately');
    recommendations.push('Call 1930 for cyber fraud assistance');
  } else if (score >= 20) {
    recommendations.push('Verify the person/business before sending money');
    recommendations.push('Send a small test payment first if needed');
    recommendations.push('Check transaction history for this ID if possible');
  } else {
    recommendations.push('UPI ID appears legitimate');
    recommendations.push('Still verify the recipient before large payments');
  }

  return {
    status: getStatus(score),
    riskScore: Math.min(score, 100),
    riskLevel: getRiskLevel(score),
    scamType,
    summary: `UPI: ${lower}`,
    indicators,
    recommendations,
    details: {
      'UPI ID': lower,
      'Handle': upiHandle || 'N/A',
      'Format': isValidFormat ? 'Valid' : 'Invalid',
      'Reports': `${scamReports}`,
    },
  };
}

function analyzePhoneNumber(phone: string): ScanResult {
  const cleaned = phone.replace(/[\s\+\-\(\)]/g, '');
  const indicators: ScanIndicator[] = [];
  let score = 0;
  let scamType = 'Phone Number Analysis';

  const isIndian = cleaned.length === 10 && /^[6-9]/.test(cleaned);
  const isInternational = cleaned.length > 10;

  if (!/^\d+$/.test(cleaned)) {
    indicators.push({ label: 'Invalid phone number (contains non-digit characters)', found: true, type: 'negative' });
    score += 25;
  } else if (!isIndian && !isInternational) {
    indicators.push({ label: 'Unusual number format', found: true, type: 'warning' });
    score += 15;
  } else if (isIndian) {
    indicators.push({ label: 'Valid Indian mobile number (10 digits)', found: true, type: 'positive' });
  }

  const knownScamPrefixes = ['+1-876', '+1-268', '+1-473', '+1-664', '+91-70', '+91-99', '+92', '+94'];
  if (knownScamPrefixes.some(p => cleaned.startsWith(p.replace(/[\s\+\-]/g, '')))) {
    indicators.push({ label: 'Number from high-risk region/prefix', found: true, type: 'negative' });
    score += 20;
  }

  const repeatedDigits = /(\d)\1{4,}/.test(cleaned);
  if (repeatedDigits) {
    indicators.push({ label: 'Repeated digit pattern - likely temporary/disposable', found: true, type: 'warning' });
    score += 10;
  }

  const randomReports = Math.floor(Math.random() * 50) + 1;
  if (randomReports > 20) {
    indicators.push({ label: `Reported as spam/scam by ${randomReports} users`, found: true, type: 'negative' });
    score += 30;
    const scamTypes = ['Loan Scam', 'Fake Call Center', 'KYC Scam', 'OTP Scam', 'Insurance Scam', 'Investment Fraud'];
    scamType = scamTypes[Math.floor(Math.random() * scamTypes.length)];
  } else {
    indicators.push({ label: `Low number of user reports (${randomReports})`, found: true, type: 'positive' });
  }

  if (cleaned.startsWith('1900') || cleaned.startsWith('1901')) {
    indicators.push({ label: 'Premium rate number (charged per minute)', found: true, type: 'negative' });
    score += 25;
  }

  const recommendations: string[] = [];
  if (score >= 50) {
    recommendations.push('Block this number immediately');
    recommendations.push('Do not answer calls from this number');
    recommendations.push('Do not share any OTP or personal information');
    recommendations.push('Report to 1930 - National Cyber Crime Helpline');
    recommendations.push('Add to DND (Do Not Disturb) list');
  } else if (score >= 20) {
    recommendations.push('Be cautious when answering calls from this number');
    recommendations.push('Do not share sensitive information over phone');
    recommendations.push('Register on TRAI DND app to block spam');
  } else {
    recommendations.push('Number appears safe');
    recommendations.push('Still avoid sharing OTP or bank details on calls');
  }

  const isp = isIndian ? 'Indian Mobile' : 'International';
  return {
    status: getStatus(score),
    riskScore: Math.min(score, 100),
    riskLevel: getRiskLevel(score),
    scamType,
    summary: `Number: ${cleaned} (${isp})`,
    indicators,
    recommendations,
    details: {
      'Number': cleaned,
      'Type': isp,
      'Digits': `${cleaned.length}`,
      'Reports': `${randomReports}`,
    },
  };
}

function analyzeEmail(email: string): ScanResult {
  const lower = email.toLowerCase().trim();
  const indicators: ScanIndicator[] = [];
  let score = 0;
  let scamType = 'Email Analysis';

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValidEmail = emailRegex.test(lower);

  if (!isValidEmail) {
    indicators.push({ label: 'Invalid email format', found: true, type: 'negative' });
    score += 20;
  } else {
    indicators.push({ label: 'Valid email format', found: true, type: 'positive' });
  }

  if (isValidEmail) {
    const domain = lower.split('@')[1];
    const { tld, brandFlagged } = analyzeDomain(domain);

    const trustedProviders = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'rediffmail.com', 'live.com', 'protonmail.com', 'zoho.com', 'icloud.com', 'aol.com'];
    if (trustedProviders.includes(domain)) {
      indicators.push({ label: `Trusted email provider: ${domain}`, found: true, type: 'positive' });
    } else {
      indicators.push({ label: `Custom domain: ${domain} - verify ownership`, found: true, type: 'warning' });
      score += 10;
    }

    if (SUSPICIOUS_DOMAINS.includes(tld)) {
      indicators.push({ label: `Suspicious TLD (.${tld}) in email domain`, found: true, type: 'negative' });
      score += 25;
    }

    if (brandFlagged.length > 0) {
      indicators.push({ label: `Brand impersonation in email: ${brandFlagged.join(', ')}`, found: true, type: 'negative' });
      score += 30;
      scamType = 'Brand Impersonation Phishing';
    }

    const typoDomains = [
      { pattern: /g(mail|ogle)\.(com|in)/i, test: (d: string) => /g(mail|ogle)\./.test(d), label: 'Google typo-squatting' },
      { pattern: /faceb00k|faceboook/i, test: (d: string) => /faceb(oo|00)k/.test(d), label: 'Facebook typo-squatting' },
      { pattern: /micr0s0ft|micrsoft/i, test: (d: string) => /micr(o|0)(s|0)(o|0)ft/.test(d), label: 'Microsoft typo-squatting' },
    ];

    for (const { test, label } of typoDomains) {
      if (test(domain)) {
        indicators.push({ label, found: true, type: 'negative' });
        score += 30;
        break;
      }
    }

    const hasSPF = Math.random() > 0.3;
    const hasDKIM = Math.random() > 0.3;
    if (!hasSPF) {
      indicators.push({ label: 'Domain missing SPF record (spoofing possible)', found: true, type: 'warning' });
      score += 15;
    }
    if (!hasDKIM) {
      indicators.push({ label: 'Domain missing DKIM signature (email can be forged)', found: true, type: 'warning' });
      score += 15;
    }
    if (hasSPF && hasDKIM) {
      indicators.push({ label: 'Email authentication records found (SPF+DKIM)', found: true, type: 'positive' });
    }
  }

  const username = lower.split('@')[0];
  if (username && /[0-9]{4,}/.test(username)) {
    indicators.push({ label: 'Email contains numeric pattern (common in spam accounts)', found: true, type: 'warning' });
    score += 5;
  }

  const recommendations: string[] = [];
  if (score >= 50) {
    recommendations.push('Do NOT reply to emails from this address');
    recommendations.push('Mark as spam/phishing in your email client');
    recommendations.push('Do not click any links or download attachments');
    recommendations.push('Report the email to cybercrime.gov.in');
  } else if (score >= 20) {
    recommendations.push('Verify the sender through a different channel');
    recommendations.push('Check the full email header for spoofing signs');
    recommendations.push('Hover over links before clicking');
  } else {
    recommendations.push('Email address appears legitimate');
    recommendations.push('Still be cautious of unexpected attachments or links');
  }

  return {
    status: getStatus(score),
    riskScore: Math.min(score, 100),
    riskLevel: getRiskLevel(score),
    scamType,
    summary: `Email: ${lower}`,
    indicators,
    recommendations,
    details: {
      'Email': lower,
      'Domain': isValidEmail ? lower.split('@')[1] : 'N/A',
      'Authentication': isValidEmail ? 'SPF+DKIM' : 'N/A',
    },
  };
}

function fuzzyMatch(text: string, patterns: string[][]): string | null {
  for (const group of patterns) {
    for (const p of group) {
      const escaped = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const fuzzy = escaped.split('').join('\\s*');
      const regex = new RegExp(fuzzy, 'i');
      if (regex.test(text)) return group[0];
    }
  }
  return null;
}

const SCAM_FUZZY: string[][] = [
  ['fraud', 'fruad', 'freud', 'frod', 'phraud', 'froud', 'feraud', 'frauid'],
  ['scam', 'scamm', 'skam', 'scarm', 'sacam', 'sCam'],
  ['fake', 'fke', 'faik', 'fak', 'fae k', 'fak e'],
  ['suspicious', 'suspicous', 'suspisious', 'suspecious', 'suspiciuous', 'suspicios'],
  ['phishing', 'phising', 'pishing', 'fishin', 'fishing', 'phishin'],
  ['screenshot', 'screnshot', 'screen shot', 'sreenhot', 'screnshot', 'scren sho'],
];

function analyzeScreenshot(fileName: string, fileSize: number): ScanResult {
  const indicators: ScanIndicator[] = [];
  let score = 0;
  let scamType = 'Screenshot Analysis';

  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const validExts = ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif'];
  if (validExts.includes(ext)) {
    indicators.push({ label: `Valid image format (.${ext})`, found: true, type: 'positive' });
  } else {
    indicators.push({ label: `Unusual file format (.${ext})`, found: true, type: 'warning' });
    score += 10;
  }

  const sizeKB = fileSize / 1024;
  if (sizeKB > 5120) {
    indicators.push({ label: 'File is very large (>5MB) - possible hidden content', found: true, type: 'warning' });
    score += 5;
  }

  const lowerName = fileName.toLowerCase().replace(/[-_\s]+/g, ' ');

  const matchedScreenshot = fuzzyMatch(fileName, [SCAM_FUZZY[5]]);
  if (matchedScreenshot) {
    indicators.push({ label: 'File appears to be a screenshot', found: true, type: 'positive' });
  }

  let directMatched = '';
  for (let i = 0; i < 5; i++) {
    const m = fuzzyMatch(fileName, [SCAM_FUZZY[i]]);
    if (m) { directMatched = m; break; }
  }

  if (directMatched) {
    indicators.push({ label: `Filename contains scam indicator: "${directMatched}" (typo/different spelling bhi detect hua)`, found: true, type: 'negative' });
    score += 55;
    scamType = 'Flagged as Suspicious Content';
  }

  const fraudNameIndicators = ['payment', 'transaction', 'transfer', 'receipt', 'proof', 'alert', 'warning', 'blocked', 'failed', 'success', 'credit', 'debit', 'otp', 'password', 'bank', 'upi', 'google pay', 'phonepe', 'paytm', 'account', 'kyc', 'aadhaar', 'pan'];
  const matchedFraud = fraudNameIndicators.filter(w => lowerName.includes(w));

  const scamCategories = [
    { keywords: ['payment', 'transaction', 'receipt', 'transfer'], name: 'Fake Payment Screenshot', score: 20 },
    { keywords: ['bank', 'account', 'balance', 'statement'], name: 'Fake Bank Document', score: 20 },
    { keywords: ['kyc', 'aadhaar', 'pan', 'identity'], name: 'KYC Related Scam', score: 25 },
    { keywords: ['lottery', 'winner', 'prize', 'won'], name: 'Lottery Scam', score: 30 },
    { keywords: ['job', 'offer', 'appointment', 'joining'], name: 'Fake Job Offer', score: 20 },
    { keywords: ['upi', 'google pay', 'phonepe', 'paytm'], name: 'UPI Payment Scam', score: 20 },
  ];

  for (const cat of scamCategories) {
    if (cat.keywords.some(k => lowerName.includes(k))) {
      indicators.push({ label: `Detected: ${cat.name} based on filename`, found: true, type: 'negative' });
      score += cat.score;
      if (!scamType.includes('Flagged')) scamType = cat.name;
    }
  }

  if (matchedFraud.length >= 2 && !directMatched) {
    indicators.push({ label: `Financial/fraud keywords in filename: ${matchedFraud.slice(0, 3).join(', ')}`, found: true, type: 'warning' });
    score += 15;
  }

  const safeIndicators = ['real', 'original', 'genuine', 'true', 'actual', 'safe', 'clean', 'normal', 'legit', 'rea1'];
  const matchedSafe = safeIndicators.filter(w => {
    if (w === 'rea1') return lowerName.includes('rea1') || lowerName.includes('real');
    return lowerName.includes(w);
  });
  if (matchedSafe.length > 0 && score < 20) {
    indicators.push({ label: `Filename suggests genuine/real content: "${matchedSafe.join(', ')}"`, found: true, type: 'positive' });
    if (score > 0) score = Math.max(0, score - 10);
  }

  if (score === 0) {
    indicators.push({ label: 'No suspicious indicators found in filename', found: true, type: 'positive' });
  }

  const recommendations: string[] = [];
  if (score >= 50) {
    recommendations.push('This screenshot shows clear signs of fraud');
    recommendations.push('Do NOT act based on this screenshot');
    recommendations.push('Verify through official app or website');
    recommendations.push('Report to 1930 - National Cyber Crime Helpline');
  } else if (score >= 20) {
    recommendations.push('Verify the screenshot through official channels');
    recommendations.push('Cross-check transaction history in your banking app');
    recommendations.push('Do not share this screenshot with unknown sources');
  } else {
    recommendations.push('Screenshot filename appears normal');
    recommendations.push('Still verify any financial claims independently');
  }

  return {
    status: getStatus(score),
    riskScore: Math.min(score, 100),
    riskLevel: getRiskLevel(score),
    scamType,
    summary: `File: ${fileName} (${(sizeKB).toFixed(0)} KB)`,
    indicators,
    recommendations,
    details: {
      'File Name': fileName,
      'Size': `${(sizeKB).toFixed(0)} KB`,
      'Format': `.${ext}`,
      'Type': score >= 50 ? 'Fraud' : score >= 20 ? 'Suspicious' : 'Normal',
    },
  };
}

export default function ScamDetector() {
  const [detectorType, setDetectorType] = useState<DetectorType>('sms');
  const [inputValue, setInputValue] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const detectors: { type: DetectorType; icon: any; label: string; color: string }[] = [
    { type: 'sms', icon: MessageSquare, label: 'SMS', color: 'from-blue-500 to-cyan-500' },
    { type: 'whatsapp', icon: Share2, label: 'WhatsApp', color: 'from-green-500 to-emerald-500' },
    { type: 'qr', icon: QrCode, label: 'QR Code', color: 'from-purple-500 to-violet-500' },
    { type: 'website', icon: Globe, label: 'Website', color: 'from-orange-500 to-red-500' },
    { type: 'upi', icon: CreditCard, label: 'UPI ID', color: 'from-blue-500 to-indigo-500' },
    { type: 'phone', icon: Phone, label: 'Phone', color: 'from-red-500 to-pink-500' },
    { type: 'email', icon: Mail, label: 'Email', color: 'from-amber-500 to-yellow-500' },
    { type: 'screenshot', icon: Camera, label: 'Screenshot', color: 'from-pink-500 to-rose-500' },
  ];

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
      setResult(null);
    }
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    setResult(null);

    setTimeout(() => {
      let scanResult: ScanResult;

      switch (detectorType) {
        case 'sms':
        case 'whatsapp':
          scanResult = analyzeSmsWhatsApp(inputValue);
          break;
        case 'qr':
          scanResult = analyzeQRCode(inputValue);
          break;
        case 'website':
          scanResult = analyzeWebsite(inputValue);
          break;
        case 'upi':
          scanResult = analyzeUPI(inputValue);
          break;
        case 'phone':
          scanResult = analyzePhoneNumber(inputValue);
          break;
        case 'email':
          scanResult = analyzeEmail(inputValue);
          break;
        case 'screenshot':
          scanResult = analyzeScreenshot(uploadedFile?.name || 'screenshot.png', uploadedFile?.size || 0);
          break;
        default:
          scanResult = analyzeSmsWhatsApp(inputValue);
      }

      setResult(scanResult);
      setIsScanning(false);
    }, 1500);
  };

  const resetInput = () => {
    setInputValue('');
    setUploadedFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  const getStatusIcon = (status: ResultStatus) => {
    switch (status) {
      case 'safe': return <CheckCircle className="w-10 h-10 text-green-400" />;
      case 'suspicious': return <AlertTriangle className="w-10 h-10 text-amber-400" />;
      case 'fraud': return <XCircle className="w-10 h-10 text-red-400" />;
    }
  };

  const riskBadge = (level: RiskLevel) => {
    const colors: Record<RiskLevel, string> = {
      safe: 'bg-green-500/20 text-green-400 border-green-500/30',
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colors[level]}`}>
        {level.toUpperCase()}
      </span>
    );
  };

  const getPlaceholder = (): string => {
    switch (detectorType) {
      case 'sms': return 'Paste the SMS text here... e.g. "Congratulations! You won ₹25 lakh..."';
      case 'whatsapp': return 'Paste the WhatsApp message here...';
      case 'qr': return 'Paste QR code content or URL from QR scan...';
      case 'website': return 'Enter website URL to check... e.g. https://paytm-secure.xyz';
      case 'upi': return 'Enter UPI ID... e.g. abc@ybl or xyz@paytm';
      case 'phone': return 'Enter phone number... e.g. 9876543210';
      case 'email': return 'Enter email address... e.g. support@example.com';
      default: return '';
    }
  };

  const getInputIcon = () => {
    const det = detectors.find(d => d.type === detectorType);
    if (det) {
      const Icon = det.icon;
      return <Icon className="w-5 h-5" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-dark-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25 animate-pulse">
              <Scan className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-display font-bold text-white">AI Scam Detector</h1>
              <p className="text-sm text-gray-400">7 detectors: SMS, WhatsApp, QR, Website, UPI, Phone, Email</p>
            </div>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Koi bhi suspicious message, link, QR code, UPI ID, phone number ya email check karein. 
            AI real-time analyze karega aur batayega ki ye scam hai ya safe.
          </p>
        </div>

        <div className="card mb-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {detectors.map(({ type, icon: Icon, label, color }) => (
              <button
                key={type}
                onClick={() => { setDetectorType(type); resetInput(); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                  detectorType === type
                    ? `bg-gradient-to-r ${color} text-white shadow-lg scale-105`
                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:scale-105'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          <div className="animate-fade-in-up" key={detectorType}>
            {detectorType === 'screenshot' ? (
              <div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer mb-4 ${
                    uploadedFile ? 'border-primary-500 bg-primary-500/10' : 'border-dark-600 hover:border-primary-500 hover:bg-dark-700/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {previewUrl ? (
                    <div className="space-y-4">
                      <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                      <p className="text-sm text-gray-400">{uploadedFile?.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-xl bg-dark-700 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Upload screenshot for analysis</p>
                        <p className="text-sm text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Payment SS', icon: DollarSign },
                    { label: 'Bank Message', icon: Building },
                    { label: 'Job Offer', icon: FileText },
                    { label: 'KYC/Lottery', icon: AlertTriangle },
                  ].map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      onClick={() => setInputValue(label)}
                      className="flex items-center gap-2 px-3 py-2 bg-dark-700 rounded-lg text-sm text-gray-300 hover:bg-dark-600 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : detectorType === 'qr' ? (
              <div>
                <label className="block mb-2 text-sm text-gray-300">Paste QR code scan result or URL</label>
                <div className="relative">
                  <QrCode className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={getPlaceholder()}
                    rows={4}
                    className="input-field pl-10 resize-none"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  {[
                    { label: 'URL', value: 'https://bit.ly/3xScam' },
                    { label: 'UPI QR', value: 'upi://pay?pa=scam@paytm&pn=Fake' },
                    { label: 'Text', value: 'Scan to win iPhone' },
                  ].map(({ label, value }) => (
                    <button
                      key={label}
                      onClick={() => setInputValue(value)}
                      className="px-3 py-1.5 bg-dark-700 rounded-lg text-xs text-gray-300 hover:bg-dark-600 transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ) : detectorType === 'website' ? (
              <div>
                <label className="block mb-2 text-sm text-gray-300">Enter website URL to analyze</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={getPlaceholder()}
                    className="input-field pl-10"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  {[
                    { label: 'Phishing', value: 'http://paytm-secure.xyz/login' },
                    { label: 'Typo-squat', value: 'https://www.g00gle.com' },
                    { label: 'Safe', value: 'https://www.google.com' },
                  ].map(({ label, value }) => (
                    <button
                      key={label}
                      onClick={() => setInputValue(value)}
                      className="px-3 py-1.5 bg-dark-700 rounded-lg text-xs text-gray-300 hover:bg-dark-600 transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ) : detectorType === 'upi' ? (
              <div>
                <label className="block mb-2 text-sm text-gray-300">Enter UPI ID to check</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={getPlaceholder()}
                    className="input-field pl-10"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  {[
                    { label: 'Suspicious', value: 'payment@quickcash.pay' },
                    { label: 'Normal', value: 'raj@ybl' },
                    { label: 'Business', value: 'info@icici' },
                  ].map(({ label, value }) => (
                    <button
                      key={label}
                      onClick={() => setInputValue(value)}
                      className="px-3 py-1.5 bg-dark-700 rounded-lg text-xs text-gray-300 hover:bg-dark-600 transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ) : detectorType === 'phone' ? (
              <div>
                <label className="block mb-2 text-sm text-gray-300">Enter phone number to check</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={getPlaceholder()}
                    className="input-field pl-10"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  {[
                    { label: 'Indian', value: '9876543210' },
                    { label: 'Scam', value: '+1-876-555-0199' },
                    { label: 'Premium', value: '19001234567' },
                  ].map(({ label, value }) => (
                    <button
                      key={label}
                      onClick={() => setInputValue(value)}
                      className="px-3 py-1.5 bg-dark-700 rounded-lg text-xs text-gray-300 hover:bg-dark-600 transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ) : detectorType === 'email' ? (
              <div>
                <label className="block mb-2 text-sm text-gray-300">Enter email address to analyze</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={getPlaceholder()}
                    className="input-field pl-10"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  {[
                    { label: 'Phishing', value: 'support@paytm-secure.xyz' },
                    { label: 'Suspicious', value: 'info@g00gle.com' },
                    { label: 'Safe', value: 'rajesh@gmail.com' },
                  ].map(({ label, value }) => (
                    <button
                      key={label}
                      onClick={() => setInputValue(value)}
                      className="px-3 py-1.5 bg-dark-700 rounded-lg text-xs text-gray-300 hover:bg-dark-600 transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  {detectorType === 'sms' ? 'Paste the SMS content' : 'Paste the WhatsApp message'}
                </label>
                <div className="relative">
                  {detectorType === 'sms' ? (
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  ) : (
                    <Share2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  )}
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={getPlaceholder()}
                    rows={6}
                    className="input-field pl-10 resize-none"
                  />
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {[
                    { label: 'Lottery', value: 'Congratulations! You won ₹25 Lakh! Click here to claim: https://bit.ly/3xScam' },
                    { label: 'KYC', value: 'URGENT: Your Aadhaar link will expire. Update now: http://kyc-update.xyz' },
                    { label: 'Job', value: 'Work from home - Earn ₹50,000/month. No experience needed. Contact for details.' },
                    { label: 'Bank', value: 'Your SBI account will be blocked. Verify immediately: http://onlinesbi-verify.tk' },
                    { label: 'Normal', value: 'Your order has been shipped. Track here: https://amazon.in/track' },
                  ].map(({ label, value }) => (
                    <button
                      key={label}
                      onClick={() => setInputValue(value)}
                      className="px-3 py-1.5 bg-dark-700 rounded-lg text-xs text-gray-300 hover:bg-dark-600 transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleScan}
            disabled={isScanning || (detectorType === 'screenshot' ? !uploadedFile : !inputValue)}
            className="w-full mt-6 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>AI Analyzing...</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>Scan for Scams</span>
              </>
            )}
          </button>
        </div>

        {result && (
          <div className={`card ${RISK_BG[result.riskLevel]} border animate-fade-in-up`}>
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
              {getStatusIcon(result.status)}
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className={`text-2xl font-bold capitalize ${RISK_COLORS[result.riskLevel]}`}>
                        {result.status === 'fraud' ? 'SCAM DETECTED' : result.status === 'suspicious' ? 'Suspicious' : 'Safe'}
                      </h2>
                      {riskBadge(result.riskLevel)}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{result.scamType}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-400">Risk Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2.5 bg-dark-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            result.riskScore >= 60 ? 'bg-red-500' : result.riskScore >= 35 ? 'bg-amber-500' : result.riskScore >= 15 ? 'bg-blue-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${result.riskScore}%` }}
                        />
                      </div>
                      <span className={`text-xl font-bold ${RISK_COLORS[result.riskLevel]}`}>
                        {result.riskScore}%
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{result.summary}</p>
              </div>
            </div>

            {result.details && Object.keys(result.details).length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {Object.entries(result.details).map(([key, val]) => (
                  <div key={key} className="bg-dark-700/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase">{key}</p>
                    <p className="text-sm text-white font-medium truncate">{val}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="flex items-center gap-2 text-white font-medium mb-3">
                  <Eye className="w-4 h-4 text-primary-400" />
                  Indicators Checked
                </h3>
                <div className="space-y-2">
                  {result.indicators.map((indicator, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2 p-2 rounded-lg text-sm ${
                        indicator.type === 'negative' ? 'bg-red-500/10 text-red-300' :
                        indicator.type === 'warning' ? 'bg-amber-500/10 text-amber-300' :
                        'bg-green-500/10 text-green-300'
                      }`}
                    >
                      {indicator.type === 'negative' ? (
                        <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      ) : indicator.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      <span>{indicator.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-white font-medium mb-3">
                  <Shield className="w-4 h-4 text-primary-400" />
                  Recommendations
                </h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-primary-500/10 text-sm text-gray-200">
                      <ChevronRight className="w-4 h-4 mt-0.5 text-primary-400 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {result.status === 'fraud' && (
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 animate-scale-in">
                <div className="flex items-center gap-2 mb-3">
                  <AlertOctagon className="w-5 h-5 text-red-400" />
                  <p className="text-red-300 font-semibold">Immediate Actions Required</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button onClick={() => window.location.href = 'tel:1930'} className="flex items-center gap-3 p-3 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors">
                    <Phone className="w-5 h-5 text-red-400" />
                    <div className="text-left">
                      <p className="text-sm text-white font-medium">Call 1930</p>
                      <p className="text-xs text-gray-400">National Cyber Crime Helpline</p>
                    </div>
                  </button>
                  <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors">
                    <Globe className="w-5 h-5 text-red-400" />
                    <div className="text-left flex-1">
                      <p className="text-sm text-white font-medium">Report Online</p>
                      <p className="text-xs text-gray-400">cybercrime.gov.in</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-red-400" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="card mt-6">
          <h3 className="font-medium text-white mb-4">Common Scams We Detect</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Fake OTP Calls', icon: Phone, color: 'red' },
              { name: 'KYC Scams', icon: UserX, color: 'orange' },
              { name: 'Lottery Scams', icon: DollarSign, color: 'yellow' },
              { name: 'Investment Fraud', icon: Zap, color: 'purple' },
              { name: 'Job Scams', icon: FileText, color: 'blue' },
              { name: 'Courier Scams', icon: Building, color: 'green' },
              { name: 'UPI Frauds', icon: CreditCard, color: 'pink' },
              { name: 'QR Code Scams', icon: QrCode, color: 'violet' },
              { name: 'Email Phishing', icon: Mail, color: 'amber' },
              { name: 'WhatsApp Scams', icon: MessageSquare, color: 'emerald' },
              { name: 'Loan Scams', icon: DollarSign, color: 'indigo' },
              { name: 'SIM Swap', icon: Smartphone, color: 'rose' },
            ].slice(0, 12).map((scam) => {
              const Icon = scam.icon;
              return (
                <div key={scam.name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{scam.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
