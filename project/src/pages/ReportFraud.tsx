import { useState } from 'react';
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
} from 'lucide-react';

const fraudTypes = [
  { id: 'upi', label: 'UPI Fraud', icon: '💳', description: 'Money transferred to wrong account or fake UPI' },
  { id: 'whatsapp', label: 'WhatsApp Scam', icon: '📱', description: 'Fake messages asking for money or OTP' },
  { id: 'facebook', label: 'Facebook Scam', icon: '📘', description: 'Fake profiles, marketplace scams' },
  { id: 'telegram', label: 'Telegram Scam', icon: '📨', description: 'Fake investment groups, job scams' },
  { id: 'olx', label: 'OLX Scam', icon: '🛒', description: 'Fake buyers/sellers, advance payment fraud' },
  { id: 'instagram', label: 'Instagram Scam', icon: '📸', description: 'Fake accounts, giveaway scams' },
  { id: 'bank', label: 'Bank Fraud', icon: '🏦', description: 'Fake bank calls, ATM fraud, card cloning' },
  { id: 'kyc', label: 'KYC Scam', icon: '🪪', description: 'Fake KYC update requests' },
  { id: 'job', label: 'Job Scam', icon: '💼', description: 'Fake job offers, work from home scams' },
  { id: 'lottery', label: 'Lottery Scam', icon: '🎰', description: 'Fake lottery, prize scams' },
  { id: 'investment', label: 'Investment Fraud', icon: '📈', description: 'Fake investment schemes, crypto scams' },
  { id: 'other', label: 'Other', icon: '📋', description: 'Any other type of cyber fraud' },
];

export default function ReportFraud() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fraudType: '',
    name: '',
    mobile: '',
    email: '',
    amountLost: '',
    dateOfFraud: '',
    description: '',
    fraudsterMobile: '',
    fraudsterUpi: '',
    fraudsterLink: '',
    evidence: [] as File[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complaintGenerated, setComplaintGenerated] = useState('');
  const [riskScore, setRiskScore] = useState(0);

  const calculateRiskScore = () => {
    let score = 0;
    if (formData.amountLost && parseInt(formData.amountLost) > 10000) score += 30;
    else if (formData.amountLost && parseInt(formData.amountLost) > 5000) score += 20;
    else if (formData.amountLost && parseInt(formData.amountLost) > 1000) score += 10;

    if (formData.fraudType) score += 15;
    if (formData.fraudsterMobile) score += 15;
    if (formData.fraudsterUpi) score += 10;
    if (formData.fraudsterLink) score += 10;
    if (formData.evidence.length > 0) score += 10;
    if (formData.description.length > 20) score += 10;

    return Math.min(score, 100);
  };

  const generateComplaint = () => {
    const fraudTypeLabel = fraudTypes.find(f => f.id === formData.fraudType)?.label || 'Cyber Fraud';
    const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const complaintId = `CSF/${new Date().getFullYear()}/${Math.floor(Math.random() * 100000)}`;

    const complaint = `
COMPLAINT LETTER
National Cyber Crime Portal

Reference ID: ${complaintId}
Date: ${date}

To,
The Cyber Crime Cell
National Cyber Crime Reporting Portal
https://cybercrime.gov.in

Subject: Complaint regarding ${fraudTypeLabel}

Complainant Details:
- Name: ${formData.name || 'N/A'}
- Mobile: ${formData.mobile || 'N/A'}
- Email: ${formData.email || 'N/A'}

Incident Details:
Nature of Fraud: ${fraudTypeLabel}
Date of Incident: ${formData.dateOfFraud || 'N/A'}
Amount Involved: Rs. ${formData.amountLost || '0'}

Description of Incident:
${formData.description || 'No details provided'}

Fraudster Details:
- Mobile Number: ${formData.fraudsterMobile || 'N/A'}
- UPI ID: ${formData.fraudsterUpi || 'N/A'}
- Suspicious Link: ${formData.fraudsterLink || 'N/A'}

Evidence Attached:
${formData.evidence.length > 0 ? formData.evidence.map(e => `- ${e.name}`).join('\n') : 'No evidence attached'}

Prayer:
1. Kindly register my complaint and investigate the matter.
2. Help recover the lost amount.
3. Take legal action against the fraudsters.
4. Provide me with the complaint number for future reference.

Declaration:
I hereby declare that the information provided above is true and correct to the best of my knowledge.

____________________
Signature of Complainant
${formData.name || 'N/A'}

---
IMPORTANT: Submit this complaint at:
1. Online: https://cybercrime.gov.in
2. Call: 1930 (Cyber Crime Helpline)
3. Visit: Nearest Police Station with Cyber Crime Cell
`;

    setComplaintGenerated(complaint);
    setRiskScore(calculateRiskScore());
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      generateComplaint();
      setStep(4);
      setIsSubmitting(false);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, evidence: [...prev.evidence, ...files] }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      evidence: prev.evidence.filter((_, i) => i !== index),
    }));
  };

  const copyComplaint = () => {
    navigator.clipboard.writeText(complaintGenerated);
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-display font-bold text-white">Report Fraud</h1>
              <p className="text-sm text-gray-400">AI-powered complaint assistant</p>
            </div>
          </div>
          <p className="text-gray-400 max-w-xl mx-auto">
            Fraud report karein. AI automatic complaint banayega aur guide karega kya karna chahiye.
          </p>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                    step >= s
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-700 text-gray-400'
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-12 h-1 mx-1 rounded transition-all ${
                      step > s ? 'bg-primary-600' : 'bg-dark-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Select Fraud Type</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {fraudTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFormData(prev => ({ ...prev, fraudType: type.id }))}
                    className={`p-4 rounded-xl text-left transition-all ${
                      formData.fraudType === type.id
                        ? 'bg-primary-600/20 border-2 border-primary-500'
                        : 'bg-dark-700 border-2 border-transparent hover:border-dark-600'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{type.icon}</span>
                    <span className="text-white font-medium">{type.label}</span>
                    <span className="text-xs text-gray-400 block mt-1">{type.description}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.fraudType}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Your Details</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-2 text-sm text-gray-300">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Aapka naam"
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-300">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                      placeholder="10-digit mobile number"
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-300">Email</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Email address"
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-300">Amount Lost (Rs.)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.amountLost}
                      onChange={(e) => setFormData(prev => ({ ...prev, amountLost: e.target.value }))}
                      placeholder="Amount lost"
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-300">Date of Incident</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.dateOfFraud}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfFraud: e.target.value }))}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(1)} className="btn-secondary flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.name || !formData.mobile}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Fraud Details & Evidence</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block mb-2 text-sm text-gray-300">Describe what happened</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the fraud incident in detail..."
                    rows={4}
                    className="input-field resize-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm text-gray-300">Fraudster's Mobile (if known)</label>
                    <input
                      type="text"
                      value={formData.fraudsterMobile}
                      onChange={(e) => setFormData(prev => ({ ...prev, fraudsterMobile: e.target.value }))}
                      placeholder="Fraudster ka mobile number"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-gray-300">Fraudster's UPI ID (if known)</label>
                    <input
                      type="text"
                      value={formData.fraudsterUpi}
                      onChange={(e) => setFormData(prev => ({ ...prev, fraudsterUpi: e.target.value }))}
                      placeholder="example@paytm"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-300">Suspicious Link (if any)</label>
                  <input
                    type="text"
                    value={formData.fraudsterLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, fraudsterLink: e.target.value }))}
                    placeholder="https://..."
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-300">Upload Evidence (Screenshots, Receipts, etc.)</label>
                  <label className="block">
                    <div className="border-2 border-dashed border-dark-600 rounded-xl p-6 text-center cursor-pointer hover:border-primary-500 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-400">Click to upload evidence files</p>
                      <p className="text-xs text-gray-500">Images, PDFs up to 10MB each</p>
                    </div>
                  </label>
                </div>

                {formData.evidence.length > 0 && (
                  <div className="space-y-2">
                    {formData.evidence.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary-400" />
                          <span className="text-sm text-gray-300">{file.name}</span>
                        </div>
                        <button
                          onClick={() => removeFile(i)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="btn-secondary flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Generate Complaint</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Complaint Generated!</h2>
                <p className="text-gray-400 mt-2">AI ne aapki complaint ready kar di hai</p>
              </div>

              <div className="mb-6 p-4 rounded-xl bg-dark-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Risk Score</span>
                  <span className={`text-lg font-bold ${
                    riskScore >= 70 ? 'text-red-400' : riskScore >= 40 ? 'text-amber-400' : 'text-green-400'
                  }`}>
                    {riskScore}/100
                  </span>
                </div>
                <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      riskScore >= 70 ? 'bg-red-500' : riskScore >= 40 ? 'bg-amber-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${riskScore}%` }}
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Generated Complaint</span>
                  <div className="flex gap-2">
                    <button onClick={copyComplaint} className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
                      <Copy className="w-4 h-4" /> Copy
                    </button>
                  </div>
                </div>
                <pre className="p-4 bg-dark-800 rounded-xl text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap font-sans">
                  {complaintGenerated}
                </pre>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                <a href="tel:1930" className="btn-primary flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" /> Call 1930
                </a>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5" /> Submit Online
                </a>
                <button onClick={() => {
                  setFormData({
                    fraudType: '', name: '', mobile: '', email: '', amountLost: '',
                    dateOfFraud: '', description: '', fraudsterMobile: '', fraudsterUpi: '',
                    fraudsterLink: '', evidence: [],
                  });
                  setStep(1);
                  setComplaintGenerated('');
                }} className="btn-secondary flex items-center justify-center gap-2">
                  New Report
                </button>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <p className="text-amber-300 font-medium mb-2">Next Steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
                  <li>Call 1930 immediately if money was lost</li>
                  <li>Submit complaint on cybercrime.gov.in</li>
                  <li>Visit your nearest police station</li>
                  <li>Block the fraudster's number/UPI</li>
                  <li>Inform your bank about the fraud</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
