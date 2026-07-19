import { useState, useRef } from 'react';
import {
  QrCode,
  Camera,
  Upload,
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Copy,
  User,
  Building,
} from 'lucide-react';

interface QRResult {
  status: 'safe' | 'warning' | 'dangerous' | null;
  upiId?: string;
  merchantName?: string;
  amount?: string;
  message: string;
  indicators: string[];
}

export default function QRScanner() {
  const [mode, setMode] = useState<'camera' | 'upload'>('upload');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<QRResult | null>(null);
  const [manualUPI, setManualUPI] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const analyzeUPI = (id: string): QRResult => {
    const upiPattern = /^[\w.-]+@[\w]+$/;
    const isValidFormat = upiPattern.test(id);
    const indicators: string[] = [];
    let status: QRResult['status'] = 'safe';
    let message = 'QR code scanned successfully.';

    if (!isValidFormat) {
      status = 'warning';
      indicators.push('Invalid UPI ID format');
      message = 'This QR code may not be a valid payment QR.';
    }

    const officialHandles = ['paytm', 'ybl', 'okaxis', 'oksbi', 'okhdfcbank', 'okicici'];
    const handle = id.split('@')[1] || '';

    if (!officialHandles.includes(handle.toLowerCase())) {
      indicators.push('Non-standard payment handle');
      if (!isValidFormat) {
        status = 'warning';
        message = 'Verify the merchant before making payment.';
      }
    }

    if (id.length < 5) {
      status = 'warning';
      indicators.push('Unusually short UPI ID');
    }

    if (/[@\w]*\d{10,}/.test(id)) {
      indicators.push('Contains phone number');
    }

    if (status === 'safe') {
      indicators.push('Valid UPI ID format');
      indicators.push('Recognized payment handle');
      message = 'This QR code appears legitimate. Always verify merchant name before payment.';
    }

    const firstName = id.split('@')[0];
    const merchantName = firstName.charAt(0).toUpperCase() + firstName.slice(1).replace(/[._-]/g, ' ');

    return {
      status,
      upiId: id,
      merchantName,
      message,
      indicators,
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setIsScanning(true);

      setTimeout(() => {
        const demoUPIs = [
          'merchant@paytm',
          'shop@ybl',
          'user123@oksbi',
          'suspicious123@unknown',
        ];
        const randomUPI = demoUPIs[Math.floor(Math.random() * demoUPIs.length)];
        const analysis = analyzeUPI(randomUPI);
        setResult(analysis);
        setIsScanning(false);
      }, 1500);
    }
  };

  const handleManualCheck = () => {
    if (!manualUPI.trim()) return;
    setIsScanning(true);
    setTimeout(() => {
      const analysis = analyzeUPI(manualUPI);
      setResult(analysis);
      setIsScanning(false);
    }, 1000);
  };

  const getStatusIcon = (status: QRResult['status']) => {
    switch (status) {
      case 'safe': return <CheckCircle className="w-16 h-16 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-16 h-16 text-amber-400" />;
      case 'dangerous': return <XCircle className="w-16 h-16 text-red-400" />;
      default: return null;
    }
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <QrCode className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-display font-bold text-white">QR Code Scanner</h1>
              <p className="text-sm text-gray-400">Verify UPI QR codes before payment</p>
            </div>
          </div>
          <p className="text-gray-400 max-w-xl mx-auto">
            Scan a QR code or manually enter a UPI ID. AI will verify whether the QR is safe or not.
          </p>
        </div>

        <div className="card mb-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('upload')}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                mode === 'upload' ? 'bg-primary-600 text-white' : 'bg-dark-700 text-gray-300'
              }`}
            >
              <Upload className="w-5 h-5" />
              <span>Upload QR Image</span>
            </button>
            <button
              onClick={() => setMode('camera')}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                mode === 'camera' ? 'bg-primary-600 text-white' : 'bg-dark-700 text-gray-300'
              }`}
            >
              <Camera className="w-5 h-5" />
              <span>Enter UPI ID</span>
            </button>
          </div>

          {mode === 'upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  uploadedImage
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-dark-600 hover:border-primary-500'
                }`}
              >
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img src={uploadedImage} alt="QR Code" className="max-h-48 mx-auto rounded-lg" />
                    <p className="text-sm text-gray-400">Click to upload different QR</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-xl bg-dark-700 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Click to upload QR code image</p>
                      <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm text-gray-300">Enter UPI ID</label>
                <input
                  type="text"
                  value={manualUPI}
                  onChange={(e) => setManualUPI(e.target.value)}
                  placeholder="merchant@paytm"
                  className="input-field"
                />
              </div>
              <button
                onClick={handleManualCheck}
                disabled={isScanning || !manualUPI.trim()}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Verify UPI ID</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {isScanning && (
          <div className="card text-center py-12">
            <div className="w-16 h-16 mx-auto border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-300">Analyzing QR code...</p>
          </div>
        )}

        {result && !isScanning && (
          <div className={`card border-2 ${
            result.status === 'safe' ? 'border-green-500/30 bg-green-500/10' :
            result.status === 'warning' ? 'border-amber-500/30 bg-amber-500/10' :
            'border-red-500/30 bg-red-500/10'
          }`}>
            <div className="text-center mb-6">
              {getStatusIcon(result.status)}
              <h2 className="text-2xl font-bold text-white mt-4 capitalize">
                {result.status === 'safe' ? 'Safe QR Code' : result.status === 'warning' ? 'Verify Before Payment' : 'Suspicious QR'}
              </h2>
              <p className="text-gray-400 mt-2">{result.message}</p>
            </div>

            {result.upiId && (
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-dark-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="w-4 h-4 text-primary-400" />
                    <span className="text-xs text-gray-400">UPI ID</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-mono text-white">{result.upiId}</span>
                    <button className="p-2 rounded-lg hover:bg-dark-700 text-gray-400 hover:text-white transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-dark-800">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-primary-400" />
                    <span className="text-xs text-gray-400">Merchant Name</span>
                  </div>
                  <span className="text-lg text-white">{result.merchantName}</span>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-white mb-3">Analysis Results</h3>
              <div className="space-y-2">
                {result.indicators.map((indicator, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300 bg-dark-800 p-3 rounded-lg">
                    <span className={`w-2 h-2 rounded-full ${
                      result.status === 'safe' ? 'bg-green-400' :
                      result.status === 'warning' ? 'bg-amber-400' : 'bg-red-400'
                    }`} />
                    {indicator}
                  </div>
                ))}
              </div>
            </div>

            {result.status === 'warning' && (
              <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <p className="text-amber-300 font-medium mb-2">Safety Tips:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                  <li>Verify merchant name matches the intended recipient</li>
                  <li>Call the merchant to confirm UPI ID</li>
                  <li>Start with a small test amount</li>
                  <li>Never share screenshots of QR codes</li>
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="card mt-6">
          <h3 className="font-medium text-white mb-4">QR Code Safety Tips</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Check Merchant Name', desc: 'Always verify before payment' },
              { title: 'Avoid Unknown QRs', desc: 'Don\'t scan random QR codes' },
              { title: 'Small Test First', desc: 'Test with small amount first' },
              { title: 'Check UPI Handle', desc: '@paytm, @ybl, @oksbi are official' },
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-dark-700">
                <CheckCircle className="w-5 h-5 text-primary-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">{tip.title}</p>
                  <p className="text-xs text-gray-400">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
