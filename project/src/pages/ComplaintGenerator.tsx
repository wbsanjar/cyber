import { useState, useRef } from 'react';
import {
  AlertTriangle,
  Shield,
  Upload,
  FileText,
  Phone,
  Calendar,
  DollarSign,
  User,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Copy,
  Download,
  Printer,
  Languages,
  Search,
  Clock,
  AlertCircle,
  Lightbulb,
  ListChecks,
  FileSpreadsheet,
  Building,
  Scale,
  Share2,
  X,
  Sparkles,
  Smartphone,
  Banknote,
  Hash,
  Mic,
  Image,
  Receipt,
  MessageCircle,
} from 'lucide-react';

const fraudTypes = [
  { id: 'upi', label: 'UPI Fraud', icon: '💳', description: 'Money transferred to wrong account or fake UPI' },
  { id: 'whatsapp', label: 'WhatsApp Scam', icon: '📱', description: 'Fake messages asking for money or OTP' },
  { id: 'otp', label: 'OTP Scam', icon: '🔐', description: 'Fake calls asking for OTP to steal money' },
  { id: 'job', label: 'Job Scam', icon: '💼', description: 'Fake job offers, work from home scams' },
  { id: 'kyc', label: 'KYC Scam', icon: '🪪', description: 'Fake KYC update requests' },
  { id: 'bank', label: 'Bank Fraud', icon: '🏦', description: 'Fake bank calls, ATM fraud, card cloning' },
  { id: 'investment', label: 'Investment Fraud', icon: '📈', description: 'Fake investment schemes, crypto scams' },
  { id: 'lottery', label: 'Lottery Scam', icon: '🎰', description: 'Fake lottery, prize scams' },
  { id: 'olx', label: 'OLX Scam', icon: '🛒', description: 'Fake buyers/sellers, advance payment fraud' },
  { id: 'telegram', label: 'Telegram Scam', icon: '📨', description: 'Fake investment groups, job scams' },
  { id: 'instagram', label: 'Instagram Scam', icon: '📸', description: 'Fake accounts, giveaway scams' },
  { id: 'facebook', label: 'Facebook Scam', icon: '📘', description: 'Fake profiles, marketplace scams' },
  { id: 'other', label: 'Other', icon: '📋', description: 'Any other type of cyber fraud' },
];

const docTypes = [
  { id: 'police', label: 'Police Complaint Letter', icon: Building },
  { id: 'cybercrime', label: 'Cyber Crime Complaint', icon: Scale },
  { id: 'summary', label: 'Incident Summary', icon: FileText },
  { id: 'evidence', label: 'Evidence List', icon: ListChecks },
  { id: 'timeline', label: 'Timeline of Events', icon: Clock },
  { id: 'nextsteps', label: 'Recommended Next Steps', icon: Lightbulb },
];

const evidenceTypes = [
  { id: 'screenshot', label: 'Screenshot', icon: Image },
  { id: 'receipt', label: 'Bank Receipt', icon: Receipt },
  { id: 'chat', label: 'Chat Screenshot', icon: MessageCircle },
  { id: 'audio', label: 'Audio Recording', icon: Mic },
];

interface EvidenceFile {
  file: File;
  type: string;
  preview: string;
}

export default function ComplaintGenerator() {
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [grammarCorrect, setGrammarCorrect] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState('police');
  const printRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    fraudType: '',
    dateTime: '',
    amountLost: '',
    bankApp: '',
    fraudsterMobile: '',
    fraudsterUpi: '',
    transactionId: '',
    description: '',
  });

  const [evidence, setEvidence] = useState<EvidenceFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedDocs, setGeneratedDocs] = useState<Record<string, string>>({});
  const [aiAnalysis, setAiAnalysis] = useState({
    fraudType: '',
    timeline: '',
    missingInfo: [] as string[],
    riskLevel: '',
    riskScore: 0,
  });

  const t = (en: string, hi: string) => language === 'hi' ? hi : en;

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = Array.from(e.target.files || []);
    const newFiles: EvidenceFile[] = files.map(file => ({
      file,
      type,
      preview: URL.createObjectURL(file),
    }));
    setEvidence(prev => [...prev, ...newFiles]);
  };

  const removeEvidence = (index: number) => {
    setEvidence(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const detectMissingInfo = () => {
    const missing: string[] = [];
    if (!formData.dateTime) missing.push(t('Date & Time of Incident', 'घटना की तिथि और समय'));
    if (!formData.amountLost) missing.push(t('Amount Lost', 'खोई हुई राशि'));
    if (!formData.bankApp) missing.push(t('Bank/UPI App Name', 'बैंक/UPI ऐप का नाम'));
    if (!formData.transactionId) missing.push(t('Transaction ID', 'लेन-देन आईडी'));
    if (!formData.fraudsterMobile && !formData.fraudsterUpi) {
      missing.push(t('Fraudster Details (Mobile or UPI ID)', 'धोखेबाज का विवरण (मोबाइल या UPI ID)'));
    }
    if (!formData.description || formData.description.length < 30) {
      missing.push(t('Detailed Description of Incident', 'घटना का विस्तृत विवरण'));
    }
    if (evidence.length === 0) missing.push(t('Evidence (Screenshots, Receipts, etc.)', 'सबूत (स्क्रीनशॉट, रसीद, आदि)'));
    return missing;
  };

  const analyzeFraud = () => {
    const missingInfo = detectMissingInfo();
    const fraudLabel = fraudTypes.find(f => f.id === formData.fraudType)?.label || 'Cyber Fraud';
    let riskScore = 0;

    const amount = parseInt(formData.amountLost) || 0;
    if (amount >= 50000) riskScore += 35;
    else if (amount >= 10000) riskScore += 25;
    else if (amount >= 1000) riskScore += 15;
    else riskScore += 5;

    if (formData.fraudType) riskScore += 15;
    if (formData.fraudsterMobile || formData.fraudsterUpi) riskScore += 15;
    if (formData.transactionId) riskScore += 10;
    if (evidence.length > 0) riskScore += 10;
    if ((formData.description?.length || 0) > 50) riskScore += 10;
    if (formData.bankApp) riskScore += 5;

    riskScore = Math.min(riskScore, 100);

    let riskLevel = t('Low', 'कम');
    if (riskScore >= 70) riskLevel = t('Critical', 'गंभीर');
    else if (riskScore >= 40) riskLevel = t('Medium', 'मध्यम');

    const date = formData.dateTime
      ? new Date(formData.dateTime).toLocaleDateString('en-IN', {
          day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        })
      : t('Not specified', 'निर्दिष्ट नहीं');

    setAiAnalysis({
      fraudType: fraudLabel,
      timeline: date,
      missingInfo,
      riskLevel,
      riskScore,
    });
  };

  const generateAllDocuments = () => {
    const fraudLabel = fraudTypes.find(f => f.id === formData.fraudType)?.label || 'Cyber Fraud';
    const date = new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
    const complaintId = `CSF/${new Date().getFullYear()}/${Math.floor(Math.random() * 100000)}`;
    const amount = formData.amountLost ? `₹${parseInt(formData.amountLost).toLocaleString('en-IN')}` : 'N/A';

    const docs: Record<string, string> = {};

    docs.police = generatePoliceComplaint(fraudLabel, date, complaintId, amount);
    docs.cybercrime = generateCyberCrimeComplaint(fraudLabel, date, complaintId, amount);
    docs.summary = generateIncidentSummary(fraudLabel, amount);
    docs.evidence = generateEvidenceList();
    docs.timeline = generateTimeline(fraudLabel);
    docs.nextsteps = generateNextSteps();

    setGeneratedDocs(docs);
  };

  const generatePoliceComplaint = (fraudLabel: string, date: string, complaintId: string, amount: string) => {
    const isHindi = language === 'hi';
    if (isHindi) {
      return `प्रार्थना पत्र
साइबर अपराध शिकायत

दिनांक: ${date}
संदर्भ संख्या: ${complaintId}

सेवा में,
थाना प्रभारी
साइबर अपराध पुलिस स्टेशन
[शहर का नाम]

विषय: ${fraudLabel} के संबंध में शिकायत

महोदय/महोदया,

मैं ${formData.name || '______'}, निवासी [पूरा पता], आपके समक्ष निम्नलिखित शिकायत प्रस्तुत करता/करती हूं:

शिकायतकर्ता का विवरण:
- नाम: ${formData.name || '______'}
- मोबाइल: ${formData.mobile || '______'}
- ईमेल: ${formData.email || '______'}

घटना का विवरण:
- धोखाधड़ी का प्रकार: ${fraudLabel}
- घटना की तिथि एवं समय: ${formData.dateTime ? new Date(formData.dateTime).toLocaleString('hi-IN') : '______'}
- खोई गई राशि: ${amount}
- बैंक/UPI ऐप: ${formData.bankApp || '______'}
- लेन-देन आईडी: ${formData.transactionId || '______'}

घटना का विस्तृत विवरण:
${formData.description || 'उपरोक्त घटना की जांच करने का अनुरोध है।'}

धोखेबाज का विवरण:
- मोबाइल नंबर: ${formData.fraudsterMobile || 'अज्ञात'}
- UPI ID: ${formData.fraudsterUpi || 'अज्ञात'}

संलग्न साक्ष्य:
${evidence.length > 0 ? evidence.map(e => `- ${e.file.name} (${evidenceTypes.find(et => et.id === e.type)?.label || 'अन्य'})`).join('\n') : '- कोई साक्ष्य संलग्न नहीं'}

अनुरोध:
1. कृपया मेरी शिकायत दर्ज करें और मामले की जांच करें।
2. खोई गई राशि को वापस दिलाने में सहायता करें।
3. धोखेबाज के खिलाफ कानूनी कार्रवाई करें।
4. मुझे भविष्य के संदर्भ के लिए शिकायत संख्या प्रदान करें।

घोषणा:
मैं घोषणा करता/करती हूं कि ऊपर दी गई जानकारी मेरी जानकारी में सत्य और सही है।

धन्यवाद,

____________________
(हस्ताक्षर)
${formData.name || '______'}
${formData.mobile || '______'}

---
महत्वपूर्ण: इस शिकायत को यहां जमा करें:
1. ऑनलाइन: https://cybercrime.gov.in
2. कॉल: 1930 (साइबर अपराध हेल्पलाइन)
3. नजदीकी पुलिस स्टेशन में जाएं`;
    }

    return `COMPLAINT LETTER
Cyber Crime Police Station

Date: ${date}
Reference ID: ${complaintId}

To,
The Station House Officer
Cyber Crime Police Station
[City Name]

Subject: Complaint regarding ${fraudLabel}

Respected Sir/Madam,

I, ${formData.name || '______'}, hereby submit the following complaint for your kind consideration:

Complainant Details:
- Name: ${formData.name || '______'}
- Mobile: ${formData.mobile || '______'}
- Email: ${formData.email || '______'}

Incident Details:
- Type of Fraud: ${fraudLabel}
- Date & Time of Incident: ${formData.dateTime ? new Date(formData.dateTime).toLocaleString('en-IN') : '______'}
- Amount Lost: ${amount}
- Bank/UPI App: ${formData.bankApp || '______'}
- Transaction ID: ${formData.transactionId || '______'}

Detailed Description of Incident:
${formData.description || 'I request a thorough investigation into the above-mentioned incident.'}

Fraudster Details:
- Mobile Number: ${formData.fraudsterMobile || 'Unknown'}
- UPI ID: ${formData.fraudsterUpi || 'Unknown'}

Evidence Attached:
${evidence.length > 0 ? evidence.map(e => `- ${e.file.name} (${evidenceTypes.find(et => et.id === e.type)?.label || 'Other'})`).join('\n') : '- No evidence attached'}

Request:
1. Kindly register my complaint and investigate the matter thoroughly.
2. Help recover the lost amount.
3. Take strict legal action against the fraudster.
4. Provide me with the complaint number for future reference.

Declaration:
I hereby declare that all information provided above is true and correct to the best of my knowledge and belief.

Thanking You,

____________________
(Signature)
${formData.name || '______'}
${formData.mobile || '______'}

---
IMPORTANT: Submit this complaint at:
1. Online: https://cybercrime.gov.in
2. Call: 1930 (Cyber Crime Helpline)
3. Visit: Nearest Police Station with Cyber Crime Cell`;
  };

  const generateCyberCrimeComplaint = (fraudLabel: string, date: string, complaintId: string, amount: string) => {
    const isHindi = language === 'hi';
    if (isHindi) {
      return `राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल
साइबर अपराध शिकायत फॉर्म

शिकायत आईडी: ${complaintId}
दिनांक: ${date}

शिकायतकर्ता की जानकारी:
1. नाम: ${formData.name || '______'}
2. मोबाइल नंबर: ${formData.mobile || '______'}
3. ईमेल: ${formData.email || '______'}

धोखाधड़ी की जानकारी:
1. धोखाधड़ी का प्रकार: ${fraudLabel}
2. घटना की तिथि और समय: ${formData.dateTime ? new Date(formData.dateTime).toLocaleString('hi-IN') : '______'}
3. खोई गई राशि: ${amount}
4. बैंक/UPI एप्लिकेशन: ${formData.bankApp || '______'}
5. लेन-देन आईडी: ${formData.transactionId || '______'}

धोखेबाज की जानकारी:
1. मोबाइल नंबर: ${formData.fraudsterMobile || 'ज्ञात नहीं'}
2. UPI ID: ${formData.fraudsterUpi || 'ज्ञात नहीं'}

घटना का विवरण:
${formData.description || 'विवरण उपलब्ध नहीं'}

साक्ष्य:
${evidence.length > 0 ? evidence.map(e => `- ${e.file.name}`).join('\n') : 'कोई साक्ष्य नहीं'}

अनुरोधित कार्रवाई:
मैं साइबर अपराध सेल से इस घटना की जांच करने, आरोपी का पता लगाने, धोखाधड़ी वाले खाते को ब्लॉक करने और मेरे पैसे वापस दिलाने में मदद करने का अनुरोध करता/करती हूं।

____________________
शिकायतकर्ता के हस्ताक्षर`;
    }

    return `NATIONAL CYBER CRIME REPORTING PORTAL
CYBER CRIME COMPLAINT FORM

Complaint ID: ${complaintId}
Date: ${date}

Complainant Information:
1. Full Name: ${formData.name || '______'}
2. Mobile Number: ${formData.mobile || '______'}
3. Email Address: ${formData.email || '______'}

Fraud Information:
1. Type of Fraud: ${fraudLabel}
2. Date & Time of Incident: ${formData.dateTime ? new Date(formData.dateTime).toLocaleString('en-IN') : '______'}
3. Amount Lost: ${amount}
4. Bank/UPI Application: ${formData.bankApp || '______'}
5. Transaction ID: ${formData.transactionId || '______'}

Fraudster Information:
1. Mobile Number: ${formData.fraudsterMobile || 'Not Known'}
2. UPI ID: ${formData.fraudsterUpi || 'Not Known'}

Description of Incident:
${formData.description || 'No description provided'}

Evidence Attached:
${evidence.length > 0 ? evidence.map(e => `- ${e.file.name}`).join('\n') : 'No evidence'}

Action Requested:
I request the Cyber Crime Cell to investigate this incident, trace the accused, block the fraudulent account, and help recover my funds.

____________________
Signature of Complainant`;
  };

  const generateIncidentSummary = (fraudLabel: string, amount: string) => {
    const isHindi = language === 'hi';
    const dateStr = formData.dateTime
      ? new Date(formData.dateTime).toLocaleDateString('en-IN', {
          day: '2-digit', month: 'long', year: 'numeric'
        })
      : '______';
    const timeStr = formData.dateTime
      ? new Date(formData.dateTime).toLocaleTimeString('en-IN', {
          hour: '2-digit', minute: '2-digit'
        })
      : '______';

    if (isHindi) {
      return `घटना सारांश
Incident Summary

शिकायतकर्ता: ${formData.name || '______'}
दिनांक: ${dateStr}

"${formData.dateTime ? dateStr : '______'} को, ${formData.name || 'शिकायतकर्ता'} को ${formData.bankApp || 'अज्ञात'} से एक कॉल/संदेश आया जिसमें ${fraudLabel} का दावा किया गया। ${formData.fraudsterMobile ? `धोखेबाज ने ${formData.fraudsterMobile} से संपर्क किया। ` : ''}${formData.description ? formData.description.slice(0, 200) + '...' : 'धोखेबाज ने शिकायतकर्ता को धोखा देकर पैसे निकाल लिए।'} परिणामस्वरूप, ${amount} की राशि शिकायतकर्ता के खाते से बिना अधिकार के डेबिट कर ली गई।"

खोई गई राशि: ${amount}
समय: ${timeStr}
धोखाधड़ी प्रकार: ${fraudLabel}
साक्ष्य: ${evidence.length} फाइलें`;
    }

    return `INCIDENT SUMMARY

Complainant: ${formData.name || '______'}
Date: ${dateStr}

"On ${dateStr} at ${timeStr}, ${formData.name || 'the complainant'} received a call/message from ${formData.bankApp || 'an unknown source'} claiming to be regarding ${fraudLabel}. ${formData.fraudsterMobile ? `The fraudster contacted from ${formData.fraudsterMobile}. ` : ''}${formData.description ? formData.description.slice(0, 200) + '...' : 'The fraudster deceived the complainant and illegally transferred money.'} As a result, ${amount} was debited from the complainant's account without authorization."

Amount Lost: ${amount}
Time: ${timeStr}
Fraud Type: ${fraudLabel}
Evidence: ${evidence.length} file(s) attached`;
  };

  const generateEvidenceList = () => {
    const isHindi = language === 'hi';
    if (isHindi) {
      if (evidence.length === 0) return isHindi ? 'कोई साक्ष्य संलग्न नहीं किया गया' : 'No evidence attached';
      return `साक्ष्य सूची
Evidence List

दिनांक: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
शिकायतकर्ता: ${formData.name || '______'}

क्रम संख्या | फ़ाइल नाम | प्रकार | आकार
${evidence.map((e, i) => `${i + 1}. ${e.file.name} | ${evidenceTypes.find(et => et.id === e.type)?.label || 'अन्य'} | ${(e.file.size / 1024).toFixed(1)} KB`).join('\n')}

कुल साक्ष्य फाइलें: ${evidence.length}`;
    }

    if (evidence.length === 0) return 'No evidence attached';
    return `EVIDENCE LIST

Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
Complainant: ${formData.name || '______'}

S.No. | File Name | Type | Size
${evidence.map((e, i) => `${i + 1}. ${e.file.name} | ${evidenceTypes.find(et => et.id === e.type)?.label || 'Other'} | ${(e.file.size / 1024).toFixed(1)} KB`).join('\n')}

Total Evidence Files: ${evidence.length}`;
  };

  const generateTimeline = (fraudLabel: string) => {
    const isHindi = language === 'hi';
    const incidentDate = formData.dateTime
      ? new Date(formData.dateTime)
      : null;

    if (isHindi) {
      let timeline = `घटना कालक्रम
Timeline of Events

शिकायतकर्ता: ${formData.name || '______'}
धोखाधड़ी प्रकार: ${fraudLabel}

`;
      if (incidentDate) {
        timeline += `${incidentDate.toLocaleString('hi-IN')} - प्रारंभिक संपर्क / घटना की शुरुआत\n`;
      }
      timeline += `${incidentDate ? incidentDate.toLocaleString('hi-IN') : '______'} - धोखाधड़ी हुई / पैसे ट्रांसफर हुए\n`;
      timeline += `${new Date().toLocaleString('hi-IN')} - शिकायत दर्ज की गई\n`;
      if (evidence.length > 0) {
        timeline += `${new Date().toLocaleString('hi-IN')} - साक्ष्य संकलित किए गए (${evidence.length} फाइलें)\n`;
      }
      timeline += `\nकुल अवधि: ${incidentDate ? Math.ceil((Date.now() - incidentDate.getTime()) / (1000 * 60 * 60 * 24)) + ' दिन' : 'ज्ञात नहीं'}`;
      return timeline;
    }

    let timeline = `TIMELINE OF EVENTS

Complainant: ${formData.name || '______'}
Fraud Type: ${fraudLabel}

`;
    if (incidentDate) {
      timeline += `${incidentDate.toLocaleString('en-IN')} - Initial contact / Incident began\n`;
    }
    timeline += `${incidentDate ? incidentDate.toLocaleString('en-IN') : '______'} - Fraud occurred / Money transferred\n`;
    timeline += `${new Date().toLocaleString('en-IN')} - Complaint registered\n`;
    if (evidence.length > 0) {
      timeline += `${new Date().toLocaleString('en-IN')} - Evidence collected (${evidence.length} files)\n`;
    }
    timeline += `\nTotal Duration: ${incidentDate ? Math.ceil((Date.now() - incidentDate.getTime()) / (1000 * 60 * 60 * 24)) + ' days' : 'Unknown'}`;
    return timeline;
  };

  const generateNextSteps = () => {
    const isHindi = language === 'hi';
    if (isHindi) {
      return `अनुशंसित अगले कदम
Recommended Next Steps

1. 1930 पर तुरंत कॉल करें - यदि पैसे खो गए हैं तो तुरंत साइबर क्राइम हेल्पलाइन पर कॉल करें
2. cybercrime.gov.in पर शिकायत दर्ज करें - ऑनलाइन पोर्टल पर औपचारिक शिकायत submit करें
3. अपने बैंक को सूचित करें - बैंक को तुरंत धोखाधड़ी के बारे में बताएं और खाता फ्रीज करवाएं
4. नजदीकी पुलिस स्टेशन जाएं - अपने क्षेत्र के साइबर अपराध पुलिस स्टेशन में शिकायत दर्ज कराएं
5. UPI ID और फोन नंबर ब्लॉक करें - धोखेबाज के UPI ID और नंबर को ब्लॉक करवाएं
6. सभी पासवर्ड बदलें - अपने सभी महत्वपूर्ण खातों के पासवर्ड तुरंत बदलें
7. ट्रांजेक्शन का रिकॉर्ड रखें - सभी लेन-देन और संचार का रिकॉर्ड संभाल कर रखें
8. परिवार और दोस्तों को सतर्क करें - इस धोखाधड़ी के बारे में दूसरों को बताएं ताकि वे भी सुरक्षित रहें`;
    }

    return `RECOMMENDED NEXT STEPS

1. Call 1930 immediately - Call the National Cyber Crime Helpline if money was lost
2. File complaint on cybercrime.gov.in - Submit formal complaint on the online portal
3. Inform your bank - Immediately notify your bank about the fraud and freeze the account
4. Visit nearest police station - File an FIR at the nearest cyber crime police station
5. Block the UPI ID and phone number - Get the fraudster's UPI ID and number blocked
6. Change all passwords - Change passwords for all important accounts immediately
7. Keep transaction records - Maintain records of all transactions and communications
8. Alert family and friends - Inform others about this fraud to keep them safe`;
  };

  const handleAnalyze = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      analyzeFraud();
      generateAllDocuments();
      setIsSubmitting(false);
      setStep(4);
    }, 1500);
  };

  const handleGenerate = () => {
    setStep(5);
  };

  const handlePrint = () => {
    const content = generatedDocs[selectedDoc];
    if (!content) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${formData.name || 'Complaint'} - ${selectedDoc}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; color: #000; }
            pre { font-family: Arial, sans-serif; white-space: pre-wrap; margin: 0; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <pre>${content}</pre>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = (format: 'txt' | 'docx') => {
    const content = generatedDocs[selectedDoc];
    if (!content) return;
    const ext = format === 'docx' ? '.doc' : '.txt';
    const mime = format === 'docx' ? 'application/msword' : 'text/plain';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.name || 'complaint'}_${selectedDoc}${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyContent = () => {
    const content = generatedDocs[selectedDoc];
    if (content) navigator.clipboard.writeText(content);
  };

  const resetForm = () => {
    setFormData({
      name: '', mobile: '', email: '', fraudType: '', dateTime: '', amountLost: '',
      bankApp: '', fraudsterMobile: '', fraudsterUpi: '', transactionId: '', description: '',
    });
    setEvidence([]);
    setGeneratedDocs({});
    setAiAnalysis({ fraudType: '', timeline: '', missingInfo: [], riskLevel: '', riskScore: 0 });
    setSelectedDoc('police');
    setStep(1);
  };

  const stepIndicator = () => {
    const labels = [
      t('User Details', 'उपयोगकर्ता विवरण'),
      t('Fraud Details', 'धोखाधड़ी विवरण'),
      t('Evidence Upload', 'सबूत अपलोड'),
      t('AI Analysis', 'AI विश्लेषण'),
      t('Documents', 'दस्तावेज़'),
    ];

    return (
      <div className="flex items-start justify-center mb-8 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-0 min-w-max px-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all text-sm ${
                    step >= s
                      ? 'bg-gradient-to-br from-primary-500 to-cyan-500 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-dark-700 text-gray-400'
                  } ${step === s ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-dark-900' : ''}`}
                >
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                <span className={`text-xs mt-1.5 whitespace-nowrap ${step >= s ? 'text-primary-400' : 'text-gray-500'}`}>
                  {labels[s - 1]}
                </span>
              </div>
              {s < 5 && (
                <div className={`w-10 sm:w-16 h-0.5 mx-1.5 sm:mx-2 rounded transition-all ${
                  step > s ? 'bg-primary-500' : 'bg-dark-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-display font-bold text-white">
                {t('Complaint Generator', 'शिकायत जनरेटर')}
              </h1>
              <p className="text-sm text-gray-400">
                {t('AI-powered complaint document generator', 'AI-संचालित शिकायत दस्तावेज़ जनरेटर')}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                language === 'hi'
                  ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                  : 'bg-dark-700 text-gray-300 border border-dark-600'
              }`}
            >
              <Languages className="w-4 h-4" />
              {language === 'en' ? t('हिंदी', 'हिंदी') : t('English', 'English')}
            </button>
            <button
              onClick={() => setGrammarCorrect(!grammarCorrect)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                grammarCorrect
                  ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                  : 'bg-dark-700 text-gray-300 border border-dark-600'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {grammarCorrect ? t('Grammar: ON', 'ग्रामर: चालू') : t('Grammar: OFF', 'ग्रामर: बंद')}
            </button>
          </div>
        </div>

        {/* Step Indicator */}
        {stepIndicator()}

        {/* Step Content */}
        <div className="card">
          {/* Step 1 - User Details */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{t('User Details', 'उपयोगकर्ता विवरण')}</h2>
                  <p className="text-sm text-gray-400">{t('Enter your basic information', 'अपनी बुनियादी जानकारी दें')}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm text-gray-300">{t('Full Name *', 'पूरा नाम *')}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      placeholder={t('Your name', 'आपका नाम')}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-300">{t('Mobile Number *', 'मोबाइल नंबर *')}</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => updateForm('mobile', e.target.value)}
                      placeholder={t('10-digit mobile number', '10 अंकों का मोबाइल नंबर')}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-300">{t('Email (Optional)', 'ईमेल (वैकल्पिक)')}</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      placeholder="email@example.com"
                      className="input-field pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.name || !formData.mobile}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  {t('Next', 'अगला')} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2 - Fraud Details */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{t('Fraud Details', 'धोखाधड़ी विवरण')}</h2>
                  <p className="text-sm text-gray-400">{t('Provide details about the fraud', 'धोखाधड़ी के बारे में विवरण बताएं')}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {fraudTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => updateForm('fraudType', type.id)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      formData.fraudType === type.id
                        ? 'bg-primary-600/20 border-2 border-primary-500'
                        : 'bg-dark-700 border-2 border-transparent hover:border-dark-600'
                    }`}
                  >
                    <span className="text-xl mb-1 block">{type.icon}</span>
                    <span className="text-white font-medium text-sm">{type.label}</span>
                    <span className="text-xs text-gray-400 block mt-0.5">{type.description}</span>
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-2 text-sm text-gray-300">{t('Date & Time of Incident', 'घटना की तिथि और समय')}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="datetime-local"
                      value={formData.dateTime}
                      onChange={(e) => updateForm('dateTime', e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-300">{t('Amount Lost (₹)', 'खोई गई राशि (₹)')}</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.amountLost}
                      onChange={(e) => updateForm('amountLost', e.target.value)}
                      placeholder={t('Amount lost', 'खोई गई राशि')}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-300">{t('Bank/UPI App', 'बैंक/UPI ऐप')}</label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.bankApp}
                      onChange={(e) => updateForm('bankApp', e.target.value)}
                      placeholder={t('e.g. Google Pay, PhonePe, SBI', 'जैसे Google Pay, PhonePe, SBI')}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-300">{t('Fraudster Mobile', 'धोखेबाज का मोबाइल')}</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.fraudsterMobile}
                      onChange={(e) => updateForm('fraudsterMobile', e.target.value)}
                      placeholder={t("Fraudster's mobile number", 'धोखेबाज का मोबाइल नंबर')}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-300">{t('Fraudster UPI ID', 'धोखेबाज का UPI ID')}</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.fraudsterUpi}
                      onChange={(e) => updateForm('fraudsterUpi', e.target.value)}
                      placeholder="example@paytm"
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-300">{t('Transaction ID', 'लेन-देन आईडी')}</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.transactionId}
                      onChange={(e) => updateForm('transactionId', e.target.value)}
                      placeholder={t('Transaction reference number', 'लेन-देन संदर्भ संख्या')}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm text-gray-300">{t('Description - "What happened?"', 'विवरण - "क्या हुआ?"')}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  placeholder={t(
                    'Describe the fraud incident in detail...',
                    'धोखाधड़ी की घटना का विस्तार से वर्णन करें...'
                  )}
                  rows={4}
                  className="input-field resize-none"
                />
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="btn-secondary flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> {t('Back', 'पीछे')}
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.fraudType}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  {t('Next', 'अगला')} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 - Evidence Upload */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{t('Evidence Upload', 'सबूत अपलोड')}</h2>
                  <p className="text-sm text-gray-400">{t('Upload evidence', 'सबूत अपलोड करें')}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {evidenceTypes.map((et) => (
                  <label key={et.id} className="block cursor-pointer">
                    <div className="border-2 border-dashed border-dark-600 rounded-xl p-4 text-center hover:border-primary-500 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept={et.id === 'audio' ? 'audio/*' : 'image/*,.pdf'}
                        onChange={(e) => handleFileUpload(e, et.id)}
                        className="hidden"
                      />
                      <et.icon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-300 font-medium">{et.label}</p>
                      <p className="text-xs text-gray-500">{t('Click to upload', 'अपलोड करने के लिए क्लिक करें')}</p>
                    </div>
                  </label>
                ))}
              </div>

              {evidence.length > 0 && (
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-gray-400 font-medium">
                    {t('Uploaded Files', 'अपलोड की गई फाइलें')} ({evidence.length})
                  </p>
                  {evidence.map((ev, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center shrink-0">
                          {(() => {
                            const Icon = evidenceTypes.find(et => et.id === ev.type)?.icon || FileText;
                            return <Icon className="w-4 h-4 text-primary-400" />;
                          })()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-gray-300 truncate">{ev.file.name}</p>
                          <p className="text-xs text-gray-500">{(ev.file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeEvidence(i)}
                        className="text-red-400 hover:text-red-300 p-1 shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {formData.description && formData.description.length > 0 && (
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 mb-6">
                  <div className="flex items-start gap-3">
                    <Search className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-blue-300 font-medium text-sm mb-1">
                        {t('Description Preview', 'विवरण पूर्वावलोकन')}
                      </h4>
                      <p className="text-gray-300 text-sm">{formData.description}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="btn-secondary flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> {t('Back', 'पीछे')}
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={isSubmitting}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t('Analyzing...', 'विश्लेषण हो रहा है...')}</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>{t('Analyze & Generate', 'विश्लेषण और जनरेट करें')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4 - AI Analysis */}
          {step === 4 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">{t('AI Analysis Results', 'AI विश्लेषण परिणाम')}</h2>
                <p className="text-gray-400 mt-1">
                  {t('AI has analyzed your complaint', 'AI ने आपकी शिकायत का विश्लेषण कर लिया है')}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-dark-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="w-4 h-4 text-primary-400" />
                    <span className="text-sm text-gray-400">{t('Fraud Type', 'धोखाधड़ी प्रकार')}</span>
                  </div>
                  <p className="text-white font-medium">{aiAnalysis.fraudType}</p>
                </div>

                <div className="p-4 rounded-xl bg-dark-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-gray-400">{t('Timeline', 'समयरेखा')}</span>
                  </div>
                  <p className="text-white font-medium">{aiAnalysis.timeline}</p>
                </div>

                <div className="p-4 rounded-xl bg-dark-700">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-gray-400">{t('Risk Level', 'जोखिम स्तर')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${
                      aiAnalysis.riskScore >= 70 ? 'text-red-400' :
                      aiAnalysis.riskScore >= 40 ? 'text-amber-400' : 'text-green-400'
                    }`}>
                      {aiAnalysis.riskLevel}
                    </span>
                    <span className={`text-sm font-medium ${
                      aiAnalysis.riskScore >= 70 ? 'text-red-400' :
                      aiAnalysis.riskScore >= 40 ? 'text-amber-400' : 'text-green-400'
                    }`}>
                      ({aiAnalysis.riskScore}/100)
                    </span>
                  </div>
                  <div className="h-2 bg-dark-600 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full ${
                        aiAnalysis.riskScore >= 70 ? 'bg-red-500' :
                        aiAnalysis.riskScore >= 40 ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${aiAnalysis.riskScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-dark-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-400">{t('Missing Information', 'गुम जानकारी')}</span>
                  </div>
                  {aiAnalysis.missingInfo.length > 0 ? (
                    <ul className="space-y-1">
                      {aiAnalysis.missingInfo.map((info, i) => (
                        <li key={i} className="text-red-300 text-sm flex items-start gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          {info}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-green-400 text-sm flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      {t('All information provided', 'सारी जानकारी प्रदान की गई')}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(3)} className="btn-secondary flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> {t('Back', 'पीछे')}
                </button>
                <button onClick={handleGenerate} className="btn-primary flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t('View Documents', 'दस्तावेज़ देखें')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5 - Documents */}
          {step === 5 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">{t('Documents Generated', 'दस्तावेज़ तैयार')}</h2>
                <p className="text-gray-400 mt-1">
                  {t('6 documents are ready for you', 'आपके लिए 6 दस्तावेज़ तैयार हैं')}
                </p>
              </div>

              {/* Risk Score Bar */}
              <div className="p-4 rounded-xl bg-dark-700 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{t('Case Risk Score', 'केस जोखिम स्कोर')}</span>
                  <span className={`text-lg font-bold ${
                    aiAnalysis.riskScore >= 70 ? 'text-red-400' :
                    aiAnalysis.riskScore >= 40 ? 'text-amber-400' : 'text-green-400'
                  }`}>
                    {aiAnalysis.riskScore}/100
                  </span>
                </div>
                <div className="h-2.5 bg-dark-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      aiAnalysis.riskScore >= 70 ? 'bg-red-500' :
                      aiAnalysis.riskScore >= 40 ? 'bg-amber-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${aiAnalysis.riskScore}%` }}
                  />
                </div>
              </div>

              {/* Document Type Selector */}
              <div className="flex flex-wrap gap-2 mb-6">
                {docTypes.map((dt) => {
                  const Icon = dt.icon;
                  return (
                    <button
                      key={dt.id}
                      onClick={() => setSelectedDoc(dt.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        selectedDoc === dt.id
                          ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                          : 'bg-dark-700 text-gray-300 border border-dark-600 hover:border-dark-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{dt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Document Content */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">
                    {t('Generated Document', 'तैयार दस्तावेज़')}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={copyContent} className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-dark-700">
                      <Copy className="w-3.5 h-3.5" /> {t('Copy', 'कॉपी')}
                    </button>
                    <button onClick={() => handleDownload('txt')} className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-dark-700">
                      <Download className="w-3.5 h-3.5" /> TXT
                    </button>
                    <button onClick={() => handleDownload('docx')} className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-dark-700">
                      <FileSpreadsheet className="w-3.5 h-3.5" /> DOC
                    </button>
                    <button onClick={handlePrint} className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-dark-700">
                      <Printer className="w-3.5 h-3.5" /> {t('Print', 'प्रिंट')}
                    </button>
                  </div>
                </div>
                <div
                  ref={printRef}
                  className="p-4 sm:p-6 bg-dark-800 rounded-xl border border-dark-600 overflow-x-auto"
                >
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {generatedDocs[selectedDoc] || t('No document generated', 'कोई दस्तावेज़ तैयार नहीं हुआ')}
                  </pre>
                </div>
              </div>

              {/* Summary Section */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary-600/10 to-cyan-600/10 border border-primary-500/20 mb-6">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-primary-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-primary-300 font-medium text-sm mb-1">
                      {t('Complaint Summary (One Click)', 'शिकायत सारांश (एक क्लिक में)')}
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {language === 'hi'
                        ? `${formData.dateTime ? new Date(formData.dateTime).toLocaleDateString('hi-IN') : '______'} को, ${formData.name || 'शिकायतकर्ता'} को ${formData.bankApp || 'अज्ञात स्रोत'} से एक कॉल/संदेश आया जिसमें ${aiAnalysis.fraudType} का दावा किया गया। बाद में, ${formData.amountLost ? '₹' + parseInt(formData.amountLost).toLocaleString('hi-IN') : 'कुछ राशि'} शिकायतकर्ता के खाते से बिना अधिकार के डेबिट कर ली गई।`
                        : `On ${formData.dateTime ? new Date(formData.dateTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '______'}, ${formData.name || 'the complainant'} received a call/message from ${formData.bankApp || 'an unknown source'} regarding ${aiAnalysis.fraudType}. Subsequently, ${formData.amountLost ? '₹' + parseInt(formData.amountLost).toLocaleString('en-IN') : 'an amount'} was debited from the complainant's account without authorization.`
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <button onClick={() => handleDownload('txt')} className="btn-primary flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> {t('Download All (PDF)', 'सभी डाउनलोड करें (PDF)')}
                </button>
                <button onClick={() => handleDownload('docx')} className="btn-secondary flex items-center justify-center gap-2">
                  <FileSpreadsheet className="w-5 h-5" /> {t('Download All (DOCX)', 'सभी डाउनलोड करें (DOCX)')}
                </button>
                <button onClick={handlePrint} className="btn-secondary flex items-center justify-center gap-2">
                  <Printer className="w-5 h-5" /> {t('Print All', 'सभी प्रिंट करें')}
                </button>
                <button
                  onClick={() => {
                    const allDocs = Object.entries(generatedDocs)
                      .map(([k, v]) => `=== ${docTypes.find(d => d.id === k)?.label || k} ===\n\n${v}`)
                      .join('\n\n');
                    navigator.clipboard.writeText(allDocs);
                  }}
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" /> {t('Copy All', 'सभी कॉपी करें')}
                </button>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(4)} className="btn-secondary flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> {t('Back to Analysis', 'विश्लेषण पर वापस')}
                </button>
                <button onClick={resetForm} className="btn-secondary flex items-center gap-2">
                  <FileText className="w-4 h-4" /> {t('New Complaint', 'नई शिकायत')}
                </button>
              </div>

              {/* Important Note */}
              <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-amber-300 font-medium text-sm mb-1">
                      {t('Important: Next Steps', 'महत्वपूर्ण: अगले कदम')}
                    </p>
                    <ul className="space-y-1 text-sm text-gray-300">
                      <li>• {t('Call 1930 immediately if money was lost', 'यदि पैसे खो गए हैं तो तुरंत 1930 पर कॉल करें')}</li>
                      <li>• {t('Submit complaint on cybercrime.gov.in', 'cybercrime.gov.in पर शिकायत दर्ज करें')}</li>
                      <li>• {t('Visit nearest police station with printed complaint', 'प्रिंटेड शिकायत लेकर नजदीकी पुलिस स्टेशन जाएं')}</li>
                      <li>• {t('Inform your bank about the fraud', 'अपने बैंक को धोखाधड़ी के बारे में सूचित करें')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
