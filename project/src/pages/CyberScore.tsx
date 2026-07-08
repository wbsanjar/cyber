import { useState } from 'react';
import {
  Shield,
  Lock,
  Key,
  Smartphone,
  Globe,
  CreditCard,
  Mail,
  ArrowUp,
  RefreshCw,
} from 'lucide-react';

interface ScoreCategory {
  id: string;
  name: string;
  icon: typeof Lock;
  score: number;
  maxScore: number;
  status: 'good' | 'warning' | 'danger';
  tips: string[];
}

export default function CyberScore() {
  const [isCalculating, setIsCalculating] = useState(false);

  const categories: ScoreCategory[] = [
    {
      id: 'password',
      name: 'Password Strength',
      icon: Key,
      score: 75,
      maxScore: 100,
      status: 'good',
      tips: [
        'Use unique passwords for each account',
        'Include uppercase, lowercase, numbers, symbols',
        'Minimum 12 characters recommended',
      ],
    },
    {
      id: '2fa',
      name: 'Two-Factor Authentication',
      icon: Smartphone,
      score: 50,
      maxScore: 100,
      status: 'warning',
      tips: [
        'Enable 2FA on all banking accounts',
        'Use authenticator apps instead of SMS',
        'Enable 2FA for email accounts',
      ],
    },
    {
      id: 'email',
      name: 'Email Security',
      icon: Mail,
      score: 80,
      maxScore: 100,
      status: 'good',
      tips: [
        'Check for email forwarding rules',
        'Verify recovery email is secure',
        'Review recent login activity',
      ],
    },
    {
      id: 'device',
      name: 'Device Security',
      icon: Smartphone,
      score: 60,
      maxScore: 100,
      status: 'warning',
      tips: [
        'Update your device software',
        'Install antivirus software',
        'Enable device encryption',
      ],
    },
    {
      id: 'banking',
      name: 'Banking Security',
      icon: CreditCard,
      score: 40,
      maxScore: 100,
      status: 'danger',
      tips: [
        'Set transaction limits',
        'Enable transaction alerts',
        'Never share OTP with anyone',
      ],
    },
    {
      id: 'browsing',
      name: 'Browsing Habits',
      icon: Globe,
      score: 70,
      maxScore: 100,
      status: 'good',
      tips: [
        'Avoid clicking unknown links',
        'Check URL before entering details',
        'Use secure (HTTPS) websites only',
      ],
    },
  ];

  const totalScore = Math.round(
    categories.reduce((sum, cat) => sum + cat.score, 0) / categories.length
  );

  const getOverallStatus = () => {
    if (totalScore >= 75) return { label: 'Good', color: 'text-green-400', bg: 'bg-green-500' };
    if (totalScore >= 50) return { label: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-500' };
    return { label: 'Needs Improvement', color: 'text-red-400', bg: 'bg-red-500' };
  };

  const getStatusColor = (score: number) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const getBarColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const handleRecalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 2000);
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-display font-bold text-white">Cyber Safety Score</h1>
              <p className="text-sm text-gray-400">Assess your online security posture</p>
            </div>
          </div>
          <p className="text-gray-400 max-w-xl mx-auto">
            Apni cyber safety score check karein. Password strength, 2FA settings, device security - sab check karein.
          </p>
        </div>

        <div className="card mb-8 text-center">
          <div className="relative inline-block mb-6">
            <svg className="w-48 h-48" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#334155"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={totalScore >= 75 ? '#10b981' : totalScore >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(totalScore / 100) * 283} 283`}
                transform="rotate(-90 50 50)"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-bold ${overallStatus.color}`}>{totalScore}</span>
              <span className={`text-sm ${overallStatus.color}`}>{overallStatus.label}</span>
            </div>
          </div>

          <p className="text-gray-400 mb-6">
            {totalScore >= 75 && 'Great! Your cyber security is strong.'}
            {totalScore >= 50 && totalScore < 75 && 'Some areas need improvement.'}
            {totalScore < 50 && 'Your cyber security needs attention.'}
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleRecalculate}
              disabled={isCalculating}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Calculating...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>Recalculate</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${
                      category.status === 'good' ? 'bg-green-500/20' :
                      category.status === 'warning' ? 'bg-amber-500/20' : 'bg-red-500/20'
                    } flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${
                        category.status === 'good' ? 'text-green-400' :
                        category.status === 'warning' ? 'text-amber-400' : 'text-red-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{category.name}</h3>
                      <p className="text-sm text-gray-400">
                        {category.status === 'good' ? 'Good' : category.status === 'warning' ? 'Needs Improvement' : 'At Risk'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xl font-bold ${getStatusColor(category.score)}`}>
                      {category.score}
                    </span>
                    <span className="text-gray-400 text-sm">/{category.maxScore}</span>
                  </div>
                </div>

                <div className="h-2 bg-dark-700 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full ${getBarColor(category.score)} rounded-full transition-all`}
                    style={{ width: `${category.score}%` }}
                  />
                </div>

                <div className="space-y-2">
                  {category.tips.slice(0, 2).map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <ArrowUp className="w-3 h-3 text-primary-400 mt-1 rotate-45" />
                      <span className="text-gray-300">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="card bg-gradient-to-br from-primary-600/10 to-cyan-600/10 border-primary-500/30">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Security Checklist</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { text: 'Change passwords regularly', checked: true },
              { text: 'Enable 2FA on important accounts', checked: false },
              { text: 'Review app permissions', checked: true },
              { text: 'Update device software', checked: false },
              { text: 'Check bank statements', checked: true },
              { text: 'Use secure Wi-Fi only', checked: false },
            ].map((item, i) => (
              <label key={i} className="flex items-center gap-3 p-3 bg-dark-700 rounded-lg cursor-pointer hover:bg-dark-600 transition-colors">
                <input
                  type="checkbox"
                  defaultChecked={item.checked}
                  className="w-5 h-5 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500"
                />
                <span className={`${item.checked ? 'text-gray-300' : 'text-gray-400'}`}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="card mt-6">
          <h2 className="text-lg font-semibold text-white mb-4">Safety Tips for Better Score</h2>
          <div className="space-y-3">
            {[
              { priority: 'high', tip: 'Enable 2FA on all banking apps immediately' },
              { priority: 'high', tip: 'Set up transaction limits and alerts' },
              { priority: 'medium', tip: 'Update all device software to latest version' },
              { priority: 'medium', tip: 'Use unique passwords for each account' },
              { priority: 'low', tip: 'Review connected apps and permissions' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-dark-700 rounded-lg">
                <span className={`w-2 h-2 rounded-full mt-2 ${
                  item.priority === 'high' ? 'bg-red-500' :
                  item.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                }`} />
                <span className="text-gray-300 text-sm">{item.tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
