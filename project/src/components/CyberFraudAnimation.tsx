import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Ban, Zap } from 'lucide-react';

const threats = [
  { label: 'OTP SCAM', color: 'text-red-400', delay: 0 },
  { label: 'KYC FRAUD', color: 'text-orange-400', delay: 0.5 },
  { label: 'PHISHING', color: 'text-yellow-400', delay: 1 },
  { label: 'FAKE CALL', color: 'text-pink-400', delay: 1.5 },
  { label: 'FAKE LINK', color: 'text-purple-400', delay: 2 },
  { label: 'UPI FRAUD', color: 'text-rose-400', delay: 2.5 },
];

const dataBits = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 4,
  duration: 3 + Math.random() * 2,
  size: 2 + Math.random() * 3,
}));

export default function CyberFraudAnimation() {
  const [blockedCount, setBlockedCount] = useState(0);
  const [activeThreat, setActiveThreat] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlockedCount((c) => c + 1);
      const idx = Math.floor(Math.random() * threats.length);
      setActiveThreat(idx);
      setTimeout(() => setActiveThreat(null), 1200);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-primary-500/5 animate-glow-pulse" />

      {/* Rotation ring */}
      <div className="absolute inset-2 rounded-full border border-primary-500/20 animate-rotate-slow">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary-400 shadow-lg shadow-primary-400/50" />
      </div>

      {/* Middle ring */}
      <div className="absolute inset-6 rounded-full border border-dashed border-cyan-500/20 animate-rotate-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />

      {/* Inner ring */}
      <div className="absolute inset-12 rounded-full border border-primary-500/30" />

      {/* Scanning line */}
      <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent animate-scan-line blur-sm" />

      {/* Center shield */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-2xl animate-pulse-fast" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full gradient-bg flex items-center justify-center shadow-2xl shadow-primary-500/30 animate-float">
            <Shield className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
            <div className="absolute -top-1 -right-1">
              <span className="flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Orbiting threat labels */}
      {threats.map((threat, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{ animation: `orbit${(i % 3) + 1} ${12 + i * 2}s linear infinite`, animationDelay: `${threat.delay}s` }}
        >
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-all duration-300 ${
              activeThreat === i
                ? 'bg-red-500/30 border-red-400 text-red-300 scale-110'
                : 'bg-dark-800/80 border-dark-600 text-gray-500'
            }`}
          >
            <span className={activeThreat === i ? threat.color : ''}>{threat.label}</span>
          </div>
        </div>
      ))}

      {/* Blocked counter */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 bg-dark-800/90 border border-dark-700 rounded-full px-4 py-1.5">
          <Ban className="w-3.5 h-3.5 text-green-400" />
          <span className="text-xs font-mono text-green-400 font-bold">{blockedCount}</span>
          <span className="text-[10px] text-gray-500">BLOCKED</span>
        </div>
      </div>

      {/* Floating data streams */}
      {dataBits.map((bit) => (
        <div
          key={bit.id}
          className="absolute w-0.5 bg-gradient-to-b from-transparent via-primary-400 to-transparent"
          style={{
            left: `${bit.left}%`,
            top: '0',
            height: `${bit.size * 4}px`,
            animation: `dataStream ${bit.duration}s linear infinite`,
            animationDelay: `${bit.delay}s`,
          }}
        />
      ))}

      {/* Threat detected popup */}
      {activeThreat !== null && (
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 animate-fade-in-up">
          <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 rounded-lg px-2.5 py-1.5">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span className="text-[10px] font-mono text-red-400 font-bold">THREAT</span>
          </div>
        </div>
      )}

      {/* Bottom stats */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-primary-400" />
          <span className="text-[10px] text-gray-500 font-mono">AI SHIELD ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
